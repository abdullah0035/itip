import React, { useState } from 'react'
import { Logo } from '../../icons/icons'
import Input from '../../../utils/input'
import { useNavigate } from 'react-router-dom'

const GetStarted = ({ onContinue }) => {
  const [contactMethod, setContactMethod] = useState('phone') // 'phone' or 'email'
  const [contactValue, setContactValue] = useState('')
  const Navigate = useNavigate();
  const handleMethodToggle = (method) => {
    setContactMethod(method)
    setContactValue('') // Clear input when switching methods
  }

  // const handleInputChange = (e) => {
  //   setContactValue(e.target.value)
  // }

  const handleContinue = () => {
    Navigate('/verification');
    if (contactValue.trim()) {
      console.log(`Sending OTP to ${contactMethod}:`, contactValue)
      if (onContinue) {
        // onContinue({ method: contactMethod, value: contactValue })
      }
    }
  }

  // const isValidInput = contactValue.trim().length > 0

  return (
    <div className="flex flex-col bg-gray-50">
      {/* Logo */}
      <div className=" pb-4">
        <img src={Logo} width={100} className='mx-auto' alt="Logo" />
      </div>

      {/* Main Content */}
      <div className="flex-1 pt-6">
        <div className="max-w-md mx-auto">

          {/* Toggle Buttons */}
          <div className="flex bg-[var(--primary-light)] rounded-full p-[6px] mb-8">
            <button
              onClick={() => handleMethodToggle('phone')}
              className={`flex-1 py-2 px-4 rounded-full fs_17 transition-all ${contactMethod === 'phone'
                  ? 'bg-white text-gray-900 shadow-sm open_sans_bold'
                  : 'text-gray-600 hover:text-gray-900 open_sans'
                }`}
            >
              Phone
            </button>
            <button
              onClick={() => handleMethodToggle('email')}
              className={`flex-1 py-2 px-4 rounded-full fs_17 font-medium  transition-all ${contactMethod === 'email'
                  ? 'bg-white text-gray-900 shadow-sm open_sans_bold'
                  : 'text-gray-600 hover:text-gray-900 open_sans'
                }`}
            >
              Email
            </button>
          </div>

          {/* Title */}
          <h1 className="fs_40 outfit_medium">Get Started</h1>

          {/* Subtitle */}
          <p className="outfit fs_20 text-gray-600 mb-5">
            Enter email or phone number to send OTP code
          </p>

          {/* Input Field */}
          <Input labels={contactMethod === 'phone' ? "Enter Your number" : "Enter Email address"} placeholder={contactMethod === 'phone' ? 'Mobile number' : 'Email address'} type={contactMethod === 'phone' ? 'tel' : 'email'} />


          {/* Disclaimer Text */}
          <p className="text-gray-500 fs_14 mb-8 leading-relaxed">
            You will receive {contactMethod === 'phone' ? 'an SMS' : 'an email'} verification
            {contactMethod === 'phone' && ' that may apply message and data rates'}.
          </p>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            // disabled={!true}
            className={`primary_btn w-full transition-all ${!true
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-[var(--primary-dark)]'
              }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

export default GetStarted