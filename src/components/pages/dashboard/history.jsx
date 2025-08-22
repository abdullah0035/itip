import React, { useState } from 'react'
import { QrCodeIcon } from '../../icons/icons'
import DataTable from 'react-data-table-component';

const History = () => {
    const qrCodesLength = 2;
    const [selectedType, setSelectedType] = useState('all');

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

    // DataTable data - Extended for pagination demonstration
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
        },
        {
            id: 4,
            no: '04',
            date: 'June 12, 2025',
            description: 'Tips Received',
            amount: '+$150.00',
            status: 'Completed'
        },
        {
            id: 5,
            no: '05',
            date: 'June 10, 2025',
            description: 'Withdraw',
            amount: '-$300.00',
            status: 'Completed'
        },
        {
            id: 6,
            no: '06',
            date: 'June 8, 2025',
            description: 'Tips Received',
            amount: '+$75.00',
            status: 'Completed'
        },
        {
            id: 7,
            no: '07',
            date: 'June 6, 2025',
            description: 'Withdraw',
            amount: '-$450.00',
            status: 'Completed'
        },
        {
            id: 8,
            no: '08',
            date: 'June 4, 2025',
            description: 'Tips Received',
            amount: '+$200.00',
            status: 'Completed'
        },
        {
            id: 9,
            no: '09',
            date: 'June 2, 2025',
            description: 'Withdraw',
            amount: '-$100.00',
            status: 'Pending'
        },
        {
            id: 10,
            no: '10',
            date: 'May 30, 2025',
            description: 'Tips Received',
            amount: '+$320.00',
            status: 'Completed'
        },
        {
            id: 11,
            no: '11',
            date: 'May 28, 2025',
            description: 'Withdraw',
            amount: '-$180.00',
            status: 'Completed'
        },
        {
            id: 12,
            no: '12',
            date: 'May 26, 2025',
            description: 'Tips Received',
            amount: '+$95.00',
            status: 'Completed'
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
        pagination: {
            style: {
                borderTopStyle: 'solid',
                borderTopWidth: '1px',
                borderTopColor: '#f1f5f9',
                paddingTop: '16px',
                paddingBottom: '16px',
            },
        },
    };

    return (
        <div className="p-6 space-y-6">
            {/* Dashboard Header */}
            <div className='flex items-center justify-between'>
                <h1 className="fs_32 outfit_medium text-[#2C2C2C]">History</h1>
            </div>

            {/* Recent Tips Table */}
            <div className={`bg-white ${qrCodesLength === 0 ? 'flex flex-col items-center justify-center ' : 'sm:px-5 py-5 px-3'} h_100vh rounded-lg`}>
                <h1 className='fs_24 outfit_medium'>History</h1>
                <h2 className='fs_16 text-[var(--gray-400)]'>Deposit funds into your wallet using one of your virtual cards</h2>
                <div className='flex items-center gap-2 mt-3'>
                    <button className={`histroyTabs w-min ${selectedType === 'all' ? 'active' : ''}`} onClick={() => { setSelectedType('all') }}>All</button>
                    <button className={`histroyTabs w-min ${selectedType === 'tips' ? 'active' : ''}`} onClick={() => { setSelectedType('tips') }}>Tips</button>
                    <button className={`histroyTabs w-min ${selectedType === 'payout' ? 'active' : ''}`} onClick={() => { setSelectedType('payout') }}>Payout</button>
                </div>
                <hr className='my-10'/>

                {/* DataTable with Pagination */}
                <div className="mt-8">
                    <h3 className="fs_24 outfit_semibold text-gray-900 mb-6">Transaction History</h3>
                    <div className="bg-white rounded-lg overflow-hidden">
                        <DataTable
                            columns={columns}
                            data={data}
                            selectableRows
                            customStyles={customStyles}
                            pagination={true}
                            paginationPerPage={10}
                            paginationRowsPerPageOptions={[5, 10, 15, 20]}
                            highlightOnHover
                            responsive
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default History