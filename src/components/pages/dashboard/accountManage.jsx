/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { RiCheckLine } from '@remixicon/react'
import Input from '../../../utils/input'
import ApiFunction from '../../../utils/api/apiFuntions'
import { decryptData } from '../../../utils/api/encrypted'

const AccountManage = () => {
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const { post } = ApiFunction()
    
    // Get token from Redux store
    const encryptedToken = useSelector(state => state.auth?.token)
    const token = decryptData(encryptedToken)

    const [bankData, setBankData] = useState({
        accountHolderName: '',
        accountNumber: '',
        routingNumber: ''
    })

    const [payoutFrequency, setPayoutFrequency] = useState('manual')

    // Load existing bank details on component mount
    useEffect(() => {
        loadBankDetails()
    }, [])

    const loadBankDetails = async () => {
        if (!token) return

        try {
            const response = await post('', {
                action: 'getBankDetails',
                token: token
            })

            if (response?.status === 'success' && response?.data) {
                setBankData({
                    accountHolderName: response.data.account_holder_name || '',
                    accountNumber: response.data.account_number || '',
                    routingNumber: response.data.routing_number || ''
                })
                setPayoutFrequency(response.data.payout_frequency || 'manual')
            }
        } catch (error) {
            console.error('Error loading bank details:', error)
        }
    }

    const handleInputChange = (value, fieldName) => {
        // Convert fieldName to match our state keys
        const field = fieldName.toLowerCase().replace(/\s+/g, '')
        let stateField = field
        
        if (field === 'accountholdername') {
            stateField = 'accountHolderName'
        } else if (field === 'accountnumber') {
            stateField = 'accountNumber'
        } else if (field === 'routingnumber') {
            stateField = 'routingNumber'
        }
        
        setBankData(prev => ({
            ...prev,
            [stateField]: value
        }))

        // Clear error when user starts typing
        if (errors[stateField]) {
            setErrors(prev => ({
                ...prev,
                [stateField]: ''
            }))
        }
    }

    // Validate form
    const validateForm = () => {
        const newErrors = {}

        // Account holder name validation
        if (!bankData.accountHolderName.trim()) {
            newErrors.accountHolderName = 'Account holder name is required'
        } else if (bankData.accountHolderName.trim().length < 2) {
            newErrors.accountHolderName = 'Account holder name must be at least 2 characters long'
        }

        // Account number validation
        if (!bankData.accountNumber.trim()) {
            newErrors.accountNumber = 'Account number is required'
        } else if (!/^\d{8,17}$/.test(bankData.accountNumber.replace(/\s/g, ''))) {
            newErrors.accountNumber = 'Account number must be 8-17 digits'
        }

        // Routing number validation
        if (!bankData.routingNumber.trim()) {
            newErrors.routingNumber = 'Routing number is required'
        } else if (!/^\d{9}$/.test(bankData.routingNumber.replace(/\s/g, ''))) {
            newErrors.routingNumber = 'Routing number must be exactly 9 digits'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleUpdate = async () => {
        if (!validateForm()) {
            toast.error('Please fix the validation errors')
            return
        }

        if (!token) {
            toast.error('Authentication token not found. Please login again.')
            return
        }

        const data = {
            action: 'updateBankDetails',
            token: token,
            account_holder_name: bankData.accountHolderName.trim(),
            account_number: bankData.accountNumber.replace(/\s/g, ''),
            routing_number: bankData.routingNumber.replace(/\s/g, ''),
            payout_frequency: payoutFrequency
        }

        setLoading(true)

        try {
            const response = await post('', data)
            
            if (response?.status === 'success') {
                toast.success(response?.message || 'Bank details updated successfully')
                
                // Clear any existing errors
                setErrors({})
            } else if (response?.message === 'Invalid account details') {
                toast.error('Invalid account details provided');
            } else {
                if (response?.errors && Array.isArray(response.errors)) {
                    // Handle validation errors from API
                    response.errors.forEach(error => {
                        toast.error(error)
                    })
                } else if (response?.message) {
                    toast.error(response.message)
                } else {
                    toast.error('Failed to update bank details')
                }
            }
        } catch (error) {
            console.error('Bank details update error:', error)
            toast.error('An error occurred. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <h2 className="fs_24 poppins_medium text-[#2C2C2C] mb-6">
                Account Management
            </h2>

            {/* Form */}
            <div className="space-y-4">
                {/* Account Holder Name Field - Full Width */}
                <div>
                    <Input
                        labels="Account Holder Name"
                        placeholder="Enter account holder name"
                        type="text"
                        marginBottom="20px"
                        onChange={handleInputChange}
                        value={bankData.accountHolderName}
                        name="accountHolderName"
                    />
                    {errors.accountHolderName && (
                        <p className="text-red-500 fs_14 mt-1 mb-3">{errors.accountHolderName}</p>
                    )}
                </div>

                {/* Account Number and Routing Number - Two Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Input
                            labels="Account Number"
                            placeholder="Enter account number"
                            type="text"
                            marginBottom="20px"
                            onChange={handleInputChange}
                            value={bankData.accountNumber}
                            name="accountNumber"
                        />
                        {errors.accountNumber && (
                            <p className="text-red-500 fs_14 mt-1 mb-3">{errors.accountNumber}</p>
                        )}
                    </div>
                    <div>
                        <Input
                            labels="Routing Number"
                            placeholder="Enter routing number"
                            type="text"
                            marginBottom="20px"
                            onChange={handleInputChange}
                            value={bankData.routingNumber}
                            name="routingNumber"
                        />
                        {errors.routingNumber && (
                            <p className="text-red-500 fs_14 mt-1 mb-3">{errors.routingNumber}</p>
                        )}
                    </div>
                </div>

                {/* Payout Frequency Selection */}
                <div className="space-y-3">
                    <label className="fs_16 text-[#2C2C2C] poppins_medium">
                        Payout Frequency
                    </label>
                    <div className="flex items-center sm:gap-[100px] gap-[30px] flex-wrap">
                        {/* Auto Weekly */}
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <input
                                    type="radio"
                                    id="auto-weekly"
                                    name="payout-frequency"
                                    value="weekly"
                                    checked={payoutFrequency === 'weekly'}
                                    onChange={(e) => setPayoutFrequency(e.target.value)}
                                    className="sr-only"
                                />
                                <label
                                    htmlFor="auto-weekly"
                                    className="flex items-center cursor-pointer"
                                >
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${payoutFrequency === 'weekly'
                                        ? 'border-teal-600 bg-teal-600'
                                        : 'border-gray-300 bg-white'
                                        }`}>
                                        {payoutFrequency === 'weekly' && (
                                            <RiCheckLine className="w-3 h-3 text-white" />
                                        )}
                                    </div>
                                    <span className="ml-3 fs_14 text-[#969696] outfit_medium whitespace-nowrap">Auto Weekly</span>
                                </label>
                            </div>
                        </div>

                        {/* Auto Monthly */}
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <input
                                    type="radio"
                                    id="auto-monthly"
                                    name="payout-frequency"
                                    value="monthly"
                                    checked={payoutFrequency === 'monthly'}
                                    onChange={(e) => setPayoutFrequency(e.target.value)}
                                    className="sr-only"
                                />
                                <label
                                    htmlFor="auto-monthly"
                                    className="flex items-center cursor-pointer"
                                >
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${payoutFrequency === 'monthly'
                                        ? 'border-teal-600 bg-teal-600'
                                        : 'border-gray-300 bg-white'
                                        }`}>
                                        {payoutFrequency === 'monthly' && (
                                            <RiCheckLine className="w-3 h-3 text-white" />
                                        )}
                                    </div>
                                    <span className="ml-3 fs_14 text-[#969696] outfit_medium whitespace-nowrap">Auto Monthly</span>
                                </label>
                            </div>
                        </div>

                        {/* Manual */}
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <input
                                    type="radio"
                                    id="manual"
                                    name="payout-frequency"
                                    value="manual"
                                    checked={payoutFrequency === 'manual'}
                                    onChange={(e) => setPayoutFrequency(e.target.value)}
                                    className="sr-only"
                                />
                                <label
                                    htmlFor="manual"
                                    className="flex items-center cursor-pointer"
                                >
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${payoutFrequency === 'manual'
                                        ? 'border-teal-600 bg-teal-600'
                                        : 'border-gray-300 bg-white'
                                        }`}>
                                        {payoutFrequency === 'manual' && (
                                            <RiCheckLine className="w-3 h-3 text-white" />
                                        )}
                                    </div>
                                    <span className="ml-3 fs_14 text-[#969696] outfit_medium whitespace-nowrap">Manual</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Update Button */}
                <div className="flex justify-end mt-8">
                    <button
                        onClick={handleUpdate}
                        disabled={loading}
                        className={`bg-[#2C6B6F] hover:bg-[#245559] text-white px-8 py-3 rounded-lg fs_14 plus_Jakarta_Sans_medium transition-colors duration-200 ${
                            loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {loading ? 'Updating...' : 'Update'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AccountManage