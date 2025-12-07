import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Home,
  Users,
  Package,
  Grid,
  Gavel,
  User2Icon,
  CreditCard,
  Lock,
  HelpCircle,
  UserCheck,
  Warehouse,
} from 'lucide-react'

const Wrapper = ({ isOpen, toggleSidebar }) => {
  const location = useLocation()
  // ... (menuItems remain same, I will not repeat them if possible, but I must provide full replacement for the block I target)

  // To avoid repeating large menuItems array, I will target the component definition start and return statement separately if I can, but replace_file_content replaces a block.
  // I will just replace the whole functional component body start and return.

  const menuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: Home },
    { path: '/artisans', name: 'Artisans', icon: Users },
    { path: '/product-management', name: 'Product Management', icon: Package },
    { path: '/category-management', name: 'Category Management', icon: Grid },
    { path: '/auction-management', name: 'Auction Management', icon: Gavel },
    { path: '/warehouse-management', name: 'Warehouse Management', icon: Warehouse },
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
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside className={`
        fixed left-0 top-16 w-64 bg-gray-800 h-[calc(100vh-4rem)] z-40 overflow-y-auto
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        <nav className="mt-6 pb-10">
          <div className="px-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      toggleSidebar()
                    }
                  }}
                  className={`flex items-center px-3 py-3 text-sm font-medium leading-relaxed rounded-lg transition-colors duration-200 whitespace-nowrap ${isActive(item.path)
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
    </>
  )
}
export default Wrapper