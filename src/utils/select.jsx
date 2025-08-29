import React, { useState, useRef, useEffect } from 'react'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Label } from '@headlessui/react'
import { RiArrowDownSLine, RiCheckLine, RiSearchLine, RiLoader4Line } from '@remixicon/react'

const Select = ({ 
  labels, 
  options = [], 
  placeholder = "Select an option", 
  value, 
  onChange, 
  marginTop = "0px", 
  marginBottom = '10px',
  displayKey = 'name', // Key to display from options (e.g., 'name', 'title', etc.)
  valueKey = 'id', // Key to use as value (e.g., 'id', 'value', etc.)
  disabled = false, // Add disabled prop for loading states
  loading = false, // Add loading prop
  searchable = true // Make search optional
}) => {
  const [selected, setSelected] = useState(value || null)
  const [dropupMode, setDropupMode] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredOptions, setFilteredOptions] = useState(options)
  const buttonRef = useRef(null)
  const searchRef = useRef(null)

  // Update selected value when prop changes
  useEffect(() => {
    setSelected(value)
  }, [value])

  // Filter options based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredOptions(options)
    } else {
      const filtered = options.filter(option => {
        const displayValue = typeof option === 'string' ? option : option[displayKey]
        return displayValue.toLowerCase().includes(searchTerm.toLowerCase())
      })
      setFilteredOptions(filtered)
    }
  }, [searchTerm, options, displayKey])

  // Reset search when options change (e.g., when cities are loaded)
  useEffect(() => {
    setSearchTerm('')
  }, [options])

  const handleChange = (selectedOption) => {
    setSelected(selectedOption)
    setSearchTerm('') // Clear search when selecting
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
      
      // Approximate dropdown height (max-h-56 = 224px + search input)
      const dropdownHeight = Math.min(filteredOptions.length * 40 + (searchable ? 50 : 0), 274)
      
      // If not enough space below but enough space above, use dropup
      setDropupMode(spaceBelow < dropdownHeight && spaceAbove > dropdownHeight)
    }
  }

  // Add click handler to button to check position
  const handleButtonClick = () => {
    if (!disabled && !loading) {
      checkDropupMode()
    }
  }

  // Focus search input when dropdown opens
  const handleSearchFocus = () => {
    setTimeout(() => {
      if (searchRef.current) {
        searchRef.current.focus()
      }
    }, 100)
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleSearchKeyDown = (e) => {
    // Prevent the listbox from closing when typing
    e.stopPropagation()
  }

  return (
    <div style={{ marginTop, marginBottom }}>
      <Listbox value={selected} onChange={handleChange} disabled={disabled || loading}>
        <Label className="poppins fs_20">{labels}</Label>
        <div className="relative mt-3">
          <ListboxButton 
            ref={buttonRef}
            onClick={handleButtonClick}
            className={`customInputGroup w-full text-left ${
              disabled || loading 
                ? 'cursor-not-allowed opacity-50 bg-gray-100' 
                : 'cursor-pointer'
            }`}
            disabled={disabled || loading}
          >
            <span className="flex-1 truncate fs_16">
              {loading ? (
                <span className="flex items-center gap-2">
                  <RiLoader4Line className="w-4 h-4 animate-spin text-[var(--primary)]" />
                  Loading...
                </span>
              ) : (
                selected 
                  ? (typeof selected === 'string' ? selected : selected[displayKey]) 
                  : placeholder
              )}
            </span>
            {!loading && (
              <RiArrowDownSLine 
                aria-hidden="true" 
                className={`w-5 h-5 text-[var(--icon)] transition-transform duration-200 ${
                  dropupMode ? 'ui-open:rotate-0' : 'ui-open:rotate-180'
                }`}
              />
            )}
          </ListboxButton>

          {!disabled && !loading && (
            <ListboxOptions 
              onShow={searchable ? handleSearchFocus : undefined}
              className={`absolute z-50 w-full overflow-hidden rounded-lg bg-white text-base shadow-lg border border-gray-300 focus:outline-none sm:text-sm ${
                dropupMode 
                  ? 'bottom-full mb-1' 
                  : 'top-full mt-1'
              }`}
            >
              {/* Search Input */}
              {searchable && (
                <div className="sticky top-0 bg-white border-b border-gray-200 p-2">
                  <div className="relative">
                    <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      ref={searchRef}
                      type="text"
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] fs_14"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      onKeyDown={handleSearchKeyDown}
                    />
                  </div>
                </div>
              )}

              {/* Options List */}
              <div className="max-h-56 overflow-auto py-1">
                {filteredOptions.length === 0 ? (
                  <div className="px-4 py-2 text-gray-500 fs_16">
                    {searchTerm ? 'No matching options found' : 'No options available'}
                  </div>
                ) : (
                  filteredOptions.map((option, index) => (
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
              </div>
            </ListboxOptions>
          )}
        </div>
      </Listbox>
    </div>
  )
}

export default Select