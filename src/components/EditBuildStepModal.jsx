import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { productControllers } from "../api/product";

const EditBuildStepModal = ({ stepId, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [stepData, setStepData] = useState({
    stepName: "",
    description: "",
    dueDate: "",
    proposedPrice: "",
    adminRemarks: "",
    instructions: "",
    materials: "",
  });
  const [images, setImages] = useState([]);
  useEffect(() => {
    const loadDetails = async () => {
      try {
        const res = await productControllers.getBuildStepDetails(stepId);
        const d = res.data?.data;
        setStepData({
          stepName: d.stepName || "",
          description: d.description || "",
          dueDate: d.dueDate ? d.dueDate.split("T")[0] : "",
          proposedPrice: d.proposedPrice || "",
          adminRemarks: d.adminRemarks || "",
          instructions: d.instructions || "",
          materials: d.materials || "",
        });
      } catch {
        toast.error("Failed to load step details");
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [stepId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStepData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      Object.entries(stepData).forEach(([key, value]) =>
        formData.append(key, value),
      );

      images.forEach((file) => formData.append("reference_images", file));

      await productControllers.updateBuildStep(stepId, formData);

      toast.success("Build Step Updated Successfully!");
      onClose();
    } catch (error) {
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
                Step Name
              </label>
              <input
                type="text"
                name="stepName"
                value={stepData.stepName}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-orange-500"
                placeholder="Step Name"
              />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Proposed Price
              </label>
              <input
                type="number"
                name="proposedPrice"
                value={stepData.proposedPrice}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-orange-500"
                placeholder="Proposed Price"
              />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={stepData.dueDate}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-orange-500"
              />
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
                Description
              </label>
              <textarea
                name="description"
                value={stepData.description}
                onChange={handleChange}
                rows={2}
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-orange-500"
                placeholder="Description"
              />
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
            className="w-full bg-orange-600 text-white py-3 rounded-xl hover:bg-orange-700 font-semibold shadow-lg shadow-orange-200 transition-all"
          >
            Update Build Step
          </button>
        </div>
      </div>
    </div>
  );
};
export default EditBuildStepModal;
