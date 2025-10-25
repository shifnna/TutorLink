import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { FaCamera, FaTimes } from "react-icons/fa";
import { Toaster,toast } from "react-hot-toast";
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
    languages: [],
    education: "",
    skills: [],
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: "profileImage" | "certificates") => {
    if (!e.target.files) return;
    if (field === "profileImage") {
      setFormData({ ...formData, profileImage: e.target.files[0] });
    } else {
      setFormData({ ...formData, certificates: [...formData.certificates, ...Array.from(e.target.files)]});
    }
  };

  const validateStep = () => {
    let newErrors: { [key: string]: string } = {};

    if (step === 1) {
      if (!formData.profileImage) newErrors.profileImage = "Profile image is required";
      if (!formData.description) newErrors.description = "Description is required";
      if (!formData.languages) newErrors.languages = "Languages are required";
    }

    if (step === 2) {
      if (!formData.education) newErrors.education = "Education is required";
      if (!formData.skills) newErrors.skills = "Skills are required";
      if (!formData.experienceLevel) newErrors.experienceLevel = "Experience level is required";
      if (formData.certificates.length === 0) newErrors.certificates = "At least one certificate is required";
      if (!formData.occupation) newErrors.occupation = "Occupation is required";
    }

    if (step === 3) {
      if (!formData.accountHolder) newErrors.accountHolder = "Account holder name is required";
      if (!formData.accountNumber) newErrors.accountNumber = "Account number is required";
      if (!formData.bankName) newErrors.bankName = "Bank name is required";
      if (!formData.ifsc) newErrors.ifsc = "IFSC code is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => { if (validateStep()) setStep((prev) => prev + 1)};
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    if (!validateStep()) return;
    try {
      useAuthStore.setState({isLoading:true})
      const response = await tutorService.apply(formData);
      if(response){
        toast.success("Application submitted successfully!");
      }
      const updatedUser = await authService.fetchUser();
      if (updatedUser.success && updatedUser.data) {
        useAuthStore.getState().setUser(updatedUser.data);
      }
      onClose();
    } catch (err:any) {
      const errorMessage =
      err.response?.data?.error ||
      "Something went wrong!";
    toast.error(errorMessage);
    } finally {
      useAuthStore.setState({isLoading:false})
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Background overlay */}
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

      {/* Modal wrapper */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div
          className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ❌ Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
              <FaTimes size={20} />

          </button>

          {/* Stepper */}
          <div className="flex items-center justify-center mb-8 text-sm font-bold text-gray-600">
            <span className={step === 1 ? "text-purple-700" : ""}>Personal Info</span>
            <span className="mx-2">→</span>
            <span className={step === 2 ? "text-purple-700" : ""}>Professional Info</span>
            <span className="mx-2">→</span>
            <span className={step === 3 ? "text-purple-700" : ""}>Payment Info</span>
          </div>

          {/* Steps */}
          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-3">
              {/* Profile Image */}
              <div className="flex flex-col items-center relative">
                {formData.profileImage ? (
                  <img
                    src={URL.createObjectURL(formData.profileImage)}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover mb-2"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-2 text-gray-500 relative">
                    <FaCamera className="text-2xl" />
                  </div>
                )}
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "profileImage")} className="mt-2" />
                {errors.profileImage && <p className="text-red-500 text-sm">{errors.profileImage}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  placeholder="Write a short description..."
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3 h-24"
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
              </div>

              {/* Languages */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Languages</label>
                <Input
                  type="text"
                  name="languages"
                  placeholder="E.g. English, Hindi, French"
                  value={formData.languages}
                  onChange={handleChange}
                  className="h-12"
                />
                {errors.languages && <p className="text-red-500 text-sm">{errors.languages}</p>}
              </div>

              {/* Gender */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3 h-12"
                >
                  <option value="">Select...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Next button */}
              <div className="flex justify-end">
                <Button className="bg-gradient-to-r from-purple-700 to-pink-600 text-white px-6 py-2 rounded-lg shadow" onClick={nextStep}>
                  Continue →
                </Button>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Education</label>
                <Input type="text" name="education" placeholder="Your highest qualification" value={formData.education} onChange={handleChange} className="h-12" />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Skills</label>
                <Input type="text" name="skills" placeholder="E.g. Math, Science, Coding" value={formData.skills} onChange={handleChange} className="h-12" />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Experience Level</label>
                <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} className="w-full border rounded-lg p-3 h-12">
                  <option value="">Select...</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Certificates</label>
                <input type="file" multiple accept=".pdf,.jpg,.png" onChange={(e) => handleFileChange(e, "certificates")} />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Occupation</label>
                <Input type="text" name="occupation" placeholder="E.g. Teacher, Lecturer" value={formData.occupation} onChange={handleChange} className="h-12" />
              </div>

              <div className="flex justify-between">
                <Button variant="outline" className="px-6 py-2 rounded-lg" onClick={prevStep}>← Back</Button>
                <Button className="bg-gradient-to-r from-purple-700 to-pink-600 text-white px-6 py-2 rounded-lg shadow" onClick={nextStep}>Continue →</Button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Account Holder Name</label>
                <Input type="text" name="accountHolder" placeholder="Enter name" value={formData.accountHolder} onChange={handleChange} className="h-12" />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Account Number</label>
                <Input type="text" name="accountNumber" placeholder="Enter account number" value={formData.accountNumber} onChange={handleChange} className="h-12" />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Bank Name</label>
                <Input type="text" name="bankName" placeholder="Enter bank name" value={formData.bankName} onChange={handleChange} className="h-12" />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">IFSC Code</label>
                <Input type="text" name="ifsc" placeholder="Enter IFSC" value={formData.ifsc} onChange={handleChange} className="h-12" />
              </div>

              <div className="flex justify-between">
                <Button variant="outline" className="px-6 py-2 rounded-lg" onClick={prevStep}>← Back</Button>
                <Button className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-2 rounded-lg shadow" onClick={handleSubmit}>
                  Submit Application
                </Button>
              </div>
            </div>
          )}
        </div>
{isLoading && (
  <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
    <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
  </div>
)}
      </div>
    </Dialog>
  );
};

export default ApplicationModal;