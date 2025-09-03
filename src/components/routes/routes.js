// Routing.js - Updated with better route organization
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
import UserRoutes from '../redux/auth/userRoutes'
import CustomerLogin from '../pages/customer/onboading/login'
import CustomerSignup from '../pages/customer/signup'

// Root redirect component
const RootRedirect = () => {
  const auth = useAuth()
  const loginRedirect = useSelector(state => state.auth?.loginRedirect) ?? "/dashboard";
  console.log("the login redirect is ", loginRedirect);
  return <Navigate to={auth ? loginRedirect : '/'} />
}

const Routing = () => {
  return (
    <>
      <Routes>
        {/* Private Routes */}
        <Route element={<PrivateRoutes />}>
          <Route path='/qr-setup' element={<QRCodeSetup />} />
          <Route path='/home' element={<Home />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/qr-codes' element={<QrCode />} />
          <Route path='/funds' element={<Funds />} />
          <Route path='/history' element={<History />} />
          <Route path='/account' element={<Account />} />
        </Route>

        {/* Public Routes */}
        <Route element={<PublicRoutes />}>
          <Route path='/' element={<Login />} />
          <Route path='/get-started' element={<GetStarted />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/verification' element={<VerificationCode />} />
          <Route path='/success' element={<SuccessScreen />} />
        </Route>

        <Route element={<UserRoutes />}>
        </Route>
          <Route path='/customer-login' element={<CustomerLogin />} />
          <Route path='/customer-signup' element={<CustomerSignup />} />

        <Route path="/tip/:qrToken" element={<Checkout />} />

        {/* Fallback route - redirects to appropriate page based on auth */}
        <Route path='*' element={<RootRedirect />} />
      </Routes>
    </>
  )
}

export default Routing