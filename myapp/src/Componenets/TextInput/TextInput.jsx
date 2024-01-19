import React from 'react'

export default function TextInput({props, onChange,fullWidth}) {
  return (
    <div>
        <input className='bg-gray-700 rounded-lg  text-white pl-2 pr-2 text-lg outline-none' 
            type='text' 
            style={{width: fullWidth==='true' ? '100%' : 'inherit' }}
            onChange={onChange}
            {...props}>
        </input>
    </div>
  )
}
