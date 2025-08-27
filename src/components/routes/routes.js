/* eslint-disable no-unused-vars */
import React from 'react'
import { Route, Routes } from 'react-router-dom'
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

const Routing = () => {
  return (
    <>
      
      <Routes>
        {/* <Route element={<PrivateRoutes />}></Route>
        <Route element={<PublicRoutes />}>
        </Route> */}
          <Route path='/' element={<Login />} />
          <Route path='/get-started' element={<GetStarted />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/verification' element={<VerificationCode />} />
          <Route path='/success' element={<SuccessScreen />} />
          <Route path='/qr-setup' element={<QRCodeSetup />} />
          <Route path='/home' element={<Home />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/qr-codes' element={<QrCode />} />
          <Route path='/funds' element={<Funds />} />
          <Route path='/history' element={<History />} />
          <Route path='/account' element={<Account />} />
      </Routes>
    </>
  )
}

export default Routing
