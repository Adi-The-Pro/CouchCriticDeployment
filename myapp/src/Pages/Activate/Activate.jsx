import React, { useState } from 'react'
import StepName from '../Steps/StepName/StepName.jsx';
import StepAvatar from '../Steps/StepAvatar/StepAvatar.jsx';

const steps = {
  1 : StepName,
  2 : StepAvatar
};
export default function Activate() {
  const [step,setStep] = useState(1);
  const CurrentStep = steps[step];
  function onNext(){
    setStep(step+1);
  };
  return (
    <div>
      <CurrentStep onNext={onNext}></CurrentStep>
    </div>
  )
}
