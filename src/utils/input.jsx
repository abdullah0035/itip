import {  RiEyeOffFill } from '@remixicon/react';
import React, { useState } from 'react'

const Input = ({labels,placeholder,icon="",type='text',marginTop="0px", marginBottom='10px'}) => {
    const [showPassword, setShowPassword] = useState(false);
    
    // Determine if this is a password field with an icon
    const isPasswordField = type === 'password' && icon;
    
    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    
    // Determine the actual input type
    const inputType = isPasswordField && showPassword ? 'text' : type;
    
    // Determine which icon to show
    const getIcon = () => {
        if (!isPasswordField) {
            return icon; // Regular icon for non-password fields
        }
        return showPassword ? <RiEyeOffFill className='text-[var(--icon)] fs_16'/> : icon;
    };
    
    return (
        <div style={{ marginTop, marginBottom }}>
            <label htmlFor="" className='poppins fs_20'>{labels}</label>
            <div className='customInputGroup poppins mt-3'>
                <input type={inputType} className="customInput fs_16" placeholder={placeholder} />
                {icon && (
                    <span 
                        onClick={isPasswordField ? togglePasswordVisibility : undefined}
                        style={{ 
                            cursor: isPasswordField ? 'pointer' : 'default',
                            userSelect: 'none'
                        }}
                    >
                        {getIcon()}
                    </span>
                )}
            </div>
        </div>
    )
}

export default Input