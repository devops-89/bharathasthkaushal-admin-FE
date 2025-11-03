import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Package,
  Palette,
  Ruler,
  Award,
  ChevronLeft,
  ChevronRight,
  X,
  ChevronDown,
  ChevronUp,
  Users,
  FileText,
} from "lucide-react";
import { productControllers } from "../../api/product";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [showCreateStepForm, setShowCreateStepForm] = useState(false);
  const [buildSteps, setBuildSteps] = useState([]);
  const [expandedStep, setExpandedStep] = useState(null);
  const [products, setProducts] = useState([]);
  const [referenceImages, setReferenceImages] = useState([]);
  const [assignForm, setAssignForm] = useState({
    artisanId: "",
    stepIds: [],
    deadline: "",
    priority: "medium",
    notes: "",
  });
  const [createStepForm, setCreateStepForm] = useState({
  productId: "",
  sequence: "",
  stepName: "",
  description: "",
  proposedPrice: "",
  admin_remarks: "",
  dueDate: "",
  materials: "",
  instructions: "",
});

const [showRejectModal, setShowRejectModal] = useState(false);
const [rejectReason, setRejectReason] = useState("");
  useEffect(() => {
    console.log("Route param id:", id);
    if (id) {
      setLoading(true);
      Promise.all([
        productControllers
          .getProductById(id)
          .then((res) => {
            console.log("Product API response:", res.data);
            const productData = res.data?.data || res.data;
            setProduct(productData || null);
            return productData;
          })
          .catch((err) => {
            console.error(
              "Error fetching product:",
              err.response?.data || err.message
            );
            setProduct(null);
            return null;
          }),
        fetchProducts(),
        fetchBuildSteps(),
      ]).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id]);
  const fetchProducts = async () => {
    try {
      const res = await productControllers.getAllProducts();
      console.log("Products Response:", res.data.data.docs);
      setProducts(res.data.data?.docs || []);
    } catch (err) {
      console.error(
        "Error fetching products:",
        err.response?.data || err.message
      );
      setProducts([]);
    }
  };
  const fetchBuildSteps = async () => {
    try {
      const res = await productControllers.getBuildSteps(id);
      console.log("Build steps API response:", res.data);
      setBuildSteps(res.data?.data || res.data || []);
    } catch (err) {
      console.error(
        "Error fetching build steps:",
        err.response?.data || err.message
      );
      setBuildSteps([]);
    }
  };
  const nextImage = () => {
    if (product?.images?.length) {
      setSelectedImageIndex(
        (prevIndex) => (prevIndex + 1) % product.images.length
      );
    }
  };
  const prevImage = () => {
    if (product?.images?.length) {
      setSelectedImageIndex((prevIndex) =>
        prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
      );
    }
  };
  const handleAssignFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "stepIds") {
      setAssignForm((prev) => ({
        ...prev,
        stepIds: checked
          ? [...prev.stepIds, value]
          : prev.stepIds.filter((id) => id !== value),
      }));
    } else {
      setAssignForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAssignFormSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      console.log("Steps would be assigned:", assignForm);
      alert("Steps assigned to artisan successfully!");

      setAssignForm({
        artisanId: "",
        stepIds: [],
        deadline: "",
        priority: "medium",
        notes: "",
      });
      setShowAssignForm(false);
      setLoading(false);
    }, 1000);
  };

  const handleCreateStepFormChange = (e) => {
    const { name, value } = e.target;
    setCreateStepForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateStepFormSubmit = (e) => {
    e.preventDefault();
    if (!createStepForm.productId) {
      return alert("Please select a product.");
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("productId", createStepForm.productId);
    formData.append("sequence", createStepForm.sequence);
    formData.append("stepName", createStepForm.stepName);
    formData.append("description", createStepForm.description);
    formData.append("proposedPrice", createStepForm.proposedPrice);
    formData.append("admin_remarks", createStepForm.admin_remarks || "");
    formData.append("dueDate", createStepForm.dueDate);
    formData.append("materials", createStepForm.materials || "");
    formData.append("instructions", createStepForm.instructions || "");
    referenceImages.forEach((file) => {
      formData.append("reference_images", file);
    });
    productControllers
      .createBuildStep(formData)
      .then((res) => {
        console.log("Create build step API response:", res.data);
        alert("Build step created successfully!");
        setCreateStepForm({
          productId: "",
          sequence: "",
          stepName: "",
          description: "",
          proposedPrice: "",
          admin_remarks: "",
          dueDate: "",
          materials: "",
          instructions: "",
        });
        setReferenceImages([]);
        if (createStepForm.productId === id) {
          fetchBuildSteps();
        }
        setShowCreateStepForm(false);
      })
      .catch((err) => {
        console.error(
          "Error creating build step:",
          err.response?.data || err.message
        );
        alert("Error creating build step. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  const toggleStepExpanded = (stepId) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6 ml-64 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6 ml-64 pt-20 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-24 h-24 text-gray-400 mx-auto mb-4" />
          <p className="text-red-600 text-xl font-seFmibold">
            Product not found!
          </p>
        </div>
      </div>
    );
  }
  const calculateDiscountedPrice = () => {
    if (product?.discount > 0) {
      return Math.round((product?.mrp || 0) / (1 - product.discount / 100));
    }
    return product?.mrp || 0;
  };
  const getSavingsAmount = () => {
    if (product?.discount > 0) {
      return calculateDiscountedPrice() - (product?.mrp || 0);
    }
    return 0;
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6 ml-64 pt-20">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Image Section - Left Side */}
            <div className="lg:col-span-7 p-8">
              <div className="sticky top-8">
                {/* Main Image with Carousel */}
                <div className="mb-6"> 
                  {product?.images?.length > 0 ? (
                    <div className="relative group">
                      <img
                        src={product.images[selectedImageIndex]?.imageUrl}
                        alt={product?.product_name}
                        className="w-full h-64 lg:h-80 object-cover rounded-2xl shadow-lg transition-transform group-hover:scale-105"
                      />
                      {/* Image Counter*/}
                      <div className="absolute top-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {selectedImageIndex + 1} / {product.images.length}
                      </div>
                      {/* Discount Badge */}
                      {product?.discount > 0 && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                            {product.discount}% OFF
                          </span>
                        </div>
                      )}
                      {/* Carousel Navigation Arrows */}
                      {product.images.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all opacity-0 group-hover:opacity-100"
                          >
                            <ChevronLeft className="w-6 h-6 text-gray-700" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all opacity-0 group-hover:opacity-100"
                          >
                            <ChevronRight className="w-6 h-6 text-gray-700" />
                          </button>
                        </>
                      )}
                      {/* Carousel Dots */}
                      {product.images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                          {product.images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedImageIndex(index)}
                              className={`w-2 h-2 rounded-full transition-all ${
                                selectedImageIndex === index
                                  ? "bg-white scale-125"
                                  : "bg-white bg-opacity-50 hover:bg-opacity-75"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-64 lg:h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                      <Package className="w-32 h-32 text-gray-400" />
                    </div>
                  )}
                </div>
                {/* Thumbnaill    & Images */}
                {product?.images?.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2 mb-4">
                    {product.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImageIndex === index
                            ? "border-orange-500 shadow-lg scale-105"
                            : "border-gray-200 hover:border-orange-300"
                        }`}
                      >
                        <img
                          src={img.imageUrl}
                          alt={`${product?.product_name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}       
              <div className="mt-3 mb-3 ml-6 mr-6">
  {/* APPROVED */}
  {product.admin_approval_status === "APPROVED" && (
    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-semibold">
      Approved
    </span>
  )}

  {/* REJECTED – show reason if exists */}
  {product.admin_approval_status === "REJECTED" && (
    <div className="space-y-2">
      <span className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-semibold">
        Rejected
      </span>
      
      {product.adminRemarks && (
        <p className="text-sm text-red-600 italic">
          Reason: {product.adminRemarks}
        </p>
      )}
    </div>
  )}

  {/* PENDING – Approve or open Reject modal */}
  {product.admin_approval_status === "PENDING" && (
    <div className="flex gap-4">
      <button
       onClick={async () => {
  try {
    await productControllers.updateProductStatus(product.productId, "APPROVED");
    alert("Product Approved");
    const res = await productControllers.getProductById(id);
    setProduct(res.data?.data || res.data);
  } catch (err) {
    alert("Failed to approve");
  }
}}
        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
      >
        Approve
      </button>

      <button
       onClick={async () => {
  try {
    await productControllers.updateProductStatus(
      product.productId,
      "REJECTED",
      rejectReason.trim()
    );
    alert("Product Rejected");

    // Refresh product data instantly (no full reload)
    const res = await productControllers.getProductById(id);
    setProduct(res.data?.data || res.data);

    setShowRejectModal(false);
    setRejectReason(""); // clear input
  } catch (err) {
    console.error(err);
    alert("Failed to reject product");
  }
}}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
      >
        Reject
      </button>
    </div>
  )}
</div>
                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => setShowCreateStepForm(true)}
                    className="w-full px-4 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <FileText className="w-3 h-5" />
                    Create Build Step
                  </button>
                  <button
                    onClick={() => setShowAssignForm(true)}
                    className="w-full px-4 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <Users className="w-5 h-5" />
                    Assign Steps to Artisan
                  </button>
                </div>
                {/* Build Steps FAQ Section */}
                <div className="mt-8">
                  <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <FileText className="w-6 h-6 text-orange-500" />
                      Build Steps ({buildSteps.length})
                    </h3>
                    {buildSteps.length === 0 ? (
                      <div className="text-center py-8">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">
                          No build steps available
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {buildSteps.map((step) => (
                          <div
                            key={step.id}
                            className="border border-gray-200 rounded-xl overflow-hidden"
                          >
                            <button
                              onClick={() => toggleStepExpanded(step.id)}
                              className="w-full px-4 py-3 bg-white hover:bg-gray-50 flex items-center justify-between transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold">
                                  Step {step.sequence}
                                </span>
                                <span className="font-medium text-gray-900">
                                  {step.stepName}
                                </span>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                    step.status
                                  )}`}
                                >
                                  {step.status?.replace("_", " ").toUpperCase()}
                                </span>
                              </div>
                              {expandedStep === step.id ? (
                                <ChevronUp className="w-5 h-5 text-gray-500" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-500" />
                              )}
                            </button>
                            {expandedStep === step.id && (
                              <div className="px-4 pb-4 bg-gray-50">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                  <div>
                                    <h4 className="font-semibold text-gray-700 mb-2">
                                      Description
                                    </h4>
                                    <p className="text-gray-600 text-sm">
                                      {step.description}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-gray-700 mb-2">
                                      Proposed Price
                                    </h4>
                                    <p className="text-orange-600 font-bold text-lg">
                                      ₹
                                      {step.proposed_price ||
                                        step.proposedPrice}
                                    </p>
                                  </div>
                                  {step.admin_remarks && (
                                    <div className="md:col-span-2">
                                      <h4 className="font-semibold text-gray-700 mb-2">
                                        Admin Remarks
                                      </h4>
                                      <p className="text-gray-600 text-sm bg-white p-3 rounded-lg">
                                        {step.admin_remarks}
                                      </p>
                                    </div>
                                  )}
                                  <div className="md:col-span-2">
                                    <h4 className="font-semibold text-gray-700 mb-2">
                                      Created Date
                                    </h4>
                                    <p className="text-gray-600 text-sm">
                                      {new Date(
                                        step.createdAt
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Product Information - Right Side */}
            <div className="lg:col-span-5 p-8 bg-gradient-to-br from-gray-50 to-white">
              <div className="space-y-6">
                {/* Product Title */}
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                    {product?.product_name || "Unnamed Product"}
                  </h1>
                </div>
              

                {/* Price Section */}
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-2xl border border-orange-200">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-4xl font-bold text-orange-600">
                      ₹{product?.mrp || 0}
                    </span>
                    {product?.discount > 0 && (
                      <span className="text-xl text-gray-500 line-through">
                        ₹{calculateDiscountedPrice()}
                      </span>
                    )}
                  </div>
                  {product?.discount > 0 && (
                    <div className="flex items-center gap-3">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                        You Save: ₹{getSavingsAmount()}
                      </span>
                      <span className="text-gray-600 text-sm">
                        ({product.discount}% off)
                      </span>
                    </div>
                  )}
                </div>
                {/* Stock Status */}
                <div className="flex items-center gap-3">
                  <span className="text-gray-700 font-medium">
                    Availability:
                  </span>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${
                      parseInt(product?.quantity || 0) < 10
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        parseInt(product?.quantity || 0) < 10
                          ? "bg-red-500"
                          : "bg-green-500"
                      }`}
                    ></div>
                    {parseInt(product?.quantity || 0) < 10
                      ? "Low Stock"
                      : "In Stock"}
                    ({product?.quantity || 0} units)
                  </span>
                </div>
                {/* Product Details */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Product Details
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {product?.artisan && (
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <Award className="w-5 h-5 text-blue-600" />
                        <div>
                          <span className="text-gray-700 font-medium">
                            Artisan:
                          </span>
                          <span className="ml-2 text-blue-600 font-semibold">
                            {product.artisan?.name || product.artisan}
                          </span>
                        </div>
                      </div>
                    )}
                    {/* Approval Action Section */}

                    {product?.material && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Package className="w-5 h-5 text-gray-600" />
                        <div>
                          <span className="text-gray-700 font-medium">
                            Material:
                          </span>
                          <span className="ml-2 text-gray-900 font-medium">
                            {product.material}
                          </span>
                        </div>
                      </div>
                    )}
                    {product?.color && (
                      <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                        <Palette className="w-5 h-5 text-purple-600" />
                        <div>
                          <span className="text-gray-700 font-medium">
                            Color:
                          </span>
                          <span className="ml-2 text-gray-900 font-medium">
                            {product.color}
                          </span>
                        </div>
                      </div>
                    )}
                    {product?.size?.length > 0 && (
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <Ruler className="w-5 h-5 text-green-600" />
                        <div>
                          <span className="text-gray-700 font-medium">
                            Size:
                          </span>
                          <span className="ml-2 text-gray-900 font-medium">
                            {product.size.join(", ")}
                          </span>
                        </div>
                      </div>
                    )}
                    {product?.netWeight && (
                      <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                        <Package className="w-5 h-5 text-yellow-600" />
                        <div>
                          <span className="text-gray-700 font-medium">
                            Net Weight:
                          </span>
                          <span className="ml-2 text-gray-900 font-medium">
                            {product.netWeight}
                          </span>
                        </div>
                      </div>
                    )}
                    {product?.dimension && (
                      <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg">
                        <Ruler className="w-5 h-5 text-indigo-600" />
                        <div>
                          <span className="text-gray-700 font-medium">
                            Dimensions:
                          </span>
                          <span className="ml-2 text-gray-900 font-medium">
                            {product.dimension}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {/* Description */}
                {product?.description && (
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      Description
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-gray-700 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  </div>
                )}
                {/* Back Button */}
                <button
                  onClick={() => navigate(-1)}
                  className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-300 border border-gray-300"
                >
                  ← Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Create Build Step Modal */}
      {showCreateStepForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Create New Build Step
              </h2>
              <button
                onClick={() => setShowCreateStepForm(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleCreateStepFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Product <span className="text-red-500">*</span>
                </label>
                <select
                  name="productId"
                  value={createStepForm.productId}
                  onChange={handleCreateStepFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Choose a product...</option>
                  {products.map((prod) => (
                    <option key={prod.productId} value={prod.productId}>
                      {prod.product_name || "Unnamed Product"}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sequence <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="sequence"
                    value={createStepForm.sequence}
                    onChange={handleCreateStepFormChange}
                    required
                    min="1"
                    placeholder="e.g., 4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Proposed Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="proposedPrice"
                    value={createStepForm.proposedPrice}
                    onChange={handleCreateStepFormChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="e.g., 200.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Step Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="stepName"
                  value={createStepForm.stepName}
                  onChange={handleCreateStepFormChange}
                  required
                  placeholder="e.g., Adding Decorative Elements"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={createStepForm.description}
                  onChange={handleCreateStepFormChange}
                  required
                  rows="3"
                  placeholder="e.g., Adding Decorative Elements & Final Touches"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={createStepForm.dueDate}
                  onChange={handleCreateStepFormChange}
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Materials
                </label>
                <input
                  type="text"
                  name="materials"
                  value={createStepForm.materials}
                  onChange={handleCreateStepFormChange}
                  placeholder="e.g., Sticker and Stone"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Remarks
                </label>
                <textarea
                  name="admin_remarks"
                  value={createStepForm.admin_remarks}
                  onChange={handleCreateStepFormChange}
                  rows="3"
                  placeholder="e.g., Insert the clock movement (mechanism) into the hole you drilled..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructions
                </label>
                <textarea
                  name="instructions"
                  value={createStepForm.instructions}
                  onChange={handleCreateStepFormChange}
                  rows="4"
                  placeholder="e.g., Use a Dremel tool or carving set to add custom designs..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reference Images
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) =>
                    setReferenceImages(Array.from(e.target.files))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateStepForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-500 text-white rounded-lg hover:from-orange-600 hover:to-orange-600 transition-colors disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create Step"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Assign Steps to Artisan Modal */}
      {showAssignForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Assign Steps to Artisan
              </h2>
              <button
                onClick={() => setShowAssignForm(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleAssignFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Artisan
                </label>
                <select
                  name="artisanId"
                  value={assignForm.artisanId}
                  onChange={handleAssignFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose an artisan...</option>
                  <option value="artisan1">
                    Ram Kumar (Bamboo Specialist)
                  </option>
                  <option value="artisan2">Sita Devi (Wood Carver)</option>
                  <option value="artisan3">
                    Arjun Singh (Painting Expert)
                  </option>
                  <option value="artisan4">
                    Maya Sharma (Finishing Specialist)
                  </option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Steps to Assign
                </label>
                {buildSteps.length === 0 ? (
                  <p className="text-gray-500 text-sm bg-gray-50 p-3 rounded-lg">
                    No build steps available.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                    {buildSteps.map((step) => (
                      <label
                        key={step.id}
                        className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          name="stepIds"
                          value={step.id}
                          checked={assignForm.stepIds.includes(
                            step.id.toString()
                          )}
                          onChange={handleAssignFormChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-medium">
                              Step {step.sequence}
                            </span>
                            <span className="font-medium text-gray-900">
                              {step.stepName}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mt-1">
                            {step.description}
                          </p>
                          <span className="text-orange-600 font-semibold text-sm">
                            ₹{step.proposed_price || step.proposedPrice}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deadline
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={assignForm.deadline}
                  onChange={handleAssignFormChange}
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority Level
                </label>
                <select
                  name="priority"
                  value={assignForm.priority}
                  onChange={handleAssignFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes
                </label>
                <textarea
                  name="notes"
                  value={assignForm.notes}
                  onChange={handleAssignFormChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any special instructions for the artisan..."
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAssignForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || assignForm.stepIds.length === 0}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-500 text-white rounded-lg hover:from-orange-600 hover:to-orange-600 transition-colors disabled:opacity-50"
                >
                  {loading ? "Assigning..." : "Assign Steps"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>



  );


  {/* Reject Reason Modal */}
{showRejectModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Reject Product</h2>
        <button
          onClick={() => setShowRejectModal(false)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Reason for rejection <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={4}
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="e.g. Product is not well finished"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setShowRejectModal(false)}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          disabled={!rejectReason.trim()}
          onClick={async () => {
            try {
              await productControllers.updateProductStatus(
                product.productId,
                "REJECTED",
                rejectReason.trim()   // <-- sends adminRemarks
              );
              alert("Product Rejected");
              setShowRejectModal(false);
              window.location.reload();   // refresh to show new status + reason
            } catch (err) {
              alert("Failed to reject");
            }
          }}
          className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50"
        >
          Confirm Reject
        </button>
      </div>
    </div>
  </div>
)}
};
export default ProductDetails;
