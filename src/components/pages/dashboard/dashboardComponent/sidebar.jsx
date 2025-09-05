import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  RiDashboardLine
} from '@remixicon/react'
import {  LogoWhite } from '../../../icons/icons'

const Sidebar = ({ 
  isOpen, 
  onClose,
  sidebarItems = [
    { name: 'Dashboard', icon: RiDashboardLine, href: '/' },
  ]
}) => {
  const location = useLocation()

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 pt-5 transition-transform bg-[var(--primary)] border-r border-gray-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } sm:translate-x-0`}
      >
        <div className="h-full pb-4 overflow-y-auto bg-transparent overflow-x-hidden">
          {/* Logo */}
          <Link to="/" className="flex items-center justify-center pb-8 ms-2 w-full">
            <img src={LogoWhite} width={80} alt="" />
          </Link>
          <ul className="space-y-2 font-medium">
            {sidebarItems?.map((item, index) => {
              const isActive = location.pathname === item?.href
              
              return (
                <li key={index}>
                  <Link
                    to={item?.href}
                    className={`flex ps-5 items-center p-2 text-gray-900 group border-white ${
                      isActive 
                        ? 'bg-[#5893A2] border-r-4' 
                        : 'hover:bg-[#5893A2] hover:border-r-4'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 transition duration-75 ${
                      isActive 
                        ? 'text-[var(--white)]' 
                        : 'text-[var(--icon)] group-hover:text-[var(--white)]'
                    }`} />
                    <span className={`flex-1 ms-3 whitespace-nowrap ${
                      isActive 
                        ? 'text-[var(--white)]' 
                        : 'text-[#C8C8C8] group-hover:text-[var(--white)]'
                    }`}>
                      {item?.name}
                    </span>
                    
                    {/* Badges */}
                    {item?.badge && (
                      <span
                        className={`inline-flex items-center justify-center px-2 ms-3 text-sm font-medium rounded-full ${
                          item.badgeColor === 'blue'
                            ? 'text-blue-800 bg-blue-100 w-3 h-3 p-3'
                            : 'text-gray-800 bg-gray-100'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 sm:hidden"
          onClick={onClose}
        />
      )}
    </>
  )
}

export default Sidebar