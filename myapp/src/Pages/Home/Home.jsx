import React from 'react'
import { Link } from 'react-router-dom'
import Card from '../../Componenets/Card/Card'
import Button from '../../Componenets/Button/Button'
export default function Home() {
  return (
    <div className='flex justify-center mt-20'>
      <Card title='Welcome To CouchCritic' icon='Emoji'>
        <p className='text-lg leading-6 mb-4 text-gray-300'>
          Exciting things are happening at CouchCritic! As we add the final polish to our platform, 
          we're inviting users to join us on this journey. 
          Your comfort and experience matter, and we're ensuring a seamless and enjoyable space for everyone. 
        </p>
        <Link to='/authenticate'>
          <Button text="Let's Begin"></Button>
        </Link>
        <div className='mt-3 text-blue-500'>
          <span>Have an invite text?</span>
        </div>
      </Card>
    </div>
  )
}
