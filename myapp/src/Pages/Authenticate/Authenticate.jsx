import React from 'react'
import { useState } from 'react';
import StepPhoneEmail from '../Steps/StepPhoneEmail/StepPhoneEmail';
import StepOtp from '../Steps/StepOtp/StepOtp';
//It has two methods-->
//First is to take input email or phone number and Second Verify That Email/Phone Using OTP
const steps = {
    1 : StepPhoneEmail,
    2 : StepOtp,
};
export default function Authenticate() {
    const [step,setStep] = useState(1);
    const CurrentStep = steps[step];
    function onNext(){
      setStep(step+1);
    }
    return (
      <div>
        <CurrentStep onNext={onNext}></CurrentStep>
      </div>
    )
}
