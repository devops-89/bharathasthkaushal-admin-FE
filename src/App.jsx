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
import ApprovalManagementDetails from "./pages/approval-management-details";
import Subcategory from "./pages/sub-category";
import NeedAssistant from "./pages/need-assistant";
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const [show, setShow] = useState(false);
  useEffect(() => {
    
    if (location.pathname === "/") {
      setShow(false);
    } else {
      setShow(true);
    }
  }, [location.pathname]);
  return (
    <div className="">
      {show && <Wrapper />}
      {show && <Header />}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/artisans" element={<Artisans />} />
        <Route path="/product-management" element={<ProductManagement />} />
        <Route
          path="/product-management/add-product"
          element={<AddProduct />}
        />
        <Route 
        path="/product-management/product-details/:id"
        element={<ProductDetails/>} 
        />
        <Route path="/category-management" element={<CategoryManagement />} />
        <Route path="/auction-management" element={<AuctionManagement />} />
        <Route path="/approval-management" element={<ApprovalManagement />} />
        <Route
          path="/approval-management-details/:id"
          element={<ApprovalManagementDetails />}
        />
        <Route path="/employee-management" element={<EmployeeManagement />} />
        <Route path="/payment-management" element={<PaymentManagement />} />
        <Route 
          path="/permission-management"
          element={<PermissionManagement />}
        />
        <Route
          path="/category-management/sub-category/:id"
          element={<Subcategory/>}
        />
        <Route path="/categories/:page/:pageSize/:id" element={<CategoryManagement/>} />
        <Route 
          path="/need-assistant"
          element={<NeedAssistant/>}
        />
      </Routes>
      
    </div>
  );
}
export default App;
