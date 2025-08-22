import React from 'react'

const Textarea = ({
  labels,
  placeholder = "",
  value = "",
  onChange = null,
  rows = 4,
  marginTop = "0px",
  marginBottom = "10px",
  disabled = false,
  maxLength,
  showCharCount = false,
  className = "",
  name = ""
}) => {

  const handleChange = (e) => {
    if (onChange && typeof onChange === 'function') {
      // Return value and field name like the Input component
      onChange(e.target.value, name || labels);
    }
  }

  const characterCount = value ? value.length : 0
  const isOverLimit = maxLength && characterCount > maxLength

  return (
    <div style={{ marginTop, marginBottom }} className={className}>
      {labels && (
        <label className='poppins fs_20 block mb-3'>{labels}</label>
      )}
      
      <div className='customInputGroup min-h-fit items-start'>
        <textarea
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
          name={name || labels}
          className="customInput fs_16 flex-1 resize-none py-2 min-h-[100px]"
          style={{ minHeight: `${rows * 24}px` }}
        />
      </div>

      {/* Character count display */}
      {(showCharCount || maxLength) && (
        <div className={`text-right mt-1 fs_12 ${
          isOverLimit ? 'text-red-500' : 'text-gray-500'
        }`}>
          {maxLength ? `${characterCount}/${maxLength}` : `${characterCount} characters`}
        </div>
      )}
    </div>
  )
}

export default Textarea