// import { ArrowLeft, CheckCircle } from "lucide-react";
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { productControllers } from "../../api/product";
// import { categoryControllers } from "../../api/category";
// import { warehouseControllers } from "../../api/warehouse";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { countries } from "../../constants/countries";

// const AddProduct = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     product_name: "",
//     categoryId: "",
//     subCategoryId: "",
//     productPricePerPiece: "",
//     quantity: "",
//     material: "",
//     weightValue: "",
//     weightUnit: "gm",
//     length: "",
//     breadth: "",
//     height: "",
//     dimensionUnit: "cm",
//     description: "",
//     timeToMake: "",
//     texture: "",
//     finish: "",
//     washCare: "",
//     artUsed: "",
//     pattern: "",
//     country: "",
//     warehouseId: "",
//   });


//   const [categories, setCategories] = useState([]);
//   const [subCategories, setSubCategories] = useState([]);
//   const [warehouses, setWarehouses] = useState([]);

//   const fetchCategories = async () => {
//     try {
//       const res = await categoryControllers.getCategory();
//       console.log("CATEGORY RESPONSE:", res.data.data.docs);
//       setCategories(res.data?.data?.docs || []);
//     } catch (error) {
//       console.log("Category Fetch Error:", error);
//     }
//   };

//   const handleCategoryChange = async (e) => {
//     const selectedCategoryId = e.target.value;
//     setFormData((prev) => ({ ...prev, categoryId: selectedCategoryId }));

//     try {
//       const res = await categoryControllers.getSubCategory(selectedCategoryId);
//       console.log("SUBCATEGORY RESPONSE:", res.data.data.docs);

//       const filteredSubs = (res.data?.data?.docs || []).filter(
//         (item) => item.type === "Sub-Category"
//       );

//       setSubCategories(filteredSubs);
//     } catch (error) {
//       console.log("SubCategory Fetch Error:", error);
//     }
//   };

//   const handleCountryChange = async (e) => {
//     const selectedCountry = e.target.value;
//     setFormData((prev) => ({ ...prev, country: selectedCountry, warehouseId: "" }));
//     setWarehouses([]);

//     if (selectedCountry) {
//       try {
//         const res = await warehouseControllers.getWarehousesByCountry(selectedCountry);
//         console.log("Warehouse Response:", res.data);
//         // Assuming response structure, adjust if needed based on actual API response
//         setWarehouses(res.data?.data?.docs || res.data?.data || []);
//       } catch (error) {
//         console.error("Error fetching warehouses:", error);
//         toast.error("Failed to fetch warehouses");
//       }
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const [images, setImages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});


//   const [countrySearch, setCountrySearch] = useState("");
//   const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

//   const filteredCountries = countries.filter((c) =>
//     c.toLowerCase().includes(countrySearch.toLowerCase())
//   );

//   const [showFinishOther, setShowFinishOther] = useState(false);
//   const [showWashCareOther, setShowWashCareOther] = useState(false);

//   const preventNegative = (e) => {
//     if (["-", "e", "+"].includes(e.key)) {
//       e.preventDefault();
//     }
//   };


//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (!event.target.closest(".relative")) {
//         setIsCountryDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const validateForm = () => {
//     const newErrors = {};
//     const textFields = ["product_name", "material", "description", "artUsed", "pattern", "finish", "washCare"];

//     // Validate text fields - no only-space strings
//     if (!formData.product_name.trim()) newErrors.product_name = "Product Name is required";
//     if (!formData.categoryId) newErrors.categoryId = "Category is required";
//     if (!formData.subCategoryId) newErrors.subCategoryId = "SubCategory is required";

//     // Strict positive number check helpers
//     const isInvalidNumber = (val) => !val || Number(val) <= 0;

//     if (isInvalidNumber(formData.productPricePerPiece)) newErrors.productPricePerPiece = "Price must be greater than 0";
//     if (isInvalidNumber(formData.quantity)) newErrors.quantity = "Quantity must be greater than 0";

//     if (!formData.material.trim()) newErrors.material = "Material is required";
//     if (!formData.description.trim()) newErrors.description = "Description is required";
//     if (!formData.country) newErrors.country = "Country is required";
//     if (!formData.warehouseId) newErrors.warehouseId = "Warehouse is required";
//     if (images.length === 0) newErrors.images = "At least one product image is required";

//     // Optional text fields check - if entered, must not be just spaces
//     if (formData.artUsed && !formData.artUsed.trim()) newErrors.artUsed = "Invalid input (spaces only)";
//     if (formData.pattern && !formData.pattern.trim()) newErrors.pattern = "Invalid input (spaces only)";
//     if (formData.finish && !formData.finish.trim()) newErrors.finish = "Invalid input (spaces only)";
//     if (formData.washCare && !formData.washCare.trim()) newErrors.washCare = "Invalid input (spaces only)";

//     // Optional numeric fields - strictly positive if entered
//     if (formData.weightValue && Number(formData.weightValue) <= 0) newErrors.weightValue = "Weight must be greater than 0";
//     if (formData.length && Number(formData.length) <= 0) newErrors.length = "Length must be greater than 0";
//     if (formData.breadth && Number(formData.breadth) <= 0) newErrors.breadth = "Breadth must be greater than 0";
//     if (formData.height && Number(formData.height) <= 0) newErrors.height = "Height must be greater than 0";
//     if (formData.timeToMake && Number(formData.timeToMake) <= 0) newErrors.timeToMake = "Time to make must be greater than 0";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleBlur = (e) => {
//     const { name, value } = e.target;
//     // Trim string values on blur
//     if (typeof value === "string") {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value.trim(),
//       }));
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files);
//     const validTypes = ["image/jpeg", "image/jpg", "image/png"];
//     const invalidFiles = files.filter((file) => !validTypes.includes(file.type));

//     if (invalidFiles.length > 0) {
//       const errorMessage = "only jpeg ,jpg and png format are allowed";
//       toast.error(errorMessage);
//       setErrors((prev) => ({ ...prev, images: errorMessage }));
//       e.target.value = null; // Reset input
//       setImages([]);
//       return;
//     }

//     setErrors((prev) => {
//       const newErrors = { ...prev };
//       delete newErrors.images;
//       return newErrors;
//     });
//     setImages(files);
//   };

//   const handleSubmit = async () => {
//     // Check validation
//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);
//     try {
//       const data = new FormData();

//       // Construct composite fields only if values exist
//       let dimension = "";
//       if (formData.length && formData.breadth && formData.height) {
//         dimension = `${formData.length}x${formData.breadth}x${formData.height} ${formData.dimensionUnit}`;
//       }

//       let netWeight = "";
//       if (formData.weightValue) {
//         netWeight = `${formData.weightValue} ${formData.weightUnit}`;
//       }

//       // Append fields
//       data.append("product_name", formData.product_name);
//       data.append("categoryId", formData.categoryId);
//       data.append("subCategoryId", formData.subCategoryId);
//       data.append("productPricePerPiece", formData.productPricePerPiece);
//       data.append("quantity", formData.quantity);
//       data.append("material", formData.material);
//       data.append("description", formData.description);
//       data.append("timeToMake", formData.timeToMake);
//       data.append("texture", formData.texture);
//       data.append("finish", formData.finish);
//       data.append("washCare", formData.washCare);
//       data.append("artUsed", formData.artUsed);
//       data.append("pattern", formData.pattern);
//       if (dimension) data.append("dimension", dimension);
//       if (netWeight) data.append("netWeight", netWeight);
//       data.append("country", formData.country);
//       data.append("warehouseId", formData.warehouseId);

//       if (images.length > 0) {
//         images.forEach((file) => {
//           data.append("images", file);
//         });
//       }
//       console.log("Request Payload:");
//       for (let [key, value] of data.entries()) {
//         console.log(`${key}:`, value);
//       }
//       const res = await productControllers.addProduct(data);
//       if (res && res.data) {
//         toast.success("Product added successfully!", {
//           icon: <CheckCircle className="text-orange-600" />,
//           progressStyle: { background: "#ea580c" }
//         });
//         console.log("Product Response:", res.data);
//         // setTimeout(() => {
//         //   navigate("/product-management", { state: { refresh: true } });
//         // }, 2000);
//       } else {
//         throw new Error("No response received");
//       }
//     } catch (err) {
//       console.error("Error adding product:", err.response?.data || err);
//       toast.error(err.response?.data?.message || "Something went wrong!");
//     }
//     finally {
//       setLoading(false);
//     }
//   };
//   const handleGoBack = () => {
//     navigate(-1);
//   };
//   const totalPrice = (parseFloat(formData.productPricePerPiece) || 0) * (parseFloat(formData.quantity) || 0);
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6 ml-64 pt-24 flex-1">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={handleGoBack}
//               className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//             >
//               <ArrowLeft className="w-6 h-6 text-gray-600" />
//             </button>
//             <div>
//               <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
//                 Add New Product
//               </h1>

//             </div>
//           </div>
//         </div>
//         {/* Form */}
//         <div className="bg-white rounded-2xl p-8 shadow-lg">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Product Name */}
//             <div>
//               <label className="block text-gray-700 font-medium mb-2">
//                 Product Name *
//               </label>
//               <input
//                 type="text"
//                 name="product_name"
//                 value={formData.product_name}
//                 onChange={handleInputChange}
//                 className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.product_name ? "border-red-500" : "border-gray-300"
//                   }`}
//                 onBlur={handleBlur}
//                 placeholder="Enter product name"
//               />
//               {errors.product_name && (
//                 <p className="text-red-500 text-sm mt-1">{errors.product_name}</p>
//               )}
//             </div>

//             {/* Country */}
//             <div>
//               <label className="block text-gray-700 font-medium mb-2">
//                 Origin Country *
//               </label>
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="Select Country"
//                   value={countrySearch}
//                   onChange={(e) => {
//                     setCountrySearch(e.target.value);
//                     setIsCountryDropdownOpen(true);
//                     if (e.target.value === "") {
//                       handleCountryChange({ target: { value: "" } });
//                     }
//                   }}
//                   onClick={() => {
//                     setIsCountryDropdownOpen(true);

//                     if (formData.country && countrySearch !== formData.country) {
//                       setCountrySearch(formData.country);
//                     }
//                   }}
//                   className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.country ? "border-red-500" : "border-gray-300"
//                     }`}
//                 />
//                 {isCountryDropdownOpen && (
//                   <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
//                     {filteredCountries.length > 0 ? (
//                       filteredCountries.map((c) => (
//                         <div
//                           key={c}
//                           className="px-4 py-2 hover:bg-orange-50 cursor-pointer text-sm text-gray-700"
//                           onClick={() => {
//                             handleCountryChange({ target: { value: c } });
//                             setCountrySearch(c);
//                             setIsCountryDropdownOpen(false);
//                           }}
//                         >
//                           {c}
//                         </div>
//                       ))
//                     ) : (
//                       <div className="px-4 py-2 text-gray-500 text-sm">No countries found</div>
//                     )}
//                   </div>
//                 )}
//               </div>
//               {errors.country && (
//                 <p className="text-red-500 text-sm mt-1">{errors.country}</p>
//               )}
//             </div>


//             {/* Warehouse */}
//             <div>
//               <label className="block text-gray-700 font-medium mb-2">
//                 Warehouse *
//               </label>
//               <select
//                 name="warehouseId"
//                 value={formData.warehouseId}
//                 onChange={handleInputChange}
//                 className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.warehouseId ? "border-red-500" : "border-gray-300"
//                   }`}
//                 disabled={!formData.country}
//               >
//                 <option value="" disabled>Select Warehouse</option>
//                 {warehouses.map((w) => (
//                   <option key={w._id || w.id} value={w._id || w.id}>
//                     {w.warehouse_name || w.name}
//                   </option>
//                 ))}
//               </select>
//               {errors.warehouseId && (
//                 <p className="text-red-500 text-sm mt-1">{errors.warehouseId}</p>
//               )}
//             </div>


//             {/* Category */}
//             <div>
//               <label className="block text-gray-700 font-medium mb-2">
//                 Category *
//               </label>
//               <select
//                 name="categoryId"
//                 value={formData.categoryId}
//                 onChange={handleCategoryChange}
//                 className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.categoryId ? "border-red-500" : "border-gray-300"
//                   }`}
//               >
//                 <option value="">Select Category</option>
//                 {categories.map((cat) => (
//                   <option key={cat.category_id} value={cat.category_id}>
//                     {cat.category_name}
//                   </option>
//                 ))}
//               </select>
//               {errors.categoryId && (
//                 <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>
//               )}
//             </div>

//             {/* SubCategory */}
//             <div>
//               <label className="block text-gray-700 font-medium mb-2">
//                 SubCategory *
//               </label>
//               <select
//                 name="subCategoryId"
//                 value={formData.subCategoryId}
//                 onChange={handleInputChange}
//                 className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.subCategoryId ? "border-red-500" : "border-gray-300"
//                   }`}
//                 disabled={!subCategories.length}
//               >
//                 <option value="">Select SubCategory</option>
//                 {subCategories.map((sub) => (
//                   <option key={sub.category_id} value={sub.category_id}>
//                     {sub.category_name}
//                   </option>
//                 ))}
//               </select>
//               {errors.subCategoryId && (
//                 <p className="text-red-500 text-sm mt-1">{errors.subCategoryId}</p>
//               )}
//             </div>

//             {/* Product Price Per Piece */}
//             <div>
//               <label className="block text-gray-700 font-medium mb-2">
//                 Price Per Piece (₹) *
//               </label>
//               <input
//                 type="number"
//                 name="productPricePerPiece"
//                 value={formData.productPricePerPiece}
//                 onChange={handleInputChange}
//                 className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.productPricePerPiece ? "border-red-500" : "border-gray-300"
//                   }`}
//                 min="0.01"
//                 step="0.01"
//                 onKeyDown={preventNegative}
//                 placeholder="0.00"
//                 onBlur={(e) => {
//                   // Ensure valid format on blur if needed
//                   let val = parseFloat(e.target.value);
//                   if (val < 0) val = 0; // reset negative on blur
//                 }}
//               />
//               {errors.productPricePerPiece && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.productPricePerPiece}
//                 </p>
//               )}
//             </div>

//             {/* Quantity */}
//             <div>
//               <label className="block text-gray-700 font-medium mb-2">
//                 Quantity *
//               </label>
//               <input
//                 type="number"
//                 name="quantity"
//                 value={formData.quantity}
//                 onChange={handleInputChange}
//                 className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.quantity ? "border-red-500" : "border-gray-300"
//                   }`}
//                 min="1"
//                 step="1"
//                 onKeyDown={preventNegative}
//                 placeholder="0"
//                 onBlur={(e) => {
//                   let val = parseInt(e.target.value);
//                   if (val < 0) val = 0;
//                 }}
//               />
//               {errors.quantity && (
//                 <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
//               )}
//             </div>

//             {/* Total Price Display */}
//             <div>
//               <label className="block text-gray-700 font-medium mb-2">
//                 Total Price (₹)
//               </label>
//               <input
//                 type="text"
//                 value={totalPrice.toFixed(2)}
//                 readOnly
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
//               />
//             </div>



//             {/* Time to Make */}
//             <div>
//               <label className="block text-gray-700 font-medium mb-2">
//                 Time to Make (Days)
//               </label>
//               <input
//                 type="number"
//                 name="timeToMake"
//                 value={formData.timeToMake}
//                 onChange={handleInputChange}
//                 min="1"
//                 step="1"
//                 onKeyDown={preventNegative}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                 placeholder="Days"
//                 onBlur={(e) => {
//                   let val = parseInt(e.target.value);
//                   if (val < 0) val = 0;
//                 }}
//               />
//               {errors.timeToMake && (
//                 <p className="text-red-500 text-sm mt-1">{errors.timeToMake}</p>
//               )}
//             </div>

//             {/* Material */}
//             <div>
//               <label className="block text-gray-700 font-medium mb-2">
//                 Material *
//               </label>
//               <input
//                 type="text"
//                 name="material"
//                 value={formData.material}
//                 onChange={handleInputChange}
//                 className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.material ? "border-red-500" : "border-gray-300"
//                   }`}
//                 placeholder="Cotton, Silk, etc."
//                 onBlur={handleBlur}
//               />
//               {errors.material && (
//                 <p className="text-red-500 text-sm mt-1">{errors.material}</p>
//               )}
//             </div>

//             {/* Finish/Texture */}
//             <div>
//               <label className="block text-gray-700 font-medium mb-2">
//                 Finish / Texture
//               </label>
//               <select
//                 name="finish"
//                 value={showFinishOther ? "Other" : formData.finish}
//                 onChange={(e) => {
//                   if (e.target.value === "Other") {
//                     setShowFinishOther(true);
//                     setFormData((prev) => ({ ...prev, finish: "" }));
//                   } else {
//                     setShowFinishOther(false);
//                     handleInputChange(e);
//                   }
//                 }}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//               >
//                 <option value="">Select Finish</option>
//                 <option value="Matte">Matte</option>
//                 <option value="Glossy">Glossy</option>
//                 <option value="Handwoven">Handwoven</option>
//                 <option value="Rough">Rough</option>
//                 <option value="Smooth">Smooth</option>
//                 <option value="Other">Other</option>
//               </select>
//               {showFinishOther && (
//                 <input
//                   type="text"
//                   name="finish"
//                   value={formData.finish}
//                   onChange={handleInputChange}
//                   placeholder="Enter custom finish"
//                   className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                   onBlur={handleBlur}
//                 />
//               )}
//             </div>

//             {/* Wash Care */}
//             <div>
//               <label className="block text-gray-700 font-medium mb-2">
//                 Wash Care
//               </label>
//               <select
//                 name="washCare"
//                 value={showWashCareOther ? "Other" : formData.washCare}
//                 onChange={(e) => {
//                   if (e.target.value === "Other") {
//                     setShowWashCareOther(true);
//                     setFormData((prev) => ({ ...prev, washCare: "" }));
//                   } else {
//                     setShowWashCareOther(false);
//                     handleInputChange(e);
//                   }
//                 }}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//               >
//                 <option value="">Select Wash Care</option>
//                 <option value="Dry Clean Only">Dry Clean Only</option>
//                 <option value="Hand Wash">Hand Wash</option>
//                 <option value="Machine Wash">Machine Wash</option>
//                 <option value="Do Not Wash">Do Not Wash</option>
//                 <option value="Other">Other</option>
//               </select>
//               {showWashCareOther && (
//                 <input
//                   type="text"
//                   name="washCare"
//                   value={formData.washCare}
//                   onChange={handleInputChange}
//                   placeholder="Enter custom wash care"
//                   className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                   onBlur={handleBlur}
//                 />
//               )}
//             </div>

//             {/* Art Used */}
//             <div>
//               <label className="block text-gray-700 font-medium mb-2">
//                 Art Used
//               </label>
//               <input
//                 type="text"
//                 name="artUsed"
//                 value={formData.artUsed}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                 placeholder="Madhubani, Warli, etc."
//                 onBlur={handleBlur}
//               />
//               {errors.artUsed && (
//                 <p className="text-red-500 text-sm mt-1">{errors.artUsed}</p>
//               )}
//             </div>

//             {/* Pattern Used */}
//             <div>
//               <label className="block text-gray-700 font-medium mb-2">
//                 Pattern Used
//               </label>
//               <input
//                 type="text"
//                 name="pattern"
//                 value={formData.pattern}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                 placeholder="Floral, Geometric, Striped, etc."
//                 onBlur={handleBlur}
//               />
//               {errors.pattern && (
//                 <p className="text-red-500 text-sm mt-1">{errors.pattern}</p>
//               )}
//             </div>



//             {/* Net Weight */}
//             <div>
//               <label className="block text-gray-700 font-medium mb-2">
//                 Net Weight
//               </label>
//               <div className="flex gap-2">
//                 <input
//                   type="number"
//                   name="weightValue"
//                   value={formData.weightValue}
//                   onChange={handleInputChange}
//                   min="0.01"
//                   step="0.01"
//                   onKeyDown={preventNegative}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                   placeholder="Weight"
//                   onBlur={(e) => {
//                     let val = parseFloat(e.target.value);
//                     if (val < 0) val = 0;
//                   }}
//                 />
//                 <select
//                   name="weightUnit"
//                   value={formData.weightUnit}
//                   onChange={handleInputChange}
//                   className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                 >
//                   <option value="gm">gm</option>
//                   <option value="kg">kg</option>
//                 </select>
//               </div>
//             </div>

//             {/* Dimension */}
//             <div className="md:col-span-2">
//               <label className="block text-gray-700 font-medium mb-2">
//                 Dimensions
//               </label>
//               <div className="grid grid-cols-4 gap-2">
//                 <input
//                   type="number"
//                   name="length"
//                   value={formData.length}
//                   onChange={handleInputChange}
//                   min="0.01"
//                   step="0.01"
//                   onKeyDown={preventNegative}
//                   className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                   placeholder="Length"
//                   onBlur={(e) => {
//                     let val = parseFloat(e.target.value);
//                     if (val < 0) val = 0;
//                   }}
//                 />
//                 <input
//                   type="number"
//                   name="breadth"
//                   value={formData.breadth}
//                   onChange={handleInputChange}
//                   min="0.01"
//                   step="0.01"
//                   onKeyDown={preventNegative}
//                   className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                   placeholder="Breadth"
//                   onBlur={(e) => {
//                     let val = parseFloat(e.target.value);
//                     if (val < 0) val = 0;
//                   }}
//                 />
//                 <input
//                   type="number"
//                   name="height"
//                   value={formData.height}
//                   onChange={handleInputChange}
//                   min="0.01"
//                   step="0.01"
//                   onKeyDown={preventNegative}
//                   className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                   placeholder="Height"
//                   onBlur={(e) => {
//                     let val = parseFloat(e.target.value);
//                     if (val < 0) val = 0;
//                   }}
//                 />
//                 <select
//                   name="dimensionUnit"
//                   value={formData.dimensionUnit}
//                   onChange={handleInputChange}
//                   className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                 >
//                   <option value="cm">cm</option>
//                   <option value="inches">inches</option>
//                 </select>
//               </div>
//             </div>

//             {/* Description */}
//             <div className="md:col-span-2">
//               <label className="block text-gray-700 font-medium mb-2">
//                 Description *
//               </label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 rows="4"
//                 className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.description ? "border-red-500" : "border-gray-300"
//                   }`}
//                 placeholder="Describe your product..."
//                 onBlur={handleBlur}
//               />
//               {errors.description && (
//                 <p className="text-red-500 text-sm mt-1">{errors.description}</p>
//               )}
//             </div>

//             {/* Image Upload */}
//             <div className="md:col-span-2">
//               <label className="block text-gray-700 font-medium mb-2">
//                 Product Images *
//               </label>
//               <input
//                 type="file"
//                 multiple
//                 accept="image/*"
//                 onChange={handleFileChange}
//                 className={`w-full ${errors.images ? "text-red-500" : ""}`}
//               />
//               {errors.images ? (
//                 <p className="text-red-500 text-sm mt-1">{errors.images}</p>
//               ) : (
//                 <p className="text-gray-500 text-sm mt-1">Only JPEG, JPG, and PNG formats are allowed.</p>
//               )}
//             </div>
//           </div>
//           {/* Buttons */}
//           <div className="flex gap-4 mt-8 pt-6 border-t">
//             <button
//               type="button"
//               onClick={handleGoBack}
//               className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//               disabled={loading}
//             >
//               Cancel
//             </button>
//             <button
//               type="button"
//               onClick={handleSubmit}
//               className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-50"
//               disabled={loading}
//             >
//               {loading ? "Saving..." : "Save Product"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default AddProduct;
import { ArrowLeft, CheckCircle } from "lucide-react";
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
  });


  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await categoryControllers.getCategory();
      console.log("CATEGORY RESPONSE:", res.data.data.docs);
      setCategories(res.data?.data?.docs || []);
    } catch (error) {
      console.log("Category Fetch Error:", error);
    }
  };

  const handleCategoryChange = async (e) => {
    const selectedCategoryId = e.target.value;
    setFormData((prev) => ({ ...prev, categoryId: selectedCategoryId }));

    try {
      const res = await categoryControllers.getSubCategory(selectedCategoryId);
      console.log("SUBCATEGORY RESPONSE:", res.data.data.docs);

      const filteredSubs = (res.data?.data?.docs || []).filter(
        (item) => item.type === "Sub-Category"
      );

      setSubCategories(filteredSubs);
    } catch (error) {
      console.log("SubCategory Fetch Error:", error);
    }
  };

  const handleCountryChange = async (e) => {
    const selectedCountry = e.target.value;
    setFormData((prev) => ({ ...prev, country: selectedCountry, warehouseId: "" }));
    setWarehouses([]);

    if (selectedCountry) {
      try {
        const res = await warehouseControllers.getWarehousesByCountry(selectedCountry);
        console.log("Warehouse Response:", res.data);
        // Assuming response structure, adjust if needed based on actual API response
        setWarehouses(res.data?.data?.docs || res.data?.data || []);
      } catch (error) {
        console.error("Error fetching warehouses:", error);
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


  const [countrySearch, setCountrySearch] = useState("");
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

  const filteredCountries = countries.filter((c) =>
    c.toLowerCase().includes(countrySearch.toLowerCase())
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
    if (!formData.product_name.trim()) newErrors.product_name = "Product Name is required";
    if (!formData.categoryId) newErrors.categoryId = "Category is required";
    if (!formData.subCategoryId) newErrors.subCategoryId = "SubCategory is required";

    if (!formData.productPricePerPiece) newErrors.productPricePerPiece = "Price is required";
    else if (Number(formData.productPricePerPiece) <= 0) newErrors.productPricePerPiece = "Price must be greater than 0";

    if (!formData.quantity) newErrors.quantity = "Quantity is required";
    else if (Number(formData.quantity) <= 0) newErrors.quantity = "Quantity must be greater than 0";

    if (!formData.material.trim()) newErrors.material = "Material is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.warehouseId) newErrors.warehouseId = "Warehouse is required";
    if (images.length === 0) newErrors.images = "At least one product image is required";

    if (formData.weightValue && Number(formData.weightValue) <= 0) newErrors.weightValue = "Weight must be greater than 0";
    if (formData.length && Number(formData.length) <= 0) newErrors.length = "Length must be greater than 0";
    if (formData.breadth && Number(formData.breadth) <= 0) newErrors.breadth = "Breadth must be greater than 0";
    if (formData.height && Number(formData.height) <= 0) newErrors.height = "Height must be greater than 0";
    if (formData.timeToMake && Number(formData.timeToMake) <= 0) newErrors.timeToMake = "Time to make must be greater than 0";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    const invalidFiles = files.filter((file) => !validTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      const errorMessage = "only jpeg ,jpg and png format are allowed";
      toast.error(errorMessage);
      setErrors((prev) => ({ ...prev, images: errorMessage }));
      e.target.value = null; // Reset input
      setImages([]);
      return;
    }

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.images;
      return newErrors;
    });
    setImages(files);
  };

  const handleSubmit = async () => {
    toast.dismiss(); // Clear any existing toasts
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();

      // Construct composite fields
      const dimension = `${formData.length}x${formData.breadth}x${formData.height} ${formData.dimensionUnit}`;
      const netWeight = `${formData.weightValue} ${formData.weightUnit}`;

      // Append fields
      data.append("product_name", formData.product_name);
      data.append("categoryId", formData.categoryId);
      data.append("subCategoryId", formData.subCategoryId);
      data.append("productPricePerPiece", formData.productPricePerPiece);
      data.append("quantity", formData.quantity);
      data.append("material", formData.material);
      data.append("description", formData.description);
      data.append("timeToMake", formData.timeToMake);
      data.append("texture", formData.texture);
      data.append("finish", formData.finish);
      data.append("washCare", formData.washCare);
      data.append("artUsed", formData.artUsed);
      data.append("pattern", formData.pattern);
      data.append("dimension", dimension);
      data.append("netWeight", netWeight);
      data.append("country", formData.country);
      data.append("warehouseId", formData.warehouseId);

      if (images.length > 0) {
        images.forEach((file) => {
          data.append("images", file);
        });
      }

      console.log("Request Payload:");
      for (let [key, value] of data.entries()) {
        console.log(`${key}:`, value);
      }
      const res = await productControllers.addProduct(data);

      if (res && res.data) {
        toast.success("Product added successfully!", {
          icon: <CheckCircle className="text-orange-600" />,
          progressStyle: { background: "#ea580c" }
        });
        console.log("Product Response:", res.data);
        setTimeout(() => {
          navigate("/product-management", { state: { refresh: true } });
        }, 1500);
      } else {
        throw new Error("No response received");
      }
    } catch (err) {
      console.error("Error adding product:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const totalPrice = (parseFloat(formData.productPricePerPiece) || 0) * (parseFloat(formData.quantity) || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6 ml-64 pt-24 flex-1">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg">
          <div className="flex items-center gap-4">
            <button
              onClick={handleGoBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
                Add New Product
              </h1>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="product_name"
                value={formData.product_name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.product_name ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="Enter product name"
              />
              {errors.product_name && (
                <p className="text-red-500 text-sm mt-1">{errors.product_name}</p>
              )}
            </div>

            {/* Country */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Origin Country *
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Select Country"
                  value={countrySearch}
                  onChange={(e) => {
                    setCountrySearch(e.target.value);
                    setIsCountryDropdownOpen(true);
                    if (e.target.value === "") {
                      handleCountryChange({ target: { value: "" } });
                    }
                  }}
                  onClick={() => {
                    setIsCountryDropdownOpen(true);
                    // If a country is already selected, we might want to clear search or keep it.
                    // Keeping it allows editing. Clearing it allows seeing all options.
                    // Let's keep it simple: if clicked, show dropdown.
                    if (formData.country && countrySearch !== formData.country) {
                      setCountrySearch(formData.country);
                    }
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.country ? "border-red-500" : "border-gray-300"
                    }`}
                />
                {isCountryDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredCountries.length > 0 ? (
                      filteredCountries.map((c) => (
                        <div
                          key={c}
                          className="px-4 py-2 hover:bg-orange-50 cursor-pointer text-sm text-gray-700"
                          onClick={() => {
                            handleCountryChange({ target: { value: c } });
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
              {errors.country && (
                <p className="text-red-500 text-sm mt-1">{errors.country}</p>
              )}
            </div>


            {/* Warehouse */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Warehouse *
              </label>
              <select
                name="warehouseId"
                value={formData.warehouseId}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.warehouseId ? "border-red-500" : "border-gray-300"
                  }`}
                disabled={!formData.country}
              >
                <option value="" disabled>Select Warehouse</option>
                {warehouses.map((w) => (
                  <option key={w._id || w.id} value={w._id || w.id}>
                    {w.warehouse_name || w.name}
                  </option>
                ))}
              </select>
              {errors.warehouseId && (
                <p className="text-red-500 text-sm mt-1">{errors.warehouseId}</p>
              )}
            </div>


            {/* Category */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Category *
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleCategoryChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.categoryId ? "border-red-500" : "border-gray-300"
                  }`}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>
              )}
            </div>

            {/* SubCategory */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                SubCategory *
              </label>
              <select
                name="subCategoryId"
                value={formData.subCategoryId}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.subCategoryId ? "border-red-500" : "border-gray-300"
                  }`}
                disabled={!subCategories.length}
              >
                <option value="">Select SubCategory</option>
                {subCategories.map((sub) => (
                  <option key={sub.category_id} value={sub.category_id}>
                    {sub.category_name}
                  </option>
                ))}
              </select>
              {errors.subCategoryId && (
                <p className="text-red-500 text-sm mt-1">{errors.subCategoryId}</p>
              )}
            </div>

            {/* Product Price Per Piece */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Price Per Piece (₹) *
              </label>
              <input
                type="number"
                name="productPricePerPiece"
                value={formData.productPricePerPiece}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.productPricePerPiece ? "border-red-500" : "border-gray-300"
                  }`}
                min="0.01"
                step="0.01"
                onKeyDown={preventNegative}
                placeholder="0.00"
              />
              {errors.productPricePerPiece && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.productPricePerPiece}
                </p>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Quantity *
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.quantity ? "border-red-500" : "border-gray-300"
                  }`}
                min="1"
                step="1"
                onKeyDown={preventNegative}
                placeholder="0"
              />
              {errors.quantity && (
                <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
              )}
            </div>

            {/* Total Price Display */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Total Price (₹)
              </label>
              <input
                type="text"
                value={totalPrice.toFixed(2)}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
              />
            </div>



            {/* Time to Make */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Time to Make (Days)
              </label>
              <input
                type="number"
                name="timeToMake"
                value={formData.timeToMake}
                onChange={handleInputChange}
                min="1"
                step="1"
                onKeyDown={preventNegative}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Days"
              />
              {errors.timeToMake && (
                <p className="text-red-500 text-sm mt-1">{errors.timeToMake}</p>
              )}
            </div>

            {/* Material */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Material *
              </label>
              <input
                type="text"
                name="material"
                value={formData.material}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.material ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="Cotton, Silk, etc."
              />
              {errors.material && (
                <p className="text-red-500 text-sm mt-1">{errors.material}</p>
              )}
            </div>

            {/* Finish/Texture */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Finish / Texture
              </label>
              <select
                name="finish"
                value={showFinishOther ? "Other" : formData.finish}
                onChange={(e) => {
                  if (e.target.value === "Other") {
                    setShowFinishOther(true);
                    setFormData((prev) => ({ ...prev, finish: "" }));
                  } else {
                    setShowFinishOther(false);
                    handleInputChange(e);
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select Finish</option>
                <option value="Matte">Matte</option>
                <option value="Glossy">Glossy</option>
                <option value="Handwoven">Handwoven</option>
                <option value="Rough">Rough</option>
                <option value="Smooth">Smooth</option>
                <option value="Other">Other</option>
              </select>
              {showFinishOther && (
                <input
                  type="text"
                  name="finish"
                  value={formData.finish}
                  onChange={handleInputChange}
                  placeholder="Enter custom finish"
                  className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              )}
            </div>

            {/* Wash Care */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Wash Care
              </label>
              <select
                name="washCare"
                value={showWashCareOther ? "Other" : formData.washCare}
                onChange={(e) => {
                  if (e.target.value === "Other") {
                    setShowWashCareOther(true);
                    setFormData((prev) => ({ ...prev, washCare: "" }));
                  } else {
                    setShowWashCareOther(false);
                    handleInputChange(e);
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select Wash Care</option>
                <option value="Dry Clean Only">Dry Clean Only</option>
                <option value="Hand Wash">Hand Wash</option>
                <option value="Machine Wash">Machine Wash</option>
                <option value="Do Not Wash">Do Not Wash</option>
                <option value="Other">Other</option>
              </select>
              {showWashCareOther && (
                <input
                  type="text"
                  name="washCare"
                  value={formData.washCare}
                  onChange={handleInputChange}
                  placeholder="Enter custom wash care"
                  className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              )}
            </div>

            {/* Art Used */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Art Used
              </label>
              <input
                type="text"
                name="artUsed"
                value={formData.artUsed}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Madhubani, Warli, etc."
              />
            </div>

            {/* Pattern Used */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Pattern Used
              </label>
              <input
                type="text"
                name="pattern"
                value={formData.pattern}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Floral, Geometric, Striped, etc."
              />
            </div>



            {/* Net Weight */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Net Weight
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="weightValue"
                  value={formData.weightValue}
                  onChange={handleInputChange}
                  min="0.01"
                  step="0.01"
                  onKeyDown={preventNegative}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Weight"
                />
                <select
                  name="weightUnit"
                  value={formData.weightUnit}
                  onChange={handleInputChange}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="gm">gm</option>
                  <option value="kg">kg</option>
                </select>
              </div>
            </div>

            {/* Dimension */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Dimensions
              </label>
              <div className="grid grid-cols-4 gap-2">
                <input
                  type="number"
                  name="length"
                  value={formData.length}
                  onChange={handleInputChange}
                  min="0.01"
                  step="0.01"
                  onKeyDown={preventNegative}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Length"
                />
                <input
                  type="number"
                  name="breadth"
                  value={formData.breadth}
                  onChange={handleInputChange}
                  min="0.01"
                  step="0.01"
                  onKeyDown={preventNegative}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Breadth"
                />
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  min="0.01"
                  step="0.01"
                  onKeyDown={preventNegative}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Height"
                />
                <select
                  name="dimensionUnit"
                  value={formData.dimensionUnit}
                  onChange={handleInputChange}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="cm">cm</option>
                  <option value="inches">inches</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="Describe your product..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            {/* Image Upload */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Product Images *
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className={`w-full ${errors.images ? "text-red-500" : ""}`}
              />
              {errors.images ? (
                <p className="text-red-500 text-sm mt-1">{errors.images}</p>
              ) : (
                <p className="text-gray-500 text-sm mt-1">Only JPEG, JPG, and PNG formats are allowed.</p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={handleGoBack}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Product"}
            </button>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} style={{ zIndex: 99999 }} />
    </div>
  );
};

export default AddProduct;
