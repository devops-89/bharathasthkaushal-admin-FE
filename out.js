import { ArrowLeft, CheckCircle, ChevronDown, UploadCloud, X } from "lucide-react";
import imageCompression from "browser-image-compression";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { productControllers } from "../../api/product";
import { categoryControllers } from "../../api/category";
import { warehouseControllers } from "../../api/warehouse";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { countries } from "../../constants/countries";
const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    product_name: "",
    categoryId: "",
    subCategoryId: "",
    productPricePerPiece: "",
    quantity: "",
    material: "",
    weightValue: "",
    weightUnit: "gm",
    length: "",
    breadth: "",
    height: "",
    dimensionUnit: "cm",
    description: "",
    timeToMake: "",
    texture: "",
    finish: "",
    washCare: "",
    artUsed: "",
    pattern: "",
    country: "",
    warehouseId: "",
    isReadyForAuction: false
  });
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const fetchCategories = async () => {
    try {
      const res = await categoryControllers.getCategory();
      setCategories(res.data?.data?.docs || []);
    } catch (error) {
    }
  };
  const handleCategoryChange = async (e) => {
    const selectedCategoryId = e.target.value;
    setFormData((prev) => ({ ...prev, categoryId: selectedCategoryId }));
    try {
      const res = await categoryControllers.getSubCategory(selectedCategoryId);
      const filteredSubs = (res.data?.data?.docs || []).filter(
        (item) => item.type === "Sub-Category"
      );
      setSubCategories(filteredSubs);
    } catch (error) {
    }
  };
  const handleCountryChange = async (e) => {
    const selectedCountry = e.target.value;
    setFormData((prev) => ({
      ...prev,
      country: selectedCountry,
      warehouseId: ""
    }));
    setWarehouses([]);
    if (selectedCountry) {
      try {
        const res = await warehouseControllers.getWarehousesByCountry(selectedCountry);
        setWarehouses(res.data?.data?.docs || res.data?.data || []);
      } catch (error) {
        toast.dismiss();
        toast.error("Failed to fetch warehouses");
      }
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const filteredCountries = countries.filter(
    (c) => c.toLowerCase().includes(countrySearch.toLowerCase())
  );
  const [showFinishOther, setShowFinishOther] = useState(false);
  const [showWashCareOther, setShowWashCareOther] = useState(false);
  const preventNegative = (e) => {
    if (["-", "e", "+"].includes(e.key)) {
      e.preventDefault();
    }
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".relative")) {
        setIsCountryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const validateForm = () => {
    const newErrors = {};
    const nameRegex = /^[a-zA-Z0-9\s\-&]{3,100}$/;
    const materialRegex = /^[a-zA-Z\s&\-]{2,50}$/;
    const artRegex = /^[a-zA-Z\s\-]{2,50}$/;
    const patternRegex = /^[a-zA-Z\s\-]{2,50}$/;
    if (!formData.product_name.trim()) {
      newErrors.product_name = "Product Name is required";
    } else if (!nameRegex.test(formData.product_name)) {
      newErrors.product_name = "Invalid Product Name (3-100 characters, alphanumeric, space, -, & only)";
    }
    if (!formData.categoryId) newErrors.categoryId = "Category is required";
    if (!formData.subCategoryId) newErrors.subCategoryId = "Sub Category is required";
    if (!formData.productPricePerPiece) {
      newErrors.productPricePerPiece = "Price is required";
    } else if (Number(formData.productPricePerPiece) <= 0) {
      newErrors.productPricePerPiece = "Price must be greater than 0";
    }
    if (!formData.quantity) {
      newErrors.quantity = "Quantity is required";
    } else if (Number(formData.quantity) <= 0) {
      newErrors.quantity = "Quantity must be greater than 0";
    }
    if (!formData.material.trim()) {
      newErrors.material = "Material is required";
    } else if (!materialRegex.test(formData.material)) {
      newErrors.material = "Invalid Material (2-50 characters, letters, space, &, - only)";
    }
    if (formData.artUsed && !artRegex.test(formData.artUsed)) {
      newErrors.artUsed = "Invalid Art (2-50 characters, letters, space, - only)";
    }
    if (formData.pattern && !patternRegex.test(formData.pattern)) {
      newErrors.pattern = "Invalid Pattern (2-50 characters, letters, space, - only)";
    }
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.warehouseId) newErrors.warehouseId = "Warehouse is required";
    if (images.length < 4) {
      newErrors.images = "At least 4 product images are required";
    } else if (images.length > 10) {
      newErrors.images = "A maximum of 10 product images are allowed";
    }
    if (formData.weightValue && Number(formData.weightValue) <= 0)
      newErrors.weightValue = "Weight must be greater than 0";
    if (formData.length && Number(formData.length) <= 0)
      newErrors.length = "Length must be greater than 0";
    if (formData.breadth && Number(formData.breadth) <= 0)
      newErrors.breadth = "Breadth must be greater than 0";
    if (formData.height && Number(formData.height) <= 0)
      newErrors.height = "Height must be greater than 0";
    if (!formData.timeToMake || formData.timeToMake.toString().trim() === "") {
      newErrors.timeToMake = "Time to Make is required";
    } else if (Number(formData.timeToMake) <= 0) {
      newErrors.timeToMake = "Time to make must be greater than 0";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };
  const handleFileChange = async (e) => {
    if (e.preventDefault) e.preventDefault();
    const files = e.dataTransfer ? Array.from(e.dataTransfer.files) : Array.from(e.target.files);
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const invalidFiles = files.filter(
      (file) => !validTypes.includes(file.type)
    );
    if (invalidFiles.length > 0) {
      const errorMessage = "Only JPEG, JPG, PNG, and WEBP formats are allowed";
      toast.dismiss();
      toast.error(errorMessage);
      setErrors((prev) => ({ ...prev, images: errorMessage }));
      if (e.target.value) e.target.value = null;
      return;
    }
    if (images.length + files.length > 10) {
      const errorMessage = "You can only upload a maximum of 10 images";
      toast.dismiss();
      toast.error(errorMessage);
      setErrors((prev) => ({ ...prev, images: errorMessage }));
      if (e.target.value) e.target.value = null;
      return;
    }
    try {
      const compressedFiles = [];
      for (const file of files) {
        const options = {
          maxSizeMB: 0.5,
          useWebWorker: false,
          // Disabling web worker to prevent silent hangs in some environments
          fileType: file.type
          // Keep original file format
        };
        try {
          const originalSizeKB = (file.size / 1024).toFixed(2);
          const compressedBlob = await imageCompression(file, options);
          const compressedSizeKB = (compressedBlob.size / 1024).toFixed(2);
          const compressedFile = new File([compressedBlob], file.name, {
            type: file.type,
            lastModified: Date.now()
          });
          compressedFiles.push(compressedFile);
        } catch (error) {
          compressedFiles.push(file);
        }
      }
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.images;
        return newErrors;
      });
      setImages((prevImages) => [...prevImages, ...compressedFiles]);
    } catch (error) {
      setImages((prevImages) => [...prevImages, ...files]);
    }
    if (e.target.value) e.target.value = null;
  };
  const removeImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e);
  };
  const handleSubmit = async () => {
    if (loading) return;
    toast.dismiss();
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      const data = new FormData();
      const dimension = `${formData.length}x${formData.breadth}x${formData.height} ${formData.dimensionUnit}`;
      const netWeight = `${formData.weightValue} ${formData.weightUnit}`;
      data.append("product_name", formData.product_name);
      data.append("categoryId", formData.categoryId);
      data.append("subCategoryId", formData.subCategoryId);
      data.append("productPricePerPiece", formData.productPricePerPiece);
      data.append("quantity", formData.quantity);
      data.append("material", formData.material);
      data.append("description", formData.description);
      data.append("timeToMake", formData.timeToMake);
      data.append("texture", formData.finish);
      data.append("finish", formData.finish);
      data.append("washCare", formData.washCare);
      data.append("artUsed", formData.artUsed);
      data.append("patternUsed", formData.pattern);
      data.append("pattern", formData.pattern);
      data.append("dimension", dimension);
      data.append("netWeight", netWeight);
      data.append("country", formData.country);
      data.append("warehouseId", formData.warehouseId);
      data.append("isReadyForAuction", formData.isReadyForAuction ? "true" : "");
      if (images.length > 0) {
        images.forEach((file) => {
          data.append("images", file);
        });
      }
      const res = await productControllers.addProduct(data);
      if (res && res.data) {
        toast.dismiss();
        toast.success("Product added successfully!", {
          icon: /* @__PURE__ */ React.createElement(CheckCircle, { className: "text-orange-600" }),
          progressStyle: { background: "#ea580c" }
        });
        setTimeout(() => {
          navigate("/product-management", { state: { refresh: true } });
        }, 1500);
      } else {
        throw new Error("No response received");
      }
    } catch (err) {
      toast.dismiss();
      toast.error(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };
  const handleGoBack = () => {
    navigate(-1);
  };
  const totalPrice = (parseFloat(formData.productPricePerPiece) || 0) * (parseFloat(formData.quantity) || 0);
  return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6 ml-64 pt-24 flex-1" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-4xl mx-auto" }, /* @__PURE__ */ React.createElement("div", { className: "mb-6 px-4 md:px-0" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: handleGoBack,
      className: "flex items-center text-gray-600 hover:text-orange-600 transition-colors font-medium"
    },
    /* @__PURE__ */ React.createElement(ArrowLeft, { className: "w-5 h-5 mr-2" }),
    "Back to Product List"
  )), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-2xl p-6 mb-6 shadow-lg" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h1", { className: "text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent" }, "Add New Product")))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-2xl p-8 shadow-lg" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-gray-700 font-medium mb-2" }, "Product Name ", /* @__PURE__ */ React.createElement("span", { className: "text-red-500" }, "*")), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      name: "product_name",
      value: formData.product_name,
      onChange: handleInputChange,
      className: `w-full bg-white px-4 py-3 border rounded-lg focus:outline-none focus:border-orange-500 ${errors.product_name ? "border-red-500" : "border-gray-300"}`,
      placeholder: "Enter product name"
    }
  ), errors.product_name && /* @__PURE__ */ React.createElement("p", { className: "text-red-400 text-sm mt-1" }, errors.product_name)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-gray-700 font-medium mb-2" }, "Origin Country ", /* @__PURE__ */ React.createElement("span", { className: "text-red-500" }, "*")), /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      placeholder: "Select Country",
      value: countrySearch,
      onChange: (e) => {
        setCountrySearch(e.target.value);
        setIsCountryDropdownOpen(true);
        if (e.target.value === "") {
          handleCountryChange({ target: { value: "" } });
        }
      },
      onClick: () => {
        setIsCountryDropdownOpen(true);
        if (formData.country && countrySearch !== formData.country) {
          setCountrySearch(formData.country);
        }
      },
      className: `w-full bg-white px-4 py-3 border rounded-lg focus:outline-none focus:border-orange-500 ${errors.country ? "border-red-500" : "border-gray-300"}`
    }
  ), isCountryDropdownOpen && /* @__PURE__ */ React.createElement("div", { className: "absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto" }, filteredCountries.length > 0 ? filteredCountries.map((c) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: c,
      className: "px-4 py-2 hover:bg-orange-50 cursor-pointer text-sm text-gray-700",
      onClick: () => {
        handleCountryChange({ target: { value: c } });
        setCountrySearch(c);
        setIsCountryDropdownOpen(false);
      }
    },
    c
  )) : /* @__PURE__ */ React.createElement("div", { className: "px-4 py-2 text-gray-500 text-sm" }, "No countries found"))), errors.country && /* @__PURE__ */ React.createElement("p", { className: "text-red-400 text-sm mt-1" }, errors.country)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-gray-700 font-medium mb-2" }, "Warehouse ", /* @__PURE__ */ React.createElement("span", { className: "text-red-500" }, "*")), /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(
    "select",
    {
      name: "warehouseId",
      value: formData.warehouseId,
      onChange: handleInputChange,
      className: `w-full bg-white px-4 py-3 border rounded-lg focus:outline-none focus:border-orange-500 appearance-none bg-white ${errors.warehouseId ? "border-red-500" : "border-gray-300"}`,
      disabled: !formData.country
    },
    /* @__PURE__ */ React.createElement("option", { value: "", disabled: true }, "Select Warehouse"),
    warehouses.map((w) => /* @__PURE__ */ React.createElement("option", { key: w._id || w.id, value: w._id || w.id }, w.warehouse_name || w.name))
  ), /* @__PURE__ */ React.createElement(ChevronDown, { className: "absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" })), errors.warehouseId && /* @__PURE__ */ React.createElement("p", { className: "text-red-400 text-sm mt-1" }, errors.warehouseId)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-gray-700 font-medium mb-2" }, "Category ", /* @__PURE__ */ React.createElement("span", { className: "text-red-500" }, "*")), /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(
    "select",
    {
      name: "categoryId",
      value: formData.categoryId,
      onChange: handleCategoryChange,
      className: `w-full bg-white px-4 py-3 border rounded-lg focus:outline-none focus:border-orange-500 appearance-none bg-white ${errors.categoryId ? "border-red-500" : "border-gray-300"}`
    },
    /* @__PURE__ */ React.createElement("option", { value: "" }, "Select Category"),
    categories.map((cat) => /* @__PURE__ */ React.createElement("option", { key: cat.category_id, value: cat.category_id }, cat.category_name))
  ), /* @__PURE__ */ React.createElement(ChevronDown, { className: "absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" })), errors.categoryId && /* @__PURE__ */ React.createElement("p", { className: "text-red-400 text-sm mt-1" }, errors.categoryId)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-gray-700 font-medium mb-2" }, "Sub Category ", /* @__PURE__ */ React.createElement("span", { className: "text-red-500" }, "*")), /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(
    "select",
    {
      name: "subCategoryId",
      value: formData.subCategoryId,
      onChange: handleInputChange,
      className: `w-full bg-white px-4 py-3 border rounded-lg focus:outline-none focus:border-orange-500 appearance-none bg-white ${errors.subCategoryId ? "border-red-500" : "border-gray-300"}`,
      disabled: !subCategories.length
    },
    /* @__PURE__ */ React.createElement("option", { value: "" }, "Select SubCategory"),
    subCategories.map((sub) => /* @__PURE__ */ React.createElement("option", { key: sub.category_id, value: sub.category_id }, sub.category_name))
  ), /* @__PURE__ */ React.createElement(ChevronDown, { className: "absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" })), errors.subCategoryId && /* @__PURE__ */ React.createElement("p", { className: "text-red-400 text-sm mt-1" }, errors.subCategoryId)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-gray-700 font-medium mb-2" }, "Price Per Piece (\u20B9) ", /* @__PURE__ */ React.createElement("span", { className: "text-red-500" }, "*")), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      name: "productPricePerPiece",
      value: formData.productPricePerPiece,
      onChange: handleInputChange,
      className: `w-full bg-white px-4 py-3 border rounded-lg focus:outline-none focus:border-orange-500 ${errors.productPricePerPiece ? "border-red-500" : "border-gray-300"}`,
      min: "0.01",
      step: "0.01",
      onKeyDown: preventNegative,
      placeholder: "0.00"
    }
  ), errors.productPricePerPiece && /* @__PURE__ */ React.createElement("p", { className: "text-red-400 text-sm mt-1" }, errors.productPricePerPiece)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-gray-700 font-medium mb-2" }, "Quantity ", /* @__PURE__ */ React.createElement("span", { className: "text-red-500" }, "*")), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      name: "quantity",
      value: formData.quantity,
      onChange: handleInputChange,
      className: `w-full bg-white px-4 py-3 border rounded-lg focus:outline-none focus:border-orange-500 ${errors.quantity ? "border-red-500" : "border-gray-300"}`,
      min: "1",
      step: "1",
      onKeyDown: preventNegative,
      placeholder: "0"
    }
  ), errors.quantity && /* @__PURE__ */ React.createElement("p", { className: "text-red-500 text-sm mt-1" }, errors.quantity)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-gray-700 font-medium mb-2" }, "Total Price (\u20B9)"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      value: totalPrice.toFixed(2),
      readOnly: true,
      className: "w-full bg-white px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-gray-700 font-medium mb-2" }, "Time to Make (Days) ", /* @__PURE__ */ React.createElement("span", { className: "text-red-500" }, "*")), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      name: "timeToMake",
      value: formData.timeToMake,
      onChange: handleInputChange,
      min: "1",
      step: "1",
      onKeyDown: preventNegative,
      className: "w-full bg-white px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500",
      placeholder: "Days"
    }
  ), errors.timeToMake && /* @__PURE__ */ React.createElement("p", { className: "text-red-400 text-sm mt-1" }, errors.timeToMake)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-gray-700 font-medium mb-2" }, "Material ", /* @__PURE__ */ React.createElement("span", { className: "text-red-500" }, "*")), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      name: "material",
      value: formData.material,
      onChange: handleInputChange,
      className: `w-full bg-white px-4 py-3 border rounded-lg focus:outline-none focus:border-orange-500 ${errors.material ? "border-red-500" : "border-gray-300"}`,
      placeholder: "Cotton, Silk, etc."
    }
  ), errors.material && /* @__PURE__ */ React.createElement("p", { className: "text-red-400 text-sm mt-1" }, errors.material)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-gray-700 font-medium mb-2" }, "Finish / Texture"), /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(
    "select",
    {
      name: "finish",
      value: showFinishOther ? "Other" : formData.finish,
      onChange: (e) => {
        if (e.target.value === "Other") {
          setShowFinishOther(true);
          setFormData((prev) => ({ ...prev, finish: "" }));
        } else {
          setShowFinishOther(false);
          handleInputChange(e);
        }
      },
      className: "w-full bg-white px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 appearance-none bg-white"
    },
    /* @__PURE__ */ React.createElement("option", { value: "" }, "Select Finish"),
    /* @__PURE__ */ React.createElement("option", { value: "Matte" }, "Matte"),
    /* @__PURE__ */ React.createElement("option", { value: "Glossy" }, "Glossy"),
    /* @__PURE__ */ React.createElement("option", { value: "Handwoven" }, "Handwoven"),
    /* @__PURE__ */ React.createElement("option", { value: "Rough" }, "Rough"),
    /* @__PURE__ */ React.createElement("option", { value: "Smooth" }, "Smooth"),
    /* @__PURE__ */ React.createElement("option", { value: "Other" }, "Other")
  ), /* @__PURE__ */ React.createElement(ChevronDown, { className: "absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" })), showFinishOther && /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      name: "finish",
      value: formData.finish,
      onChange: handleInputChange,
      placeholder: "Enter custom finish",
      className: "mt-2 w-full bg-white px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-gray-700 font-medium mb-2" }, "Wash Care"), /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(
    "select",
    {
      name: "washCare",
      value: showWashCareOther ? "Other" : formData.washCare,
      onChange: (e) => {
        if (e.target.value === "Other") {
          setShowWashCareOther(true);
          setFormData((prev) => ({ ...prev, washCare: "" }));
        } else {
          setShowWashCareOther(false);
          handleInputChange(e);
        }
      },
      className: "w-full bg-white px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 appearance-none bg-white"
    },
    /* @__PURE__ */ React.createElement("option", { value: "" }, "Select Wash Care"),
    /* @__PURE__ */ React.createElement("option", { value: "Dry Clean Only" }, "Dry Clean Only"),
    /* @__PURE__ */ React.createElement("option", { value: "Hand Wash" }, "Hand Wash"),
    /* @__PURE__ */ React.createElement("option", { value: "Machine Wash" }, "Machine Wash"),
    /* @__PURE__ */ React.createElement("option", { value: "Do Not Wash" }, "Do Not Wash"),
    /* @__PURE__ */ React.createElement("option", { value: "Other" }, "Other")
  ), /* @__PURE__ */ React.createElement(ChevronDown, { className: "absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" })), showWashCareOther && /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      name: "washCare",
      value: formData.washCare,
      onChange: handleInputChange,
      placeholder: "Enter custom wash care",
      className: "mt-2 w-full bg-white px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-gray-700 font-medium mb-2" }, "Art Used"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      name: "artUsed",
      value: formData.artUsed,
      onChange: handleInputChange,
      className: `w-full bg-white px-4 py-3 border rounded-lg focus:outline-none focus:border-orange-500 ${errors.artUsed ? "border-red-500" : "border-gray-300"}`,
      placeholder: "Madhubani, Warli, etc."
    }
  ), errors.artUsed && /* @__PURE__ */ React.createElement("p", { className: "text-red-400 text-sm mt-1" }, errors.artUsed)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-gray-700 font-medium mb-2" }, "Pattern Used"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      name: "pattern",
      value: formData.pattern,
      onChange: handleInputChange,
      className: `w-full bg-white px-4 py-3 border rounded-lg focus:outline-none focus:border-orange-500 ${errors.pattern ? "border-red-500" : "border-gray-300"}`,
      placeholder: "Floral, Geometric, Striped, etc."
    }
  ), errors.pattern && /* @__PURE__ */ React.createElement("p", { className: "text-red-400 text-sm mt-1" }, errors.pattern)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-gray-700 font-medium mb-2" }, "Net Weight"), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      name: "weightValue",
      value: formData.weightValue,
      onChange: handleInputChange,
      min: "0.01",
      step: "0.01",
      onKeyDown: preventNegative,
      className: "w-full bg-white px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500",
      placeholder: "Weight"
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(
    "select",
    {
      name: "weightUnit",
      value: formData.weightUnit,
      onChange: handleInputChange,
      className: "pl-2 pr-6 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 appearance-none bg-white"
    },
    /* @__PURE__ */ React.createElement("option", { value: "gm" }, "gm"),
    /* @__PURE__ */ React.createElement("option", { value: "kg" }, "kg")
  ), /* @__PURE__ */ React.createElement(ChevronDown, { className: "absolute right-1 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" })))), /* @__PURE__ */ React.createElement("div", { className: "md:col-span-2" }, /* @__PURE__ */ React.createElement("label", { className: "block text-gray-700 font-medium mb-2" }, "Dimensions"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-4 gap-2" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      name: "length",
      value: formData.length,
      onChange: handleInputChange,
      min: "0.01",
      step: "0.01",
      onKeyDown: preventNegative,
      className: "bg-white px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500",
      placeholder: "Length"
    }
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      name: "breadth",
      value: formData.breadth,
      onChange: handleInputChange,
      min: "0.01",
      step: "0.01",
      onKeyDown: preventNegative,
      className: "bg-white px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500",
      placeholder: "Breadth"
    }
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      name: "height",
      value: formData.height,
      onChange: handleInputChange,
      min: "0.01",
      step: "0.01",
      onKeyDown: preventNegative,
      className: "bg-white px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500",
      placeholder: "Height"
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(
    "select",
    {
      name: "dimensionUnit",
      value: formData.dimensionUnit,
      onChange: handleInputChange,
      className: "w-full appearance-none px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 bg-white"
    },
    /* @__PURE__ */ React.createElement("option", { value: "cm" }, "cm"),
    /* @__PURE__ */ React.createElement("option", { value: "inches" }, "inches")
  ), /* @__PURE__ */ React.createElement(ChevronDown, { className: "absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" })))), /* @__PURE__ */ React.createElement("div", { className: "md:col-span-2" }, /* @__PURE__ */ React.createElement("label", { className: "block text-gray-700 font-medium mb-2" }, "Description ", /* @__PURE__ */ React.createElement("span", { className: "text-red-500" }, "*")), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      name: "description",
      value: formData.description,
      onChange: handleInputChange,
      rows: "4",
      className: `w-full bg-white px-4 py-3 border rounded-lg focus:outline-none focus:border-orange-500 ${errors.description ? "border-red-500" : "border-gray-300"}`,
      placeholder: "Describe your product..."
    }
  ), errors.description && /* @__PURE__ */ React.createElement("p", { className: "text-red-400 text-sm mt-1" }, errors.description)), /* @__PURE__ */ React.createElement("div", { className: "md:col-span-2 flex items-center gap-3 bg-orange-50/50 p-4 rounded-xl border border-orange-100 mt-2" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "checkbox",
      name: "isReadyForAuction",
      id: "isReadyForAuction",
      checked: formData.isReadyForAuction,
      onChange: handleInputChange,
      className: "w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500 cursor-pointer transition-all duration-200"
    }
  ), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(
    "label",
    {
      htmlFor: "isReadyForAuction",
      className: "block text-gray-800 font-semibold cursor-pointer select-none text-base"
    },
    "Ready for Auction"
  ), /* @__PURE__ */ React.createElement("p", { className: "text-gray-500 text-xs mt-0.5" }, "Check this box if you want this product to be available for auction immediately."))), /* @__PURE__ */ React.createElement("div", { className: "md:col-span-2" }, /* @__PURE__ */ React.createElement("label", { className: "block text-gray-700 font-medium mb-2" }, "Product Images ", /* @__PURE__ */ React.createElement("span", { className: "text-red-500" }, "*")), /* @__PURE__ */ React.createElement(
    "div",
    {
      className: `mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-colors cursor-pointer ${isDragging ? "border-orange-500 bg-orange-50" : errors.images ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-orange-400 hover:bg-orange-50/50"}`,
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
      onClick: () => document.getElementById("file-upload").click()
    },
    /* @__PURE__ */ React.createElement("div", { className: "space-y-2 text-center pointer-events-none" }, /* @__PURE__ */ React.createElement(UploadCloud, { className: "mx-auto h-12 w-12 text-gray-400" }), /* @__PURE__ */ React.createElement("div", { className: "flex text-sm text-gray-600 justify-center" }, /* @__PURE__ */ React.createElement("span", { className: "relative font-medium text-orange-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-orange-500 focus-within:ring-offset-2 hover:text-orange-500" }, "Upload files"), /* @__PURE__ */ React.createElement("p", { className: "pl-1" }, "or drag and drop")), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-gray-500" }, "PNG, JPG, JPEG, WEBP up to 10MB")),
    /* @__PURE__ */ React.createElement(
      "input",
      {
        id: "file-upload",
        name: "file-upload",
        type: "file",
        multiple: true,
        accept: "image/jpeg, image/jpg, image/png, image/webp",
        className: "sr-only",
        onChange: handleFileChange
      }
    )
  ), errors.images ? /* @__PURE__ */ React.createElement("p", { className: "text-red-400 text-sm mt-1" }, errors.images) : /* @__PURE__ */ React.createElement("p", { className: "text-gray-500 text-sm mt-1" }, "Select at least 4 images and at most 10 images."), images.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4" }, images.map((file, index) => /* @__PURE__ */ React.createElement("div", { key: index, className: "relative group rounded-lg overflow-hidden border border-gray-200 aspect-square" }, /* @__PURE__ */ React.createElement(
    "img",
    {
      src: URL.createObjectURL(file),
      alt: `preview ${index}`,
      className: "w-full h-full object-cover"
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: (e) => {
        e.stopPropagation();
        removeImage(index);
      },
      className: "p-1.5 bg-white text-red-600 rounded-full hover:bg-red-50 shadow-sm transition-colors"
    },
    /* @__PURE__ */ React.createElement(X, { size: 16 })
  ))))))), /* @__PURE__ */ React.createElement("div", { className: "flex gap-4 mt-8 pt-6 border-t" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: handleGoBack,
      className: "px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors",
      disabled: loading
    },
    "Cancel"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: handleSubmit,
      className: "flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors disabled:opacity-50",
      disabled: loading
    },
    loading ? "Saving..." : "Save Product"
  )))), /* @__PURE__ */ React.createElement(
    ToastContainer,
    {
      position: "top-right",
      autoClose: 3e3,
      style: { zIndex: 99999 }
    }
  ));
};
export default AddProduct;
