import React from 'react';
import "./styles/VRR.css"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function ValidationRiskReport() {
  return (
    <div className='vrr-main'>
      <h1>Your Validation Risk Report</h1>
      <h3>How your product will play out in the real-world market</h3>
      <div className='flex items-center justify-between'>
        <span></span>
        <Button>View Report</Button>
      </div>
    </div>
  )
}

export default ValidationRiskReport