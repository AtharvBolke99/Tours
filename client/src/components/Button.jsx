import React from 'react'


function Button({variant="primary", size="lg", title, onClick}) {
  const variants = {
    primary: "bg-[#2563EB] hover:bg-[#1E40AF] text-white",
    secondary: "bg-[#F8FAFC] hover:bg-[#E2E8F0] text-[#0F172A] border border-[#CBD5E1]",
    danger: "bg-[#EF4444] hover:bg-[#DC2626] text-white",
  }

  const sizes = {
    sm: "text-sm px-3 py-1.5",
    md: "text-base px-4 py-2",
    lg: "text-lg px-6 py-3",
  }
  return (
    
     <button
     onClick={onClick}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        rounded-md
        m-1
        transition
        hover:opacity-90
        cursor-pointer
      `}
    >
{title}
    </button>
  )
}

export default Button ;

