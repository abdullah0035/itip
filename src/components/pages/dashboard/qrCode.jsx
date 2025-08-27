import React, { useState } from 'react'
import { Barcode, QrCodeIcon } from '../../icons/icons'

const QrCodeCard = ({
    title = "Morning Shift Cab",
    tipType = "Fixed $5",
    createdOn = "July 30, 2025",
    totalTipsReceived = "$120",
    status = "Active"
}) => {
    return (
        <div className="bg-white rounded-md border border-[#F1F1F1] p-4 md:p-6 ">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* QR Code Section */}
                <div className="flex-shrink-0">
                    <img src={Barcode} alt="" />
                </div>

                {/* Content Section */}
                <div className="flex-1 w-full sm:min-w-0">
                    <div className="flex flex-col w-100 sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 ">
                        {/* Left Content */}
                        <div className="flex-1">
                            <h3 className=" fs_40 outfit_medium mb-2">
                                {title}
                            </h3>

                            <div className="space-y-1 text-sm md:text-base text-gray-600">
                                <div className="flex flex-row items-center gap-1 sm:gap-2">
                                    <span className="fs_20 text-[var(--gray-400)]">Tip Type:</span>
                                    <span className='fs_20 text-[var(--gray-400)]'>{tipType}</span>
                                </div>

                                <div className="flex flex-row items-center gap-1 sm:gap-2">
                                    <span className="fs_20 text-[var(--gray-400)]">Created On:</span>
                                    <span className='fs_20 text-[var(--gray-400)]'>{createdOn}</span>
                                </div>

                                <div className="flex flex-row items-center gap-1 sm:gap-2">
                                    <span className="fs_20 text-[var(--gray-400)]">Total Tips Received:</span>
                                    <span className="fs_20 text-[var(--gray-400)]">{totalTipsReceived}</span>
                                </div>
                            </div>
                        </div>

                        {/* Status Badge */}
                        <div className="flex-shrink-0 self-end">
                            <span className={`
                inline-flex items-center px-3 py-1 font-medium
                ${status === 'Active'
                                    ? 'bg-[var(--primary)] text-white rounded-md'
                                    : 'bg-gray-100 text-gray-800 border border-gray-200'
                                }
              `}>
                                {status}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const QrCode = () => {
    const qrCodesLength = 0;
    const [selectedType, setSelectedType] = useState('all');
    return (
        <div className="p-6 space-y-6">
            {/* Dashboard Header */}
            <div className='flex items-center justify-between'>
                <h1 className="fs_32 outfit_medium text-[#2C2C2C]">QR Code </h1>
                {
                    qrCodesLength > 0 && <button className='w-min h-min fs_16 bg-[#147187] text-white py-2 px-4 whitespace-nowrap rounded hover:bg-[#147187] flex items-center justify-center'>New QR Code</button>
                }

            </div>


            {/* Recent Tips Table */}
            <div className={`bg-white ${qrCodesLength === 0 ? 'flex flex-col items-center justify-center ' : 'sm:px-5 py-5 px-3'} h_100vh rounded-lg`}>
                {qrCodesLength === 0 ? <>
                    <div className="p-6 max-w-[550px] flex items-center justify-center flex-col">
                        <img src={QrCodeIcon} className='w-[153px] h-[153px]' alt="" />
                        <h1 className='outfit_bold fs_48 text-center mt-3'>You Haven't created any QR Codes yet</h1>
                        <p className='outfit fs_22 text-center mb-5'>Generate up to 5 custom tip QR Codes to start receiving tips</p>
                        <button className='primary_btn'>Genrate QR Code</button>
                        <p className='outfit fs_20 text-center text-[var(--gray-600)] mt-4'>Tip: Place this on your dashboard, uniform, or delivery package to get noticed.</p>

                    </div>
                </> : <>

                    <h1 className='fs_24 outfit_medium'>QR Code</h1>
                    <h2 className='fs_16 text-[var(--gray-400)]'>Deposit funds into your wallet using one of your virtual cards</h2>
                    <div className='flex items-center gap-2 mt-3'>
                        <button className={`QrTabs w-min ${selectedType === 'all' ? 'active' : ''}`} onClick={() => { setSelectedType('all') }}>All QR Code</button>
                        <button className={`QrTabs w-min ${selectedType === 'active' ? 'active' : ''}`} onClick={() => { setSelectedType('active') }}>Active</button>
                        <button className={`QrTabs w-min ${selectedType === 'deleted' ? 'active' : ''}`} onClick={() => { setSelectedType('deleted') }}>Deleted</button>
                    </div>

                    {/* ----create here--- */}
                    <div className="space-y-4 mt-6">
                        <QrCodeCard
                            title="Morning Shift Cab"
                            tipType="Fixed $5"
                            createdOn="July 30, 2025"
                            totalTipsReceived="$120"
                            status="Active"
                        />
                        <QrCodeCard
                            title="Evening Delivery"
                            tipType="Variable"
                            createdOn="August 15, 2025"
                            totalTipsReceived="$85"
                            status="Active"
                        />
                    </div>
                </>}
            </div>
        </div>
    )
}

export default QrCode