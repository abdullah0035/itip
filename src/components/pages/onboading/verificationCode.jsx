import React, { useState, useRef, useEffect } from 'react'
import { Logo } from '../../icons/icons'
import { useNavigate } from 'react-router-dom'

const VerificationCode = ({ email = "random@gmail.com" }) => {
  const [code, setCode] = useState(['0', '0', '0', '0', '0']) // Set to 00000 for testing
  const [resendTimer, setResendTimer] = useState(60)
  const inputRefs = useRef([])
  const navigate = useNavigate();
  // Initialize input refs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 5)
  }, [])

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  const handleInputChange = (index, value) => {
    // Only allow single digit
    if (value.length > 1) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Auto-focus next input if value entered
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    
    // Handle arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowRight' && index < 4) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 5)
    if (/^\d+$/.test(pastedData)) {
      const newCode = pastedData.split('').concat(Array(5).fill('')).slice(0, 5)
      setCode(newCode)
      // Focus last filled input or first empty one
      const focusIndex = Math.min(pastedData.length, 4)
      inputRefs.current[focusIndex]?.focus()
    }
  }

  const handleResendCode = () => {
    if (resendTimer === 0) {
      setResendTimer(60)
      // Here you would typically call your resend code API
      console.log('Resending code...')
    }
  }

  const handleContinue = () => {
    const enteredCode = code.join('')
    console.log('Entered code:', enteredCode)
    // Here you would validate the code
    if (enteredCode.length === 5) {
      console.log('Code is complete:', enteredCode)
      navigate('/signup');

      // Proceed with verification
    }
  }

  const isCodeComplete = code.every(digit => digit !== '')
  const displayContact = email

  return (
    <div className="flex flex-col">
      {/* Logo */}
      <div className="">
        <img src={Logo} width={100} className='mx-auto' alt="Logo" />
      </div>

      {/* Main Content */}
      <div className="flex-1 pt-8">
        <div className="w-full mx-auto">
          {/* Title */}
          <h1 className="fs_40 text-start outfit_medium text-black ">Enter 5-digit code</h1>
          
          {/* Subtitle */}
          <p className="outfit fs_16 text-gray-600 mb-8 max-w-[450px]">
            Enter 5-digit code we just texted to your email {displayContact}
          </p>

          {/* Code Input Boxes */}
          <div className="flex gap-3 mb-8 justify-center">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-14 h-14 text-center text-xl font-medium border-2 border-gray-300 rounded-lg focus:border-[var(--primary)] focus:outline-none transition-colors"
                maxLength="1"
                inputMode="numeric"
                pattern="[0-9]*"
              />
            ))}
          </div>

          {/* Resend Code */}
          <div className="text-start mb-8">
            <button
              onClick={handleResendCode}
              disabled={resendTimer > 0}
              className={`fs_16 poppins_medium transition-colors ${
                resendTimer > 0 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-[var(--primary)] hover:text-[var(--primary-dark)] cursor-pointer'
              }`}
            >
              Resend Code {resendTimer > 0 && `${resendTimer}s`}
            </button>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={!isCodeComplete}
            className={`primary_btn w-full transition-all ${
              !isCodeComplete 
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

export default VerificationCode