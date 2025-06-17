import React from 'react';
import "./GotAnIdea.css"
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

function GotAnidea() {
  const router = useRouter();
  return (
    <div className='got-an-idea-container'>
      <div>
        <h1 className='got-an-idea-title'>Got an idea?</h1>
        <h3 className='got-an-idea-subtitle py-3 border-b border-t border-neutral-700'>Do you want to save days of your time <b>researching</b> and <i>scouring</i> the internet</h3>
        <p className='got-an-idea-description'>If yes, then you're a perfect fit for <b>Stormee AI.</b></p>
        <Button onClick={() => {router.push("/auth")}} className='got-an-idea-button dark'>Get Started now!</Button>
      </div>
    </div>
  )
}

export default GotAnidea