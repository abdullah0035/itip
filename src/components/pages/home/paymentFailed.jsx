import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ApiFunction from '../../../utils/api/apiFuntions';
import { decryptData } from '../../../utils/api/encrypted';
import { setCheckoutData } from '../../redux/loginForm';

const PaymentFailed = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { id } = useParams(); // Extract the ID from URL if using route params
    
    const checkoutData = useSelector(state => state?.auth?.checkoutData);
    const { post } = ApiFunction();
    const [loading, setLoading] = useState(false);
    const encryptedToken = useSelector(state => state?.auth?.token);
    const token = decryptData(encryptedToken);
    
    // Extract error data from URL parameters
    const errorMessage = searchParams.get('error_message') || searchParams.get('message');
    const transactionId = searchParams.get('transaction_id') || searchParams.get('txn_id') || id;
    
    useEffect(() => {
        // If we have transaction ID and checkout data, update status to failed
        if (transactionId && checkoutData) {
            const urlId = parseInt(transactionId);
            const tipId = checkoutData?.tip_id;
            
            // Only update if IDs match
            if (urlId === tipId) {
                updateFailedPaymentStatus(urlId);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transactionId, checkoutData]);

    const updateFailedPaymentStatus = async (tipId) => {
        try {
            setLoading(true);
            
            const formData = {
                id: tipId,
                action: 'updateTipStatus',
                amount: checkoutData?.amount ?? "",
                status: "failed",
                customerToken: token || ""
            };

            await post('', formData);
            // Don't need to handle response for failed payments
            
        } catch (err) {
            console.error('Failed payment status update error:', err);
            // Silently fail - not critical for user experience
        } finally {
            setLoading(false);
        }
    };

    const resetPaymentStatus = () => {
        // Clear URL parameters and redirect back to checkout
        window.history.replaceState({}, document.title, window.location.pathname);
        navigate(-1); // Go back to previous page
    };

    const retryPayment = () => {
        // If we have checkoutData, we can retry with the same data
        if (checkoutData) {
            navigate(-1); // Go back to checkout
        } else {
            navigate('/'); // Go to home if no checkout data
        }
    };
    const dispatch = useDispatch();
    
    const homeRedirect = () => {
        dispatch(setCheckoutData(null));
        navigate('/');
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
                <div className="text-center">
                    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Failed</h2>
                    <p className="text-gray-600 mb-6">
                        {errorMessage || 'Your payment could not be processed. Please try again or contact support if the issue persists.'}
                    </p>

                    {transactionId && (
                        <div className="bg-gray-50 p-4 rounded-lg mb-6">
                            <p className="text-sm text-gray-600">Transaction ID:</p>
                            <p className="font-mono text-sm">{transactionId}</p>
                        </div>
                    )}

                    {checkoutData && (
                        <div className="bg-gray-50 p-4 rounded-lg mb-6">
                            <p className="text-sm text-gray-600">Failed Amount:</p>
                            <p className="font-semibold">${checkoutData.amount || '0.00'}</p>
                        </div>
                    )}

                    {loading && (
                        <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg mb-6">
                            <p className="text-sm text-blue-700">Updating payment status...</p>
                        </div>
                    )}

                    <div className="space-y-3">
                        <button
                            onClick={retryPayment}
                            className="w-full bg-[#2C6B6F] text-white py-3 rounded-lg hover:bg-[#245559] transition-colors"
                            disabled={loading}
                        >
                            Try Again
                        </button>
                        <button
                            onClick={() => homeRedirect()}
                            className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                            disabled={loading}
                        >
                            Return to Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailed;