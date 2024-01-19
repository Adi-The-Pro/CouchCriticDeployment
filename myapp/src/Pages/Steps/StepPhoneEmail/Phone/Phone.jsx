import React, { useState } from 'react'
import Card from '../../../../Componenets/Card/Card'
import Button from '../../../../Componenets/Button/Button'
import TextInput from '../../../../Componenets/TextInput/TextInput'
import {sendOtp} from '../../../../http/index'
import { useDispatch } from 'react-redux'
import { setOtp } from '../../../../store/authSlice'

export default function Phone({onNext}) {
  const [phoneNumber,setPhoneNumber] = useState();

  //To store data inside state variable that we receive from the backend i.e hash and phone number
  const dispatch = useDispatch();

  const submit = async () => {
    if(!phoneNumber) return;
    const {data} = await sendOtp({phone:phoneNumber});
    console.log(data);
    dispatch(setOtp({phone:data.phone,hash:data.hash}));
    onNext();
  }

  return (
    <Card title='Enter Your Phone Number' icon='phone'>
        <TextInput value={phoneNumber} onChange={(e)=> setPhoneNumber(e.target.value)}></TextInput>
        <div className='mt-5'>
          <Button text="Next" onClick={submit}></Button>
        </div>
        <p className='text-gray-500 text-sm max-w-sm mt-3'>
            By entering your number, you're agreeing to 
            our Terms of Services and Privacy Policy. Thanks!
        </p>
    </Card>
  )
}
