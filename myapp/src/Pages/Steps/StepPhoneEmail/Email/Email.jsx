import React, { useState } from 'react'
import Card from '../../../../Componenets/Card/Card'
import Button from '../../../../Componenets/Button/Button'
import TextInput from '../../../../Componenets/TextInput/TextInput'

export default function Email({onNext}) {
  const [email,setEmail] = useState('999999999');
  return (
    <Card title='Enter Your Email Id' icon='email'>
      <TextInput value={email} onChange={(e)=> setEmail(e.target.value)}></TextInput>
      <div className='mt-5'>
          <Button text="Next" onClick={onNext}></Button>
      </div>
      <p className='text-gray-500 text-sm max-w-sm mt-3'>
          By entering your number, you're agreeing to 
          our Terms of Services and Privacy Policy. Thanks!
      </p>
    </Card>
  )
}
