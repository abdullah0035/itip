import React, { useState } from 'react'
import { Logo } from '../../icons/icons'
import Input from '../../../utils/input'
import RadioGroup from '../../../utils/radioGroup'
import Textarea from '../../../utils/textarea'
import { useNavigate } from 'react-router-dom'

const QRCodeSetup = ({ onGenerateQR }) => {
    const [tipType, setTipType] = useState('fixed') // 'fixed' or 'no-amount'
    const [tipAmount, setTipAmount] = useState('50')
    const [title, setTitle] = useState('Evening Shift')
    const [description, setDescription] = useState("I've been driving for 8 hours today")
    const Navigate = useNavigate();
    const tipTypeOptions = [
        { label: 'Fixed Amount', value: 'fixed' },
        { label: 'No Amount', value: 'no-amount' }
    ]

    const handleTipTypeChange = (type) => {
        setTipType(type)
        if (type === 'no-amount') {
            setTipAmount('') // Clear amount when switching to no amount
        }
    }

    const handleGenerateQR = () => {
        const qrData = {
            tipType,
            tipAmount: tipType === 'fixed' ? tipAmount : null,
            title,
            description
        }

        console.log('Generating QR Code with data:', qrData)
        Navigate('/home')
        // if (onGenerateQR) {
        //   onGenerateQR(qrData)
        // }
    }

    const isFormValid = title.trim() && description.trim() && (tipType === 'no-amount' || tipAmount.trim())

    return (
        <div className="flex flex-col">
            {/* Logo */}
            <div className="pb-4">
                <img src={Logo} width={100} className='mx-auto' alt="Logo" />
            </div>

            {/* Main Content */}
            <div className="flex-1 pt-6 overflow-y-auto">
                <div className="max-w-md mx-auto pb-8">

                    {/* Title */}
                    <h1 className="fs_40 outfit_medium text-black mb-2">Setup your first QR Code</h1>

                    {/* Subtitle */}
                    <p className="outfit fs_20 text-gray-600">
                        Welcome to iTIP! Now let's set up your first QR Code to start receiving tips.
                    </p>
                    <hr className='my-8 text-[#E6E6E6]' />
                    {/* Tip Type Section */}
                    <RadioGroup
                        label="Tip Type"
                        options={tipTypeOptions}
                        value={tipType}
                        onChange={handleTipTypeChange}
                        name="tipType"
                        marginBottom="24px"
                    />

                    {/* Tip Amount (only show if Fixed Amount selected) */}
                    {tipType === 'fixed' && (
                        <div className="mb-6">
                            <label className="block poppins fs_16 text-black mb-3">Tip Amount</label>
                            <div className="customInputGroup">
                                <span className="text-gray-500 fs_16">$</span>
                                <input
                                    type="number"
                                    value={tipAmount}
                                    onChange={(e) => setTipAmount(e.target.value)}
                                    placeholder="0"
                                    className="customInput fs_16 flex-1 ml-2"
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                        </div>
                    )}

                    {/* Title Field */}
                    <div className="mb-6">
                        <Input
                            labels="Title"
                            type="text"
                            placeholder="Enter title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            marginBottom="0px"
                        />
                    </div>

                    {/* Description Field */}
                    <Textarea
                        labels="Description"
                        placeholder={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        marginBottom="32px"
                        maxLength={500}
                        showCharCount={true}
                    />

                    {/* Generate QR Code Button */}
                    <button
                        onClick={handleGenerateQR}
                        disabled={!isFormValid}
                        className={`primary_btn w-full transition-all ${!isFormValid
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-[var(--primary-dark)]'
                            }`}
                    >
                        Generate QR Code
                    </button>
                </div>
            </div>
        </div>
    )
}

export default QRCodeSetup