import React, { useState, useMemo } from 'react'
import { RiEyeLine, RiSearchLine, RiArrowUpLine, RiArrowDownLine } from '@remixicon/react'
import { Barcode } from '../../icons/icons'

const Dashboard = () => {
    // Sample data for recent tips
    const [recentTips] = useState([
        {
            id: 1,
            no: '01',
            date: 'June 17, 2025',
            description: 'SEVIS Payment',
            amount: -220.00,
            status: 'Completed',
            action: 'View Receipt'
        },
        {
            id: 2,
            no: '02',
            date: 'June 16, 2025',
            description: 'Fund Wallet - NGN ₦150K',
            amount: 500.00,
            status: 'Completed',
            action: 'View Receipt'
        },
        {
            id: 3,
            no: '03',
            date: 'June 14, 2025',
            description: 'Card Settings Updated',
            amount: null,
            status: 'Pending',
            action: null
        },
        {
            id: 4,
            no: '04',
            date: 'June 13, 2025',
            description: 'Restaurant Tip',
            amount: 15.50,
            status: 'Completed',
            action: 'View Receipt'
        },
        {
            id: 5,
            no: '05',
            date: 'June 12, 2025',
            description: 'Coffee Shop Tip',
            amount: 5.25,
            status: 'Completed',
            action: 'View Receipt'
        }
    ])

    // Table state
    const [searchTerm, setSearchTerm] = useState('')
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(10)

    // Filter and sort data
    const filteredAndSortedData = useMemo(() => {
        let filtered = recentTips.filter(tip =>
            tip.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tip.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tip.date.toLowerCase().includes(searchTerm.toLowerCase())
        )

        if (sortConfig.key) {
            filtered.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1
                }
                return 0
            })
        }

        return filtered
    }, [recentTips, searchTerm, sortConfig])

    // Pagination
    const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedData = filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage)

    // Sorting function
    const handleSort = (key) => {
        let direction = 'asc'
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc'
        }
        setSortConfig({ key, direction })
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
        if (amount === null) return '---'
        const formatted = Math.abs(amount).toFixed(2)
        return amount >= 0 ? `+$${formatted}` : `-$${formatted}`
    }

    const getAmountClass = (amount) => {
        if (amount === null) return 'text-gray-400'
        return amount >= 0 ? 'text-green-600' : 'text-red-600'
    }

    const getActionButton = (action, status) => {
        if (action === 'View Receipt' && status === 'Completed') {
            return (
                <button className="px-3 py-1 text-xs bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors">
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
                            <button className="w-[100px] h-min fs_10 bg-[#147187] text-white py-2 px-4 whitespace-nowrap rounded hover:bg-[#147187] flex items-center justify-center">
                                Generate QR Code
                            </button>
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
                        <p className="fs_36 plus_Jakarta_Sans_bold font-bold text-gray-900 mb-4">$124.35</p>
                        </div>
                        <button className="bg_primary text-white py-2 px-4 rounded fs_10 hover:bg_dark transition-colors">
                            Withdraw
                        </button>
                    </div>

                    {/* Total Tips */}
                    <div className="flex-1 bg-white rounded-xl p-6 shadow-sm border flex flex-col justify-between">
                        <h3 className="fs_20 poppins_medium text-[var(--primary)] mb-2">Total Tips</h3>
                        <p className="text-3xl plus_Jakarta_Sans_bold text-end">$124.35</p>
                    </div>

                    {/* Tips This Month */}
                    <div className="flex-1 bg-white rounded-xl p-6 shadow-sm border flex flex-col justify-between">
                        <h3 className="fs_20 poppins_medium text-[var(--primary)] mb-2">Tips This Month</h3>
                        <p className="text-3xl plus_Jakarta_Sans_bold text-end">$120</p>
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
                            {paginatedData.map((tip) => (
                                <tr key={tip.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {tip.no}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {tip.date}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {tip.description}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <span className={getAmountClass(tip.amount)}>
                                            {formatAmount(tip.amount)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={getStatusBadge(tip.status)}>
                                            {tip.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {getActionButton(tip.action, tip.status)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-3 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredAndSortedData.length)} of {filteredAndSortedData.length} results
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                {[...Array(totalPages)].map((_, i) => (
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
        </div>
    )
}

export default Dashboard