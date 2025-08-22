import React from 'react'
import RadioButton from './radioButton'

const RadioGroup = ({ 
  label, 
  options = [], 
  value, 
  onChange, 
  name,
  marginTop = "0px", 
  marginBottom = "24px",
  labelClassName = "poppins fs_18 text-black",
  spacing = "12px"
}) => {

  return (
    <div className='' style={{ marginTop, marginBottom }}>
      {label && (
        <h3 className={`${labelClassName} mb-4`}>{label}</h3>
      )}
      
      <div className="space-y-3 flex justify-around">
        {options.map((option, index) => (
          <RadioButton
            key={option.value || index}
            label={option.label}
            value={option.value}
            checked={value === option.value}
            onChange={onChange}
            name={name}
            marginBottom={index === options.length - 1 ? "0px" : spacing}
            disabled={option.disabled}
          />
        ))}
      </div>
    </div>
  )
}

export default RadioGroup