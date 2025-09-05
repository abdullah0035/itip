/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo, useEffect } from 'react'
import { RiEyeLine, RiSearchLine, RiArrowUpLine, RiArrowDownLine, RiCloseLine, RiPrinterLine } from '@remixicon/react'
import { Barcode } from '../../icons/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { decryptData } from '../../../utils/api/encrypted'
import ApiFunction from '../../../utils/api/apiFuntions'
import { toast } from 'react-toastify'
import { setLogout } from '../../redux/loginForm'

const Dashboard = () => {
const navigate = useNavigate()
const { get } = ApiFunction()

// Get encrypted token from Redux store
const encryptedToken = useSelector(state => state?.auth?.token)
const token = decryptData(encryptedToken)

// State management
const [dashboardData, setDashboardData] = useState(null)
const [recentTips, setRecentTips] = useState([])
const [isLoading, setIsLoading] = useState(true)
const [error, setError] = useState('')

// Modal state for receipt
const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false)
const [selectedTip, setSelectedTip] = useState(null)

// Table state
const [searchTerm, setSearchTerm] = useState('')
const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
const [currentPage, setCurrentPage] = useState(1)
const [itemsPerPage] = useState(10)
const dispatch = useDispatch();

// Fetch dashboard data from API
const fetchDashboardData = async () => {
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
            action: 'getDashboard',
            token: token
        })
        
        if (response?.status === 'success') {
            setDashboardData(response?.dashboard_data)
            setRecentTips(response?.dashboard_data?.recent_tips || [])
        } else {
            setError(response?.message || 'Failed to fetch dashboard data')
            toast.error(response?.message || 'Failed to fetch dashboard data')
        }
    } catch (error) {
        console.error('Error fetching dashboard data:', error)
        const errorMessage = error?.message || 'Failed to load dashboard data'
        setError(errorMessage)
        toast.error(errorMessage)
        
        // If unauthorized, redirect to login
        if (error?.response?.status === 403 || errorMessage?.includes('Unauthorized')) {
            
            navigate('/')
            dispatch(setLogout());
        }
    } finally {
        setIsLoading(false)
    }
}

// Fetch data when component mounts
useEffect(() => {
    fetchDashboardData()
}, [token])

// Filter and sort data
const filteredAndSortedData = useMemo(() => {
    let filtered = recentTips?.filter(tip =>
        tip?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        tip?.status?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        tip?.date?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    ) || []

    if (sortConfig?.key) {
        filtered.sort((a, b) => {
            let aValue = a?.[sortConfig?.key]
            let bValue = b?.[sortConfig?.key]
            
            // Handle amount comparison
            if (sortConfig?.key === 'amount') {
                aValue = parseFloat(String(aValue)?.replace(/[^0-9.-]/g, '')) || 0
                bValue = parseFloat(String(bValue)?.replace(/[^0-9.-]/g, '')) || 0
            }
            
            if (aValue < bValue) {
                return sortConfig?.direction === 'asc' ? -1 : 1
            }
            if (aValue > bValue) {
                return sortConfig?.direction === 'asc' ? 1 : -1
            }
            return 0
        })
    }

    return filtered
}, [recentTips, searchTerm, sortConfig])

// Pagination
const totalPages = Math.ceil(filteredAndSortedData?.length / itemsPerPage)
const startIndex = (currentPage - 1) * itemsPerPage
const paginatedData = filteredAndSortedData?.slice(startIndex, startIndex + itemsPerPage) || []

// Sorting function
const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
        direction = 'desc'
    }
    setSortConfig({ key, direction })
}

// Receipt modal functions
const openReceiptModal = (tip) => {
    setSelectedTip(tip)
    setIsReceiptModalOpen(true)
}

const closeReceiptModal = () => {
    setIsReceiptModalOpen(false)
    setSelectedTip(null)
}

const printReceipt = () => {
    const printContent = document.getElementById('receipt-content').innerHTML
    const originalContent = document.body.innerHTML
    
    document.body.innerHTML = `
        <div style="padding: 20px; font-family: Arial, sans-serif;">
            ${printContent}
        </div>
    `
    
    window.print()
    document.body.innerHTML = originalContent
    window.location.reload() // Reload to restore React functionality
}

// Helper functions
const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium"
    if (status === 'Completed') {
        return `${baseClasses} bg-green-100 text-green-800`
    } else if (status === 'Pending') {
        return `${baseClasses} bg-yellow-100 text-yellow-800`
    }
    return `${baseClasses} bg-gray-100 text-gray-800`
}

const formatAmount = (amount) => {
    if (amount === null || amount === undefined) return '---'
    const numAmount = parseFloat(String(amount).replace(/[^0-9.-]/g, ''))
    if (isNaN(numAmount)) return '---'
    return amount.startsWith && amount.startsWith('+') ? amount : `+${amount}`
}

const getAmountClass = (amount) => {
    if (amount === null || amount === undefined) return 'text-gray-400'
    if (String(amount).includes('-')) return 'text-red-600'
    return 'text-green-600'
}

const getActionButton = (tip, status) => {
    if (status === 'Completed') {
        return (
            <button 
                onClick={() => openReceiptModal(tip)}
                className="px-3 py-1 text-xs bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
            >
                <RiEyeLine className="w-3 h-3 inline mr-1" />
                View Receipt
            </button>
        )
    }
    return <span className="text-gray-400">---</span>
}

const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
        return <span className="opacity-50">⇅</span>
    }
    return sortConfig.direction === 'asc' ?
        <RiArrowUpLine className="w-4 h-4" /> :
        <RiArrowDownLine className="w-4 h-4" />
}

// Receipt Modal Component
const ReceiptModal = () => {
    if (!isReceiptModalOpen || !selectedTip) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] flex flex-col">
                {/* Modal Header - Fixed */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
                    <h3 className="text-lg font-semibold text-gray-900">Receipt</h3>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={printReceipt}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Print Receipt"
                        >
                            <RiPrinterLine className="w-5 h-5" />
                        </button>
                        <button
                            onClick={closeReceiptModal}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <RiCloseLine className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Receipt Content - Scrollable with hidden scrollbar */}
                <div className="flex-1 overflow-y-auto scrollbar-hide" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
                    <style jsx>{`
                        .scrollbar-hide::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>
                    <div id="receipt-content" className="p-6">
                        <div className="text-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Digital Tip Receipt</h2>
                            <p className="text-sm text-gray-600">Receipt #RCP-01-{selectedTip?.no || 'N/A'}</p>
                        </div>

                        <div className="space-y-4">
                            {/* Receipt Details */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-600">Date:</span>
                                    <span className="text-sm text-gray-900">{selectedTip?.date}</span>
                                </div>
                                
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-600">Description:</span>
                                    <span className="text-sm text-gray-900">{selectedTip?.description}</span>
                                </div>
                                
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-600">Payment Method:</span>
                                    <span className="text-sm text-gray-900">Digital Tip</span>
                                </div>
                                
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-600">Transaction ID:</span>
                                    <span className="text-sm text-gray-900">TXN-{selectedTip?.no}</span>
                                </div>
                                
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-600">Status:</span>
                                    <span className={getStatusBadge(selectedTip?.status)}>
                                        {selectedTip?.status}
                                    </span>
                                </div>
                            </div>

                            {/* Amount Section */}
                            <div className="bg-gray-50 rounded-lg p-4 mt-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-900">Total Amount:</span>
                                    <span className={`text-xl font-bold ${getAmountClass(selectedTip?.amount)}`}>
                                        {formatAmount(selectedTip?.amount)}
                                    </span>
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div className="text-center pt-4 mt-6">
                                <p className="text-xs text-gray-500 mb-2">
                                    Generated on {new Date().toLocaleDateString()}, {new Date().toLocaleTimeString()}
                                </p>
                                <p className="text-xs text-gray-400">Thank you for your business!</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Footer - Fixed */}
                <div className="p-4 border-t border-gray-200 flex justify-end gap-3 flex-shrink-0">
                    <button
                        onClick={closeReceiptModal}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Close
                    </button>
                    <button
                        onClick={printReceipt}
                        className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <RiPrinterLine className="w-4 h-4" />
                        Print Receipt
                    </button>
                </div>
            </div>
        </div>
    )
}

// Skeleton Loader Components
const StatCardSkeleton = () => (
    <div className="flex-1 bg-white rounded-xl p-6 shadow-sm border flex flex-col justify-between animate-pulse">
        <div>
            <div className="h-5 bg-gray-200 rounded mb-2"></div>
            <div className="h-9 bg-gray-200 rounded mb-4"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded"></div>
    </div>
)

const QRSectionSkeleton = () => (
    <div className="w-full lg:w-2/5">
        <div className="bg-white rounded-xl p-6 shadow-sm border animate-pulse">
            <div className="h-7 bg-gray-200 rounded mb-4"></div>
            <div className='flex justify-between'>
                <div className='justify-end flex items-end'>
                    <div className="w-[100px] h-8 bg-gray-200 rounded"></div>
                </div>
                <div className="flex justify-center">
                    <div className="w-28 h-28 bg-gray-200 rounded-lg"></div>
                </div>
            </div>
        </div>
    </div>
)

const TableSkeleton = () => (
    <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded w-64 animate-pulse"></div>
            </div>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50">
                    <tr>
                        {['No', 'Date', 'Description', 'Amount', 'Status', 'Action'].map((header) => (
                            <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {[...Array(5)].map((_, index) => (
                        <tr key={index} className="animate-pulse">
                            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-8"></div></td>
                            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                            <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded w-20"></div></td>
                            <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded w-24"></div></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
)

if (isLoading) {
    return (
        <div className="p-6 space-y-6">
            {/* Dashboard Header */}
            <h1 className="fs_32 outfit_medium text-[#2C2C2C]">Dashboard</h1>

            {/* Top Section - QR Code and Stats Skeleton */}
            <div className="flex flex-col lg:flex-row gap-2">
                <QRSectionSkeleton />
                
                {/* Stats Cards Skeleton */}
                <div className="w-full lg:w-3/5 flex flex-col md:flex-row gap-2">
                    <StatCardSkeleton />
                    <StatCardSkeleton />
                    <StatCardSkeleton />
                </div>
            </div>

            {/* Recent Tips Table Skeleton */}
            <TableSkeleton />
        </div>
    )
}

if (error) {
    return (
        <div className="p-6 space-y-6">
            <h1 className="fs_32 outfit_medium text-[#2C2C2C]">Dashboard</h1>
            <div className="bg-white rounded-xl p-8 shadow-sm border text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <button 
                    onClick={fetchDashboardData}
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
        <h1 className="fs_32 outfit_medium text-[#2C2C2C]">Dashboard</h1>

        {/* Top Section - QR Code and Stats */}
        <div className="flex flex-col lg:flex-row gap-2">
            {/* QR Code Section - 40% width */}
            <div className="w-full lg:w-2/5">
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <h2 className="fs_28 plus_Jakarta_Sans_medium text-gray-900 mb-4">Your QR Code</h2>
                    <div className='flex justify-between'>
                        {/* Generate QR Code Button */}
                        <div className='justify-end flex items-end'>
                            <Link to={'/qr-setup'}>
                                <button className="w-[120px] h-min fs_10  bg-[#147187] text-white py-2 px-4 whitespace-nowrap rounded hover:bg-[#147187] flex items-center justify-center">
                                    Generate QR Code
                                </button>
                            </Link>
                        </div>

                        <div className="flex justify-center ">
                            <div className="w-28 h-28 bg-gray-100 rounded-lg flex items-center justify-center">
                                {/* Placeholder QR Code */}
                                <img src={Barcode} alt="" />
                            </div>
                        </div>
                    </div>
                    {/* QR Code Display */}
                </div>
            </div>

            {/* Stats Cards - 60% width divided equally */}
            <div className="w-full lg:w-3/5 flex flex-col md:flex-row gap-2">
                {/* Available Balance */}
                <div className="flex-1 bg-white rounded-xl p-6 shadow-sm border flex  flex-col justify-between">
                    <div>
                        <h3 className="fs_20 poppins_medium text-[var(--primary)] mb-2">Available Balance</h3>
                        <p className="fs_36 plus_Jakarta_Sans_bold font-bold text-gray-900 mb-4">
                            {dashboardData?.available_balance?.formatted || '$0.00'}
                        </p>
                    </div>
                    <button className="bg_primary text-white py-2 px-4 rounded fs_10 hover:bg_dark transition-colors">
                        Withdraw
                    </button>
                </div>

                {/* Total Tips */}
                <div className="flex-1 bg-white rounded-xl p-6 shadow-sm border flex flex-col justify-between">
                    <h3 className="fs_20 poppins_medium text-[var(--primary)] mb-2">Total Tips</h3>
                    <p className="text-3xl plus_Jakarta_Sans_bold text-end">
                        {dashboardData?.total_tips?.formatted || '$0.00'}
                    </p>
                </div>

                {/* Tips This Month */}
                <div className="flex-1 bg-white rounded-xl p-6 shadow-sm border flex flex-col justify-between">
                    <h3 className="fs_20 poppins_medium text-[var(--primary)] mb-2">Tips This Month</h3>
                    <p className="text-3xl plus_Jakarta_Sans_bold text-end">
                        {dashboardData?.tips_this_month?.formatted || '$0'}
                    </p>
                </div>
            </div>
        </div>

        {/* Recent Tips Table */}
        <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 className="fs_24 font-semibold text-gray-900">Recent Tips</h2>

                    {/* Search Bar */}
                    <div className="relative">
                        <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search tips..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                No
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('date')}
                            >
                                <div className="flex items-center gap-1">
                                    Date
                                    {getSortIcon('date')}
                                </div>
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('description')}
                            >
                                <div className="flex items-center gap-1">
                                    Description
                                    {getSortIcon('description')}
                                </div>
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('amount')}
                            >
                                <div className="flex items-center gap-1">
                                    Amount
                                    {getSortIcon('amount')}
                                </div>
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('status')}
                            >
                                <div className="flex items-center gap-1">
                                    Status
                                    {getSortIcon('status')}
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedData?.length > 0 ? paginatedData?.map((tip) => (
                            <tr key={tip?.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {tip?.no}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {tip?.date}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {tip?.description}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <span className={getAmountClass(tip?.amount)}>
                                        {formatAmount(tip?.amount)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={getStatusBadge(tip?.status)}>
                                        {tip?.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {getActionButton(tip, tip?.status)}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                    No recent tips found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="px-6 py-3 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredAndSortedData?.length || 0)} of {filteredAndSortedData?.length || 0} results
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            {[...Array(totalPages)]?.map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-3 py-1 text-sm border rounded ${currentPage === i + 1
                                        ? 'bg-teal-600 text-white border-teal-600'
                                        : 'border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* Receipt Modal */}
        <ReceiptModal />
    </div>
)
}

export default Dashboard