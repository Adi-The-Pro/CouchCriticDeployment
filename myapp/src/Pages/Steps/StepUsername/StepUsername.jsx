import React from 'react'

export default function StepUsername({onNext}) {
  return (
    <>
      <div>StepUsername</div>
      <button className='bg-blue-500' onClick={onNext}>
        <span>Next</span>
      </button>
    </>
  )
}
