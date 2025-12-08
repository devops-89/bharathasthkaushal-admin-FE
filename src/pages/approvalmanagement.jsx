import React, { useState } from "react";
import {
  Eye,
  Check,
  X,
  Clock,
  User,
  Tag,
  Calendar,
  IndianRupee,
  ArrowLeft,
  Mail,
  Package,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
const ApprovalManagement = () => {
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [currentView, setCurrentView] = useState("list");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [compensationPercentage, setCompensationPercentage] = useState(0);
  const [pendingApprovals, setPendingApprovals] = useState([
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
  ]);

  const handleApprove = (id) => {
    setPendingApprovals((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Approved" } : item
      )
    );
    alert("Product approved successfully!");
  };

  const handleReject = (id) => {
    const reason = prompt("Please provide a reason for rejection:");
    if (reason) {
      setPendingApprovals((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status: "Rejected", rejectionReason: reason }
            : item
        )
      );
      alert("Product rejected successfully!");
    }
  };
  const navigate = useNavigate();
  const handleViewDetails = (product) => {
    navigate(`/approval-management-details/${product.id}`);
  };
  const handleBackToList = () => {
    setCurrentView("list");
    setSelectedProduct(null);
    setCompensationPercentage(0);
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

  const filteredApprovals = pendingApprovals.filter((item) => {
    const statusMatch =
      statusFilter === "All Status" || item.status === statusFilter;
    const categoryMatch =
      categoryFilter === "All Categories" || item.category === categoryFilter;
    return statusMatch && categoryMatch;
  });
  if (currentView === "details" && selectedProduct) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <DetailView product={selectedProduct} />
      </div>
    );
  }

  // Main list view
  return (
    <div className="p-6 bg-gray-50 min-h-screen ml-64 pt-24  flex-1">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold leading-normal bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
            Approval Management
          </h1>
          <nav className="flex items-center space-x-2 text-sm text-orange-600 mt-2">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? "text-orange-600 font-semibold" : ""
              }
            >
              Dashboard
            </NavLink>

            <span>•</span>
            <NavLink
              to="/approval-management"
              className={({ isActive }) =>
                isActive ? "text-orange-600 font-semibold" : ""
              }
            >
              Approval Management
            </NavLink>
          </nav>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-xl font-bold text-gray-800">
                {
                  pendingApprovals.filter((item) => item.status === "Pending")
                    .length
                }
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Under Review</p>
              <p className="text-xl font-bold text-gray-800">
                {
                  pendingApprovals.filter(
                    (item) => item.status === "Under Review"
                  ).length
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Check size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Approved</p>
              <p className="text-xl font-bold text-gray-800">
                {
                  pendingApprovals.filter((item) => item.status === "Approved")
                    .length
                }
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <X size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Rejected</p>
              <p className="text-xl font-bold text-gray-800">
                {
                  pendingApprovals.filter((item) => item.status === "Rejected")
                    .length
                }
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Filters section */}
      <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <label className="font-medium text-gray-700">Category:</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option>All Categories</option>
              <option>Handloom</option>
              <option>Handicraft</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-medium text-gray-700">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option>All Status</option>
              <option>Pending</option>
              <option>Under Review</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-medium text-gray-600">
                  PRODUCT DETAILS
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  ARTISANS
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  CATEGORY
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  TOTAL PRICE
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  SUBMITTED
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  STATUS
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredApprovals.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-800 mb-1">
                          {item.productName}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {item.description.substring(0, 80)}...
                        </p>
                      </div>
                      <button
                        onClick={() => handleViewDetails(item)}
                        className="ml-3 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex-shrink-0"
                        title="View Full Details"
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-800">
                          {item.artisans.length} Artisans
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.artisans
                          .slice(0, 2)
                          .map((artisan) => artisan.name)
                          .join(", ")}
                        {item.artisans.length > 2 &&
                          ` +${item.artisans.length - 2} more`}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <span className="text-gray-800">{item.category}</span>
                      <p className="text-sm text-gray-500">
                        {item.subcategory}
                      </p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <IndianRupee size={16} className="text-gray-600" />
                      <span className="font-medium text-gray-800">
                        {item.totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span className="text-gray-600">
                        {item.submittedDate}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default ApprovalManagement;
