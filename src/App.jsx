import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import LoginPage from "./components/LoginPage";
import Wrapper from "./components/Wrapper";
import Dashboard from "./pages/Dashboard";
import ApprovalManagement from "./pages/approvalmanagement";
import Artisans from "./pages/artisans";
import AuctionManagement from "./pages/auction-management";
import CategoryManagement from "./pages/category-management";
import EmployeeManagement from "./pages/employee-management";
import PaymentManagement from "./pages/payment-management";
import PermissionManagement from "./pages/permission-management";
import ProductManagement from "./pages/product-management";
import AddProduct from "./pages/product-management/add-product";
import ProductDetails from "./pages/product-management/product-details";
import EditProduct from "./pages/EditProduct";
import Buildstate from "./components/EditBuildStepModal";
//import ApprovalManagementDetails from "./pages/approval-management-details";
import Subcategory from "./pages/sub-category";
import NeedAssistant from "./pages/need-assistant";
import UserManagement from "./pages/user-management";
import UserProfile from "./pages/user-profile";
import Profile from "./pages/Profile";
import WarehouseManagement from "./pages/warehouse-management";
import WarehouseDetails from "./pages/warehouse-details";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const [show, setShow] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  useEffect(() => {
    if (location.pathname === "/" || location.pathname === "/login" || location.pathname === "/forgot-password" || location.pathname === "/reset-password") {
      setShow(false);
    } else {
      setShow(true);
    }
  }, [location.pathname]);
  return (
    <div className="">
      <ToastContainer position="top-right" autoClose={2500} style={{ zIndex: 9999999 }} />
      {show && <Wrapper isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />}
      {show && <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/artisans" element={<Artisans />} />
        <Route path="/product-management" element={<ProductManagement />} />
        <Route
          path="/product-management/add-product"
          element={<AddProduct />}
        />
        <Route path="/edit-product/:id" element={<EditProduct />} />

        <Route
          path="/product-management/product-details/:id"
          element={<ProductDetails />}
        />
        <Route path="/category-management" element={<CategoryManagement />} />
        <Route path="/auction-management" element={<AuctionManagement />} />
        {/* <Route path="/approval-management" element={<ApprovalManagement />} />
        <Route
          path="/approval-management-details/:id"
          element={<ApprovalManagementDetails />}
        /> */}
        <Route path="/employee-management" element={<EmployeeManagement />} />
        <Route path="/payment-management" element={<PaymentManagement />} />
        <Route
          path="/permission-management"
          element={<PermissionManagement />}
        />
        <Route
          path="/category-management/sub-category/:id"
          element={<Subcategory />}
        />
        <Route path="/categories/:page/:pageSize/:id" element={<CategoryManagement />} />
        <Route
          path="/user-management"
          element={<UserManagement />}
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/user-profile/:id" element={<UserProfile />} />
        <Route path="/edit-build-step/:id" element={<Buildstate />} />
        <Route
          path="/need-assistant"
          element={<NeedAssistant />}
        />
        <Route path="/warehouse-management" element={<WarehouseManagement />} />
        <Route path="/warehouse-management/details/:id" element={<WarehouseDetails />} />
      </Routes>
    </div>
  );
}
export default App;
