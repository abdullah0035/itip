/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from 'react'
import QRCode from 'qrcode'
import { QrCodeIcon } from '../../icons/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { decryptData } from '../../../utils/api/encrypted'
import ApiFunction from '../../../utils/api/apiFuntions'
import { toast } from 'react-toastify'

// QR Code Preview Modal Component
const QRPreviewModal = ({ isOpen, onClose, qrData }) => {
    const [qrCodeUrl, setQrCodeUrl] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)

    useEffect(() => {
        if (isOpen && qrData) {
            generateQRCode()
        }
    }, [isOpen, qrData])

    const generateQRCode = async () => {
        if (!qrData) return
        
        setIsGenerating(true)
        try {
            const url = await QRCode.toDataURL(qrData.qr_string || qrData.qr_token, {
                width: 300,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            })
            setQrCodeUrl(url)
        } catch (error) {
            console.error('Error generating QR code:', error)
            toast.error('Failed to generate QR code')
        } finally {
            setIsGenerating(false)
        }
    }

    const handleDownload = () => {
        if (!qrCodeUrl || !qrData) return

        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()
        
        canvas.width = 400
        canvas.height = 500
        
        img.onload = () => {
            // White background
            ctx.fillStyle = 'white'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            
            // Draw QR code (centered)
            const qrSize = 300
            const qrX = (canvas.width - qrSize) / 2
            const qrY = 50
            ctx.drawImage(img, qrX, qrY, qrSize, qrSize)
            
            // Add title and description
            ctx.fillStyle = 'black'
            ctx.font = 'bold 20px Arial'
            ctx.textAlign = 'center'
            ctx.fillText(qrData.title, canvas.width / 2, 380)
            
            // Add description with word wrapping
            ctx.font = '16px Arial'
            const description = qrData.description || 'Scan to tip'
            const words = description.split(' ')
            let line = ''
            let y = 410
            
            for (let n = 0; n < words.length; n++) {
                const testLine = line + words[n] + ' '
                const metrics = ctx.measureText(testLine)
                const testWidth = metrics.width
                if (testWidth > 350 && n > 0) {
                    ctx.fillText(line, canvas.width / 2, y)
                    line = words[n] + ' '
                    y += 20
                } else {
                    line = testLine
                }
            }
            ctx.fillText(line, canvas.width / 2, y)
            
            // Download
            const link = document.createElement('a')
            link.download = `${qrData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_qr_code.png`
            link.href = canvas.toDataURL()
            link.click()
        }
        
        img.src = qrCodeUrl
    }

    if (!isOpen || !qrData) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center no_scroll z-50 p-4 mt-0">
            <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto no_scroll">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">QR Code Preview</h3>
                    <div className="flex items-center gap-2 ">
                        <button
                            onClick={handleDownload}
                            disabled={!qrCodeUrl || isGenerating}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Download QR Code"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* QR Code Content */}
                <div className="p-8 text-center bg-white max-h-[60vh] overflow-y-auto no_scroll">
                    <div className="inline-block p-4 bg-white rounded-lg shadow-sm border">
                        {isGenerating ? (
                            <div className="w-[300px] h-[300px] flex items-center justify-center bg-gray-100 rounded">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                            </div>
                        ) : qrCodeUrl ? (
                            <img 
                                src={qrCodeUrl} 
                                alt="QR Code" 
                                className="w-[300px] h-[300px] object-contain"
                            />
                        ) : (
                            <div className="w-[300px] h-[300px] flex items-center justify-center bg-gray-100 rounded">
                                <span className="text-gray-500">Failed to generate QR code</span>
                            </div>
                        )}
                    </div>
                    
                    <div className="mt-6 space-y-2">
                        <h4 className="text-xl font-semibold text-gray-900">{qrData.title}</h4>
                        {qrData.description && (
                            <p className="text-gray-600 text-sm leading-relaxed">{qrData.description}</p>
                        )}
                        <div className="mt-4 space-y-1 text-sm text-gray-500">
                            <p><span className="font-medium">Type:</span> {qrData.tip_type === 'fixed' ? `Fixed $${qrData.tip_amount}` : 'No Amount'}</p>
                            <p><span className="font-medium">Total Tips:</span> {qrData.total_tips_formatted || '$0'}</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t rounded-b-lg">
                    <p className="text-xs text-gray-500 text-center">
                        Share this QR code with customers to receive tips
                    </p>
                </div>
            </div>
        </div>
    )
}

const QrCodeCard = ({
    id,
    title = "Morning Shift Cab",
    tipType = "Fixed $5",
    createdOn = "July 30, 2025",
    totalTipsReceived = "$120",
    status = "Active",
    qrString = "",
    qrData = {},
    onDelete,
    onPreview
}) => {
    const [isDeleting, setIsDeleting] = useState(false)
    const [qrCodeUrl, setQrCodeUrl] = useState('')
    const [isGeneratingQR, setIsGeneratingQR] = useState(false)

    // Generate QR code for card display
    useEffect(() => {
        generateCardQRCode()
    }, [qrString, title])

    const generateCardQRCode = async () => {
        if (!qrString && !title) return
        
        setIsGeneratingQR(true)
        try {
            const url = await QRCode.toDataURL(qrString || title, {
                width: 80,
                margin: 1,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            })
            setQrCodeUrl(url)
        } catch (error) {
            console.error('Error generating QR code:', error)
        } finally {
            setIsGeneratingQR(false)
        }
    }

    const handleDelete = async () => {
        if (isDeleting) return
        
        const confirmDelete = window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)
        if (!confirmDelete) return

        setIsDeleting(true)
        try {
            await onDelete(id)
        } finally {
            setIsDeleting(false)
        }
    }

    const handlePreview = () => {
        onPreview(qrData)
    }

    return (
        <div className="bg-white rounded-md border border-[#F1F1F1] p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* QR Code Section */}
                <div className="flex-shrink-0">
                    <div className="p-2 bg-white border rounded-lg shadow-sm">
                        {isGeneratingQR ? (
                            <div className="w-[60px] h-[60px] flex items-center justify-center bg-gray-100 rounded">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                            </div>
                        ) : qrCodeUrl ? (
                            <img 
                                src={qrCodeUrl} 
                                alt="QR Code" 
                                className="w-[110px] h-[130px] object-contain"
                            />
                        ) : (
                            <div className="w-[60px] h-[60px] flex items-center justify-center bg-gray-100 rounded">
                                <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zm6 0h2v2h-2V5zm0 4h2v2h-2V9zm0 4h2v2h-2v-2zm4-8h2v2h-2V5zm0 4h2v2h-2V9zm0 4h2v2h-2v-2zm-8 4h2v2H9v-2zm4 0h2v2h-2v-2z"/>
                                </svg>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 w-full sm:min-w-0">
                    <div className="flex flex-col w-100 sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                        {/* Left Content */}
                        <div className="flex-1">
                            <h3 className="fs_40 outfit_medium mb-2">
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

                        {/* Action Buttons */}
                        <div className="flex-shrink-0 self-end flex items-center gap-2">
                            {/* Status Badge */}
                            <span className={`
                                inline-flex items-center px-3 py-1 font-medium
                                ${status === 'Active'
                                    ? 'bg-[var(--primary)] text-white rounded-md'
                                    : 'bg-gray-100 text-gray-800 border border-gray-200'
                                }
                            `}>
                                {status}
                            </span>

                            {/* Preview Button */}
                            <button
                                onClick={handlePreview}
                                className="inline-flex items-center px-3 py-1 font-medium text-sm rounded-md transition-colors bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200"
                                title="Preview QR Code"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                Preview
                            </button>

                            {/* Delete Button - Only show for Active QR codes */}
                            {status === 'Active' && (
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className={`
                                        inline-flex items-center px-3 py-1 font-medium text-sm rounded-md transition-colors
                                        ${isDeleting 
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                            : 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200'
                                        }
                                    `}
                                    title="Delete QR Code"
                                >
                                    {isDeleting ? 'Deleting...' : 'Delete'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const QrCode = () => {
    const navigate = useNavigate()
    const { get, post } = ApiFunction()
    
    // Get encrypted token from Redux store
    const encryptedToken = useSelector(state => state?.auth?.token)
    const token = decryptData(encryptedToken)

    // State management
    const [qrCodes, setQrCodes] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [selectedType, setSelectedType] = useState('all')
    const [previewModal, setPreviewModal] = useState({ isOpen: false, qrData: null })

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

    // Handle QR code deletion
    const handleDeleteQRCode = async (qrId) => {
        if (!token) {
            toast.error('Authentication token not found. Please login again.')
            return
        }

        try {
            const response = await post('', {
                action: 'deleteQRCode',
                token: token,
                qr_id: qrId
            })

            if (response?.status === 'success') {
                toast.success('QR Code deleted successfully')
                
                // Update the local state to reflect the deletion
                setQrCodes(prevQrCodes => 
                    prevQrCodes.map(qr => 
                        qr.id === qrId 
                            ? { ...qr, status: 'inactive' }
                            : qr
                    )
                )
            } else {
                toast.error(response?.message || 'Failed to delete QR code')
            }
        } catch (error) {
            console.error('Error deleting QR code:', error)
            toast.error('An error occurred while deleting the QR code')
        }
    }

    // Handle QR code preview
    const handlePreviewQRCode = (qrData) => {
        setPreviewModal({ isOpen: true, qrData })
    }

    // Close preview modal
    const closePreviewModal = () => {
        setPreviewModal({ isOpen: false, qrData: null })
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
                        <div className="flex-shrink-0 flex items-center gap-2">
                            <div className="h-8 bg-gray-200 rounded w-16"></div>
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
                                        id={qrCode?.id}
                                        title={qrCode?.title || 'Untitled QR Code'}
                                        tipType={formatTipType(qrCode?.tip_type, qrCode?.tip_amount)}
                                        createdOn={qrCode?.created_date || 'Unknown'}
                                        totalTipsReceived={qrCode?.total_tips_formatted || '$0'}
                                        status={formatStatus(qrCode?.status)}
                                        qrString={qrCode?.qr_string || `http://localhost:3000/${qrCode?.qr_token}`}
                                        qrData={qrCode}
                                        onDelete={handleDeleteQRCode}
                                        onPreview={handlePreviewQRCode}
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

            {/* QR Code Preview Modal */}
            <QRPreviewModal 
                isOpen={previewModal.isOpen} 
                onClose={closePreviewModal} 
                qrData={previewModal.qrData} 
            />
        </div>
    )
}

export default QrCode