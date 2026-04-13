import React from 'react'

function Input({type, value , placeholder, onChange, onKeyDown}) {
  return (
    <input type={type} value={value} placeholder={placeholder} onChange={onChange} onKeyDown={onKeyDown}
    className='border border-[#E5E7EB] m-2 px-4 text-[17px] text-[#111827] py-1 rounded-xl focus:outline-1 outline-[#2563EB] w-full'/>
  )
}

export default Input
