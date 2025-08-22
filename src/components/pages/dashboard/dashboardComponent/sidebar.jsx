import React from 'react'
import { 
  RiDashboardLine, 
  RiLayoutGridLine, 
  RiInboxLine, 
  RiGroupLine, 
  RiShoppingBagLine, 
  RiLoginBoxLine, 
  RiUserAddLine
} from '@remixicon/react'

const Sidebar = ({ 
  isOpen, 
  onClose,
  sidebarItems = [
    { name: 'Dashboard', icon: RiDashboardLine, href: '#' },
    { name: 'Kanban', icon: RiLayoutGridLine, href: '#', badge: 'Pro' },
    { name: 'Inbox', icon: RiInboxLine, href: '#', badge: '3', badgeColor: 'blue' },
    { name: 'Users', icon: RiGroupLine, href: '#' },
    { name: 'Products', icon: RiShoppingBagLine, href: '#' },
    { name: 'Sign In', icon: RiLoginBoxLine, href: '#' },
    { name: 'Sign Up', icon: RiUserAddLine, href: '#' },
  ]
}) => {

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-white border-r border-gray-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } sm:translate-x-0`}
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white">
          <ul className="space-y-2 font-medium">
            {sidebarItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href}
                  className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
                >
                  <item.icon className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" />
                  <span className="flex-1 ms-3 whitespace-nowrap">{item.name}</span>
                  
                  {/* Badges */}
                  {item.badge && (
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
                </a>
              </li>
            ))}
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