import React from 'react'
import { useState } from 'react';
import Phone from './Phone/Phone';
import Email from './Email/Email';
const phoneMap = {
  phone : Phone,
  email : Email,
};
export default function StepPhoneEmail({onNext}) {
  const [type,setType] = useState('phone');
  const CurrentComponent = phoneMap[type];
  return (
    <div className='flex justify-center mt-20'>
      <div className='max-w-xl rounded-lg p-4 text-center'>
        <div className='flex mb-2 justify-end'>
          <button onClick={()=>setType('phone')} 
            className={`h-10 w-8 rounded-lg ${type==='phone' ? 'bg-blue-600' : ''}`}
          >
            <img src='/images/phoneAndroid.png'></img>
          </button>
          <button onClick={()=>setType('email')} 
            className={`h-10 w-8 rounded-lg ml-4 ${type==='email' ? 'bg-blue-600' : ''}`}
          >
            <img src='/images/emailBlack.png'></img>
          </button>
        </div>
        <CurrentComponent onNext={onNext}></CurrentComponent>
      </div>
    </div>
  )
}
