import React, { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { Logo } from '../../icons/icons'
import { useNavigate } from 'react-router-dom'

// Note: Install QR code library with: npm install qrcode
// Also install types if using TypeScript: npm install @types/qrcode

const Home = ({ qrData }) => {
  const [qrCodeDataURL, setQrCodeDataURL] = useState('')
  const navigate = useNavigate();
  const handleGoToDashboard = () => {
    console.log('Navigating to dashboard...')
    navigate('/dashboard')
  }

  // Generate QR code when component mounts or qrData changes
  useEffect(() => {
    const generateQRCode = async () => {
      try {
        // Create QR code data based on the provided data
        const qrText = qrData ? JSON.stringify(qrData) : 'https://itip.app/tip/default'
        
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

    generateQRCode()
  }, [qrData])

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
          <h1 className="fs_40 outfit_bold text-black">QR Code</h1>
          
          {/* Subtitle */}
          <p className="outfit fs_18 text-gray-600 mb-1 leading-relaxed">
            Welcome to iTIP! Now let's set up your first QR Code to start receiving tips.
          </p>

          {/* QR Code Container */}
          <div className="mb-2 flex justify-center">
            <div className="p-6 rounded-2xl">
              {qrCodeDataURL ? (
                <img 
                  src={qrCodeDataURL} 
                  alt="QR Code for iTIP" 
                  className="w-64 h-64 mx-auto"
                />
              ) : (
                <div className="w-64 h-64 mx-auto flex items-center justify-center bg-gray-100 rounded-lg">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)] mx-auto mb-2"></div>
                    <p className="text-gray-500 fs_14">Generating QR Code...</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Go To Dashboard Button */}
          <button
            onClick={handleGoToDashboard}
            className="primary_btn w-full hover:bg-[var(--primary-dark)] transition-all"
          >
            Go To Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home