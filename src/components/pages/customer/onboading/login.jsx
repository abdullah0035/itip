/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { RiEyeFill, RiInformationFill } from '@remixicon/react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Input from '../../../../utils/input'
import ApiFunction from '../../../../utils/api/apiFuntions'
import { encryptData } from '../../../../utils/api/encrypted'
import { setCustomerLogin, setLoginRedirect, setToken, setUserData } from '../../../redux/loginForm'
import { Logo } from '../../../icons/icons'

const CustomerLogin = () => {
    const [loading, setLoading] = useState(false);
    const [socialLoading, setSocialLoading] = useState({ google: false, facebook: false });
    const [fbInitialized, setFbInitialized] = useState(false); // Track FB initialization
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

    // Initialize Google and Facebook SDKs
    useEffect(() => {
        // Load Google SDK
        const loadGoogleSDK = () => {
            if (!window.google) {
                const script = document.createElement('script');
                script.src = 'https://accounts.google.com/gsi/client';
                script.async = true;
                script.defer = true;
                script.onload = initializeGoogle;
                document.head.appendChild(script);
            } else {
                initializeGoogle();
            }
        };

        // Load Facebook SDK
        const loadFacebookSDK = () => {
            if (!window.FB) {
                // Set up the async init function first
                window.fbAsyncInit = function () {
                    window.FB.init({
                        appId: '1005881088243062', // ⚠️ CRITICAL: Replace with your real Facebook App ID
                        cookie: true,
                        xfbml: true,
                        version: 'v18.0'
                    });

                    // Check login status and set initialized flag
                    window.FB.getLoginStatus(function (response) {
                        console.log('Facebook SDK initialized successfully');
                        setFbInitialized(true);
                    });
                };

                // Load the SDK script
                const script = document.createElement('script');
                script.async = true;
                script.defer = true;
                script.crossOrigin = 'anonymous';
                script.src = 'https://connect.facebook.net/en_US/sdk.js';
                script.onload = () => console.log('Facebook SDK script loaded');
                script.onerror = (error) => {
                    console.error('Failed to load Facebook SDK:', error);
                    toast.error('Failed to load Facebook SDK');
                };
                document.head.appendChild(script);
            } else {
                // FB already exists, check if it's initialized
                if (window.FB.getLoginStatus) {
                    setFbInitialized(true);
                }
            }
        };

        const initializeGoogle = () => {
            if (window.google) {
                window.google.accounts.id.initialize({
                    client_id: '85597160248-8723grf9u2qts0iimin2gjdj4c6j5q0e.apps.googleusercontent.com',
                    callback: handleGoogleLogin,
                });

                // Render Google button
                const googleButton = document.getElementById('google-login-button');
                if (googleButton) {
                    window.google.accounts.id.renderButton(googleButton, {
                        theme: 'outline',
                        size: 'large',
                        width: '100%',
                        text: 'signin_with',
                        shape: 'rectangular',
                        logo_alignment: 'left'
                    });
                }
            }
        };

        loadGoogleSDK();
        loadFacebookSDK();

        // Cleanup function
        return () => {
            // Optional: Clean up if needed
        };
    }, []);

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

    // Validate form
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

    // Handle regular customer login
    const handleSubmit = async (e) => {
        e?.preventDefault()

        if (!validateForm()) {
            return
        }

        const data = {
            action: 'customerLogin',
            email: formData.email,
            password: formData.password
        }

        setLoading(true);

        try {
            const res = await post('', data);
            console.log("Customer login response:", res);

            if (res?.status === 'success') {
                toast.success('Login Successful');
                const token = encryptData(res?.token);
                const userData = encryptData(res?.user_data);
                dispatch(setLoginRedirect('/customer-dashboard'));
                dispatch(setToken(token));
                dispatch(setUserData(userData));
                dispatch(setCustomerLogin(true));
            } else if (res?.status === 'error') {
                // Handle API error responses
                const errorMessage = res?.message || 'Login failed';

                if (errorMessage === "Invalid password") {
                    toast.error('Incorrect password. Please try again.');
                    setErrors({
                        password: 'Incorrect password'
                    });
                } else if (errorMessage === "Customer not found") {
                    toast.error('No account found with this email address.');
                    setErrors({
                        email: 'No account found with this email'
                    });
                } else if (res?.errors && Array.isArray(res.errors)) {
                    // Handle validation errors array
                    toast.error(res.errors[0] || errorMessage);
                    setErrors({
                        submit: res.errors.join(', ')
                    });
                } else {
                    toast.error(errorMessage);
                    setErrors({
                        submit: errorMessage
                    });
                }
            } else {
                // Handle unexpected response format
                toast.error("Unexpected response from server. Please try again.");
                setErrors({
                    submit: 'Unexpected response from server. Please try again.'
                });
            }
        } catch (error) {
            console.error('Customer login error:', error);

            // Check if error has response data (from HTTP error status like 401, 404, etc.)
            if (error?.response?.data) {
                const errorData = error.response.data;
                const errorMessage = errorData?.message || 'Login failed';

                if (errorMessage === "Invalid password") {
                    toast.error('Incorrect password. Please try again.');
                    setErrors({
                        password: 'Incorrect password'
                    });
                } else if (errorMessage === "Customer not found") {
                    toast.error('No account found with this email address.');
                    setErrors({
                        email: 'No account found with this email'
                    });
                } else if (errorData?.errors && Array.isArray(errorData.errors)) {
                    toast.error(errorData.errors[0] || errorMessage);
                    setErrors({
                        submit: errorData.errors.join(', ')
                    });
                } else {
                    toast.error(errorMessage);
                    setErrors({
                        submit: errorMessage
                    });
                }
            } else if (error?.message) {
                // Handle other error types
                if (error.message === "Invalid password") {
                    toast.error('Incorrect password. Please try again.');
                    setErrors({
                        password: 'Incorrect password'
                    });
                } else if (error.message === "Customer not found") {
                    toast.error('No account found with this email address.');
                    setErrors({
                        email: 'No account found with this email'
                    });
                } else {
                    toast.error(error.message);
                    setErrors({
                        submit: error.message
                    });
                }
            } else {
                // Fallback for unknown errors
                toast.error('An error occurred. Please try again.');
                setErrors({
                    submit: 'An error occurred. Please try again.'
                });
            }
        } finally {
            setLoading(false);
        }
    }

    // Handle Google Login
    const handleGoogleLogin = async (response) => {
        setSocialLoading(prev => ({ ...prev, google: true }));

        try {
            const data = {
                action: 'customerGoogleLogin',
                credential: response.credential
            };

            await post('', data)
                .then(res => {
                    console.log("Google login response:", res);
                    if (res?.status === 'success') {
                        toast.success('login successful');
                        const token = encryptData(res?.token);
                        const userData = encryptData(res?.user_data);
                        dispatch(setLoginRedirect('/customer-dashboard'));
                        dispatch(setToken(token));
                        dispatch(setUserData(userData));
                        dispatch(setCustomerLogin(true));
                    } else {
                        toast.error(res.message || 'Google login failed');
                    }
                });
        } catch (error) {
            console.error('Google login error:', error);
            toast.error('Google login failed. Please try again.');
        } finally {
            setSocialLoading(prev => ({ ...prev, google: false }));
        }
    };

    // Enhanced Facebook Login Handler
    const handleFacebookLogin = () => {
        console.log('Facebook login button clicked');
        console.log('FB SDK available:', !!window.FB);
        console.log('FB initialized:', fbInitialized);

        // Check if Facebook SDK is loaded and initialized
        if (!window.FB) {
            console.error('Facebook SDK not loaded');
            toast.error('Facebook SDK not loaded. Please refresh the page and try again.');
            return;
        }

        if (!fbInitialized) {
            console.error('Facebook SDK not initialized');
            toast.error('Facebook is still initializing. Please wait a moment and try again.');
            return;
        }

        setSocialLoading(prev => ({ ...prev, facebook: true }));

        try {
            // First check current login status
            window.FB.getLoginStatus((statusResponse) => {
                console.log('Current FB login status:', statusResponse);

                if (statusResponse.status === 'connected') {
                    // User is already logged in, get their info
                    getFacebookUserInfo(statusResponse.authResponse);
                } else {
                    // User needs to log in
                    window.FB.login((loginResponse) => {
                        console.log('FB login response:', loginResponse);

                        if (loginResponse.authResponse) {
                            console.log('Facebook login successful');
                            getFacebookUserInfo(loginResponse.authResponse);
                        } else {
                            console.log('Facebook login cancelled or failed');
                            setSocialLoading(prev => ({ ...prev, facebook: false }));

                            if (loginResponse.status === 'not_authorized') {
                                toast.error('Please authorize the app to continue with Facebook login.');
                            } else if (loginResponse.status === 'unknown') {
                                toast.error('Facebook login failed. Please try again.');
                            }
                        }
                    }, {
                        scope: 'email,public_profile',
                        return_scopes: true
                    });
                }
            });
        } catch (error) {
            console.error('Facebook login error:', error);
            toast.error('Facebook login failed. Please try again.');
            setSocialLoading(prev => ({ ...prev, facebook: false }));
        }
    };

    // Helper function to get Facebook user info and process login
    const getFacebookUserInfo = (authResponse) => {
        window.FB.api('/me', { fields: 'id,name,email,first_name,last_name,picture.width(200).height(200)' }, async (userInfo) => {
            console.log('Facebook user info:', userInfo);

            try {
                const data = {
                    action: 'customerFacebookLogin',
                    facebook_id: userInfo.id,
                    access_token: authResponse.accessToken,
                    email: userInfo.email,
                    first_name: userInfo.first_name,
                    last_name: userInfo.last_name,
                    name: userInfo.name,
                    picture: userInfo.picture?.data?.url
                };

                await post('', data)
                    .then(res => {
                        console.log("Facebook login response:", res);
                        if (res?.status === 'success') {
                            toast.success('Facebook login successful');
                            const token = encryptData(res?.token);
                            const userData = encryptData(res?.user_data);
                            dispatch(setLoginRedirect('/customer-dashboard'));
                            dispatch(setToken(token));
                            dispatch(setUserData(userData));
                            dispatch(setCustomerLogin(true));
                        } else {
                            toast.error(res.message || 'Facebook login failed');
                        }
                    });
            } catch (error) {
                console.error('Facebook login API error:', error);
                toast.error('Facebook login failed. Please try again.');
            } finally {
                setSocialLoading(prev => ({ ...prev, facebook: false }));
            }
        });
    };

    return (
        <>
            <img src={Logo} width={100} className='mx-auto' alt="" />

            <div className='mt-5 h-full'>
                <h1 className='fs_36 outfit_medium'>Customer Login</h1>
                <h2 className='outfit mb-5 fs_20'>Login to give tips easily</h2>

                

                {/* Regular Login Form */}
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
                    {errors?.email && (
                        <p className="text-red-500 fs_14 mt-1 mb-3 flex items-center gap-[10px">{errors?.email} <RiInformationFill className='w-[16px]' /></p>
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
                    {errors?.password && (
                        <p className="text-red-500 fs_14 mt-1 mb-3 flex items-center gap-[10px]">{errors?.password } <RiInformationFill className='w-[16px]' /></p>
                    )}

                    <Link to='' className='float-right text-[var(--primary)] poppins_medium fs_14'>Forgot Password?</Link>

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
                    <Link to={'/customer-register'} className='text-[var(--primary)]'> Create New</Link>
                </span>

{/* Divider */}
                <div className="flex items-center my-6">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <div className="px-4 text-sm text-gray-500 bg-white">or</div>
                    <div className="flex-1 border-t border-gray-300"></div>
                </div>
                <div className="social-login my-6">
                    <div className="mb-3">
                        <div id="google-login-button" className="w-full min-h-[44px] flex items-center justify-center rounded-lg">
                        </div>
                    </div>

                    <button
                        onClick={handleFacebookLogin}
                        disabled={socialLoading.facebook || !fbInitialized}
                        className={`w-full bg-[#0866FF] hover:bg-[#166FE5] text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 ${socialLoading?.facebook || !fbInitialized ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        {socialLoading?.facebook ? 'Signing in...' :
                            !fbInitialized ? 'Loading Facebook...' :
                                'Continue with Facebook'}
                    </button>
                </div>

                <div className="text-center mt-4">
                    <Link to={'/login'} className='text-sm text-gray-600 hover:text-[var(--primary)]'>
                        Are you a service provider? <Link to={'/'} className='text-[var(--primary)] poppins_bold'>Login here</Link>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default CustomerLogin