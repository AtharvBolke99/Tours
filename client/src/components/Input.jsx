import React from 'react'

function Input({type, value , placeholder, onChange, onKeyDown}) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      onKeyDown={onKeyDown}
      className="input-field border m-2 px-4 text-[17px] py-1 rounded-xl focus:outline-none w-full"
    />
  )
}

export default Input
