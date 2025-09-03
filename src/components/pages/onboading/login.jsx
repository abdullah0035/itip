/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { Logo } from '../../icons/icons'
import Input from '../../../utils/input'
import { RiEyeFill } from '@remixicon/react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import ApiFunction from '../../../utils/api/apiFuntions'
import { toast } from 'react-toastify'
import { setLogin, setLoginRedirect, setToken, setUserData } from '../../redux/loginForm'
import { encryptData } from '../../../utils/api/encrypted'

const Login = () => {
  const [loading, setLoading] = useState(false);
  // const navigate = useNavigate();
  const login = useSelector(state => state.auth.isLogin);
  const { post } = ApiFunction();
  const dispatch = useDispatch();
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  // Error state
  const [errors, setErrors] = useState({})

  // Handle input changes
  const handleInputChange = (value, fieldName) => {
    const field = fieldName.toLowerCase().replace(' ', '').replace('address', '')

    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  // Validate form using FormValidator
  const validateForm = () => {
    const newErrors = {}

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e?.preventDefault()

    if (!validateForm()) {
      return
    }

    const data = {
      action: 'login',
      email: formData.email,
      password: formData.password
    }

    setLoading(true); // Start loading

    try {
      await post('', data)
        .then(res => {
          console.log("the response of login api is", res);
          if (res?.status === 'success') {
            toast.success('Login Successfull');
            const token = encryptData(res?.token);
            const userData = encryptData(res?.user_data);
            dispatch(setLoginRedirect('/dashboard'));
            dispatch(setToken(token));
            dispatch(setUserData(userData));
            dispatch(setLogin(true));
          } else {
            if (res.message) {
              toast.error(res.message || 'Login failed');
            }
          }
        })
    } catch (error) {
      setErrors({
        submit: 'An error occurred. Please try again.'
      })
    } finally {
      setLoading(false); // Stop loading
    }
  }

  return (
    <>
      <img src={Logo} width={100} className='mx-auto' alt="" />

      <div className='mt-5 h-full'>
        <h1 className='fs_36 outfit_medium'>Login</h1>
        <h2 className='outfit mb-5 fs_20'>Login to your account</h2>

        <form onSubmit={handleSubmit}>
          <Input
            labels='Email Address'
            type='email'
            placeholder='Enter your email'
            icon=""
            onChange={handleInputChange}
            value={formData.email}
            name="email"
          />
          {errors.email && (
            <p className="text-red-500 fs_14 mt-1 mb-3">{errors?.email}</p>
          )}

          <Input
            labels='Password'
            type='password'
            placeholder='password'
            icon={<RiEyeFill className='text-[var(--icon)] fs_16' />}
            onChange={handleInputChange}
            value={formData.password}
            name="password"
          />
          {errors.password && (
            <p className="text-red-500 fs_14 mt-1 mb-3">{errors?.password}</p>
          )}

          <Link to='' className='float-right text-[var(--primary)] poppins_medium fs_14'>Forgot Password?</Link>

          <span className='block poppins_medium fs_14 text-center mt-10'>
            Already Registered as Customer?
            <Link to={'/customer-login'} className='text-[var(--primary)] poppins_medium ms-1'>Login</Link>
          </span>

          {/* Show auth error from hook or form submission error */}
          <button
            type="submit"
            className={`primary_btn mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <span className='block poppins_medium fs_14 text-center mt-10'>
          Don't Have an account?
          <Link to={'/get-started'} className='text-[var(--primary)]'> Create New</Link>
        </span>
      </div>
    </>
  )
}

export default Login