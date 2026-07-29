import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productControllers } from "../api/product";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { categoryControllers } from "../api/category";
import { warehouseControllers } from "../api/warehouse";
import { X, ArrowLeft, ChevronDown } from "lucide-react";
import { countries } from "../constants/countries";
const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState({
    product_name: "",
    description: "",
    categoryId: "",
    subCategoryId: "",
    productPricePerPiece: "",
    adminRemarks: "",
    timeToMake: "",
    texture: "",
    artUsed: "",
    patternUsed: "",
    remainingQuantity: "",
    material: "",
    netWeight: "",
    dimension: "",
    country: "",
    warehouseId: "",
    isReadyForAuction: false,
  });

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [originalProduct, setOriginalProduct] = useState(null);
  const [initialProductData, setInitialProductData] = useState(null);
  const [initialExistingImages, setInitialExistingImages] = useState([]);

  const [countrySearch, setCountrySearch] = useState("");
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [showFinishOther, setShowFinishOther] = useState(false);

  const filteredCountries = countries.filter((c) =>
    c.toLowerCase().includes(countrySearch.toLowerCase()),
  );

  const hasChanges = React.useMemo(() => {
    const hasProductDataChanged = JSON.stringify(productData) !== JSON.stringify(initialProductData);
    const haveExistingImagesChanged = existingImages.length !== initialExistingImages.length;
    const haveNewImagesAdded = images.length > 0;
    return hasProductDataChanged || haveExistingImagesChanged || haveNewImagesAdded;
  }, [productData, initialProductData, existingImages.length, initialExistingImages.length, images.length]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".relative-dropdown-container")) {
        setIsCountryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [catRes, productRes] = await Promise.all([
          categoryControllers.getCategory(),
          productControllers.getProductById(id),
        ]);

        const cats = catRes.data?.data?.docs || [];
        setCategories(cats);

        const p = productRes.data.data;

        {/*if (p.admin_approval_status === "APPROVED") {
          toast.dismiss();
          toast.error("Approved products cannot be edited!");
          navigate(`/product-management/product-details/${id}`);
          return;
        }*/}

        if (p.isReadyForAuction) {
          toast.dismiss();
          toast.error("Products listed for auction cannot be edited!");
          navigate(`/product-management/product-details/${id}`);
          return;
        }

        setOriginalProduct(p);

        const resolveId = (val, list) => {
          if (!val) return "";
          if (typeof val === "object") {
            if (val.category_id) return val.category_id;
            const match = list.find((c) => c._id === val._id || c.id === val._id);
            return match ? match.category_id : val._id || "";
          }
          const matchByCatId = list.find((c) => c.category_id == val);
          if (matchByCatId) return matchByCatId.category_id;
          const matchByObjId = list.find((c) => c._id == val || c.id == val);
          if (matchByObjId) return matchByObjId.category_id;
          return val;
        };

        const rawCat = p.categoryId || p.category || p.category_id;
        const rawSubCat = p.subCategoryId || p.subCategory || p.sub_category_id;
        const catId = resolveId(rawCat, cats);

        let subCats = [];
        let subCatId = "";

        if (catId) {
          try {
            const res2 = await categoryControllers.getSubCategory(catId);
            subCats = (res2.data?.data?.docs || []).filter(
              (item) => item.type === "Sub-Category",
            );
            setSubCategories(subCats);
            subCatId = resolveId(rawSubCat, subCats);
          } catch (err) {
            // console.log("SubCategory Fetch Error", err);
          }
        }

        if (!subCatId && typeof rawSubCat === "object" && rawSubCat.category_id) {
          subCatId = rawSubCat.category_id;
        }

        let fetchedWarehouses = [];
        if (p.country) {
          try {
            const wRes = await warehouseControllers.getWarehousesByCountry(p.country);
            fetchedWarehouses = wRes.data?.data?.docs || wRes.data?.data || [];
            setWarehouses(fetchedWarehouses);
          } catch (err) {
            console.error("Error fetching warehouses", err);
          }
        }

        const rawWarehouseId = p.warehouseId || (p.warehouse && (p.warehouse._id || p.warehouse.id));
        let finalWarehouseId = "";

        if (rawWarehouseId) {
          const foundW = fetchedWarehouses.find((w) => w._id === rawWarehouseId || w.id === rawWarehouseId);
          finalWarehouseId = foundW ? foundW._id || foundW.id : rawWarehouseId;
        }

        // Check if texture is one of the dropdown values
        const textureVal = p.texture || p.finish || "";
        const predefinedTextures = ["Matte", "Glossy", "Handwoven", "Rough", "Smooth"];
        if (textureVal && !predefinedTextures.includes(textureVal)) {
          setShowFinishOther(true);
        }

        const initialData = {
          product_name: p.product_name || "",
          description: p.description || "",
          categoryId: catId || "",
          subCategoryId: subCatId || "",
          productPricePerPiece: p.productPricePerPiece || p.mrp || "",
          adminRemarks: p.adminRemarks || p.admin_remarks || "",
          timeToMake: p.timeToMake || "",
          //  texture: p.texture || "",
          //  patternUsed: p.patternUsed || "",
          texture: textureVal,
          artUsed: p.artUsed || "",
          patternUsed: p.patternUsed || p.pattern || "",
          remainingQuantity: p.remainingQuantity !== undefined ? p.remainingQuantity : (p.quantity || ""),
          material: p.material || "",
          netWeight: p.netWeight || "",
          dimension: p.dimension || "",
          country: p.country || "",
          warehouseId: finalWarehouseId || "",
          isReadyForAuction: p.isReadyForAuction || false,
        };

        setProductData(initialData);
        setInitialProductData(initialData);

        let fetchedImages = p.images || [];
        if (typeof fetchedImages === "string") {
          try {
            fetchedImages = JSON.parse(fetchedImages);
          } catch (e) {
            fetchedImages = [fetchedImages];
          }
        }
        setExistingImages(fetchedImages);
        setInitialExistingImages(fetchedImages);

        setCountrySearch(p.country || "");
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.dismiss();
        toast.error("Failed to load product data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleCategoryChange = async (e) => {
    const selectedId = e.target.value;

    setProductData((prev) => ({
      ...prev,
      categoryId: selectedId,
      subCategoryId: "",
    }));

    try {
      const res = await categoryControllers.getSubCategory(selectedId);
      const onlySubs = (res.data?.data?.docs || []).filter(
        (item) => item.type === "Sub-Category",
      );
      setSubCategories(onlySubs);
    } catch (err) {
      // console.log("SubCategory Fetch Error");
    }
  };

  const handleCountryChange = async (e) => {
    const selectedCountry = e.target.value;
    setProductData((prev) => ({
      ...prev,
      country: selectedCountry,
      warehouseId: "",
    }));
    setWarehouses([]);

    if (selectedCountry) {
      try {
        const res = await warehouseControllers.getWarehousesByCountry(selectedCountry);
        setWarehouses(res.data?.data?.docs || res.data?.data || []);
      } catch (error) {
        console.error("Error fetching warehouses:", error);
        toast.dismiss();
        toast.error("Failed to fetch warehouses");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    const invalidFiles = files.filter((file) => !validTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      const errorMessage = "Only JPEG, JPG and PNG format are allowed";
      toast.dismiss();
      toast.error(errorMessage);
      e.target.value = null; // Reset input
      return;
    }
    setImages((prev) => [...prev, ...files]);
  };

  const removeExistingImage = (indexToRemove) => {
    setExistingImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const removeNewImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    toast.dismiss();

    const nameRegex = /^[a-zA-Z0-9\s\-&]{3,100}$/;
    const materialRegex = /^[a-zA-Z\s&\-]{2,50}$/;
    const artRegex = /^[a-zA-Z\s\-]{2,50}$/;
    const patternRegex = /^[a-zA-Z\s\-]{2,50}$/;

    const newErrors = {};

    if (!productData.product_name || !productData.product_name.trim()) {
      newErrors.product_name = "Product Name is required";
    } else if (!nameRegex.test(productData.product_name)) {
      newErrors.product_name = "Invalid Product Name (3-100 characters, alphanumeric, space, -, & only)";
    }

    if (!productData.material || !productData.material.trim()) {
      newErrors.material = "Material is required";
    } else if (!materialRegex.test(productData.material)) {
      newErrors.material = "Invalid Material (2-50 characters, letters, space, &, - only)";
    }

    if (productData.artUsed && !artRegex.test(productData.artUsed)) {
      newErrors.artUsed = "Invalid Art (2-50 characters, letters, space, - only)";
    }

    if (productData.patternUsed && !patternRegex.test(productData.patternUsed)) {
      newErrors.patternUsed = "Invalid Pattern (2-50 characters, letters, space, - only)";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    if (!hasChanges) {
      navigate(-1);
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      Object.keys(productData).forEach((key) => {
        if (key === "remainingQuantity") {
          formData.append("quantity", productData[key]);
        } else if (key === "isReadyForAuction") {
          formData.append(key, productData[key] ? "true" : "");
        } else {
          formData.append(key, productData[key]);
        }
      });

      images.forEach((file) => {
        formData.append("images", file);
      });

      /*
      existingImages.forEach((img) => {
        formData.append("existingImages", typeof img === "object" ? JSON.stringify(img) : img);
      });
      // Just in case the backend uses a different key for retained images
      formData.append("retainedImages", JSON.stringify(existingImages));
       */

      if (existingImages.length === 0) {
        formData.append("existingImages", "[]");
      } else {
        const existingImageUrls = existingImages
          .map((img) => (typeof img === "object" ? (img.imageUrl || img.downloadUrl) : img))
          .filter(Boolean);
        formData.append("existingImages", JSON.stringify(existingImageUrls));
      }

      await productControllers.updateProduct(id, formData);

      toast.dismiss();
      toast.success("Product Updated Successfully!");
      navigate(-1);
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to update product!");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const preventNegative = (e) => {
    if (["-", "e", "+"].includes(e.key)) {
      e.preventDefault();
    }
  };

  const isAddedByArtisan = originalProduct?.addedBy?.user_group === "ARTISAN";
  const totalPrice = (parseFloat(productData.productPricePerPiece) || 0) * (parseFloat(productData.remainingQuantity) || 0);

  {/*if (loading) return <p className="p-6 text-center">Loading...</p>;*/ }
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6 ml-64 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading product data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6 ml-64 pt-24 flex-1">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-6 px-4 md:px-0">
          <button
            onClick={handleGoBack}
            className="flex items-center text-gray-600 hover:text-orange-600 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Product List
          </button>
        </div>

        {/* Header */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
                Edit Product
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
                value={productData.product_name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.product_name ? "border-red-500" : "border-gray-300"}`}
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
              <div className="relative relative-dropdown-container">
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
                    if (productData.country && countrySearch !== productData.country) {
                      setCountrySearch(productData.country);
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
            </div>

            {/* Warehouse */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Warehouse *
              </label>
              <div className="relative">
                <select
                  name="warehouseId"
                  value={productData.warehouseId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white"
                  disabled={!productData.country}
                >
                  <option value="" disabled>Select Warehouse</option>
                  {warehouses.map((w) => (
                    <option key={w._id || w.id} value={w._id || w.id}>
                      {w.warehouse_name || w.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Category *
              </label>
              <div className="relative">
                <select
                  name="categoryId"
                  value={productData.categoryId}
                  onChange={handleCategoryChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.category_id} value={cat.category_id}>
                      {cat.category_name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* SubCategory */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                SubCategory *
              </label>
              <div className="relative">
                <select
                  name="subCategoryId"
                  value={productData.subCategoryId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white"
                  disabled={!subCategories.length}
                >
                  <option value="">Select SubCategory</option>
                  {subCategories.map((sub) => (
                    <option key={sub.category_id} value={sub.category_id}>
                      {sub.category_name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Product Price Per Piece */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Price Per Piece (₹) *
              </label>
              <input
                type="number"
                name="productPricePerPiece"
                value={productData.productPricePerPiece}
                onChange={handleChange}
                disabled={isAddedByArtisan}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${isAddedByArtisan ? "bg-gray-100 cursor-not-allowed text-gray-500" : ""
                  }`}
                min="0.01"
                step="0.01"
                onKeyDown={preventNegative}
                placeholder="0.00"
              />
              {isAddedByArtisan && (
                <p className="text-gray-500 text-xs mt-1">Price locked (Added by Artisan)</p>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Quantity *
              </label>
              <input
                type="number"
                name="remainingQuantity"
                value={productData.remainingQuantity}
                onChange={handleChange}
                disabled={isAddedByArtisan}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${isAddedByArtisan ? "bg-gray-100 cursor-not-allowed text-gray-500" : ""
                  }`}
                min="0"
                step="1"
                onKeyDown={preventNegative}
                placeholder="0"
              />
              {isAddedByArtisan && (
                <p className="text-gray-500 text-xs mt-1">Quantity locked (Added by Artisan)</p>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 focus:outline-none"
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
                value={productData.timeToMake}
                onChange={handleChange}
                min="1"
                step="1"
                onKeyDown={preventNegative}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Days"
              />
            </div>

            {/* Material */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Material *
              </label>
              <input
                type="text"
                name="material"
                value={productData.material}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.material ? "border-red-500" : "border-gray-300"}`}
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
              <div className="relative">
                <select
                  name="texture"
                  value={showFinishOther ? "Other" : productData.texture}
                  onChange={(e) => {
                    if (e.target.value === "Other") {
                      setShowFinishOther(true);
                      setProductData((prev) => ({ ...prev, texture: "" }));
                    } else {
                      setShowFinishOther(false);
                      handleChange(e);
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none bg-white"
                >
                  <option value="">Select Finish</option>
                  <option value="Matte">Matte</option>
                  <option value="Glossy">Glossy</option>
                  <option value="Handwoven">Handwoven</option>
                  <option value="Rough">Rough</option>
                  <option value="Smooth">Smooth</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
              {showFinishOther && (
                <input
                  type="text"
                  name="texture"
                  value={productData.texture}
                  onChange={handleChange}
                  placeholder="Enter custom finish/texture"
                  className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                value={productData.artUsed}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.artUsed ? "border-red-500" : "border-gray-300"}`}
                placeholder="Madhubani, Warli, etc."
              />
              {errors.artUsed && (
                <p className="text-red-400 text-sm mt-1">{errors.artUsed}</p>
              )}
            </div>

            {/* Pattern Used */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Pattern Used
              </label>
              <input
                type="text"
                name="patternUsed"
                value={productData.patternUsed}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.patternUsed ? "border-red-500" : "border-gray-300"}`}
                placeholder="Floral, Geometric, Striped, etc."
              />
              {errors.patternUsed && (
                <p className="text-red-400 text-sm mt-1">{errors.patternUsed}</p>
              )}
            </div>

            {/* <div>
            <label className="font-medium">Color</label>
            <input
              type="text"
              name="color"
              value={productData.color || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div> */}

            {/* <div>
            <label className="font-medium">Size</label>
            <input
              type="text"
              name="size"
              value={productData.size || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div> */}

            {/* <div>
            <label className="font-medium">Discount (%)</label>
            <input
              type="number"
              name="discount"
              value={productData.discount || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div> */}

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Net Weight
              </label>
              <input
                type="text"
                name="netWeight"
                value={productData.netWeight}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g. 500 gm"
              />
            </div>

            {/* Dimension */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Dimensions
              </label>
              <input
                type="text"
                name="dimension"
                value={productData.dimension}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g. 10x15x5 cm"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={productData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Describe your product..."
              />
            </div>

            {/* Admin Remarks */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Admin Remarks
              </label>
              <textarea
                name="adminRemarks"
                value={productData.adminRemarks}
                onChange={handleChange}
                rows="2"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter admin remarks (if any)"
              />
            </div>

            {/* Ready for Auction Checkbox */}
            <div className="md:col-span-2 flex items-center gap-3 bg-orange-50/50 p-4 rounded-xl border border-orange-100 mt-2">
              <input
                type="checkbox"
                name="isReadyForAuction"
                id="isReadyForAuction"
                checked={productData.isReadyForAuction}
                onChange={handleChange}
                className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500 cursor-pointer transition-all duration-200"
              />
              <div>
                <label
                  htmlFor="isReadyForAuction"
                  className="block text-gray-800 font-semibold cursor-pointer select-none text-base"
                >
                  Ready for Auction
                </label>
                <p className="text-gray-500 text-xs mt-0.5">
                  Check this box if you want this product to be available for auction immediately.
                </p>
              </div>
            </div>

            {/* Image Upload and Previews */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Product Images
              </label>
              {/*
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
              <p className="text-gray-500 text-sm mt-1">
                Only JPEG, JPG, and PNG formats are allowed.
              </p>
              */}
              {/* Image Previews */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
                {/* Existing Images */}
                {existingImages.map((img, idx) => (
                  <div key={`existing-${idx}`} className="relative group border border-gray-200 rounded-lg overflow-hidden bg-gray-50 aspect-square">
                    <img
                      src={typeof img === "object" ? (img.downloadUrl || img.imageUrl) : img}
                      alt={`Existing ${idx}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeExistingImage(idx)}
                        className="bg-white text-red-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-full shadow-lg transform hover:scale-110 transition-all"
                        title="Remove Image"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* New Uploads */}
                {images.map((file, idx) => (
                  <div key={`new-${idx}`} className="relative group border border-orange-200 rounded-lg overflow-hidden bg-orange-50 aspect-square">
                    <img src={URL.createObjectURL(file)} alt={`New ${idx}`} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">NEW</div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeNewImage(idx)}
                        className="bg-white text-red-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-full shadow-lg transform hover:scale-110 transition-all"
                        title="Remove Image"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Upload Input */}
              <label htmlFor="file-upload" className="block cursor-pointer group">
                <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg group-hover:border-orange-500 group-hover:bg-orange-50/50 transition-colors">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400 group-hover:text-orange-500 transition-colors"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600 justify-center">
                      <span className="relative font-medium text-orange-600 group-hover:text-orange-500">
                        Upload new images
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple accept="image/*" onChange={handleFileChange} />
                      </span>
                      <p className="pl-1 group-hover:text-gray-700">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 group-hover:text-gray-600">PNG, JPG, JPEG up to 10MB</p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
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
              className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-50 font-medium shadow-md hover:shadow-lg"
              disabled={loading || !hasChanges}
            >
              {loading ? "Updating..." : "Update Product"}
            </button>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        style={{ zIndex: 99999 }}
      />
    </div>
  );
};

export default EditProduct;
