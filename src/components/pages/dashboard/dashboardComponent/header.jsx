import React, { useState } from 'react'
import { RiMenuLine } from '@remixicon/react'

const Header = ({ onToggleSidebar, user = { name: 'Neil Sims', email: 'neil.sims@itip.com' } }) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen)
  }

  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            {/* Mobile menu button */}
            <button
              onClick={onToggleSidebar}
              type="button"
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <span className="sr-only">Open sidebar</span>
              <RiMenuLine className="w-6 h-6" />
            </button>

            {/* Logo */}
            <a href="#" className="flex ms-2 md:me-24">
              <img 
                src="https://flowbite.com/docs/images/logo.svg" 
                className="h-8 me-3" 
                alt="iTIP Logo" 
              />
              <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap">
                iTIP
              </span>
            </a>
          </div>

          {/* User menu */}
          <div className="flex items-center">
            <div className="flex items-center ms-3 relative">
              <button
                type="button"
                onClick={toggleUserDropdown}
                className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300"
                aria-expanded={userDropdownOpen}
              >
                <span className="sr-only">Open user menu</span>
                <img 
                  className="w-8 h-8 rounded-full" 
                  src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" 
                  alt="user photo" 
                />
              </button>

              {/* User dropdown */}
              {userDropdownOpen && (
                <div className="absolute right-0 top-10 z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow">
                  <div className="px-4 py-3">
                    <p className="text-sm text-gray-900">{user.name}</p>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.email}
                    </p>
                  </div>
                  <ul className="py-1">
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Dashboard
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Settings
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Earnings
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Header