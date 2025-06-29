import React from 'react';
import './styles/Banner2.css'
import { AuroraText } from './magicui/aurora-text';
import { Input } from './ui/input';
import { Button } from './ui/button';
import validationEngine2 from "./icons/validationEngine2.png";
import Image from 'next/image';
import ProductVid from './ProductVid';
import { useRouter } from 'next/navigation';

function Banner2() {
  const router = useRouter();
  return (
    <div className='banner-main'>
      <div>
        <h1>The <span>MVP Dashboard</span> that helps you <AuroraText>Launch Faster</AuroraText></h1>
        <h3>We give you deep market-based validation and in-depth competitor insights in <b>minutes</b>.</h3>
        {/* <Input className='dark'/> */}
        <div className='flex gap-2 items-center justify-center'>
          <Button onClick={() => {
              router.push("/auth")
            }} className='dark'>Get Started</Button>
          <Button className='dark' variant='secondary'>Understand the process</Button>
        </div><br/><br/>
      </div>
      {/* <Image className='validation-banner' src={validationEngine2} alt=""/> */}
      <ProductVid/>
    </div>
  )
}

export default Banner2