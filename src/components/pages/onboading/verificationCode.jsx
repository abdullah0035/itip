import React, { useState, useRef, useEffect } from 'react'
import { Logo } from '../../icons/icons'
import { useNavigate } from 'react-router-dom'

const VerificationCode = ({ email = "random@gmail.com" }) => {
  const navigate = useNavigate()
  
  // Form state
  const [code, setCode] = useState(['', '', '', '', ''])
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  
  const inputRefs = useRef([])

  // Initialize input refs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 5)
  }, [])

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [resendTimer])

  // Clear errors when user starts typing
  const clearErrors = () => {
    if (Object.keys(errors).length > 0) {
      setErrors({})
    }
  }

  const handleInputChange = (index, value) => {
    // Only allow single digit
    if (value.length > 1) return
    
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return

    clearErrors()

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
    if (e.key === 'Backspace') {
      if (!code[index] && index > 0) {
        // Move to previous input if current is empty
        inputRefs.current[index - 1]?.focus()
      } else {
        // Clear current input
        const newCode = [...code]
        newCode[index] = ''
        setCode(newCode)
        clearErrors()
      }
    }
    
    // Handle arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowRight' && index < 4) {
      inputRefs.current[index + 1]?.focus()
    }
    
    // Handle Enter key
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 5)
    
    if (pastedData.length > 0) {
      const newCode = [...code]
      for (let i = 0; i < 5; i++) {
        newCode[i] = pastedData[i] || ''
      }
      setCode(newCode)
      
      // Focus appropriate input
      const focusIndex = Math.min(pastedData.length, 4)
      inputRefs.current[focusIndex]?.focus()
      
      clearErrors()
    }
  }

  // Validate code
  const validateCode = () => {
    const enteredCode = code.join('')
    const newErrors = {}
    
    if (enteredCode.length !== 5) {
      newErrors.code = 'Please enter the complete 5-digit code'
      setErrors(newErrors)
      return false
    }
    
    if (!/^\d{5}$/.test(enteredCode)) {
      newErrors.code = 'Code must contain only numbers'
      setErrors(newErrors)
      return false
    }
    
    return true
  }

  // Handle code submission
  const handleSubmit = async () => {
    if (!validateCode()) {
      return
    }
    
    setIsLoading(true)
    
    try {
      const enteredCode = code.join('')
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Here you would typically verify the code with your backend
      console.log('Verifying code:', enteredCode)
      
      // Simulate code verification
      if (enteredCode === '12345') {
        // Demo: accept 12345 as valid code
        navigate('/signup')
      } else if (enteredCode === '00000') {
        // Demo: accept 00000 as valid code (as set in original)
        navigate('/signup')
      } else {
        // Invalid code
        setErrors({
          code: 'Invalid verification code. Please try again.'
        })
        // Clear the code
        setCode(['', '', '', '', ''])
        inputRefs.current[0]?.focus()
      }
      
    } catch (error) {
      console.error('Verification error:', error)
      setErrors({
        code: error.message || 'Verification failed. Please try again.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle resend code
  const handleResendCode = async () => {
    if (!canResend) return
    
    setIsLoading(true)
    clearErrors()
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('Resending code to:', email)
      
      // Reset timer and state
      setResendTimer(60)
      setCanResend(false)
      setCode(['', '', '', '', ''])
      
      // Show success message briefly
      setErrors({
        success: 'Verification code sent successfully!'
      })
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setErrors({})
      }, 3000)
      
      // Focus first input
      inputRefs.current[0]?.focus()
      
    } catch (error) {
      console.error('Resend error:', error)
      setErrors({
        resend: error.message || 'Failed to resend code. Please try again.'
      })
    } finally {
      setIsLoading(false)
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
          <h1 className="fs_40 text-start outfit_medium text-black">Enter 5-digit code</h1>
          
          {/* Subtitle */}
          <p className="outfit fs_16 text-gray-600 mb-8 max-w-[450px]">
            Enter 5-digit code we just texted to your email {displayContact}
          </p>

          {/* Code Input Boxes */}
          <div className="flex gap-3 mb-4 justify-center">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`w-14 h-14 text-center text-xl font-medium border-2 rounded-lg focus:outline-none transition-colors ${
                  errors.code 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:border-[var(--primary)]'
                }`}
                maxLength="1"
                inputMode="numeric"
                pattern="[0-9]*"
                disabled={isLoading}
              />
            ))}
          </div>
          
          {/* Error Messages */}
          {errors.code && (
            <p className="text-red-500 fs_14 text-center mb-4">{errors.code}</p>
          )}
          
          {errors.success && (
            <p className="text-green-500 fs_14 text-center mb-4">{errors.success}</p>
          )}
          
          {errors.resend && (
            <p className="text-red-500 fs_14 text-center mb-4">{errors.resend}</p>
          )}

          {/* Resend Code */}
          <div className="text-start mb-8">
            <button
              onClick={handleResendCode}
              disabled={!canResend || isLoading}
              className={`fs_16 poppins_medium transition-colors ${
                !canResend || isLoading
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-[var(--primary)] hover:text-[var(--primary-dark)] cursor-pointer'
              }`}
            >
              {isLoading && !canResend ? 'Sending...' : 'Resend Code'} 
              {!canResend && !isLoading && ` (${resendTimer}s)`}
            </button>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleSubmit}
            disabled={!isCodeComplete || isLoading}
            className={`primary_btn w-full transition-all ${
              !isCodeComplete || isLoading
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-[var(--primary-dark)]'
            }`}
          >
            {isLoading ? 'Verifying...' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default VerificationCode