import React from 'react'
import { GreenCheck } from '../../icons/icons'
import { useNavigate } from 'react-router-dom'

const SuccessScreen = ({ onCreateQRCode }) => {
    const navigate = useNavigate();
    const handleCreateQRCode = () => {
        console.log('Creating QR Code...')
        navigate('/qr-setup');
        // if (onCreateQRCode) {
        //     onCreateQRCode()
        // }
        // Navigate to QR code creation screen
    }

    return (
        <div className="flex flex-col justify-center h-[90vh]">
            {/* Main Content */}
            <div className="flex-1 flex flex-col justify-center items-center px-6">
                <div className="max-w-md mx-auto text-center">

                    {/* Success Icon */}
                    <div className="mb-8 flex justify-center">
                        <img src={GreenCheck} alt="Success" />
                    </div>

                    {/* Title */}
                    <h1 className="fs_48 outfit_medium text-black">You're all set!</h1>

                    {/* Subtitle */}
                    <p className="outfit fs_20 text-gray-600 mb-5 leading-relaxed">
                        Now, let's set up your first QR code to start receiving tips
                    </p>

                    {/* Create QR Code Button */}
                    <button
                        onClick={handleCreateQRCode}
                        className="primary_btn fs_16 w-full hover:bg-[var(--primary-dark)] transition-all"
                    >
                        Create QR Code
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SuccessScreen