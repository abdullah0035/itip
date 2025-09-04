/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { QrCodeIcon } from '../../icons/icons'
import DataTable from 'react-data-table-component'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { decryptData } from '../../../utils/api/encrypted'
import ApiFunction from '../../../utils/api/apiFuntions'
import { toast } from 'react-toastify'

const History = () => {
    const navigate = useNavigate()
    const { get } = ApiFunction()
    
    // Get encrypted token from Redux store
    const encryptedToken = useSelector(state => state?.auth?.token)
    const token = decryptData(encryptedToken)

    // State management
    const [historyData, setHistoryData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [selectedType, setSelectedType] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalRows, setTotalRows] = useState(0)
    const [perPage, setPerPage] = useState(10)
    const [isInitialized, setIsInitialized] = useState(false)

    // Fetch history data from API
    const fetchHistoryData = async (page = 1, limit = 10, filter = 'all') => {
        if (!token) {
            setError('Authentication required')
            setIsLoading(false)
            navigate('/')
            return
        }

        // Prevent multiple simultaneous calls
        if (isLoading && isInitialized) {
            return
        }

        try {
            setIsLoading(true)
            setError('')

            const response = await get('', {
                action: 'history',
                token: token,
                filter: filter,
                page: page,
                limit: limit
            })
            
            if (response?.status === 'success') {
                const items = response?.history?.items || []
                const formattedData = items?.map((item, index) => ({
                    id: item?.id || index + 1,
                    no: String(((page - 1) * limit) + index + 1)?.padStart(2, '0'),
                    date: item?.date || 'N/A',
                    description: item?.description || 'N/A',
                    amount: item?.amount || '---',
                    amount_raw: item?.amount_raw || 0,
                    status: item?.status || 'Unknown',
                    type: item?.type || 'unknown'
                }))

                setHistoryData(formattedData)
                setTotalRows(response?.history?.pagination?.total_items || 0)
                setIsInitialized(true)
            } else {
                setError(response?.message || 'Failed to fetch history data')
                toast.error(response?.message || 'Failed to fetch history data')
            }
        } catch (error) {
            console.error('Error fetching history data:', error)
            const errorMessage = error?.message || 'Failed to load history data'
            setError(errorMessage)
            toast.error(errorMessage)
            
            // If unauthorized, redirect to login
            if (error?.response?.status === 403 || errorMessage?.includes('Unauthorized')) {
                
                navigate('/')
            }
        } finally {
            setIsLoading(false)
        }
    }

    // Fetch data when component mounts or filters change
    useEffect(() => {
        if (token && !isInitialized) {
            fetchHistoryData(1, perPage, selectedType)
            setCurrentPage(1)
        }
    }, [token])

    // Handle filter changes separately
    useEffect(() => {
        if (token && isInitialized) {
            fetchHistoryData(1, perPage, selectedType)
            setCurrentPage(1)
        }
    }, [selectedType])

    // Handle pagination change
    const handlePageChange = (page) => {
        if (page !== currentPage && !isLoading) {
            setCurrentPage(page)
            fetchHistoryData(page, perPage, selectedType)
        }
    }

    // Handle per page change
    const handlePerRowsChange = (newPerPage, page) => {
        if ((newPerPage !== perPage || page !== currentPage) && !isLoading) {
            setPerPage(newPerPage)
            setCurrentPage(page)
            fetchHistoryData(page, newPerPage, selectedType)
        }
    }

    // Handle filter change
    const handleFilterChange = (newFilter) => {
        if (newFilter !== selectedType && !isLoading) {
            setSelectedType(newFilter)
            setCurrentPage(1)
        }
    }

    // DataTable columns configuration
    const columns = [
        {
            name: 'No',
            selector: row => row?.no,
            sortable: true,
            width: '80px',
            style: {
                fontSize: '16px',
                fontFamily: 'outfit_medium',
                color: '#2C2C2C'
            }
        },
        {
            name: 'Date',
            selector: row => row?.date,
            sortable: true,
            style: {
                fontSize: '16px',
                fontFamily: 'outfit_medium',
                color: '#2C2C2C'
            }
        },
        {
            name: 'Description',
            selector: row => row?.description,
            style: {
                fontSize: '16px',
                fontFamily: 'outfit_medium',
                color: '#2C2C2C'
            }
        },
        {
            name: 'Amount',
            selector: row => row?.amount,
            right: true,
            cell: row => (
                <span className={`font-medium ${
                    row?.amount?.includes('-') ? 'text-red-600' :
                    row?.amount?.includes('+') ? 'text-green-600' :
                    'text-gray-400'
                }`}>
                    {row?.amount || '---'}
                </span>
            ),
            style: {
                fontSize: '16px',
                fontFamily: 'outfit_medium',
                color: '#2C2C2C'
            }
        },
        {
            name: 'Status',
            selector: row => row?.status,
            center: true,
            cell: row => (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                    row?.status === 'Completed' 
                        ? 'bg-green-100 text-green-800'
                        : row?.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                }`}>
                    {row?.status || 'Unknown'}
                </span>
            ),
        }
    ]

    // Custom styles for DataTable
    const customStyles = {
        header: {
            style: {
                minHeight: '56px',
            },
        },
        headRow: {
            style: {
                borderTopStyle: 'solid',
                borderTopWidth: '1px',
                borderTopColor: '#f1f5f9',
                backgroundColor: '#ffffff',
            },
        },
        headCells: {
            style: {
                '&:not(:last-of-type)': {
                    borderRightStyle: 'none',
                },
                fontSize: '16px',
                fontFamily: 'outfit_medium',
                color: '#969696',
                paddingLeft: '16px',
                paddingRight: '16px',
            },
        },
        rows: {
            style: {
                minHeight: '56px',
                '&:not(:last-of-type)': {
                    borderBottomStyle: 'solid',
                    borderBottomWidth: '1px',
                    borderBottomColor: '#f8fafc',
                },
                '&:hover': {
                    backgroundColor: '#f8fafc80',
                },
            },
        },
        cells: {
            style: {
                paddingLeft: '16px',
                paddingRight: '16px',
            },
        },
        pagination: {
            style: {
                borderTopStyle: 'solid',
                borderTopWidth: '1px',
                borderTopColor: '#f1f5f9',
                paddingTop: '16px',
                paddingBottom: '16px',
            },
        },
        progress: {
            style: {
                backgroundColor: '#f8fafc',
            },
        },
    }

    // Loading component for DataTable
    const LoadingComponent = () => (
        <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)] mb-4"></div>
            <p className="text-gray-500">Loading transaction history...</p>
        </div>
    )

    // Empty state component
    const NoDataComponent = () => (
        <div className="flex flex-col items-center justify-center py-16">
            <img src={QrCodeIcon} className='w-[80px] h-[80px] mb-4 opacity-50' alt="" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
            <p className="text-gray-500 text-center">
                {selectedType === 'tips' ? 'You haven\'t received any tips yet' :
                 selectedType === 'payout' ? 'No payout transactions found' :
                 'No transaction history available'}
            </p>
        </div>
    )

    // Skeleton loader for the main content
    const SkeletonLoader = () => (
        <div className="bg-white sm:px-5 py-5 px-3 h_100vh rounded-lg animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mb-4"></div>
            <div className="flex items-center gap-2 mb-4">
                <div className="h-8 bg-gray-200 rounded w-16"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
                <div className="h-8 bg-gray-200 rounded w-20"></div>
            </div>
            <hr className="my-10"/>
            <div className="mt-8">
                <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
                <div className="bg-white rounded-lg overflow-hidden">
                    <div className="border border-gray-200 rounded-lg">
                        {/* Table header skeleton */}
                        <div className="flex bg-gray-50 p-4 border-b">
                            <div className="flex-1 h-4 bg-gray-200 rounded mx-2"></div>
                            <div className="flex-1 h-4 bg-gray-200 rounded mx-2"></div>
                            <div className="flex-1 h-4 bg-gray-200 rounded mx-2"></div>
                            <div className="flex-1 h-4 bg-gray-200 rounded mx-2"></div>
                            <div className="flex-1 h-4 bg-gray-200 rounded mx-2"></div>
                        </div>
                        {/* Table rows skeleton */}
                        {[...Array(5)]?.map((_, index) => (
                            <div key={index} className="flex p-4 border-b border-gray-100">
                                <div className="flex-1 h-4 bg-gray-200 rounded mx-2"></div>
                                <div className="flex-1 h-4 bg-gray-200 rounded mx-2"></div>
                                <div className="flex-1 h-4 bg-gray-200 rounded mx-2"></div>
                                <div className="flex-1 h-4 bg-gray-200 rounded mx-2"></div>
                                <div className="flex-1 h-4 bg-gray-200 rounded mx-2"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )

    if (isLoading && currentPage === 1) {
        return (
            <div className="p-6 space-y-6">
                <div className='flex items-center justify-between'>
                    <h1 className="fs_32 outfit_medium text-[#2C2C2C]">History</h1>
                </div>
                <SkeletonLoader />
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-6 space-y-6">
                <h1 className="fs_32 outfit_medium text-[#2C2C2C]">History</h1>
                <div className="bg-white rounded-lg p-8 text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button 
                        onClick={() => fetchHistoryData(1, perPage, selectedType)}
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
                <h1 className="fs_32 outfit_medium text-[#2C2C2C]">History</h1>
            </div>

            {/* History Content */}
            <div className="bg-white sm:px-5 py-5 px-3 h_100vh rounded-lg">
                <h1 className='fs_24 outfit_medium'>History</h1>
                <h2 className='fs_16 text-[var(--gray-400)]'>View all your transaction history including tips and payouts</h2>
                
                {/* Filter Tabs */}
                <div className='flex items-center gap-2 mt-3'>
                    <button 
                        className={`histroyTabs w-min ${selectedType === 'all' ? 'active' : ''}`} 
                        onClick={() => handleFilterChange('all')}
                        disabled={isLoading}
                    >
                        All
                    </button>
                    <button 
                        className={`histroyTabs w-min ${selectedType === 'tips' ? 'active' : ''}`} 
                        onClick={() => handleFilterChange('tips')}
                        disabled={isLoading}
                    >
                        Tips
                    </button>
                    <button 
                        className={`histroyTabs w-min ${selectedType === 'payout' ? 'active' : ''}`} 
                        onClick={() => handleFilterChange('payout')}
                        disabled={isLoading}
                    >
                        Payout
                    </button>
                </div>
                
                <hr className='my-10'/>

                {/* DataTable with Pagination */}
                <div className="mt-8">
                    <h3 className="fs_24 outfit_semibold text-gray-900 mb-6">Transaction History</h3>
                    <div className="bg-white rounded-lg overflow-hidden">
                        <DataTable
                            columns={columns}
                            data={historyData || []}
                            customStyles={customStyles}
                            pagination
                            paginationServer
                            paginationTotalRows={totalRows}
                            paginationDefaultPage={currentPage}
                            paginationPerPage={perPage}
                            paginationRowsPerPageOptions={[5, 10, 15, 20]}
                            onChangeRowsPerPage={handlePerRowsChange}
                            onChangePage={handlePageChange}
                            highlightOnHover
                            responsive
                            progressPending={isLoading && currentPage > 1}
                            progressComponent={<LoadingComponent />}
                            noDataComponent={<NoDataComponent />}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default History