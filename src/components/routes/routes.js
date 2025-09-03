// Routing.js - Updated with shared dashboard routes
import { Route, Routes, Navigate } from 'react-router-dom'
import PrivateRoutes from '../redux/auth/privateRoutes'
import PublicRoutes from '../redux/auth/publicRoutes'
import Login from '../pages/onboading/login'
import Signup from '../pages/onboading/signup'
import VerificationCode from '../pages/onboading/verificationCode'
import SuccessScreen from '../pages/onboading/successScreen'
import GetStarted from '../pages/onboading/getStarted'
import QRCodeSetup from '../pages/onboading/qrCodeSetup'
import Home from '../pages/home/home'
import Dashboard from '../pages/dashboard/dashboard'
import QrCode from '../pages/dashboard/qrCode'
import Funds from '../pages/dashboard/funds'
import History from '../pages/dashboard/history'
import Account from '../pages/dashboard/account'
import { useAuth } from '../redux/auth/useAuth'
import { useSelector } from 'react-redux'
import Checkout from '../pages/home/checkout'
import CustomerLogin from '../pages/customer/onboading/login'
import CustomerPrivateRoutes from '../redux/auth/customerPrivateRoutes'
import CustomerPublicRoutes from '../redux/auth/customerPublicRoutes'
import CustomerSignup from '../pages/customer/onboading/signup'
import CustomerDashboard from '../pages/customer/dashboard/customerDashboard'
import CustomerHistory from '../pages/customer/dashboard/history'
import CustomerAccount from '../pages/customer/dashboard/account'

// Root redirect component
const RootRedirect = () => {
  const auth = useAuth()
  const loginRedirect = useSelector(state => state.auth?.loginRedirect) ?? "/dashboard";
  return <Navigate to={auth ? loginRedirect : '/'} />
}

const Routing = () => {
  return (
    <>
      <Routes>
        {/* Service Provider Private Routes */}
        <Route element={<PrivateRoutes />}>
          <Route path='/qr-setup' element={<QRCodeSetup />} />
          <Route path='/home' element={<Home />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/qr-codes' element={<QrCode />} />
          <Route path='/funds' element={<Funds />} />
          <Route path='/history' element={<History />} />
          <Route path='/account' element={<Account />} />
        </Route>

        {/* Service Provider Public Routes */}
        <Route element={<PublicRoutes />}>
          <Route path='/' element={<Login />} />
          <Route path='/get-started' element={<GetStarted />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/verification' element={<VerificationCode />} />
          <Route path='/success' element={<SuccessScreen />} />
        </Route>

        {/* Customer Private Routes - Share same dashboard components */}
        <Route element={<CustomerPrivateRoutes />}>
          <Route path='/customer-dashboard' element={<CustomerDashboard />} />
          <Route path='/customer-history' element={<CustomerHistory />} />
          <Route path='/customer-account' element={<CustomerAccount />} />
          {/* You can add customer-specific routes here if needed */}
        </Route>

        {/* Customer Public Routes */}
        <Route element={<CustomerPublicRoutes />}>
          <Route path='/customer-login' element={<CustomerLogin />} />
          <Route path='/customer-signup' element={<CustomerSignup />} />
        </Route>

        {/* Public tip route - accessible to everyone */}
        <Route path="/tip/:qrToken" element={<Checkout />} />

        {/* Fallback route - redirects to appropriate page based on auth */}
        <Route path='*' element={<RootRedirect />} />
      </Routes>
    </>
  )
}

export default Routing