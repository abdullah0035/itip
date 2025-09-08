/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import QRCode from 'qrcode'
import ApiFunction from '../../../utils/api/apiFuntions'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { decryptData } from '../../../utils/api/encrypted'
import axios from 'axios'
import { setCheckoutData } from '../../redux/loginForm'

const Checkout = () => {
    const { qrToken } = useParams();
    const [searchParams] = useSearchParams();
    const { post } = ApiFunction()

    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [qrData, setQrData] = useState(null)
    const [qrCodeUrl, setQrCodeUrl] = useState('')
    const [errors, setErrors] = useState({})

    // Payment status states
    const [paymentStatus, setPaymentStatus] = useState(null) // 'success', 'failed', 'pending', null
    const [paymentData, setPaymentData] = useState(null)

    const encryptedToken = useSelector(state => state?.auth?.token)
    const token = decryptData(encryptedToken)

    const [formData, setFormData] = useState({
        name: '',
        profession: '',
        amount: '',
        message: '',
        paymentMethod: 'card',
        title: ''
    })

    // Check for payment response in URL parameters
    useEffect(() => {
        const checkPaymentResponse = () => {
            const allParams = Object.fromEntries(searchParams.entries());
            console.log('URL Parameters:', allParams);

            // Check for common payment response parameters
            const status = searchParams.get('status') || searchParams.get('payment_status');
            const transactionId = searchParams.get('transaction_id') || searchParams.get('txn_id');
            const amount = searchParams.get('amount');
            const paymentId = searchParams.get('payment_id') || searchParams.get('invoice_id');

            if (status || transactionId) {
                console.log('Payment response detected:', { status, transactionId, amount, paymentId });

                setPaymentData({
                    status,
                    transactionId,
                    amount,
                    paymentId,
                    allParams
                });

                // Determine payment status
                if (status?.toLowerCase() === 'success' || status?.toLowerCase() === 'completed' || status?.toLowerCase() === 'paid') {
                    setPaymentStatus('success');
                    toast.success('Payment completed successfully!');
                } else if (status?.toLowerCase() === 'failed' || status?.toLowerCase() === 'cancelled' || status?.toLowerCase() === 'error') {
                    setPaymentStatus('failed');
                    toast.error('Payment failed or was cancelled.');
                } else if (status?.toLowerCase() === 'pending') {
                    setPaymentStatus('pending');
                    toast.info('Payment is being processed...');
                }

                // Update backend with payment status
                updatePaymentStatus(transactionId, status);
            }
        };

        checkPaymentResponse();
    }, [searchParams]);

    const updatePaymentStatus = async (transactionId, status) => {
        try {
            const response = await post('', {
                action: 'updatePaymentStatus',
                transaction_id: transactionId,
                payment_status: status,
                qr_token: qrToken
            });
            console.log('Payment status updated:', response);
        } catch (error) {
            console.error('Error updating payment status:', error);
        }
    };

    // Generate QR code when qrData is available
    useEffect(() => {
        if (qrData?.qr_string) {
            generateQRCode(qrData.qr_string)
        }
    }, [qrData])

    const generateQRCode = async (qrString) => {
        try {
            const url = await QRCode.toDataURL(qrString, {
                width: 160,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            })
            setQrCodeUrl(url)
        } catch (error) {
            console.error('Error generating QR code:', error)
        }
    }

    // Load QR code details
    useEffect(() => {
        if (qrToken) {
            loadQRDetails()
        } else {
            console.log("the qr-code token is", qrToken);
        }
    }, [qrToken])

    const loadQRDetails = async () => {
        try {
            setLoading(true)
            const response = await post('', {
                action: 'getQRDetails',
                qr_token: qrToken
            })

            if (response?.status === 'success') {
                setQrData(response.qr_data)
                // Set initial amount - now always editable
                setFormData(prev => ({ ...prev, amount: response.qr_data.tip_amount?.toString() || '' }))
            } else {
                toast.error(response?.message || 'QR code not found')
            }
        } catch (error) {
            console.error('Error loading QR details:', error)
            toast.error('Failed to load QR code details')
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (field, value) => {
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

    const validateForm = () => {
        const newErrors = {}

        if (!formData?.name?.trim()) {
            newErrors.name = 'Name is required'
        }

        if (!formData?.profession?.trim()) {
            newErrors.profession = 'Profession is required'
        }

        if (!formData?.amount || parseFloat(formData?.amount) <= 0) {
            newErrors.amount = 'Please enter a valid tip amount'
        }

        if (!formData?.message?.trim()) {
            newErrors.message = 'Message is required'
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (qrData?.title) {
            formData['title'] = qrData?.title;
        }
    }, [qrData])

    const handlePayment = async (id) => {
        try {
            const data = {
                amount: parseFloat(formData?.amount),
                currency: "AED",
                payment_type: "one_time",
                is_test: true,
                success_url: id
                    ? `https://itip-nine.vercel.app/success/${id}`
                    : "https://itip-nine.vercel.app/",

                failure_url: id
                    ? `https://itip-nine.vercel.app/failed/${id}`
                    : "https://itip-nine.vercel.app/",

                description: formData?.title
            };

            const response = await axios.post('https://portal.ivmsgroup.com/payment/create-invoice', data, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-KEY': 'test_api_key_123456789'
                },
                timeout: 10000
            });

            console.log(response)
            if (response?.data?.status === 'success') {
                if (response.data?.data?.payment_link) {
                    window.location.href = response.data?.data?.payment_link;
                }
            }

        } catch (error) {
            console.error('Payment error:', error);

            if (error.response) {
                console.error('Error response:', error.response.data);
                console.error('Error status:', error.response.status);
            } else if (error.request) {
                console.error('Network error:', error.request);
            } else {
                console.error('Error:', error.message);
            }
        } finally {
            console.log('Payment request completed');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            toast.error('Please fill all required fields')
            return
        }

        setSubmitting(true)

        try {
            const response = await post('', {
                action: 'processTip',
                customer_token: token ?? "",
                qr_token: qrToken,
                name: formData?.name?.trim(),
                profession: formData?.profession?.trim(),
                amount: parseFloat(formData?.amount),
                message: formData?.message?.trim(),
            })

            if (response?.status === 'success') {
                dispatch(setCheckoutData(response?.tip_data));
                const tipId = response?.tip_data?.tip_id;
                handlePayment(tipId);
                setErrors({})

            } else {
                toast.error(response?.message || 'Failed to process tip')
            }
        } catch (error) {
            console.error('Error processing tip:', error)
            toast.error('An error occurred while processing your tip')
        } finally {
            setSubmitting(false)
        }
    }

    const resetPaymentStatus = () => {
        setPaymentStatus(null);
        setPaymentData(null);
        // Clear URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
    };

    const startNewPayment = () => {
        resetPaymentStatus();
        setFormData({
            name: '',
            profession: '',
            amount: qrData?.tip_amount?.toString() || '',
            message: '',
            paymentMethod: 'card',
            title: qrData?.title || ''
        });
    };

    // Payment Success Component
    const PaymentSuccess = () => (
        <div className="text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">
                Your tip of ${paymentData?.amount || formData.amount} has been processed successfully.
            </p>

            {paymentData?.transactionId && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <p className="text-sm text-gray-600">Transaction ID:</p>
                    <p className="font-mono text-sm">{paymentData.transactionId}</p>
                </div>
            )}

            <div className="space-y-3">
                <button
                    onClick={startNewPayment}
                    className="w-full bg-[#2C6B6F] text-white py-3 rounded-lg hover:bg-[#245559] transition-colors"
                >
                    Send Another Tip
                </button>
                <button
                    onClick={() => navigate('/')}
                    className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Return to Home
                </button>
            </div>
        </div>
    );

    // Payment Failed Component
    const PaymentFailed = () => (
        <div className="text-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Failed</h2>
            <p className="text-gray-600 mb-6">
                Your payment could not be processed. Please try again or contact support if the issue persists.
            </p>

            <div className="space-y-3">
                <button
                    onClick={resetPaymentStatus}
                    className="w-full bg-[#2C6B6F] text-white py-3 rounded-lg hover:bg-[#245559] transition-colors"
                >
                    Try Again
                </button>
                <button
                    onClick={() => navigate('/')}
                    className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Return to Home
                </button>
            </div>
        </div>
    );

    // Payment Pending Component
    const PaymentPending = () => (
        <div className="text-center">
            <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-yellow-500 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Processing</h2>
            <p className="text-gray-600 mb-6">
                Your payment is being processed. This may take a few minutes.
            </p>

            {paymentData?.transactionId && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <p className="text-sm text-gray-600">Transaction ID:</p>
                    <p className="font-mono text-sm">{paymentData.transactionId}</p>
                </div>
            )}

            <div className="space-y-3">
                <button
                    onClick={() => window.location.reload()}
                    className="w-full bg-[#2C6B6F] text-white py-3 rounded-lg hover:bg-[#245559] transition-colors"
                >
                    Refresh Status
                </button>
                <button
                    onClick={() => navigate('/')}
                    className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Return to Home
                </button>
            </div>
        </div>
    );

    // Skeleton components
    const SkeletonQR = () => (
        <div className="flex flex-col items-center mb-8 animate-pulse">
            <div className="w-48 h-48 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
    )

    const SkeletonForm = () => (
        <div className="space-y-6 animate-pulse">
            {[...Array(6)].map((_, i) => (
                <div key={i}>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                </div>
            ))}
            <div className="h-12 bg-gray-200 rounded"></div>
        </div>
    )

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4">
                <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
                    <SkeletonQR />
                    <SkeletonForm />
                </div>
            </div>
        )
    }

    if (!qrData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">QR Code Not Found</h2>
                    <p className="text-gray-600 mb-6">The QR code you're looking for doesn't exist or has been disabled.</p>
                    <button
                        onClick={() => window.history.back()}
                        className="bg-[#2C6B6F] text-white px-6 py-2 rounded-lg hover:bg-[#245559] transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
                {/* Show payment status components or normal form */}
                {paymentStatus === 'success' ? (
                    <PaymentSuccess />
                ) : paymentStatus === 'failed' ? (
                    <PaymentFailed />
                ) : paymentStatus === 'pending' ? (
                    <PaymentPending />
                ) : (
                    <>
                        {/* QR Code Display */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="w-48 h-48 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center mb-4">
                                <div className="w-40 h-40 bg-black bg-opacity-10 rounded flex items-center justify-center">
                                    {qrCodeUrl ? (
                                        <img
                                            src={qrCodeUrl}
                                            alt="QR Code"
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <span className="text-6xl">⧈</span>
                                    )}
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
                                {qrData?.title}
                            </h2>
                            <p className="text-gray-600 text-center">
                                {qrData.description || 'Leave a tip'}
                            </p>
                        </div>

                        {/* Tip Form */}
                        <div className="space-y-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Your Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C6B6F] focus:border-transparent outline-none transition-all"
                                    placeholder="Enter your name"
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                            </div>

                            {/* Profession */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Profession *
                                </label>
                                <input
                                    type="text"
                                    value={formData.profession}
                                    onChange={(e) => handleInputChange('profession', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C6B6F] focus:border-transparent outline-none transition-all"
                                    placeholder="e.g., Customer, Driver, etc."
                                />
                                {errors.profession && <p className="text-red-500 text-sm mt-1">{errors.profession}</p>}
                            </div>

                            {/* Amount */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tip Amount *
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3 text-gray-500">$</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        value={formData.amount}
                                        onChange={(e) => handleInputChange('amount', e.target.value)}
                                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C6B6F] focus:border-transparent outline-none transition-all"
                                        placeholder="0.00"
                                    />
                                </div>
                                {qrData.tip_type === 'fixed' && (
                                    <p className="text-sm text-gray-500 mt-1">Suggested amount: ${qrData.tip_amount} (editable)</p>
                                )}
                                {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                            </div>

                            {/* Message */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Message *
                                </label>
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => handleInputChange('message', e.target.value)}
                                    rows="3"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C6B6F] focus:border-transparent outline-none transition-all resize-none"
                                    placeholder="Leave a message..."
                                />
                                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={submitting}
                                className={`w-full py-4 rounded-lg font-medium text-lg transition-all ${submitting
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-[#2C6B6F] text-white hover:bg-[#245559] active:transform active:scale-95'
                                    }`}
                            >
                                {submitting ? 'Processing...' : `Send Tip $${formData.amount || '0.00'}`}
                            </button>
                        </div>

                        {/* Footer */}
                        <div className="mt-8 text-center text-sm text-gray-500">
                            <p>Secure payment processing</p>
                            <p className="mt-1">Your information is safe and encrypted</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Checkout