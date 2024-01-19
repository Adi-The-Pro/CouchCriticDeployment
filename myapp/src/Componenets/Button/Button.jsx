import React from 'react'

export default function Button({text,onClick}) {
  return (
    <div className='flex justify-center mb-1'>
      {/*Here we have added hover effect on the button which changes the background color of the button and also a trasition which makes the changes smooth*/}
      <button onClick={onClick} 
        className='flex bg-blue-500 p-2 rounded-3xl font-bold hover:bg-blue-700 transition-all duration-300 ease-in-out'>
      <span>{text}</span>
      <img src="/images/arrow_forward.png" alt="Arrow" className='ml-1'/>
      </button>
    </div>

  )
}
