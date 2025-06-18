import React from 'react';
import Nav from '@/components/Nav';
import BusinessCanvas from "./BusinessCanvas"

function Page() {
  return (
    <div>
      <Nav/>
      {/* <div className='h-[10vh] w-full'></div> */}
      <BusinessCanvas/>
    </div>
  )
}

export default Page