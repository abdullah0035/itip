import React, { useState } from 'react'
import { RiEyeFill } from '@remixicon/react'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../../../utils/input'
import Select from '../../../utils/select'
import { Logo } from '../../icons/icons'

const Signup = () => {
  const [selectedCity, setSelectedCity] = useState(null)
  const navigate = useNavigate();
  // City options
  const cities = [
    { id: 1, name: 'New York' },
    { id: 2, name: 'Los Angeles' },
    { id: 3, name: 'Chicago' },
    { id: 4, name: 'Houston' },
    { id: 5, name: 'Phoenix' },
    { id: 6, name: 'Philadelphia' },
    { id: 7, name: 'San Antonio' },
    { id: 8, name: 'San Diego' },
    { id: 9, name: 'Dallas' },
    { id: 10, name: 'San Jose' },
    { id: 11, name: 'Austin' },
    { id: 12, name: 'Jacksonville' },
    { id: 13, name: 'Fort Worth' },
    { id: 14, name: 'Columbus' },
    { id: 15, name: 'Charlotte' }
  ]

  const handleCityChange = (city) => {
    setSelectedCity(city)
    console.log('Selected city:', city) // You can handle the selected city here
  }

  const handleSubmit = () => {
    navigate('/success');
  }

  return (
    <>
      <img src={Logo} width={100} className='mx-auto' alt="" />

      <div className='mt-5 h-full'>
        <h1 className='fs_36 outfit_medium'>Sign Up</h1>
        <h2 className='outfit mb-10 fs_20'>Sign Up to your account</h2>
        
        {/* First Name and Last Name Row */}
        <div className='grid grid-cols-2 gap-4 mb-4'>
          <div className=''>
            <Input labels={'First Name'} type={'text'} placeholder={'First Name'} icon={""} />
          </div>
          <div className=''>
            <Input labels={'Last Name'} type={'text'} placeholder={'Last Name'} icon={""} />
          </div>
        </div>

        <Input labels={'Email Address'} type={'email'} placeholder={'Your Email Address'} icon={""} />
        <Input labels={'Password'} type={'password'} placeholder={'Password'} icon={<RiEyeFill className='text-[var(--icon)] fs_16'/>} />
        <Input labels={'Country'} type={'text'} placeholder={'Country'} icon={""} />
        
        {/* City Dropdown */}
        <Select
          labels={'City'}
          options={cities}
          placeholder={'Select City'}
          value={selectedCity}
          onChange={handleCityChange}
          displayKey={'name'}
          valueKey={'id'}
          marginBottom={'20px'}
        />

        <button className='primary_btn mt-4' onClick={()=>handleSubmit()}>Sign Up</button>

        <span className='block poppins_medium fs_14 text-center mt-10'>I already have an account? <Link to={'/'} className='text-[var(--primary)]'>Sign In</Link></span>
      </div>
    </>
  )
}

export default Signup