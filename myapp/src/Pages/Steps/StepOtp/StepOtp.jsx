import React, { useState } from 'react'
import Card from '../../../Componenets/Card/Card'
import TextInput from '../../../Componenets/TextInput/TextInput'
import Button from '../../../Componenets/Button/Button';
import { verifyOtp } from '../../../http/index';
import { useDispatch, useSelector } from 'react-redux'; //this is used to use the data we stored inside state variable
import { setAuth } from '../../../store/authSlice';

export default function StepOtp() {
  const [otp,setOtp] = useState('');

  const dispatch = useDispatch();
  const {phone,hash} = useSelector((state) => state.auth.otp);

  async function submit(){
    if(!otp || !phone || !hash) return;
    const {data} = await verifyOtp({otp,phone,hash});
    console.log(data);
    dispatch(setAuth(data));
  }

  return (
    <div className='flex justify-center mt-20'>
      <Card title='Enter the code we just texted you' icon='lock'>
        <TextInput value={otp} onChange={(e)=> setOtp(e.target.value)}></TextInput>
        <div className='mt-5'>
          <Button text="Next" onClick={submit}></Button>
        </div>
        <p className='text-gray-500 text-sm max-w-sm mt-3'>
          By entering your number, you're agreeing to 
          our Terms of Services and Privacy Policy. Thanks!
        </p>
      </Card>
    </div>
  )
}
