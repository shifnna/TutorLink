import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { FaCamera } from "react-icons/fa";
import { useAuthStore } from "../../store/authStore";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApplicationModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const { applyForTutor } = useAuthStore();

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    description: "",
    languages: "",
    education: "",
    skills: "",
    experienceLevel: "",
    gender: "",
    occupation: "",
    profileImage: null as File | null,
    certificates: [] as File[],
    accountHolder: "",
    accountNumber: 0,
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
      setFormData({ ...formData, certificates: Array.from(e.target.files) });
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

  const nextStep = () => {
    if (validateStep()) setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  const handleSubmit = async () => {
    if (!validateStep()) return;

    // Convert profile image
    const profileImageStr = formData.profileImage ? await fileToBase64(formData.profileImage) : null;

    // Convert certificates
    const certificatesStr = formData.certificates.length
      ? await Promise.all(formData.certificates.map((file) => fileToBase64(file)))
      : [];

    const certificatesJoined = certificatesStr.join(","); // convert array to single string
  
    await applyForTutor(
      formData.description,
      formData.languages,
      formData.education,
      formData.skills,
      formData.experienceLevel,
      formData.gender,
      formData.occupation,
      profileImageStr,
      certificatesJoined, // Pass as array of strings
      formData.accountHolder,
      formData.accountNumber,
      formData.bankName,
      formData.ifsc
    );

    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto">

          {/* Stepper */}
          <div className="flex items-center justify-center mb-8 text-sm font-bold text-gray-600">
            <span className={step === 1 ? "text-purple-700" : ""}>Personal Info</span>
            <span className="mx-2">→</span>
            <span className={step === 2 ? "text-purple-700" : ""}>Professional Info</span>
            <span className="mx-2">→</span>
            <span className={step === 3 ? "text-purple-700" : ""}>Payment Info</span>
          </div>

          {/* Steps */}
          {step === 1 && (
            <div className="space-y-3">
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

              <div className="flex justify-end">
                <Button className="bg-gradient-to-r from-purple-700 to-pink-600 text-white px-6 py-2 rounded-lg shadow" onClick={nextStep}>
                  Continue →
                </Button>
              </div>
            </div>
          )}

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
      </div>
    </Dialog>
  );
};

export default ApplicationModal;
