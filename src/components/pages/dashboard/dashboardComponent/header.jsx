import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { RiArrowDownFill, RiMenuLine, RiTriangleFill } from '@remixicon/react'

const Header = ({ onToggleSidebar, user = { name: 'Neil Sims', email: 'neil.sims@itip.com' } }) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen)
  }

  return (
    <nav className="fixed top-0 h-[70px] z-40 w-full bg-white border-b border-gray-200">
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
          </div>

          {/* User menu */}
          <div className="flex items-center">
            <div className="flex items-center justify-center ms-3 relative">
              <button
              className="flex items-center text-sm rounded-full gap-3 mt-2"
                type="button"
                onClick={toggleUserDropdown}
                aria-expanded={userDropdownOpen}
              >
                <img 
                  className="flex text-sm bg-gray-800 rounded-full focus:ring-4 w-8 h-8 " 
                  src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" 
                  alt="userImage" 
                />
                <span className="fs_16 plus_Jakarta_Sans_semibold flex gap-3 items-center">Alexandro <RiTriangleFill className="w-[10px] h-[10px] mt-[5px] text-[#6C7278] rotate-180"/></span>
                
              </button>

              {/* User dropdown */}
              {userDropdownOpen && (
                <div className="absolute right-0 top-7 z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow">
                  <div className="px-4 py-3">
                    <p className="text-sm text-gray-900">{user.name}</p>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.email}
                    </p>
                  </div>
                  <ul className="py-1">
                    <li>
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Dashboard
                      </Link>
                    </li>
                    {/* <li>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Settings
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/earnings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Earnings
                      </Link>
                    </li> */}
                    <li>
                      <Link
                        to="/signout"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </Link>
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