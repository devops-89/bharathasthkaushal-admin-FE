import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Home,
  Users,
  Package,
  Grid,
  Gavel,
  //ThumbsUp,
  User2Icon,
  CreditCard,
  Lock,
  HelpCircle,
  UserCheck,
} from 'lucide-react'
const Wrapper = () => {
  const location = useLocation()
  const menuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: Home },
    { path: '/artisans', name: 'Artisans', icon: Users },
    { path: '/product-management', name: 'Product Management', icon: Package },
    { path: '/category-management', name: 'Category Management', icon: Grid },
    { path: '/auction-management', name: 'Auction Management', icon: Gavel },
    // {path:'/approval-management', name:'Approval Management', icon:ThumbsUp},
    { path: '/employee-management', name: 'Employee Management', icon: User2Icon },
    { path: '/payment-management', name: 'Payment Management', icon: CreditCard },
    { path: '/permission-management', name: 'Permission Management', icon: Lock },
    { path: '/user-management', name: 'User Management', icon: UserCheck },
    { path: '/need-assistant', name: 'Need Assistant', icon: HelpCircle },
  ]

  const isActive = (path) => {
    return location.pathname === path || (path === '/dashboard' && location.pathname === '/')
  }
  return (
    <aside className="fixed left-0 top-16 w-64 bg-gray-800 h-screen z-40 overflow-y-auto">
      <nav className="mt-6">
        <div className="px-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-3 text-sm font-medium leading-relaxed rounded-lg transition-colors duration-200 ${isActive(item.path)
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}

              </Link>
            )
          })}
        </div>
      </nav>
    </aside>
  )
}
export default Wrapper