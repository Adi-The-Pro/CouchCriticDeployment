import React, { useState } from 'react'
import Card from '../../../Componenets/Card/Card'
import TextInput from '../../../Componenets/TextInput/TextInput'
import Button from '../../../Componenets/Button/Button'
import { useDispatch,useSelector} from 'react-redux';
import {setName} from '../../../store/activateSlice';
export default function StepName({onNext}) {
  const {name} = useSelector((state) => state.activate);
  const dispatch = useDispatch();

  const [fullname,setFullname] = useState(name||'');

  function nextStep(){
    if(!fullname){
      return;
    }
    dispatch(setName(fullname));
    onNext();
  };

  return (
    <div className='flex justify-center mt-20'>
      <Card title='What’s your full name?' icon='name'>
        <TextInput value={fullname} onChange={(e)=> setFullname(e.target.value)}></TextInput>
        <p className='text-gray-500 text-sm max-w-sm mt-3'>
          People use real names at codershouse :) 
        </p>
        <div className='mt-5'>
          <Button text="Next" onClick={nextStep}></Button>
        </div>
      </Card>
    </div>

  )
}
