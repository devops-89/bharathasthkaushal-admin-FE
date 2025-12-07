import React, { useEffect, useState } from "react";
import { X, Eye } from "lucide-react";
import axios from "axios";
import { productControllers } from "../api/product";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BuildStepDetailsModal = ({ stepId, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [stepDetails, setStepDetails] = useState(null);
  const [showRejectPopup, setShowRejectPopup] = useState(false);
  const [remarks, setRemarks] = useState("");
  useEffect(() => {
    if (!stepId) return;
    const fetchDetails = async () => {
      try {
        const res = await productControllers.getBuildStepDetails(stepId);
        setStepDetails(res.data?.data || res.data);
      } catch (err) {
        toast.error("Error fetching build step details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [stepId]);

  if (!stepId) return null;
  const handleApprove = async () => {
    try {
      const res = await productControllers.updateBuildStepStatus(
        stepId,
        "APPROVED"
      );
      console.log("Reject API Response:", res.data);
      setStepDetails((prev) => ({
        ...prev,
        status: "APPROVED",
      }));
      toast.info("Approved Successfully!");
    } catch (err) {
      console.log(err);
      toast.info("Approval failed");
    }
  };
  const currentStatus = stepDetails?.buildStatus || stepDetails?.status;

  const handleRejectSubmit = async () => {
    try {
      const res = await productControllers.updateBuildStepStatus(
        stepId,
        "REJECTED",
        remarks
      );
      console.log("Reject API Response:", res.data);

      setStepDetails((prev) => ({
        ...prev,
        status: "REJECTED",
      }));

      toast.info("Rejected Successfully!");
      setShowRejectPopup(false);
    } catch (err) {
      console.log(err);
      toast.info("Rejection failed");
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* HEADERr */}
        <h2 className="text-2xl font-bold mb-4">Build Step Details</h2>
        {loading ? (
          <p className="text-center py-10">Loading details...</p>
        ) : (
          <>
            {/* Step Name */}
            <p className="text-lg font-semibold mb-2">
              {stepDetails?.stepName}
            </p>

            {/* Description */}
            <p className="text-gray-700 mb-4">{stepDetails?.description}</p>


            <div className="flex items-center gap-2 mt-4 mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Status:</h3>
              <span
                className={`px-3 py-1 rounded-full text-sm font-bold border ${["APPROVED", "ADMIN_APPROVED"].includes(
                  stepDetails?.buildStatus
                )
                    ? "bg-green-100 text-green-700 border-green-200"
                    : ["REJECTED", "ADMIN_REJECTED"].includes(
                      stepDetails?.buildStatus
                    )
                      ? "bg-red-100 text-red-700 border-red-200"
                      : "bg-yellow-100 text-yellow-700 border-yellow-200"
                  }`}
              >
                {stepDetails?.buildStatus?.replace(/_/g, " ") || "PENDING"}
              </span>
            </div>

            {/* Admin Remarks */}
            {stepDetails?.adminRemarks && (
              <div className="mb-6 bg-orange-50 p-4 rounded-xl border border-orange-100">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  Admin Remarks
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {stepDetails.adminRemarks}
                </p>
              </div>
            )}
            {/*artisianRemarks  */}

            {stepDetails?.artisianRemarks && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-1">
                  Artisan Remarks
                </h3>
                <p className="text-gray-700">{stepDetails.artisianRemarks}</p>
              </div>
            )}

            {/* Instructions */}
            {stepDetails?.instructions && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-1">
                  Instructions
                </h3>
                <p className="text-gray-700">{stepDetails.instructions}</p>
              </div>
            )}

            {/* Materials */}
            {stepDetails?.materials && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-1">Materials</h3>
                <p className="text-gray-700">{stepDetails.materials}</p>
              </div>
            )}

            {/* Progress */}
            <div className="mb-4">
              <h3 className="font-semibold text-gray-800 mb-1">
                Progress: {stepDetails?.progressPercentage || "0"}%
              </h3>
            </div>
            {/* Reference Images (Admin) */}
            {stepDetails?.referenceImagesAddedByAdmin?.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Reference Images by Admin
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {stepDetails.referenceImagesAddedByAdmin.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}
            {/* Artisan Images */}
            {stepDetails?.imagesAddedByArtisan?.length > 0 ? (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Images Added By Artisan
                </h3>

                <div className="grid grid-cols-2 gap-2">
                  {stepDetails.imagesAddedByArtisan.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-red-500 font-semibold">
                No images added by artisan yet.
              </p>
            )}
            <div className="flex gap-20 mt-6"></div>

            {stepDetails?.imagesAddedByArtisan?.length > 0 &&
              currentStatus !== "APPROVED" &&
              currentStatus !== "ADMIN_APPROVED" &&
              currentStatus !== "REJECTED" &&
              currentStatus !== "ADMIN_REJECTED" && (
                <div className="flex gap-20 mt-6">
                  <button
                    onClick={handleApprove}
                    className="ml-40 bg-green-600 hover:bg-green-700 px-4 py-2 text-white rounded-lg"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => setShowRejectPopup(true)}
                    className="mr-40 bg-red-600 hover:bg-red-700 px-4 py-2 text-white rounded-lg"
                  >
                    Reject
                  </button>
                </div>
              )}

            {/* Reject Popup */}
            {showRejectPopup && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-xl w-full max-w-md">
                  <h2 className="text-xl font-semibold mb-3">
                    Reason for Rejection
                  </h2>
                  <textarea
                    className="w-full border p-2 rounded-md"
                    rows="4"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Write admin remarks..."
                  ></textarea>

                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      onClick={() => setShowRejectPopup(false)}
                      className="px-3 py-1 bg-gray-300 rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleRejectSubmit}
                      className="px-3 py-1 bg-red-600 text-white rounded-md"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};
export default BuildStepDetailsModal;
