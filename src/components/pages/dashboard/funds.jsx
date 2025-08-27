import { RiWallet3Fill, RiCheckLine } from '@remixicon/react';
import React, { useState } from 'react'
import { BalanceCardCircle } from '../../icons/icons';
import DataTable from 'react-data-table-component';

const Funds = () => {
    const [payoutFrequency, setPayoutFrequency] = useState('weekly');

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
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    row.status === 'Completed' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                }`}>
                    {row.status}
                </span>
            ),
        }
    ];

    // DataTable data
    const data = [
        {
            id: 1,
            no: '01',
            date: 'June 17, 2025',
            description: 'Withdraw',
            amount: '-$220.00',
            status: 'Completed'
        },
        {
            id: 2,
            no: '02',
            date: 'June 16, 2025',
            description: 'Withdraw',
            amount: '+$500.00',
            status: 'Completed'
        },
        {
            id: 3,
            no: '03',
            date: 'June 14, 2025',
            description: 'Withdraw',
            amount: '---',
            status: 'Pending'
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
        <div className="p-6 space-y-6">
            {/* Dashboard Header */}
            <div className='flex items-center justify-between'>
                <h1 className="fs_32 outfit_medium text-[#2C2C2C]">Funds</h1>
            </div>

            {/* Recent Tips Table */}
            <div className={`bg-white sm:px-5 py-5 px-3 h_100vh rounded-lg`}>
                <h1 className='fs_24 outfit_medium'>Funds</h1>
                <h2 className='fs_16 text-[var(--gray-400)]'>Deposit funds into your wallet using one of your virtual cards</h2>

                {/* Balance Cards */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6 mb-8'>
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
                                <h3 className="fs_48 outfit_medium ms-5 mb-0">$1,250.00</h3>
                                <button className="bg-[var(--primary)] float-end text-white px-4 py-2 rounded-lg fs_14 transition-colors">
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
                            <h3 className="fs_48 outfit_medium ms-5">$1,250.00</h3>
                        </div>
                    </div>
                </div>

                {/* Payout Options */}
                <h3 className="fs_24 outfit_semibold text-gray-900 mb-6">Payout Options</h3>
                <div className="border border-[var(--border-color)] p-5 rounded-xl">

                    {/* Bank Account */}
                    <div className="mb-6">
                        <h4 className="fs_24 outfit_semibold text-[#2C2C2D] mb-2">Bank Account</h4>
                        <p className="text-[#969696] fs_32 outfit_medium">4567 7856 3942 2337</p>
                    </div>

                    {/* Payout Frequency */}
                    <div className="flex items-center sm:gap-[100px] gap-[30px]">
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
                                    <span className="ml-3 fs_24 text-[#969696] outfit_medium whitespace-nowrap">Auto Month</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Payout Table */}
                <div className="mt-8">
                    <h3 className="fs_24 outfit_semibold text-gray-900 mb-6">Recent Payout</h3>
                    <div className="bg-white rounded-lg overflow-hidden">
                        <DataTable
                            columns={columns}
                            data={data}
                            selectableRows
                            customStyles={customStyles}
                            pagination={true}
                            highlightOnHover
                            responsive
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Funds