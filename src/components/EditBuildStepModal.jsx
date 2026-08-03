import React, { useEffect, useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { productControllers } from "../api/product";
import { categoryControllers } from "../api/category";

// const EditBuildStepModal = ({ stepId, onClose }) => {
const EditBuildStepModal = ({ stepId, stepDetails, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [subCategories, setSubCategories] = useState([]);
  const [isSkillsDropdownOpen, setIsSkillsDropdownOpen] = useState(false);
  const [stepData, setStepData] = useState({
    stepName: "",
    description: "",
    dueDate: "",
    proposedPrice: "",
    adminRemarks: "",
    instructions: "",
    materials: "",
    skills: [],
  });
  const [initialData, setInitialData] = useState(null);
  const [stepErrors, setStepErrors] = useState({});
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const res = await categoryControllers.getallSubcategory();
        setSubCategories(res.data?.data?.docs || res.data?.data || []);
      } catch (err) {
        console.error("Error fetching subcategories:", err);
      }
    };
    fetchSubCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".relative-skills-dropdown")) {
        setIsSkillsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // const loadDetails = async () => {
    //   try {
    //     const res = await productControllers.getBuildStepDetails(stepId);
    //     const d = res.data?.data;
    //     setStepData({
    //       stepName: d.stepName || "",
    //       description: d.description || "",
    //       dueDate: d.dueDate ? d.dueDate.split("T")[0] : "",
    //       proposedPrice: d.proposedPrice || "",
    //       adminRemarks: d.adminRemarks || "",
    //       instructions: d.instructions || "",
    //       materials: d.materials || "",
    //       skills: d.skills
    //         ? d.skills.split(",").map((s) => s.trim()).filter(Boolean)
    //         : [],
    //     });
    //   } catch {
    //     toast.error("Failed to load step details");
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // loadDetails();

    if (stepDetails) {
      const initial = {
        stepName: stepDetails.stepName || "",
        description: stepDetails.description || "",
        dueDate: stepDetails.dueDate ? (() => {
          const d = new Date(stepDetails.dueDate);
          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        })() : "",
        proposedPrice: stepDetails.proposedPrice || "",
        adminRemarks: stepDetails.adminRemarks || stepDetails.admin_remarks || "",
        instructions: stepDetails.instructions || "",
        materials: stepDetails.materials || "",
        skills: stepDetails.skills
          ? (typeof stepDetails.skills === 'string'
            ? stepDetails.skills.split(",")
            : Array.isArray(stepDetails.skills)
              ? stepDetails.skills
              : []).map((s) => (s.trim ? s.trim() : s)).filter(Boolean)
          : [],
      };
      setStepData(initial);
      setInitialData(initial);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [stepId, stepDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStepData((prev) => ({ ...prev, [name]: value }));
    if (stepErrors[name]) setStepErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const isDataChanged = 
    initialData && (
      JSON.stringify({ ...stepData, skills: [...stepData.skills].sort() }) !== 
      JSON.stringify({ ...initialData, skills: [...initialData.skills].sort() }) ||
      images.length > 0
    );

  const handleSubmit = async () => {
    let errors = {};

    if (!stepData.proposedPrice) {
      errors.proposedPrice = "Proposed Price is required";
    } else if (Number(stepData.proposedPrice) <= 0) {
      errors.proposedPrice = "Proposed Price must be greater than 0";
    }

    if (!stepData.stepName.trim()) {
      errors.stepName = "Step Name is required";
    } else {
      const nameRegex = /^[a-zA-Z0-9\s,\.]+$/;
      if (!nameRegex.test(stepData.stepName)) {
        errors.stepName = "Special characters are not allowed";
      }
    }

    if (!stepData.description.trim()) {
      errors.description = "Description is required";
    }

    if (stepData.materials && stepData.materials.trim()) {
      const materialRegex = /^[a-zA-Z\s&\-]{2,50}$/;
      if (!materialRegex.test(stepData.materials)) {
        errors.materials = "Invalid Material (2-50 characters, letters, space, &, - only)";
      }
    }

    if (!stepData.skills || stepData.skills.length === 0) {
      errors.skills = "Please select at least one skill";
    }

    if (!stepData.dueDate) {
      errors.dueDate = "Due Date is required";
    } else {
      const selectedDate = new Date(stepData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const maxDate = new Date("2099-12-31T23:59:59");
      if (selectedDate < today) {
        errors.dueDate = "Due Date cannot be in the past";
      } else if (selectedDate > maxDate) {
        errors.dueDate = "Due Date must be less than 2099";
      }
    }

    if (Object.keys(errors).length > 0) {
      setStepErrors(errors);
      toast.dismiss();
      toast.error("Please Enter the required fields correctly");
      return;
    }
    setStepErrors({});

    try {
      const formData = new FormData();
      Object.entries(stepData).forEach(([key, value]) => {
        if (key === "skills" && Array.isArray(value)) {
          formData.append(key, value.join(", "));
        } else {
          formData.append(key, value);
        }
      });

      images.forEach((file) => formData.append("reference_images", file));

      await productControllers.updateBuildStep(stepId, formData);

      toast.dismiss();
      toast.success("Build Step Updated Successfully!");
      onClose();
    } catch (error) {
      toast.dismiss();
      toast.error("Update failed");
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col relative shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b shrink-0">
          <h2 className="text-xl font-bold text-gray-900">Update Build Step</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-0">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Step Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="stepName"
                value={stepData.stepName}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-orange-500"
                placeholder="Step Name"
              />
              {stepErrors.stepName && <p className="text-red-500 text-xs mt-1">{stepErrors.stepName}</p>}
            </div>

            <div className="col-span-1 relative relative-skills-dropdown">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills <span className="text-red-500">*</span>
              </label>
              <div
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:outline-none focus-within:border-orange-500 cursor-pointer bg-white flex items-center justify-between text-sm"
                onClick={() => setIsSkillsDropdownOpen(!isSkillsDropdownOpen)}
              >
                <span className="truncate text-gray-700">
                  {stepData.skills.length > 0
                    ? stepData.skills.join(", ")
                    : "Select Skills"}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
              {stepErrors.skills && <p className="text-red-500 text-xs mt-1">{stepErrors.skills}</p>}

              {isSkillsDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {subCategories.map((sub, index) => {
                    const isSelected = stepData.skills.some(
                      (skill) => skill.toLowerCase() === sub.category_name.toLowerCase()
                    );
                    return (
                      <div
                        key={sub.id || sub._id || index}
                        className="px-4 py-2 hover:bg-orange-50 cursor-pointer text-sm flex items-center gap-2"
                        onClick={() => {
                          let newSkills;
                          if (isSelected) {
                            newSkills = stepData.skills.filter(
                              (item) => item.toLowerCase() !== sub.category_name.toLowerCase()
                            );
                          } else {
                            newSkills = [...stepData.skills, sub.category_name];
                          }
                          setStepData((prev) => ({
                            ...prev,
                            skills: newSkills,
                          }));
                          if (stepErrors.skills) setStepErrors((prev) => ({ ...prev, skills: "" }));
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          readOnly
                          className="rounded text-orange-600 focus:ring-orange-500"
                        />
                        <span className="text-gray-700">{sub.category_name}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Proposed Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="proposedPrice"
                value={stepData.proposedPrice}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-orange-500"
                placeholder="Proposed Price"
              />
              {stepErrors.proposedPrice && <p className="text-red-500 text-xs mt-1">{stepErrors.proposedPrice}</p>}
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="dueDate"
                value={stepData.dueDate}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-orange-500"
              />
              {stepErrors.dueDate && <p className="text-red-500 text-xs mt-1">{stepErrors.dueDate}</p>}
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reference Images
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImages([...e.target.files])}
                className="w-full border border-gray-300 p-1.5 rounded-lg text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={stepData.description}
                onChange={handleChange}
                rows={2}
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-orange-500"
                placeholder="Description"
              />
              {stepErrors.description && <p className="text-red-500 text-xs mt-1">{stepErrors.description}</p>}
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instructions
              </label>
              <textarea
                name="instructions"
                value={stepData.instructions}
                onChange={handleChange}
                rows={2}
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-orange-500"
                placeholder="Instructions"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Materials
              </label>
              <textarea
                name="materials"
                value={stepData.materials}
                onChange={handleChange}
                rows={2}
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-orange-500"
                placeholder="Materials"
              />
              {stepErrors.materials && <p className="text-red-500 text-xs mt-1">{stepErrors.materials}</p>}
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin Remarks
              </label>
              <textarea
                name="adminRemarks"
                value={stepData.adminRemarks}
                onChange={handleChange}
                rows={2}
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-orange-500"
                placeholder="Admin Remarks"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 rounded-b-xl shrink-0">
          <button
            onClick={handleSubmit}
            disabled={!isDataChanged}
            className={`w-full py-3 rounded-xl font-semibold shadow-lg transition-all ${
              isDataChanged
                ? "bg-orange-600 text-white hover:bg-orange-700 shadow-orange-200"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Update Build Step
          </button>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};
export default EditBuildStepModal;
