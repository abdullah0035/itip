import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { RiMenuLine, RiTriangleFill } from '@remixicon/react'
import { useDispatch, useSelector } from 'react-redux'
import { setLogout } from '../../../redux/loginForm'
import { toast } from 'react-toastify'
import ApiFunction from '../../../../utils/api/apiFuntions'
import { decryptData } from '../../../../utils/api/encrypted'

const Header = ({ onToggleSidebar }) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()
  const { get } = ApiFunction()

  // Get token from Redux store
  const encryptedToken = useSelector(state => state.auth?.token)
  const token = useMemo(() => {
    return encryptedToken ? decryptData(encryptedToken) : null
  }, [encryptedToken])

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await get(`?action=getUserProfile&token=${encodeURIComponent(token)}`)
        
        if (response?.status === 'success') {
          setUserData(response.user_data)
        } else {
          console.error('Failed to fetch user profile:', response?.message)
          toast.error('Failed to load user profile')
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
        toast.error('An error occurred while loading user profile')
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen)
  }

  const handleLogout = () => {
    toast.success('Logout Successful')
    dispatch(setLogout())
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownOpen && !event.target.closest('.user-dropdown-container')) {
        setUserDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [userDropdownOpen])

  // Display name with fallback
  const displayName = userData?.full_name || userData?.first_name || 'User'
  const displayEmail = userData?.email || 'user@itip.com'

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
            <div className="flex items-center justify-center ms-3 relative user-dropdown-container">
              <button
                className="flex items-center text-sm rounded-full gap-3 mt-2"
                type="button"
                onClick={toggleUserDropdown}
                aria-expanded={userDropdownOpen}
                disabled={loading}
              >
                <img 
                  className="flex text-sm bg-gray-800 rounded-full focus:ring-4 w-8 h-8" 
                  src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" 
                  alt="userImage" 
                />
                <span className="fs_16 plus_Jakarta_Sans_semibold flex gap-3 items-center">
                  {loading ? (
                    <span className="animate-pulse bg-gray-300 h-4 w-20 rounded"></span>
                  ) : (
                    displayName
                  )}
                  <RiTriangleFill className="w-[10px] h-[10px] mt-[5px] text-[#6C7278] rotate-180"/>
                </span>
              </button>

              {/* User dropdown */}
              {userDropdownOpen && (
                <div className="absolute right-0 top-7 z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow">
                  <div className="px-4 py-3">
                    {loading ? (
                      <div className="animate-pulse">
                        <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-40"></div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-gray-900">{displayName}</p>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {displayEmail}
                        </p>
                        {userData?.balance_formatted && (
                          <p className="text-xs text-gray-600 mt-1">
                            Balance: {userData.balance_formatted}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                  <ul className="py-1">
                    <li>
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        Profile Settings
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/history"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        Transaction History
                      </Link>
                    </li>
                    <li>
                      <Link
                        to=""
                        onClick={handleLogout}
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