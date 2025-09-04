/* eslint-disable react-hooks/exhaustive-deps */
import { RiWallet3Fill, RiCheckLine } from '@remixicon/react';
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { BalanceCardCircle } from '../../icons/icons';
import DataTable from 'react-data-table-component';
import ApiFunction from '../../../utils/api/apiFuntions'
import { decryptData } from '../../../utils/api/encrypted'

// Skeleton Components
const SkeletonCard = () => (
    <div className="fundsCard animate-pulse">
        <div className="relative z-10">
            <div className="flex items-start gap-3 mb-4">
                <div className="w-[41px] h-[41px] bg-gray-300 rounded-md"></div>
                <div className="h-6 bg-gray-300 rounded w-32 mt-1"></div>
            </div>
            <div className="">
                <div className="h-12 bg-gray-300 rounded w-40 ms-5 mb-4"></div>
                <div className="float-end h-10 bg-gray-300 rounded w-32"></div>
            </div>
        </div>
    </div>
);

const SkeletonTable = () => (
    <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
        {[...Array(3)].map((_, i) => (
            <div key={i} className="flex space-x-4 py-3">
                <div className="h-4 bg-gray-300 rounded w-12"></div>
                <div className="h-4 bg-gray-300 rounded w-24"></div>
                <div className="h-4 bg-gray-300 rounded w-32"></div>
                <div className="h-4 bg-gray-300 rounded w-20"></div>
                <div className="h-4 bg-gray-300 rounded w-16"></div>
            </div>
        ))}
    </div>
);

const SkeletonBankInfo = () => (
    <div className="border border-[var(--border-color)] p-5 rounded-xl animate-pulse">
        <div className="mb-6">
            <div className="h-6 bg-gray-300 rounded w-32 mb-2"></div>
            <div className="h-8 bg-gray-300 rounded w-48"></div>
        </div>
        <div className="flex items-center gap-8">
            <div className="h-6 bg-gray-300 rounded w-28"></div>
            <div className="h-6 bg-gray-300 rounded w-32"></div>
        </div>
    </div>
);

const Funds = () => {
    const [loading, setLoading] = useState(true)
    const [payoutLoading, setPayoutLoading] = useState(false)
    const [fundsData, setFundsData] = useState(null)
    const [payoutFrequency, setPayoutFrequency] = useState('manual')
    const { post,get } = ApiFunction()
    
    // Get token from Redux store
    const encryptedToken = useSelector(state => state.auth?.token)
    const token = decryptData(encryptedToken)

    // Load funds data on component mount
    useEffect(() => {
        loadFundsData()
    }, [])

    const loadFundsData = async () => {
        if (!token) {
            toast.error('Authentication token not found. Please login again.')
            return
        }

        setLoading(true)
        try {
            const response = await get('?action=getFundsData&token=' + encodeURIComponent(token))
            
            if (response?.status === 'success') {
                setFundsData(response.funds_data)
                setPayoutFrequency(response.funds_data.payout_frequency || 'manual')
            } else {
                toast.error(response?.message || 'Failed to load funds data')
            }
        } catch (error) {
            console.error('Error loading funds data:', error)
            toast.error('An error occurred while loading funds data')
        } finally {
            setLoading(false)
        }
    }

    const handlePayoutFrequencyChange = async (newFrequency) => {
        if (!token) {
            toast.error('Authentication token not found. Please login again.')
            return
        }

        setPayoutLoading(true)
        
        try {
            const response = await post('', {
                action: 'updatePayoutFrequency',
                token: token,
                payout_frequency: newFrequency
            })

            if (response?.status === 'success') {
                setPayoutFrequency(newFrequency)
                toast.success('Payout frequency updated successfully')
            } else {
                toast.error(response?.message || 'Failed to update payout frequency')
            }
        } catch (error) {
            console.error('Error updating payout frequency:', error)
            toast.error('An error occurred while updating payout frequency')
        } finally {
            setPayoutLoading(false)
        }
    }

    const handleWithdraw = async () => {
        if (!token) {
            toast.error('Authentication token not found. Please login again.')
            return
        }

        if (!fundsData?.bank_account?.has_bank_account) {
            toast.error('Please add your bank account details first')
            return
        }

        if (fundsData?.available_balance?.amount <= 0) {
            toast.error('Insufficient balance for withdrawal')
            return
        }

        try {
            const response = await post('', {
                action: 'initiateWithdrawal',
                token: token,
                amount: fundsData.available_balance.amount
            })

            if (response?.status === 'success') {
                toast.success(response.message)
                // Reload funds data to reflect updated balance
                loadFundsData()
            } else {
                toast.error(response?.message || 'Failed to initiate withdrawal')
            }
        } catch (error) {
            console.error('Error initiating withdrawal:', error)
            toast.error('An error occurred while processing withdrawal')
        }
    }

    // DataTable columns configuration
    const columns = [
        {
            name: 'No',
            selector: row => row.no,
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
            selector: row => row.date,
            sortable: true,
            style: {
                fontSize: '16px',
                fontFamily: 'outfit_medium',
                color: '#2C2C2C'
            }
        },
        {
            name: 'Description',
            selector: row => row.description,
            style: {
                fontSize: '16px',
                fontFamily: 'outfit_medium',
                color: '#2C2C2C'
            }
        },
        {
            name: 'Amount',
            selector: row => row.amount,
            right: true,
            style: {
                fontSize: '16px',
                fontFamily: 'outfit_medium',
                color: '#2C2C2C'
            }
        },
        {
            name: 'Status',
            selector: row => row.status,
            center: true,
            cell: row => (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                    row.status === 'Completed' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                }`}>
                    {row.status}
                </span>
            ),
        }
    ];

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
    };

    return (
        <div className="p-6 max-sm:p-5 space-y-4">
            {/* Dashboard Header */}
            <div className='hidden items-center justify-between sm:flex '>
                <h1 className="fs_32 outfit_medium text-[#2C2C2C]">Funds</h1>
            </div>

            {/* Recent Tips Table */}
            <div className={`bg-white sm:px-5 py-5 px-0 h_100vh rounded-lg`}>
                <h1 className='sm:fs_24 fs_40 outfit_medium'>Funds</h1>
                <h2 className='fs_16 text-[var(--gray-400)]'>Deposit funds into your wallet using one of your virtual cards</h2>

                {/* Balance Cards */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6 mb-8'>
                    {loading ? (
                        <>
                            <SkeletonCard />
                            <SkeletonCard />
                        </>
                    ) : (
                        <>
                            {/* Available Balance Card */}
                            <div className="fundsCard">
                                <img src={BalanceCardCircle} className='bg_circle' alt="" />
                                <div className="relative z-10">
                                    <div className="flex items-start gap-3 mb-4">
                                        <div className="p-2 bg-[var(--primary)] rounded-md flex items-center justify-center">
                                            <RiWallet3Fill className='text-white h-[25px] w-[25px]' />
                                        </div>
                                        <span className="fs_20 outfit_medium mt-1">Available Balance</span>
                                    </div>
                                    <div className="">
                                        <h3 className="fs_48 outfit_medium ms-5 mb-0">
                                            {fundsData?.available_balance?.formatted || '$0.00'}
                                        </h3>
                                        <button 
                                            onClick={handleWithdraw}
                                            disabled={!fundsData?.user_info?.can_withdraw}
                                            className={`float-end text-white px-4 py-2 rounded-lg fs_14 transition-colors ${
                                                fundsData?.user_info?.can_withdraw 
                                                    ? 'bg-[var(--primary)] hover:opacity-90' 
                                                    : 'bg-gray-400 cursor-not-allowed'
                                            }`}
                                        >
                                            Withdraw Now
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Total Earnings Card */}
                            <div className="fundsCard">
                                <img src={BalanceCardCircle} className='bg_circle' alt="" />
                                {/* Background decoration */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-8 translate-x-8"></div>
                                <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-y-4 translate-x-4"></div>

                                <div className="relative z-10">
                                    <div className="flex items-start gap-3 mb-4">
                                        <div className="p-2 bg-[var(--primary)] rounded-md flex items-center justify-center">
                                            <RiWallet3Fill className='text-white h-[25px] w-[25px]' />
                                        </div>
                                        <span className="fs_20 outfit_medium mt-1">Total Earnings</span>
                                    </div>
                                    <h3 className="fs_48 outfit_medium ms-5">
                                        {fundsData?.total_earnings?.formatted || '$0.00'}
                                    </h3>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Payout Options */}
                <h3 className="fs_24 outfit_semibold text-gray-900 mb-6">Payout Options</h3>
                
                {loading ? (
                    <SkeletonBankInfo />
                ) : (
                    <div className="border border-[var(--border-color)] p-5 rounded-xl">
                        {/* Bank Account */}
                        <div className="mb-6">
                            <h4 className="fs_24 outfit_semibold text-[#2C2C2D] mb-2">Bank Account</h4>
                            <p className="text-[#969696] fs_32 outfit_medium">
                                {fundsData?.bank_account?.account_number_formatted || 'No account linked'}
                            </p>
                        </div>

                        {/* Payout Frequency */}
                        <div className="flex items-center max-sm:items-start max-sm:flex-col sm:gap-[100px] gap-[30px]">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <input
                                        type="radio"
                                        id="auto-weekly"
                                        name="payout-frequency"
                                        value="weekly"
                                        checked={payoutFrequency === 'weekly'}
                                        onChange={(e) => handlePayoutFrequencyChange(e.target.value)}
                                        disabled={payoutLoading}
                                        className="sr-only"
                                    />
                                    <label
                                        htmlFor="auto-weekly"
                                        className={`flex items-center cursor-pointer ${payoutLoading ? 'opacity-50' : ''}`}
                                    >
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${payoutFrequency === 'weekly'
                                            ? 'border-teal-600 bg-teal-600'
                                            : 'border-gray-300 bg-white'
                                            }`}>
                                            {payoutFrequency === 'weekly' && (
                                                <RiCheckLine className="w-3 h-3 text-white" />
                                            )}
                                        </div>
                                        <span className="ml-3 fs_24 text-[#969696] outfit_medium whitespace-nowrap">Auto Weekly</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-0">
                                <div className="relative">
                                    <input
                                        type="radio"
                                        id="auto-monthly"
                                        name="payout-frequency"
                                        value="monthly"
                                        checked={payoutFrequency === 'monthly'}
                                        onChange={(e) => handlePayoutFrequencyChange(e.target.value)}
                                        disabled={payoutLoading}
                                        className="sr-only"
                                    />
                                    <label
                                        htmlFor="auto-monthly"
                                        className={`flex items-center cursor-pointer ${payoutLoading ? 'opacity-50' : ''}`}
                                    >
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${payoutFrequency === 'monthly'
                                            ? 'border-teal-600 bg-teal-600'
                                            : 'border-gray-300 bg-white'
                                            }`}>
                                            {payoutFrequency === 'monthly' && (
                                                <RiCheckLine className="w-3 h-3 text-white" />
                                            )}
                                        </div>
                                        <span className="ml-3 fs_24 text-[#969696] outfit_medium whitespace-nowrap">Auto Month</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-0">
                                <div className="relative">
                                    <input
                                        type="radio"
                                        id="manual"
                                        name="payout-frequency"
                                        value="manual"
                                        checked={payoutFrequency === 'manual'}
                                        onChange={(e) => handlePayoutFrequencyChange(e.target.value)}
                                        disabled={payoutLoading}
                                        className="sr-only"
                                    />
                                    <label
                                        htmlFor="manual"
                                        className={`flex items-center cursor-pointer ${payoutLoading ? 'opacity-50' : ''}`}
                                    >
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${payoutFrequency === 'manual'
                                            ? 'border-teal-600 bg-teal-600'
                                            : 'border-gray-300 bg-white'
                                            }`}>
                                            {payoutFrequency === 'manual' && (
                                                <RiCheckLine className="w-3 h-3 text-white" />
                                            )}
                                        </div>
                                        <span className="ml-3 fs_24 text-[#969696] outfit_medium whitespace-nowrap">Manual</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Recent Payout Table */}
                <div className="mt-8">
                    <h3 className="fs_24 outfit_semibold text-gray-900 mb-6">Recent Payout</h3>
                    <div className="bg-white rounded-lg overflow-hidden">
                        {loading ? (
                            <SkeletonTable />
                        ) : (
                            <DataTable
                                columns={columns}
                                data={fundsData?.recent_payouts || []}
                                selectableRows
                                customStyles={customStyles}
                                pagination={true}
                                highlightOnHover
                                responsive
                                noDataComponent={
                                    <div className="text-center py-8 text-gray-500">
                                        No payout history available
                                    </div>
                                }
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Funds