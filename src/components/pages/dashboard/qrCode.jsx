import React, { useState, useEffect, useMemo } from 'react'
import { Barcode, QrCodeIcon } from '../../icons/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { decryptData } from '../../../utils/api/encrypted'
import ApiFunction from '../../../utils/api/apiFuntions'
import { toast } from 'react-toastify'

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
    const navigate = useNavigate()
    const { get } = ApiFunction()
    
    // Get encrypted token from Redux store
    const encryptedToken = useSelector(state => state?.auth?.token)
    const token = decryptData(encryptedToken)

    // State management
    const [qrCodes, setQrCodes] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [selectedType, setSelectedType] = useState('all')

    // Fetch QR codes from API
    const fetchQRCodes = async () => {
        if (!token) {
            setError('Authentication required')
            setIsLoading(false)
            navigate('/')
            return
        }

        try {
            setIsLoading(true)
            setError('')

            const response = await get('', {
                action: 'getUserQRCodes',
                token: token
            })
            
            if (response?.status === 'success') {
                setQrCodes(response?.qr_codes || [])
            } else {
                setError(response?.message || 'Failed to fetch QR codes')
                toast.error(response?.message || 'Failed to fetch QR codes')
            }
        } catch (error) {
            console.error('Error fetching QR codes:', error)
            const errorMessage = error?.message || 'Failed to load QR codes'
            setError(errorMessage)
            toast.error(errorMessage)
            
            // If unauthorized, redirect to login
            if (error?.response?.status === 403 || errorMessage?.includes('Unauthorized')) {
                toast.error('Session expired. Please log in again.')
                navigate('/')
            }
        } finally {
            setIsLoading(false)
        }
    }

    // Fetch QR codes when component mounts
    useEffect(() => {
        fetchQRCodes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token])

    // Filter QR codes based on selected type
    const filteredQRCodes = useMemo(() => {
        if (!qrCodes) return []
        
        switch (selectedType) {
            case 'active':
                return qrCodes?.filter(qr => qr?.status === 'active')
            case 'deleted':
                return qrCodes?.filter(qr => qr?.status === 'inactive')
            default:
                return qrCodes
        }
    }, [qrCodes, selectedType])

    // Format tip type for display
    const formatTipType = (tipType, tipAmount) => {
        if (tipType === 'fixed') {
            return `Fixed $${tipAmount || 0}`
        }
        return 'No Amount'
    }

    // Format status for display
    const formatStatus = (status) => {
        return status === 'active' ? 'Active' : 'Inactive'
    }

    // Skeleton Loader Components
    const QrCardSkeleton = () => (
        <div className="bg-white rounded-md border border-[#F1F1F1] p-4 md:p-6 animate-pulse">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gray-200 rounded"></div>
                </div>
                <div className="flex-1 w-full sm:min-w-0">
                    <div className="flex flex-col w-100 sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                        <div className="flex-1">
                            <div className="h-8 bg-gray-200 rounded mb-2"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                            </div>
                        </div>
                        <div className="flex-shrink-0">
                            <div className="h-8 bg-gray-200 rounded w-16"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    const SkeletonLoader = () => (
        <div className="bg-white sm:px-5 py-5 px-3 h_100vh rounded-lg">
            <div className="h-6 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mb-4 animate-pulse"></div>
            <div className="flex items-center gap-2 mb-6">
                <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>
            <div className="space-y-4">
                <QrCardSkeleton />
                <QrCardSkeleton />
                <QrCardSkeleton />
            </div>
        </div>
    )

    const totalQRCodes = qrCodes?.length || 0
    const filteredQRCodesLength = filteredQRCodes?.length || 0

    if (isLoading) {
        return (
            <div className="p-6 space-y-6">
                <div className='flex items-center justify-between'>
                    <h1 className="fs_32 outfit_medium text-[#2C2C2C]">QR Code</h1>
                </div>
                <SkeletonLoader />
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-6 space-y-6">
                <h1 className="fs_32 outfit_medium text-[#2C2C2C]">QR Code</h1>
                <div className="bg-white rounded-lg p-8 text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button 
                        onClick={fetchQRCodes}
                        className="bg-[#147187] text-white py-2 px-4 rounded hover:bg-[#147187]/80"
                    >
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6">
            {/* Dashboard Header */}
            <div className='flex items-center justify-between'>
                <h1 className="fs_32 outfit_medium text-[#2C2C2C]">QR Code</h1>
                {totalQRCodes > 0 && (
                    <Link to="/qr-setup">
                        <button className='w-min h-min fs_16 bg-[#147187] text-white py-2 px-4 whitespace-nowrap rounded hover:bg-[#147187] flex items-center justify-center'>
                            New QR Code
                        </button>
                    </Link>
                )}
            </div>

            {/* QR Codes Content */}
            <div className={`bg-white ${totalQRCodes === 0 ? 'flex flex-col items-center justify-center ' : 'sm:px-5 py-5 px-3'} h_100vh rounded-lg`}>
                {totalQRCodes === 0 ? (
                    <div className="p-6 max-w-[550px] flex items-center justify-center flex-col">
                        <img src={QrCodeIcon} className='w-[153px] h-[153px]' alt="" />
                        <h1 className='outfit_bold fs_48 text-center mt-3'>You Haven't created any QR Codes yet</h1>
                        <p className='outfit fs_22 text-center mb-5'>Generate up to 5 custom tip QR Codes to start receiving tips</p>
                        <Link to="/qr-setup">
                            <button className='primary_btn'>Generate QR Code</button>
                        </Link>
                        <p className='outfit fs_20 text-center text-[var(--gray-600)] mt-4'>
                            Tip: Place this on your dashboard, uniform, or delivery package to get noticed.
                        </p>
                    </div>
                ) : (
                    <>
                        <h1 className='fs_24 outfit_medium'>QR Code</h1>
                        <h2 className='fs_16 text-[var(--gray-400)]'>Manage your tip QR codes and track their performance</h2>
                        
                        {/* Filter Tabs */}
                        <div className='flex items-center gap-2 mt-3'>
                            <button 
                                className={`QrTabs w-min ${selectedType === 'all' ? 'active' : ''}`} 
                                onClick={() => setSelectedType('all')}
                            >
                                All QR Code ({qrCodes?.length || 0})
                            </button>
                            <button 
                                className={`QrTabs w-min ${selectedType === 'active' ? 'active' : ''}`} 
                                onClick={() => setSelectedType('active')}
                            >
                                Active ({qrCodes?.filter(qr => qr?.status === 'active')?.length || 0})
                            </button>
                            <button 
                                className={`QrTabs w-min ${selectedType === 'deleted' ? 'active' : ''}`} 
                                onClick={() => setSelectedType('deleted')}
                            >
                                Deleted ({qrCodes?.filter(qr => qr?.status === 'inactive')?.length || 0})
                            </button>
                        </div>

                        {/* QR Code Cards */}
                        <div className="space-y-4 mt-6">
                            {filteredQRCodesLength > 0 ? (
                                filteredQRCodes?.map((qrCode) => (
                                    <QrCodeCard
                                        key={qrCode?.id}
                                        title={qrCode?.title || 'Untitled QR Code'}
                                        tipType={formatTipType(qrCode?.tip_type, qrCode?.tip_amount)}
                                        createdOn={qrCode?.created_date || 'Unknown'}
                                        totalTipsReceived={qrCode?.total_tips_formatted || '$0'}
                                        status={formatStatus(qrCode?.status)}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <img src={QrCodeIcon} className='w-[80px] h-[80px] mx-auto mb-4 opacity-50' alt="" />
                                    <p className="text-gray-500 fs_18 font-medium mb-2">
                                        {selectedType === 'active' ? 'No active QR codes found' :
                                         selectedType === 'deleted' ? 'No deleted QR codes found' :
                                         'No QR codes found'}
                                    </p>
                                    <p className="text-gray-400 fs_14">
                                        {selectedType === 'active' ? 'All your QR codes are currently inactive' :
                                         selectedType === 'deleted' ? 'You haven\'t deleted any QR codes yet' :
                                         'Try switching to a different filter'}
                                    </p>
                                    {selectedType !== 'deleted' && (
                                        <Link to="/qr-setup">
                                            <button className='mt-4 bg-[#147187] text-white py-2 px-4 rounded hover:bg-[#147187]/80'>
                                                Create New QR Code
                                            </button>
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default QrCode