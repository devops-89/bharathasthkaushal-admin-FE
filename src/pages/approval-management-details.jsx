import React, { useState } from "react";
import {
  ArrowLeft,
  Check,
  X,
  User,
  Mail,
  Calendar,
  IndianRupee,
  Package
} from "lucide-react";

const ApprovalManagementDetails = () => {
  const [compensationPercentage, setCompensationPercentage] = useState(0);
  
  // Mock navigation function for demo
  const handleNavigateBack = () => {
    alert("Navigating back to approval management list");
  };

  // Get product ID from URL - for demo, we'll use ID 1
  const productId = 1;

  // Mock data - same as in ApprovalManagement component
  const pendingApprovals = [
    {
      id: 1,
      productName: "Madhubani Painting Canvas",
      category: "Handloom",
      subcategory: "Folk Art",
      totalPrice: 4500,
      description:
        "Traditional Madhubani painting on canvas featuring peacock motifs with intricate designs and vibrant colors. This artwork represents the rich cultural heritage of Bihar and showcases the traditional painting techniques passed down through generations.",
      submittedDate: "2025-08-12",
      status: "Pending",
      imageUrl:
        "https://media.istockphoto.com/id/1919424781/photo/handmade-painting-on-wooden-canvas.jpg?s=1024x1024&w=is&k=20&c=rH7FZVepIgMFdd5CnokHbNPLleLI53OZ_S9_AsFoIJ8=",
      dimensions: "18x24 inches",
      materials: "Canvas, Natural pigments",
      weight: "0.5 kg",
      artisans: [
        {
          id: 1,
          name: "Sunita Devi",
          contact: "sunita.devi@email.com",
          role: "Main Artist",
          priceBreakdown: {
            materialCost: 400,
            laborCost: 800,
            processingFee: 150,
            platformFee: 100,
            logisticCost: 50,
            taxes: 50,
          },
          totalCost: 1550,
        },
        {
          id: 2,
          name: "Rajesh Kumar",
          contact: "rajesh.kumar@email.com",
          role: "Color Specialist",
          priceBreakdown: {
            materialCost: 200,
            laborCost: 600,
            processingFee: 100,
            platformFee: 75,
            logisticCost: 25,
            taxes: 50,
          },
          totalCost: 1050,
        },
        {
          id: 3,
          name: "Priya Sharma",
          contact: "priya.sharma@email.com",
          role: "Border Designer",
          priceBreakdown: {
            materialCost: 300,
            laborCost: 700,
            processingFee: 120,
            platformFee: 80,
            logisticCost: 30,
            taxes: 70,
          },
          totalCost: 1300,
        },
      ],
    },
    {
      id: 2,
      productName: "Bamboo Basket Set",
      category: "Handicraft",
      subcategory: "Bamboo Craft",
      totalPrice: 2400,
      description:
        "Handwoven bamboo basket set of 3 pieces for storage, made from eco-friendly materials. Perfect for home organization and storage needs while supporting sustainable craftsmanship.",
      submittedDate: "2025-08-11",
      status: "Pending",
      imageUrl:
        "https://media.istockphoto.com/id/1346661870/photo/baskets-traditional-handicraft-products.jpg?s=1024x1024&w=is&k=20&c=fwKRe388gQfT5usL-wLVp9mFufgHs0EedQyaxT_0z3Y=",
      dimensions: "Large: 12x8 inches, Medium: 10x6 inches, Small: 8x4 inches",
      materials: "Natural bamboo, Eco-friendly finish",
      weight: "1.2 kg",
      artisans: [
        {
          id: 1,
          name: "Ravi Sharma",
          contact: "ravi.sharma@email.com",
          role: "Basket Weaver",
          priceBreakdown: {
            materialCost: 200,
            laborCost: 400,
            processingFee: 80,
            platformFee: 60,
            logisticCost: 40,
            taxes: 40,
          },
          totalCost: 820,
        },
        {
          id: 2,
          name: "Mohan Das",
          contact: "mohan.das@email.com",
          role: "Handle Specialist",
          priceBreakdown: {
            materialCost: 150,
            laborCost: 350,
            processingFee: 70,
            platformFee: 50,
            logisticCost: 30,
            taxes: 30,
          },
          totalCost: 680,
        },
        {
          id: 3,
          name: "Asha Kumari",
          contact: "asha.kumari@email.com",
          role: "Finishing Expert",
          priceBreakdown: {
            materialCost: 180,
            laborCost: 380,
            processingFee: 75,
            platformFee: 55,
            logisticCost: 35,
            taxes: 35,
          },
          totalCost: 760,
        },
      ],
    },
    {
      id: 3,
      productName: "Silk Dupatta",
      category: "Handloom",
      subcategory: "Silk Weaving",
      totalPrice: 6600,
      description:
        "Pure silk dupatta with traditional block print designs and golden borders. Handcrafted using traditional weaving techniques with premium quality silk threads.",
      submittedDate: "2025-08-10",
      status: "Under Review",
      imageUrl:
        "https://media.istockphoto.com/id/1809746228/vector/ikat-floral-pattern-tulips-flower-embroidery-on-white-background-flower-motif-seamless-ikat.jpg?s=1024x1024&w=is&k=20&c=gLB9ZfLleMGyxVoYMxMcHKU8IHnEJF6naQkocg9D9f0=",
      dimensions: "2.5 meters length",
      materials: "Pure silk, Natural dyes",
      weight: "0.3 kg",
      artisans: [
        {
          id: 1,
          name: "Meera Gupta",
          contact: "meera.gupta@email.com",
          role: "Silk Weaver",
          priceBreakdown: {
            materialCost: 1000,
            laborCost: 900,
            processingFee: 150,
            platformFee: 100,
            logisticCost: 50,
            taxes: 50,
          },
          totalCost: 2250,
        },
        {
          id: 2,
          name: "Kavita Singh",
          contact: "kavita.singh@email.com",
          role: "Block Print Artist",
          priceBreakdown: {
            materialCost: 500,
            laborCost: 800,
            processingFee: 120,
            platformFee: 80,
            logisticCost: 40,
            taxes: 60,
          },
          totalCost: 1600,
        },
        {
          id: 3,
          name: "Deepak Jain",
          contact: "deepak.jain@email.com",
          role: "Gold Border Specialist",
          priceBreakdown: {
            materialCost: 800,
            laborCost: 1000,
            processingFee: 180,
            platformFee: 120,
            logisticCost: 60,
            taxes: 90,
          },
          totalCost: 2250,
        },
      ],
    },
    {
      id: 4,
      productName: "Clay Pottery Vase",
      category: "Handicraft",
      subcategory: "Pottery",
      totalPrice: 1950,
      description:
        "Handcrafted clay vase with traditional motifs and earthy finish. Made using traditional pottery techniques with natural clay and fired in traditional kilns.",
      submittedDate: "2025-08-13",
      status: "Pending",
      imageUrl:
        "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&h=400&fit=crop&auto=format",
      dimensions: "Height: 12 inches, Diameter: 6 inches",
      materials: "Natural clay, Organic glaze",
      weight: "2.0 kg",
      artisans: [
        {
          id: 1,
          name: "Amit Patel",
          contact: "amit.patel@email.com",
          role: "Potter",
          priceBreakdown: {
            materialCost: 150,
            laborCost: 350,
            processingFee: 65,
            platformFee: 50,
            logisticCost: 25,
            taxes: 35,
          },
          totalCost: 675,
        },
        {
          id: 2,
          name: "Suman Devi",
          contact: "suman.devi@email.com",
          role: "Design Artist",
          priceBreakdown: {
            materialCost: 100,
            laborCost: 300,
            processingFee: 55,
            platformFee: 40,
            logisticCost: 20,
            taxes: 30,
          },
          totalCost: 545,
        },
        {
          id: 3,
          name: "Ramesh Singh",
          contact: "ramesh.singh@email.com",
          role: "Glazing Expert",
          priceBreakdown: {
            materialCost: 120,
            laborCost: 280,
            processingFee: 60,
            platformFee: 45,
            logisticCost: 22,
            taxes: 33,
          },
          totalCost: 560,
        },
      ],
    },
  ];

  // ID ke basis pe product find karna
  const product = pendingApprovals.find((item) => item.id === productId);

  if (!product) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen ml-64 pt-20 flex-1">
        <div className="text-center py-10">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-600">Product not found!</h2>
          <button
            onClick={handleNavigateBack}
            className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Back to List
          </button>
        </div>
      </div>
    );
  }

  const handleApprove = () => {
    alert("Product approved successfully!");
    // In real app: navigate("/approval-management");
  };

  const handleReject = () => {
    const reason = prompt("Please provide a reason for rejection:");
    if (reason) {
      alert(`Product rejected: ${reason}`);
      // In real app: navigate("/approval-management");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Under Review":
        return "bg-blue-100 text-blue-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen ml-64 pt-20 flex-1">
      {/* Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleNavigateBack}
          className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 rounded-lg transition-colors shadow-sm border"
        >
          <ArrowLeft size={16} />
          Back to List
        </button>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
            {product.productName}
          </h1>
          <p className="text-gray-600">Product Details & Approval</p>
        </div>
      </div>

      {/* Product Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Image and Basic Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.productName}
              className="w-full h-96 object-cover"
            />
          </div>
          
          {/* Product Specifications */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Specifications</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Dimensions:</span>
                <span className="font-medium text-gray-800">{product.dimensions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Materials:</span>
                <span className="font-medium text-gray-800">{product.materials}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Weight:</span>
                <span className="font-medium text-gray-800">{product.weight}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Category:</span>
                <span className="font-medium text-gray-800">{product.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Subcategory:</span>
                <span className="font-medium text-gray-800">{product.subcategory}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Details and Actions */}
        <div className="space-y-6">
          {/* Status and Price */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                  product.status
                )}`}
              >
                {product.status}
              </span>
              <span className="text-3xl font-bold text-gray-800 flex items-center gap-1">
                <IndianRupee size={24} />
                {product.totalPrice.toLocaleString()}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600 mb-4">
              <Calendar size={16} />
              <span>Submitted on {product.submittedDate}</span>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Artisan Details */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Artisan Details</h3>
            <div className="space-y-4">
              {product.artisans.map((artisan) => (
                <div key={artisan.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <User size={16} className="text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">{artisan.name}</h4>
                        <p className="text-sm text-gray-600">{artisan.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800 flex items-center gap-1">
                        <IndianRupee size={14} />
                        {artisan.totalCost.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail size={14} />
                    <span>{artisan.contact}</span>
                  </div>
                  
                  {/* Price Breakdown */}
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Cost Breakdown:</h5>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Material:</span>
                        <span className="font-medium">₹{artisan.priceBreakdown.materialCost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Labor:</span>
                        <span className="font-medium">₹{artisan.priceBreakdown.laborCost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Processing:</span>
                        <span className="font-medium">₹{artisan.priceBreakdown.processingFee}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Platform:</span>
                        <span className="font-medium">₹{artisan.priceBreakdown.platformFee}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Logistics:</span>
                        <span className="font-medium">₹{artisan.priceBreakdown.logisticCost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Taxes:</span>
                        <span className="font-medium">₹{artisan.priceBreakdown.taxes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          {(product.status === "Pending" || product.status === "Under Review") && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Actions</h3>
              <div className="flex gap-3">
                <button
                  onClick={handleApprove}
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <Check size={20} />
                  Approve Product
                </button>
                <button
                  onClick={handleReject}
                  className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <X size={20} />
                  Reject Product
                </button>
              </div>
            </div>
          )}

          {/* Compensation Adjustment (if needed) */}
          {product.status === "Under Review" && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Compensation Adjustment</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Compensation Percentage
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={compensationPercentage}
                      onChange={(e) => setCompensationPercentage(e.target.value)}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium text-gray-800 min-w-[40px]">
                      {compensationPercentage}%
                    </span>
                  </div>
                </div>
                {compensationPercentage > 0 && (
                  <div className="text-sm text-gray-600">
                    Additional compensation: ₹{Math.round((product.totalPrice * compensationPercentage) / 100).toLocaleString()}
                  </div>
                )}
              </div>
            </div> 
          )}
        </div>
      </div>
    </div>
  );
};

export default ApprovalManagementDetails;