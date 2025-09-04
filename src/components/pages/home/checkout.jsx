/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import QRCode from 'qrcode'
import ApiFunction from '../../../utils/api/apiFuntions'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { decryptData } from '../../../utils/api/encrypted'

const Checkout = () => {
    const {qrToken} = useParams();
    // const qrToken = searchParams.get('qrToken');

    const { post } = ApiFunction()
    
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [qrData, setQrData] = useState(null)
    const [qrCodeUrl, setQrCodeUrl] = useState('')
    const [errors, setErrors] = useState({})

     const encryptedToken = useSelector(state => state?.auth?.token)
    const token = decryptData(encryptedToken)
    
    const [formData, setFormData] = useState({
        name: '',
        profession: '',
        amount: '',
        message: '',
        paymentMethod: 'card',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardHolderName: ''
    })

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
        }else{
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

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required'
        }

        if (!formData.profession.trim()) {
            newErrors.profession = 'Profession is required'
        }

        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            newErrors.amount = 'Please enter a valid tip amount'
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Message is required'
        }

        if (formData.paymentMethod === 'card') {
            if (!formData.cardNumber.trim()) {
                newErrors.cardNumber = 'Card number is required'
            } else if (formData.cardNumber.replace(/\s/g, '').length < 16) {
                newErrors.cardNumber = 'Please enter a valid card number'
            }

            if (!formData.expiryDate.trim()) {
                newErrors.expiryDate = 'Expiry date is required'
            }

            if (!formData.cvv.trim()) {
                newErrors.cvv = 'CVV is required'
            }

            if (!formData.cardHolderName.trim()) {
                newErrors.cardHolderName = 'Cardholder name is required'
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

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
                customer_token  : token ?? "",
                qr_token: qrToken,
                name: formData.name.trim(),
                profession: formData.profession.trim(),
                amount: parseFloat(formData.amount),
                message: formData.message.trim(),
                payment_method: formData.paymentMethod,
                card_no: formData.paymentMethod === 'card' ? 
                    '**** **** **** ' + formData.cardNumber.slice(-4) : 
                    formData.paymentMethod === 'google_pay' ? 'Google Pay Transaction' : 'Apple Pay Transaction'
            })

            if (response?.status === 'success') {
                toast.success('Thank you! Your tip has been sent successfully.')
                // Reset form
                setFormData({
                    name: '',
                    profession: '',
                    amount: qrData?.tip_amount?.toString() || '',
                    message: '',
                    paymentMethod: 'card',
                    cardNumber: '',
                    expiryDate: '',
                    cvv: '',
                    cardHolderName: ''
                })
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
                        {qrData.title}
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

                    {/* Payment Method */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Payment Method *
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                type="button"
                                onClick={() => handleInputChange('paymentMethod', 'card')}
                                className={`p-3 border rounded-lg text-sm font-medium transition-all ${
                                    formData.paymentMethod === 'card'
                                        ? 'border-[#2C6B6F] bg-[#2C6B6F] text-white'
                                        : 'border-gray-300 hover:border-gray-400'
                                }`}
                            >
                                Card
                            </button>
                            <button
                                type="button"
                                onClick={() => handleInputChange('paymentMethod', 'google_pay')}
                                className={`p-3 border rounded-lg text-sm font-medium transition-all ${
                                    formData.paymentMethod === 'google_pay'
                                        ? 'border-[#2C6B6F] bg-[#2C6B6F] text-white'
                                        : 'border-gray-300 hover:border-gray-400'
                                }`}
                            >
                                Google Pay
                            </button>
                            <button
                                type="button"
                                onClick={() => handleInputChange('paymentMethod', 'apple_pay')}
                                className={`p-3 border rounded-lg text-sm font-medium transition-all ${
                                    formData.paymentMethod === 'apple_pay'
                                        ? 'border-[#2C6B6F] bg-[#2C6B6F] text-white'
                                        : 'border-gray-300 hover:border-gray-400'
                                }`}
                            >
                                Apple Pay
                            </button>
                        </div>
                    </div>

                    {/* Card Details - Only show if card is selected */}
                    {formData.paymentMethod === 'card' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Card Number *
                                </label>
                                <input
                                    type="text"
                                    value={formData.cardNumber}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim()
                                        if (value.replace(/\s/g, '').length <= 16) {
                                            handleInputChange('cardNumber', value)
                                        }
                                    }}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C6B6F] focus:border-transparent outline-none transition-all"
                                    placeholder="1234 5678 9012 3456"
                                />
                                {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Expiry Date *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.expiryDate}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').substr(0, 5)
                                            handleInputChange('expiryDate', value)
                                        }}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C6B6F] focus:border-transparent outline-none transition-all"
                                        placeholder="MM/YY"
                                    />
                                    {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        CVV *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.cvv}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '').substr(0, 4)
                                            handleInputChange('cvv', value)
                                        }}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C6B6F] focus:border-transparent outline-none transition-all"
                                        placeholder="123"
                                    />
                                    {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Cardholder Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.cardHolderName}
                                    onChange={(e) => handleInputChange('cardHolderName', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C6B6F] focus:border-transparent outline-none transition-all"
                                    placeholder="John Doe"
                                />
                                {errors.cardHolderName && <p className="text-red-500 text-sm mt-1">{errors.cardHolderName}</p>}
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitting}
                        className={`w-full py-4 rounded-lg font-medium text-lg transition-all ${
                            submitting
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
            </div>
        </div>
    )
}

export default Checkout