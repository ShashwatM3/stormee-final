import React from 'react';
import "./Unique.css";
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

function Unique() {
  const router = useRouter();
  return (
    <div id="unique-main" className='unique-main'>
      <h4>Setting us apart</h4>
      <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>What makes us different?</h1>
      <h3>Why shouldn't YOU go to our competitors...</h3><br/>
      <br/>
      <div className='flex items-center justify-center flex-col w-full'>
        <div id="unique1">
          <div>
            <h1>Speed/Quality of Execution</h1>
            <h3>This platform <b>serves to user, instead of leaving the user mid-way</b> Instead of frameworks or templates, we deliver <b>pitch-ready blueprints.</b></h3>
          </div>
          <div>
            <h1>Built-in Critical Feedback</h1>
            <h3>We don't believe in cheerful optimism when it comes to analyzing ideas. Stormee delivers data-backed clarity along with different feedback perspectives</h3>
          </div>
        </div>
        <div id="unique2">
          <div>
            <h1>Not a Tool. Not a convenience. Stage-wise Structure</h1>
            <h3>We guide founders through a structured journey: onboarding, idea solidification, validation, and business planning, without "throwing" content at them</h3>
          </div>
          <div>
            <h1>Not just output. We go Beyond.</h1>
            <h3>We provide more than just content. We provide ways to fill gaps in the user's idea or suggest pivots for more power.</h3><br/>
            <div className='flex items-center gap-2'>
            <Button onClick={() => {router.push("/auth")}} className='dark'>Get started</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Unique