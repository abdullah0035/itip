import React from 'react'

const RadioButton = ({ 
  label, 
  value, 
  checked, 
  onChange, 
  name,
  marginTop = "0px", 
  marginBottom = "12px",
  labelClassName = "poppins fs_16 text-black",
  disabled = false 
}) => {

  const handleChange = () => {
    if (!disabled && onChange) {
      onChange(value)
    }
  }

  return (
    <div style={{ marginTop, marginBottom }}>
      <label className={`flex items-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
        <div className="relative">
          <input
            type="radio"
            name={name}
            value={value}
            checked={checked}
            onChange={handleChange}
            disabled={disabled}
            className="sr-only"
          />
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            checked 
              ? 'border-[var(--primary)] bg-[var(--primary)]' 
              : 'border-gray-400 hover:border-gray-500'
          } ${disabled ? 'opacity-50' : ''}`}>
            {checked && (
              <div className="w-2 h-2 bg-white rounded-full"></div>
            )}
          </div>
        </div>
        <span className={`ml-3 ${labelClassName}`}>{label}</span>
      </label>
    </div>
  )
}

export default RadioButton