/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ApiFunction from '../../../utils/api/apiFuntions';
import { decryptData } from '../../../utils/api/encrypted';
import { setCheckoutData } from '../../redux/loginForm';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Extract the ID from URL

    const checkoutData = useSelector(state => state?.auth?.checkoutData);
    console.log("the checkout Data is",checkoutData);
    const { post } = ApiFunction();
    const [loading, setLoading] = useState(true);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [error, setError] = useState(null);
    const encryptedToken = useSelector(state => state?.auth?.token);
    const token = decryptData(encryptedToken);
    const urlId = parseInt(id); // Convert to number for comparison
    const tipId = checkoutData?.tip_id;
    useEffect(() => {
        // Check if URL ID matches checkoutData tip_id


        if (!tipId || urlId !== tipId) {
            // If no match, redirect to home page
            navigate('/');
            return;
        }

        updatePayment();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, checkoutData, navigate]);

    const updatePayment = async () => {
        try {
            setLoading(true);
            setError(null);

            const formData = {
                id: urlId, // API expects 'id', not 'tipId'
                action: 'updateTipStatus',
                amount: checkoutData?.amount ?? "",
                status: "completed",
                customerToken: token || "" // Send empty string if no token
            };

            const response = await post('', formData);

            if (response.status === 'success') {
                setUpdateSuccess(true);
            } else {
                setError(response.message || 'Failed to update payment status');
            }

        } catch (err) {
            console.error('Payment update error:', err);
            setError('Failed to update payment status. Please contact support.');
        } finally {
            setLoading(false);
        }
    };
const dispatch = useDispatch();
        const homeRedirect = () => {
            dispatch(setCheckoutData(null));
            navigate('/');
        }
    
    // Show loading state
    if (loading) {
        return (
            <div className="py-12 px-4">
                <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
                    <div className="text-center">
                        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Processing Payment...</h2>
                        <p className="text-gray-600">Please wait while we confirm your payment.</p>
                    </div>
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="py-12 px-4">
                <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
                    <div className="text-center">
                        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Processing Error</h2>
                        <p className="text-gray-600 mb-6">{error}</p>

                        <div className="space-y-3">
                            <button
                                onClick={() => updatePayment()}
                                className="primary_btn transition-colors"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => homeRedirect()}
                                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Return to Home
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Show success state
    return (
        <div className="py-12 px-4">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
                <div className="text-center">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Successful!</h2>
                    <p className="text-gray-600 mb-6">
                        Your tip of ${checkoutData?.amount || '0.00'} has been processed successfully.
                    </p>

                    {checkoutData?.tip_id && (
                        <div className="bg-gray-50 p-4 rounded-lg mb-6">
                            <p className="text-sm text-gray-600">Transaction ID:</p>
                            <p className="font-mono text-sm">{checkoutData?.tip_id}</p>
                        </div>
                    )}

                    <div className="space-y-3">
                        <button
                            onClick={() => navigate('/')}
                            className="primary_btn transition-colors"
                        >
                            Return to Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;