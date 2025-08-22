import React from 'react'
import { Logo } from '../../icons/icons'
import Input from '../../../utils/input'
import { RiEyeFill } from '@remixicon/react'
import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <>
      <img src={Logo} width={100} className='mx-auto' alt="" />

      <div className='mt-5 h-full'>
        <h1 className='fs_36 outfit_medium'>Login</h1>
        <h2 className='outfit mb-5 fs_20'>Login to your account</h2>
        <Input labels={'Email Address'} type={'email'} placeholder={'Enter your email'} icon={""} />
        <Input labels={'Password'} type={'password'} placeholder={'password'} icon={<RiEyeFill className='text-[var(--icon)] fs_16'/>} />
        <Link to={''} className='float-right text-[var(--primary)] poppins_medium fs_14'>Forgot Password?</Link>
        <button className='primary_btn mt-4'>Login</button>

        <span className='block poppins_medium fs_14 text-center mt-10'>Dont Have an account? <Link to={'/get-started'} className='text-[var(--primary)]'>Create New</Link></span>
      </div>
    </>
  )
}

export default Login
