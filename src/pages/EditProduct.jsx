import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productControllers } from "../api/product";
import { toast } from "react-toastify";
import { categoryControllers } from "../api/category";
import { X } from "lucide-react";
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
    patternUsed: "",
    quantity: "",
    material: "",
    discount: "",
    netWeight: "",
    dimension: "",
    color: "",
    size: "",
  });

  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
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

        if (p.admin_approval_status === "APPROVED") {
          toast.error("Approved products cannot be edited!");
          navigate(`/product-details/${id}`);
          return;
        }

        // Helper to find the correct ID for the dropdown
        const resolveId = (val, list) => {
          if (!val) return "";

          let lookupValue = val;

          // If it's an object, prefer category_id if available, otherwise use _id for lookup
          if (typeof val === "object") {
            if (val.category_id) return val.category_id;
            lookupValue = val._id || val.id;
          }

          // 1. Try to find by category_id (exact match)
          const matchByCatId = list.find((c) => c.category_id == lookupValue);
          if (matchByCatId) return matchByCatId.category_id;

          // 2. Try to find by _id (match ObjectId)
          const matchByObjId = list.find((c) => c._id == lookupValue || c.id == lookupValue);
          if (matchByObjId) return matchByObjId.category_id;

          // 3. If it was a string and we didn't find it, maybe it IS the category_id (even if not in list?)
          if (typeof val !== "object") return val;

          return "";
        };

        const catId = resolveId(p.categoryId, cats);

        let subCats = [];
        let subCatId = "";

        if (catId) {
          try {
            const res2 = await categoryControllers.getSubCategory(catId);
            subCats = (res2.data?.data?.docs || []).filter(
              (item) => item.type === "Sub-Category"
            );
            setSubCategories(subCats);

            subCatId = resolveId(p.subCategoryId, subCats);
          } catch (err) {
            console.log("SubCategory Fetch Error");
          }
        } else {

          if (typeof p.subCategoryId === "object") {
            subCatId = p.subCategoryId.category_id || "";
          }
        }

        console.log("Fetched Product:", p);

        setProductData({
          product_name: p.product_name || "",
          description: p.description || "",
          categoryId: catId || "",
          subCategoryId: subCatId || "",
          productPricePerPiece: p.productPricePerPiece || "",
          adminRemarks: p.adminRemarks || p.admin_remarks || "",
          timeToMake: p.timeToMake || "",
          texture: p.texture || "",
          patternUsed: p.patternUsed || "",
          quantity: p.quantity || "",
          material: p.material || "",
          discount: p.discount || "",
          netWeight: p.netWeight || "",
          dimension: p.dimension || "",
          color: p.color || "",
          size: p.size || "",
        });

      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to load product data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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
        (item) => item.type === "Sub-Category"
      );

      setSubCategories(onlySubs);
    } catch (err) {
      console.log("SubCategory Fetch Error");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      Object.keys(productData).forEach((key) => {
        formData.append(key, productData[key]);
      });

      images.forEach((file) => {
        formData.append("images", file);
      });

      await productControllers.updateProduct(id, formData);

      toast.success("Product Updated Successfully!");
      navigate(`/product-details/${id}`);
    } catch (err) {
      toast.error("Failed to update product!");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-6 text-center">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 ml-64 pt-20">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-xl">
        <div className="flex justify-between mb-4">
          <h2 className="text-3xl font-bold text-gray-800">Edit Product</h2>

          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* PRODUCT NAME */}
          <div>
            <label className="font-medium">Product Name</label>
            <input
              type="text"
              name="product_name"
              value={productData.product_name || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          {/* CATEGORY */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-medium">Category *</label>
              <select
                name="categoryId"
                value={productData.categoryId || ""}
                onChange={handleCategoryChange}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-medium">SubCategory *</label>
              <select
                name="subCategoryId"
                value={productData.subCategoryId || ""}
                onChange={handleChange}

                disabled={!subCategories.length}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">Select SubCategory</option>
                {subCategories.map((sub) => (
                  <option key={sub.category_id} value={sub.category_id}>
                    {sub.category_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* PRICE + STOCK */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-medium">Price Per Piece</label>
              <input
                type="number"
                name="productPricePerPiece"
                value={productData.productPricePerPiece || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="font-medium">Stock Quantity</label>
              <input
                type="number"
                name="quantity"
                value={productData.quantity || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>

          {/* TEXT FIELDS */}
          <div>
            <label className="font-medium">Time To Make (days)</label>
            <input
              type="number"
              name="timeToMake"
              value={productData.timeToMake || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="font-medium">Texture</label>
            <input
              type="text"
              name="texture"
              value={productData.texture || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="font-medium">Pattern Used</label>
            <input
              type="text"
              name="patternUsed"
              value={productData.patternUsed || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="font-medium">Material</label>
            <input
              type="text"
              name="material"
              value={productData.material || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="font-medium">Color</label>
            <input
              type="text"
              name="color"
              value={productData.color || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="font-medium">Size</label>
            <input
              type="text"
              name="size"
              value={productData.size || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="font-medium">Discount (%)</label>
            <input
              type="number"
              name="discount"
              value={productData.discount || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* LONG FIELDS */}
          <div>
            <label className="font-medium">Description</label>
            <textarea
              name="description"
              rows="3"
              value={productData.description || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            ></textarea>
          </div>

          <div>
            <label className="font-medium">Admin Remarks</label>
            <textarea
              name="adminRemarks"
              rows="2"
              value={productData.adminRemarks || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            ></textarea>
          </div>

          {/* IMAGES */}
          <div>
            <label className="font-medium">Upload New Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setImages([...e.target.files])}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700"
          >
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
