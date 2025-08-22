import React, { useState, useRef } from 'react'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Label } from '@headlessui/react'
import { RiArrowDownSLine, RiCheckLine } from '@remixicon/react'

const Select = ({ 
  labels, 
  options = [], 
  placeholder = "Select an option", 
  value, 
  onChange, 
  marginTop = "0px", 
  marginBottom = '10px',
  displayKey = 'name', // Key to display from options (e.g., 'name', 'title', etc.)
  valueKey = 'id' // Key to use as value (e.g., 'id', 'value', etc.)
}) => {
  const [selected, setSelected] = useState(value || null)
  const [dropupMode, setDropupMode] = useState(false)
  const buttonRef = useRef(null)

  const handleChange = (selectedOption) => {
    setSelected(selectedOption)
    if (onChange) {
      onChange(selectedOption)
    }
  }

  // Check if dropdown should open upward
  const checkDropupMode = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const spaceBelow = viewportHeight - rect.bottom
      const spaceAbove = rect.top
      
      // Approximate dropdown height (max-h-56 = 224px)
      const dropdownHeight = Math.min(options.length * 40, 224)
      
      // If not enough space below but enough space above, use dropup
      setDropupMode(spaceBelow < dropdownHeight && spaceAbove > dropdownHeight)
    }
  }

  // Add click handler to button to check position
  const handleButtonClick = () => {
    checkDropupMode()
  }

  return (
    <div style={{ marginTop, marginBottom }}>
      <Listbox value={selected} onChange={handleChange}>
        <Label className="poppins fs_20">{labels}</Label>
        <div className="relative mt-3">
          <ListboxButton 
            ref={buttonRef}
            onClick={handleButtonClick}
            className="customInputGroup w-full cursor-pointer text-left"
          >
            <span className="flex-1 truncate fs_16">
              {selected 
                ? (typeof selected === 'string' ? selected : selected[displayKey]) 
                : placeholder
              }
            </span>
            <RiArrowDownSLine 
              aria-hidden="true" 
              className={`w-5 h-5 text-[var(--icon)] transition-transform duration-200 ${dropupMode ? 'ui-open:rotate-0' : 'ui-open:rotate-180'}`}
            />
          </ListboxButton>

          <ListboxOptions className={`absolute z-50 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-lg border border-gray-300 focus:outline-none sm:text-sm max-h-56 ${
            dropupMode 
              ? 'bottom-full mb-1' 
              : 'top-full mt-1'
          }`}>
            {options.length === 0 ? (
              <div className="px-4 py-2 text-gray-500 fs_16">No options available</div>
            ) : (
              options.map((option, index) => (
                <ListboxOption
                  key={typeof option === 'string' ? index : option[valueKey] || index}
                  value={option}
                  className="group relative cursor-pointer py-2 pr-9 pl-3 text-gray-900 select-none hover:bg-gray-100 ui-active:bg-indigo-600 ui-active:text-white transition-colors duration-150"
                >
                  <span className="block truncate font-normal group-data-[selected]:poppins_bold fs_16">
                    {typeof option === 'string' ? option : option[displayKey]}
                  </span>

                  <span className="absolute inset-y-0 right-0 items-center pr-4 text-[var(--primary-dark)] group-data-[selected]:block hidden">
                    <RiCheckLine aria-hidden="true" className="w-5 h-5 text-[var(--primary)] fw-bold" />
                  </span>
                </ListboxOption>
              ))
            )}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  )
}

export default Select