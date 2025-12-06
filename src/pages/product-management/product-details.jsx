import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";

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
  Eye,
  FileText,
  Clock,
  Brush,
  Layers,
  Droplets,
  Pencil,
  Tag,
  MapPin,
  Warehouse,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { productControllers } from "../../api/product";
import { userControllers } from "../../api/user";
import { warehouseControllers } from "../../api/warehouse";
import { countries } from "../../constants/countries";
import BuildStepDetailsModal from "../../components/BuildStepDetailsModal";
import EditBuildStepModal from "../../components/EditBuildStepModal";

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
  const [productPage, setProductPage] = useState(1);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [productLoading, setProductLoading] = useState(false);
  const [referenceImages, setReferenceImages] = useState([]);
  const [assignForm, setAssignForm] = useState({
    productId: "",
    buildStepId: "",
    artisanId: "",
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
  const [artisans, setArtisans] = useState([]);
  const [showStepDetails, setShowStepDetails] = useState(false);
  const [selectedStepId, setSelectedStepId] = useState(null);
  const [editStepId, setEditStepId] = useState(null);

  useEffect(() => {
    userControllers.getUserListGroup("ARTISAN").then((res) => {
      let data = res.data.data.docs.map((a) => ({
        id: a.id,
        name: `${a.firstName} ${a.lastName}`,
      }));
      setArtisans(data);
    });
  }, []);
  console.log("buildstep", buildSteps);
  console.log("stepid", selectedStepId);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // Approval Modal State
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approveCountry, setApproveCountry] = useState("");
  const [approveWarehouseId, setApproveWarehouseId] = useState("");
  const [warehouses, setWarehouses] = useState([]);
  const [isWarehouseLoading, setIsWarehouseLoading] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

  const filteredCountries = countries.filter((c) =>
    c.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const handleCountryChange = async (selectedCountry) => {
    setApproveCountry(selectedCountry);
    setApproveWarehouseId("");
    setWarehouses([]);

    if (selectedCountry) {
      setIsWarehouseLoading(true);
      try {
        const res = await warehouseControllers.getWarehousesByCountry(selectedCountry);
        setWarehouses(res.data?.data?.docs || res.data?.data || []);
      } catch (error) {
        console.error("Error fetching warehouses:", error);
        toast.error("Failed to fetch warehouses");
      } finally {
        setIsWarehouseLoading(false);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".relative-country-dropdown")) {
        setIsCountryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
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
            toast.error(
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

  const fetchProducts = async (page = 1) => {
    try {
      setProductLoading(true);
      const res = await productControllers.getAllProducts(page, 100);

      const newProducts = res.data?.data?.docs || [];

      setProducts((prev) => [...prev, ...newProducts]);
      setHasMoreProducts(newProducts.length > 0);
    } catch (err) {
      toast.error(
        "Error fetching products:",
        err.response?.data || err.message
      );
    } finally {
      setProductLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts(productPage);
  }, [productPage]);
  const fetchBuildSteps = async () => {
    try {
      const res = await productControllers.getBuildSteps(id);
      console.log("Build steps API response:", res.data);
      setBuildSteps(res.data?.data || res.data || []);
    } catch (err) {
      toast.error(
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

  const [artisanID, setArtisanID] = useState("");

  const handleAssignFormChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "artisanId") {
      console.log("Selected artisanId:", value);
      setArtisanID(value);
    }

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

  const handleAssignFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        productId: product.productId,
        buildStepId: Number(assignForm.buildStepId),
        artisanId: artisanID,
      };
      console.log("assign product", payload);
      await productControllers.assignStepToArtisan(payload);
      toast.info(" Step Assigned Successfully!");
      setShowAssignForm(false);
      fetchBuildSteps();
    } catch (err) {
      toast.info(" Failed to assign step");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStepFormChange = (e) => {
    const { name, value } = e.target;
    setCreateStepForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateStepFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
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

      const res = await productControllers.createBuildStep(formData);
      console.log("Create build step API response:", res.data);
      const newStep = res.data?.data || res.data;
      toast.info("Build step created successfully!");
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
      setShowCreateStepForm(false);
      await fetchBuildSteps();
    } catch (err) {
      console.error(
        "Error creating build step:",
        err.response?.data || err.message
      );
      toast.error("Error creating build step. Please try again.");
    } finally {
      setLoading(false);
    }
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
                              className={`w-2 h-2 rounded-full transition-all ${selectedImageIndex === index
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
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${selectedImageIndex === index
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

                {/* Action Buttons */}
                {product.admin_approval_status === "APPROVED" && (
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        if (buildSteps.length >= 10) {
                          toast.error(
                            "You can create only up to 10 build steps!"
                          );
                          return;
                        }
                        setCreateStepForm((prev) => ({
                          ...prev,
                          productId: product.productId,
                        }));
                        setShowCreateStepForm(true);
                      }}
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
                      Assigned Step To Artisan
                    </button>
                  </div>
                )}
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
                                <button
                                  onClick={() => setEditStepId(step.id)}
                                  className="p-2 rounded-full hover:bg-gray-100"
                                >
                                  <Pencil className="w-5 h-5 text-blue-600" />
                                </button>

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
                                {/* Assigned Artisan Name */}
                                {step.artisan && (
                                  <div className="md:col-span-2">
                                    <h4 className="font-semibold text-gray-700 mb-2">
                                      Assigned Artisan
                                    </h4>
                                    <p className="text-orange-600 font-semibold text-sm bg-orange-50 p-3 rounded-sm">
                                      {step.artisan.firstName ||
                                        step.artisan.lastName
                                        ? `${step.artisan.firstName ?? ""} ${step.artisan.lastName ?? ""
                                        }`
                                        : "No Artisan Assigned"}
                                    </p>
                                  </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                  <div className="  md:col-span-2 ">
                                    <h4 className="font-semibold text-gray-700 mb-2">
                                      Build Steps Details
                                    </h4>
                                    <Eye
                                      className="w-5 h-5 text-gray-600 cursor-pointer hover:text-orange-600"
                                      onClick={() => {
                                        setSelectedStepId(step.id);
                                        setShowStepDetails(true);
                                      }}
                                    />
                                  </div>
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
                                      Due Date
                                    </h4>
                                    <p className="text-gray-600 text-sm">
                                      {/* {moment(step.dueDate).format("DD/MM/YYYY hh:mm A")} */}
                                      {moment(
                                        step.dueDate,
                                        "YYYY-MM-DDTHH:mm"
                                      ).format("DD/MM/YYYY hh:mm A")}
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
              <button
                onClick={() => navigate(-1)}
                className="mb-6 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold shadow-md transition-all duration-300 flex items-center gap-2 w-fit"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
              <div className="space-y-6">
                {/* Product Title */}
                {/* <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                    {product?.  product_name || "Unnamed Product"}
                  </h1>
                </div> */}
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                    {product?.product_name || "Unnamed Product"}
                  </h1>

                  {product.admin_approval_status !== "APPROVED" && (
                    <button
                      onClick={() =>
                        navigate(`/edit-product/${product.productId}`)
                      }
                      className="p-2 rounded-full hover:bg-gray-200 transition"
                      title="Edit Product"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-orange-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536M9 11l6-6 3.536 3.536-6 6H9v-3.536z"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Price Section */}
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-2xl border border-orange-200">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-4xl font-bold text-orange-600">
                      ₹
                      {parseInt(product.productPricePerPiece) *
                        product.quantity}
                    </span>
                    {product?.discount > 0 && (
                      <span className="text-xl text-gray-500 line-through"></span>
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
                    className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${parseInt(product?.quantity || 0) < 10
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                      }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${parseInt(product?.quantity || 0) < 10
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
                {/* Admin Actions */}
                <div className="py-4 border-b border-gray-200 mb-4">
                  {showRejectModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl transform transition-all">
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-xl font-bold text-gray-900">
                            Reject Product
                          </h2>
                          <button
                            onClick={() => setShowRejectModal(false)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <X className="w-5 h-5 text-gray-500" />
                          </button>
                        </div>

                        <textarea
                          rows={4}
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="Enter rejection reason..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                        />

                        <div className="flex gap-3 mt-6">
                          <button
                            onClick={() => setShowRejectModal(false)}
                            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                          >
                            Cancel
                          </button>

                          <button
                            disabled={!rejectReason.trim()}
                            onClick={async () => {
                              try {
                                await productControllers.updateProductStatus(
                                  product.productId,
                                  "DISAPPROVED",
                                  rejectReason.trim()
                                );

                                toast.success("Product Rejected Successfully");

                                const updated =
                                  await productControllers.getProductById(id);
                                setProduct(updated.data?.data || updated.data);

                                setShowRejectModal(false);
                                setRejectReason("");
                              } catch (err) {
                                toast.error(err.response?.data?.message || "Failed to Reject Product");
                                console.log(err);
                              }
                            }}
                            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium disabled:opacity-50 transition-colors shadow-lg shadow-red-200"
                          >
                            Confirm Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {showApproveModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl transform transition-all">
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-xl font-bold text-gray-900">
                            Approve Product
                          </h2>
                          <button
                            onClick={() => setShowApproveModal(false)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <X className="w-5 h-5 text-gray-500" />
                          </button>
                        </div>

                        <div className="space-y-4">
                          {/* Country Selection */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Origin Country *
                            </label>
                            <div className="relative relative-country-dropdown">
                              <input
                                type="text"
                                placeholder="Select Country"
                                value={countrySearch}
                                onChange={(e) => {
                                  setCountrySearch(e.target.value);
                                  setIsCountryDropdownOpen(true);
                                  if (e.target.value === "") {
                                    handleCountryChange("");
                                  }
                                }}
                                onClick={() => {
                                  setIsCountryDropdownOpen(true);
                                  if (approveCountry && countrySearch !== approveCountry) {
                                    setCountrySearch(approveCountry);
                                  }
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              />
                              {isCountryDropdownOpen && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                  {filteredCountries.length > 0 ? (
                                    filteredCountries.map((c) => (
                                      <div
                                        key={c}
                                        className="px-4 py-2 hover:bg-orange-50 cursor-pointer text-sm text-gray-700"
                                        onClick={() => {
                                          handleCountryChange(c);
                                          setCountrySearch(c);
                                          setIsCountryDropdownOpen(false);
                                        }}
                                      >
                                        {c}
                                      </div>
                                    ))
                                  ) : (
                                    <div className="px-4 py-2 text-gray-500 text-sm">No countries found</div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Warehouse Selection */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Warehouse *
                            </label>
                            <select
                              value={approveWarehouseId}
                              onChange={(e) => setApproveWarehouseId(e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              disabled={!approveCountry || isWarehouseLoading}
                            >
                              <option value="" disabled>Select Warehouse</option>
                              {warehouses.map((w) => (
                                <option key={w._id || w.id} value={w._id || w.id}>
                                  {w.warehouse_name || w.name}
                                </option>
                              ))}
                            </select>
                            {isWarehouseLoading && <p className="text-xs text-gray-500 mt-1">Loading warehouses...</p>}
                          </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                          <button
                            onClick={() => setShowApproveModal(false)}
                            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                          >
                            Cancel
                          </button>

                          <button
                            disabled={!approveCountry || !approveWarehouseId}
                            onClick={async () => {
                              try {
                                await productControllers.updateProductStatus(
                                  product.productId,
                                  "APPROVED",
                                  "",
                                  {
                                    country: approveCountry,
                                    warehouseId: approveWarehouseId
                                  }
                                );

                                toast.success("Product Approved Successfully");

                                const updated = await productControllers.getProductById(id);
                                setProduct(updated.data?.data || updated.data);

                                setShowApproveModal(false);
                                setApproveCountry("");
                                setApproveWarehouseId("");
                                setCountrySearch("");
                              } catch (err) {
                                toast.error(err.response?.data?.message || "Failed to Approve Product");
                                console.log(err);
                              }
                            }}
                            className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-green-200"
                          >
                            Confirm Approve
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">Status:</span>
                    <div className="flex items-center gap-3">
                      {product.admin_approval_status === "PENDING" && (
                        <>
                          <button
                            onClick={() => setShowApproveModal(true)}
                            className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-green-200"
                          >
                            Approve
                          </button>

                          <button
                            onClick={() => setShowRejectModal(true)}
                            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-red-200"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {product.admin_approval_status === "APPROVED" && (
                        <span className="bg-green-100 text-green-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2">
                          <Award className="w-4 h-4" /> Approved
                        </span>
                      )}

                      {product.admin_approval_status === "DISAPPROVED" && (
                        <div className="text-right">
                          <span className="bg-red-100 text-red-700 px-4 py-2 rounded-xl font-bold inline-flex items-center gap-2">
                            <X className="w-4 h-4" /> Rejected
                          </span>
                          {(product.adminRemarks || product.admin_remarks) && (
                            <p className="text-xs text-red-600 mt-1 max-w-[200px]">
                              Reason: {product.adminRemarks || product.admin_remarks}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Product Details Grid */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-orange-500" />
                    Product Specifications
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product?.artisan && (
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl hover:shadow-md transition-shadow">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Award className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                            Artisan
                          </p>
                          <p className="text-gray-900 font-semibold">
                            {product.artisan?.name || product.artisan}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Country */}
                    {product?.country && (
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl hover:shadow-md transition-shadow">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <MapPin className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                            Origin Country
                          </p>
                          <p className="text-gray-900 font-semibold">
                            {product.country}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Warehouse */}
                    {(product?.warehouse || product?.warehouseId) && (
                      <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl hover:shadow-md transition-shadow">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <Warehouse className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                            Warehouse
                          </p>
                          <p className="text-gray-900 font-semibold">
                            {product.warehouse?.warehouse_name || product.warehouse?.name || "N/A"}
                          </p>
                        </div>
                      </div>
                    )}


                    {/* Category */}
                    {product?.category && (
                      <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl hover:shadow-md transition-shadow">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Layers className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                            Category
                          </p>
                          <p className="text-gray-900 font-semibold">
                            {product.category.category_name}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Subcategory */}
                    {product?.subCategory && (
                      <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl hover:shadow-md transition-shadow">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                          <Tag className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                            Subcategory
                          </p>
                          <p className="text-gray-900 font-semibold">
                            {product.subCategory.category_name}
                          </p>
                        </div>
                      </div>
                    )}

                    {product?.material && (
                      <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl hover:shadow-md transition-shadow">
                        <div className="p-2 bg-amber-100 rounded-lg">
                          <Package className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                            Material
                          </p>
                          <p className="text-gray-900 font-semibold">
                            {product.material}
                          </p>
                        </div>
                      </div>
                    )}

                    {product?.color && (
                      <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl hover:shadow-md transition-shadow">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Palette className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                            Color
                          </p>
                          <p className="text-gray-900 font-semibold">
                            {product.color}
                          </p>
                        </div>
                      </div>
                    )}

                    {product?.size?.length > 0 && (
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl hover:shadow-md transition-shadow">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Ruler className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                            Size
                          </p>
                          <p className="text-gray-900 font-semibold">
                            {Array.isArray(product.size)
                              ? product.size.join(", ")
                              : product.size}
                          </p>
                        </div>
                      </div>
                    )}

                    {product?.netWeight && (
                      <div className="flex items-center gap-3 p-3 bg-rose-50 rounded-xl hover:shadow-md transition-shadow">
                        <div className="p-2 bg-rose-100 rounded-lg">
                          <Package className="w-5 h-5 text-rose-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                            Net Weight
                          </p>
                          <p className="text-gray-900 font-semibold">
                            {product.netWeight}
                          </p>
                        </div>
                      </div>
                    )}

                    {product?.dimension && (
                      <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl hover:shadow-md transition-shadow">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                          <Ruler className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                            Dimensions
                          </p>
                          <p className="text-gray-900 font-semibold">
                            {product.dimension}
                          </p>
                        </div>
                      </div>
                    )}

                    {product?.timeToMake && (
                      <div className="flex items-center gap-3 p-3 bg-cyan-50 rounded-xl hover:shadow-md transition-shadow">
                        <div className="p-2 bg-cyan-100 rounded-lg">
                          <Clock className="w-5 h-5 text-cyan-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                            Time to Make
                          </p>
                          <p className="text-gray-900 font-semibold">
                            {product.timeToMake} Days
                          </p>
                        </div>
                      </div>
                    )}

                    {product?.texture && (
                      <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-xl hover:shadow-md transition-shadow">
                        <div className="p-2 bg-teal-100 rounded-lg">
                          <Layers className="w-5 h-5 text-teal-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                            Texture/Finish
                          </p>
                          <p className="text-gray-900 font-semibold">
                            {product.texture}
                          </p>
                        </div>
                      </div>
                    )}

                    {product?.artUsed && (
                      <div className="flex items-center gap-3 p-3 bg-fuchsia-50 rounded-xl hover:shadow-md transition-shadow">
                        <div className="p-2 bg-fuchsia-100 rounded-lg">
                          <Brush className="w-5 h-5 text-fuchsia-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                            Art Used
                          </p>
                          <p className="text-gray-900 font-semibold">
                            {product.artUsed}
                          </p>
                        </div>
                      </div>
                    )}

                    {product?.washCare && (
                      <div className="flex items-center gap-3 p-3 bg-sky-50 rounded-xl hover:shadow-md transition-shadow">
                        <div className="p-2 bg-sky-100 rounded-lg">
                          <Droplets className="w-5 h-5 text-sky-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                            Wash Care
                          </p>
                          <p className="text-gray-900 font-semibold">
                            {product.washCare}
                          </p>
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

              </div>
            </div>
          </div>
        </div>
      </div >
      {/* Create Build Step Modal */}
      {
        showCreateStepForm && (
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Product
                    </label>

                    <div
                      onScroll={(e) => {
                        const bottom =
                          e.target.scrollHeight - e.target.scrollTop ===
                          e.target.clientHeight;
                        if (bottom && hasMoreProducts && !productLoading) {
                          setProductPage((prev) => prev + 1);
                        }
                      }}
                      className="w-full max-h-48 overflow-auto border border-gray-300 rounded-lg"
                    >
                      <select
                        name="productId"
                        value={createStepForm.productId}
                        onChange={handleCreateStepFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        required
                      >
                        <option value={product.productId}>
                          {product.product_name}
                        </option>
                      </select>
                    </div>
                  </div>
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
                    type="datetime-local"
                    name="dueDate"
                    value={createStepForm.dueDate}
                    onChange={handleCreateStepFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
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
        )
      }
      {/* Assign Steps to Artisan Modal */}
      {
        showAssignForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Create Assigned Step
                </h2>
                <button
                  onClick={() => setShowAssignForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleAssignFormSubmit}>
                {/* Product Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Product
                  </label>
                  <select
                    name="productId"
                    value={assignForm.productId}
                    onChange={handleAssignFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value={product.productId}>
                      {product.product_name}
                    </option>
                  </select>
                </div>
                {/* Build Step Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Build Step
                  </label>
                  <select
                    name="buildStepId"
                    value={assignForm.buildStepId}
                    onChange={handleAssignFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="">Choose step...</option>
                    {buildSteps.map((step) => (
                      <option key={step.id} value={step.id}>
                        Step {step.sequence} - {step.stepName}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Artisan Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Artisan
                  </label>

                  <select
                    name="artisanId"
                    value={assignForm.artisanId}
                    onChange={handleAssignFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Choose artisan...</option>
                    {artisans.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Submit */}
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
                    className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  >
                    Assign
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
      }
      {
        showStepDetails && (
          <BuildStepDetailsModal
            stepId={selectedStepId}
            onClose={() => setShowStepDetails(false)}
          />
        )
      }
      {
        editStepId && (
          <EditBuildStepModal
            stepId={editStepId}
            onClose={() => setEditStepId(null)}
          />
        )
      }
    </div >
  );
};
export default ProductDetails;
