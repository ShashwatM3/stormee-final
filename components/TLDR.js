import React from 'react';
import './TLDR.css'
import { Button } from './ui/button';

function TLDR() {
  return (
    <div className='tldr-main'>
      <div className='tldr-con'>
        <h1 className='scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0'>TL;DR &#8212; Stormee's Give & Take</h1><br/>
        <div>
          <div>
            <h3 className='scroll-m-20 text-2xl font-semibold tracking-tight'>What the founder comes to us with</h3>
            <ul>
            <li>An clear/unclear Idea</li>
            <li>No Business Plan</li>
            </ul>
          </div>
          <div>
            <h3 className='scroll-m-20 text-2xl font-semibold tracking-tight'>What we give the founder</h3>
            <ul>
            <li>Clear-cut Validation Report</li>
            <li>In-depth Competitive Analysis</li>
            <li>Multi-perspective 'break-down' of idea</li>
            </ul>
            <Button onClick={() => {
              const el = document.getElementById("hiw-main");
              if(el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }} variant='ghost' className='mt-3 dark border cursor-pointer'>How do we incorporate this</Button>
          </div>
        </div>
        <br/>
      </div>
    </div>
  )
}

export default TLDR