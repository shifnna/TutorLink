import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { FaCamera, FaTimes } from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";
import { IApplicationModal } from "../../types/ITutorApplication";
import { useAuthStore } from "../../store/authStore";
import { tutorService } from "../../services/tutorService";
import { authService } from "../../services/authService";

const ApplicationModal: React.FC<IApplicationModal> = ({ isOpen, onClose }) => {
  const { isLoading } = useAuthStore();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    description: "",
    languages: [] as string[],
    education: "",
    skills: [] as string[],
    experienceLevel: "",
    gender: "",
    occupation: "",
    profileImage: null as File | null,
    certificates: [] as File[],
    accountHolder: "",
    accountNumber: "",
    bankName: "",
    ifsc: "",
  });

  useEffect(() => {
    const prefillFromDB = async () => {
      try {
        const response = await tutorService.getTutorProfile();
        if (response.success && response.data) {
          const t = response.data;

          const normalizeToArray = (value: string | string[] | undefined): string[] => {
            if (!value) return [];
            return Array.isArray(value)
              ? value
              : value.split(",").map((v) => v.trim()).filter(Boolean);
          };

          setFormData({
            description: t.description || "",
            languages: normalizeToArray(t.languages),
            education: t.education || "",
            skills: normalizeToArray(t.skills),
            experienceLevel: t.experienceLevel || "",
            gender: t.gender || "",
            occupation: t.occupation || "",
            profileImage: null,
            certificates: [],
            accountHolder: t.accountHolder || "",
            accountNumber: t.accountNumber || "",
            bankName: t.bankName || "",
            ifsc: t.ifsc || "",
          });
        } else {
          console.log("No tutor data found — starting fresh");
        }
      } catch (err) {
        console.error("Failed to prefill tutor profile:", err);
      }
    };

    if (isOpen) prefillFromDB();
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "languages" || name === "skills") {
      setFormData({
        ...formData,
        [name]: value.split(",").map((v) => v.trim()).filter(Boolean),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "profileImage" | "certificates"
  ) => {
    if (!e.target.files) return;
    if (field === "profileImage") {
      setFormData({ ...formData, profileImage: e.target.files[0] });
      setErrors((prev) => ({ ...prev, profileImage: "" }));
    } else {
      setFormData({
        ...formData,
        certificates: [...formData.certificates, ...Array.from(e.target.files)],
      });
      setErrors((prev) => ({ ...prev, certificates: "" }));
    }
  };

  const validateStep = () => {
    const newErrors: { [key: string]: string } = {};

    if (step === 1) {
      if (!formData.profileImage) newErrors.profileImage = "Profile image is required";
      if (!formData.description.trim()) newErrors.description = "Description is required";
      if (formData.languages.length === 0)
        newErrors.languages = "At least one language is required";
      if (!formData.gender) newErrors.gender = "Gender is required";
    }

    if (step === 2) {
      if (!formData.education.trim()) newErrors.education = "Education is required";
      if (formData.skills.length === 0) newErrors.skills = "At least one skill is required";
      if (!formData.experienceLevel)
        newErrors.experienceLevel = "Experience level is required";
      if (formData.certificates.length === 0)
        newErrors.certificates = "At least one certificate is required";
      if (!formData.occupation.trim()) newErrors.occupation = "Occupation is required";
    }

    if (step === 3) {
      if (!formData.accountHolder.trim())
        newErrors.accountHolder = "Account holder name is required";
      if (!formData.accountNumber.trim())
        newErrors.accountNumber = "Account number is required";
      if (!formData.bankName.trim()) newErrors.bankName = "Bank name is required";
      if (!formData.ifsc.trim()) newErrors.ifsc = "IFSC code is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) setStep((prev) => prev + 1);
  };
  const prevStep = () => setStep((prev) => prev - 1);

  //Submit form & auto-close modal
  const handleSubmit = async () => {
    if (!validateStep()) return;
    useAuthStore.setState({ isLoading: true });

    const response = await tutorService.apply(formData);

    if (!response.success) {
      if (response.errors?.length) {
        toast.error(response.errors[0].message);
      } else {
        toast.error(response.message || "Submission failed!");
      }
      useAuthStore.setState({ isLoading: false });
      return;
    }

    toast.success(response.message || "Application submitted successfully!");

    // Refresh user data (in case tutor status changed)
    await authService.fetchUser();

    useAuthStore.setState({ isLoading: false });

    // Auto close modal after short delay
    setTimeout(() => {
      onClose();
    }, 500);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-3xl bg-white p-8 text-left align-middle shadow-2xl transition-all">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes size={20} />
                </button>

                {/* Stepper */}
                <div className="flex items-center justify-center mb-8 text-sm font-medium text-gray-500">
                  <span className={`px-2 py-1 rounded-full ${step === 1 ? "bg-blue-100 text-blue-700" : ""}`}>Personal Info</span>
                  <span className="mx-2 text-gray-300">→</span>
                  <span className={`px-2 py-1 rounded-full ${step === 2 ? "bg-blue-100 text-blue-700" : ""}`}>Professional Info</span>
                  <span className="mx-2 text-gray-300">→</span>
                  <span className={`px-2 py-1 rounded-full ${step === 3 ? "bg-blue-100 text-blue-700" : ""}`}>Payment Info</span>
                </div>

                {/* Step 1 */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="flex flex-col items-center">
                      {formData.profileImage ? (
                        <img
                          src={URL.createObjectURL(formData.profileImage)}
                          alt="Preview"
                          className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-blue-100"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4 border-4 border-gray-200">
                          <FaCamera className="text-gray-400 text-2xl" />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "profileImage")}
                        className="text-sm text-gray-600"
                      />
                      {errors.profileImage && (
                        <p className="text-red-500 text-sm mt-2">{errors.profileImage}</p>
                      )}
                    </div>

                    <div>
                      <label className="block font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        name="description"
                        placeholder="Tell us a bit about yourself..."
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-xl p-4 h-28 resize-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                      />
                      {errors.description && (
                        <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                      )}
                    </div>

                    <div>
                      <label className="block font-medium text-gray-700 mb-2">Languages</label>
                      <Input
                        type="text"
                        name="languages"
                        placeholder="e.g., English, Hindi, French"
                        value={formData.languages.join(", ")}
                        onChange={handleChange}
                        className="h-12 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                      />
                      {errors.languages && (
                        <p className="text-red-500 text-sm mt-1">{errors.languages}</p>
                      )}
                    </div>

                    <div>
                      <label className="block font-medium text-gray-700 mb-2">Gender</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-xl p-3 h-12 focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                      >
                        <option value="">Select...</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.gender && (
                        <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
                      )}
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button
                        className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                        onClick={nextStep}
                      >
                        Continue →
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 2 */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block font-medium text-gray-700 mb-2">Education</label>
                      <Input
                        type="text"
                        name="education"
                        placeholder="Your highest qualification"
                        value={formData.education}
                        onChange={handleChange}
                        className="h-12 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                      />
                      {errors.education && (
                        <p className="text-red-500 text-sm mt-1">{errors.education}</p>
                      )}
                    </div>

                    <div>
                      <label className="block font-medium text-gray-700 mb-2">Skills</label>
                      <Input
                        type="text"
                        name="skills"
                        placeholder="e.g., Math, Science, Coding"
                        value={formData.skills.join(", ")}
                        onChange={handleChange}
                        className="h-12 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                      />
                      {errors.skills && (
                        <p className="text-red-500 text-sm mt-1">{errors.skills}</p>
                      )}
                    </div>

                    <div>
                      <label className="block font-medium text-gray-700 mb-2">Experience Level</label>
                      <select
                        name="experienceLevel"
                        value={formData.experienceLevel}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-xl p-3 h-12 focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                      >
                        <option value="">Select...</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Expert">Expert</option>
                      </select>
                      {errors.experienceLevel && (
                        <p className="text-red-500 text-sm mt-1">{errors.experienceLevel}</p>
                      )}
                    </div>

                    <div>
                      <label className="block font-medium text-gray-700 mb-2">Certificates</label>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.png"
                        onChange={(e) => handleFileChange(e, "certificates")}
                        className="text-sm text-gray-600"
                      />
                      {errors.certificates && (
                        <p className="text-red-500 text-sm mt-1">{errors.certificates}</p>
                      )}
                    </div>

                    <div>
                      <label className="block font-medium text-gray-700 mb-2">Occupation</label>
                      <Input
                        type="text"
                        name="occupation"
                        placeholder="e.g., Teacher, Lecturer"
                        value={formData.occupation}
                        onChange={handleChange}
                        className="h-12 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                      />
                      {errors.occupation && (
                        <p className="text-red-500 text-sm mt-1">{errors.occupation}</p>
                      )}
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button
                        variant="outline"
                        className="px-8 py-3 rounded-xl border-gray-200 hover:bg-gray-50 transition"
                        onClick={prevStep}
                      >
                        ← Back
                      </Button>
                      <Button
                        className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                        onClick={nextStep}
                      >
                        Continue →
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3 */}
                {step === 3 && (
                  <div className="space-y-6">
                    {[
                      { name: "accountHolder", label: "Account Holder Name", placeholder: "Enter name" },
                      { name: "accountNumber", label: "Account Number", placeholder: "Enter account number" },
                      { name: "bankName", label: "Bank Name", placeholder: "Enter bank name" },
                      { name: "ifsc", label: "IFSC Code", placeholder: "Enter IFSC" },
                    ].map(({ name, label, placeholder }) => (
                      <div key={name}>
                        <label className="block font-medium text-gray-700 mb-2">{label}</label>
                        <Input
                          type="text"
                          name={name}
                          placeholder={placeholder}
                          value={formData[name as keyof typeof formData] as string}
                          onChange={handleChange}
                          className="h-12 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                        />
                        {errors[name] && (
                          <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
                        )}
                      </div>
                    ))}

                    <div className="flex justify-between pt-4">
                      <Button
                        variant="outline"
                        className="px-8 py-3 rounded-xl border-gray-200 hover:bg-gray-50 transition"
                        onClick={prevStep}
                      >
                        ← Back
                      </Button>
                      <Button
                        className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                        onClick={handleSubmit}
                      >
                        Submit Application
                      </Button>
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>

        {isLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </Dialog>
    </Transition>
  );
};

export default ApplicationModal;