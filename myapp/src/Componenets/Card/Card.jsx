import React from 'react'
export default function Card({title,icon,children}) {
  return (
    <div className="max-w-xl bg-gray-800 rounded-lg p-4 text-center">
      <div className="flex align-middle justify-center mb-4">
        {icon && <img src={`/images/${icon}.png`} alt="Hand" />}
        {title && <h1 className='ml-2 text-lg font-bold'>{title}</h1>}
      </div>
      {children}
    </div>
  )
}
