import React, { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { Logo } from '../../icons/icons'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { decryptData } from '../../../utils/api/encrypted'
import ApiFunction from '../../../utils/api/apiFuntions'
import { toast } from 'react-toastify'

// Note: Install QR code library with: npm install qrcode
// Also install types if using TypeScript: npm install @types/qrcode

const Home = ({ qrData }) => {
  const [qrCodeDataURL, setQrCodeDataURL] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [qrCodes, setQrCodes] = useState([])
  const [error, setError] = useState('')
  
  const navigate = useNavigate()
  const { get } = ApiFunction()
  
  // Get encrypted token from Redux store
  const encryptedToken = useSelector(state => state?.auth?.token)
  const token = decryptData(encryptedToken)

  const handleGoToDashboard = () => {
    console.log('Navigating to dashboard...')
    navigate('/dashboard')
  }

  const handleGenerateQRCode = () => {
    console.log('Navigating to QR setup...')
    navigate('/qr-setup')
  }

  // Fetch user's QR codes from API
  const fetchUserQRCodes = async () => {
    if (!token) {
      setError('Authentication required')
      setIsLoading(false)
      navigate('/')
      return
    }

    try {
      setIsLoading(true)
      setError('')
      const formData = {
        action: 'getUserQRCodes',
        token: token
      }
      const response = await get(``, formData)

      if (response?.status === 'success') {
        setQrCodes(response.qr_codes || [])
        
        // If QR codes exist, generate QR code for the first one
        if (response.qr_codes && response.qr_codes.length > 0) {
          const firstQRCode = response.qr_codes[0]
          await generateQRCodeImage(firstQRCode.qr_string || firstQRCode.qr_token)
        }
      } else {
        setError(response?.message || 'Failed to fetch QR codes')
        toast.error(response?.message || 'Failed to fetch QR codes')
      }
    } catch (error) {
      console.error('Error fetching QR codes:', error)
      const errorMessage = error.message || 'Failed to load QR codes'
      setError(errorMessage)
      toast.error(errorMessage)
      
      // If unauthorized, redirect to login
      if (error.response?.status === 403 || errorMessage.includes('Unauthorized')) {
        toast.error('Session expired. Please log in again.')
        navigate('/')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Generate QR code image from QR string
  const generateQRCodeImage = async (qrString) => {
    try {
      // Use the QR string from API or fallback to provided qrData
      const qrText = qrString || (qrData ? JSON.stringify(qrData) : 'https://itip.app/tip/default')
      
      // Generate QR code as data URL
      const dataURL = await QRCode.toDataURL(qrText, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      
      setQrCodeDataURL(dataURL)
    } catch (error) {
      console.error('Error generating QR code:', error)
      // Fallback to a simple QR code
      try {
        const fallbackDataURL = await QRCode.toDataURL('https://itip.app', {
          width: 256,
          margin: 2
        })
        setQrCodeDataURL(fallbackDataURL)
      } catch (fallbackError) {
        console.error('Fallback QR code generation failed:', fallbackError)
      }
    }
  }

  // Fetch QR codes when component mounts
  useEffect(() => {
    fetchUserQRCodes()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  // Skeleton Loader Component
  const SkeletonLoader = () => (
    <div className="w-64 h-64 mx-auto rounded-lg animate-pulse bg-gray-200 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)] mx-auto mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-24 mx-auto"></div>
      </div>
    </div>
  )

  // Determine what to show based on QR codes availability
  const hasQRCodes = qrCodes.length > 0
  const titleText = hasQRCodes ? 'Your QR Code' : 'No QR Code Yet'
  const subtitleText = hasQRCodes 
    ? 'Here is your active QR code for receiving tips. Share it with your customers!'
    : 'You haven\'t created any QR codes yet. Create your first QR code to start receiving tips.'

  return (
    <div className="">
      {/* Logo */}
      <div className=" pb-10">
        <img src={Logo} width={100} className='mx-auto' alt="Logo" />
      </div>

      {/* Main Content */}
      <div className="h-[80vh] flex flex-col justify-center items-center">
        <div className="max-w-md mx-auto text-center">
          
          {/* Title */}
          <h1 className="fs_40 outfit_bold text-black">{titleText}</h1>
          
          {/* Subtitle */}
          <p className="outfit fs_18 text-gray-600 mb-1 leading-relaxed">
            {subtitleText}
          </p>

          {/* QR Code Container or Skeleton */}
          <div className="mb-2 flex justify-center">
            <div className="p-6 rounded-2xl">
              {isLoading ? (
                <SkeletonLoader />
              ) : hasQRCodes && qrCodeDataURL ? (
                <img 
                  src={qrCodeDataURL} 
                  alt="QR Code for iTIP" 
                  className="w-64 h-64 mx-auto"
                />
              ) : hasQRCodes && !qrCodeDataURL ? (
                <div className="w-64 h-64 mx-auto flex items-center justify-center bg-gray-100 rounded-lg">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)] mx-auto mb-2"></div>
                    <p className="text-gray-500 fs_14">Generating QR Code...</p>
                  </div>
                </div>
              ) : (
                 <SkeletonLoader />
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {hasQRCodes ? (
            /* Go To Dashboard Button */
            <button
              onClick={handleGoToDashboard}
              className="primary_btn w-full hover:bg-[var(--primary-dark)] transition-all"
              disabled={isLoading}
            >
              Go To Dashboard
            </button>
          ) : (
            /* Generate QR Code Button */
            <button
              onClick={handleGenerateQRCode}
              className="primary_btn w-full hover:bg-[var(--primary-dark)] transition-all"
              disabled={isLoading}
            >
              Generate QR Code
            </button>
          )}

          {/* Error Message */}
          {error && !isLoading && (
            <p className="text-red-500 fs_14 mt-4 text-center">{error}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home