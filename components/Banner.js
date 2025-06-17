"use client"

import React from 'react';
import "./styles/Banner.css";
import { AuroraText } from "@/components/magicui/aurora-text";
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

// function Banner() {
//   const router = useRouter();
//   return (
//     <div className='banner' id="banner">
//       <div className='banner-main'>
//         <div className="banner-content">
//           <h1>
//             Brainstorm with Stormee AI and get a Complete MVP Analysis <AuroraText>within Minutes</AuroraText>
//           </h1>
//           <p>
//           Brainstorm and validate your idea instantly with Stormee AI. Get a complete MVP market analysis, competitive landscape insights, and a clear strategic blueprint — all within minutes.
//           </p>
//           <div>
//             <Button onClick={() => {
//               // const ban = document.getElementById("banner");
//               // if(ban) {
//               //   ban.setAttribute("id", "fadeOutElement");
//               //   setTimeout(() => {
//               //     router.push("/auth")
//               //   }, 800);
//               // }
//               router.push("/auth");
//             }}>Get started</Button>
//             <Button variant={'secondary'}>Learn More</Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Banner;

function Banner() {
  const router = useRouter();
  return (
    <div className='banner-main'>
      <div>
        <div>
          {/* <h1 className='scroll-m-20 text-4xl tracking-tight lg:text-6xl'>Transform an idea of <span>less than 10 words</span> to a <AuroraText>beautiful</AuroraText> MVP Dashboard with Validation Metrics</h1> */}
          <h1 className='scroll-m-20 text-4xl tracking-tight lg:text-6xl'>Deep Market Analysis and Multi-perspective Valdiation. Delivered in Minutes.</h1>
          <h3>Use Stormee AI to give your idea a backbone, through a stage-wise structured process. Jumpstart your product development journey.</h3>
          <div className='flex gap-2'>
            <Button onClick={() => {
              router.push("/auth")
            }} className='dark'>Get Started</Button>
            <Button onClick={() => {
              const el = document.getElementById("unique-main");
              if(el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }} className='dark' variant='secondary'>What do we offer?</Button>
          </div>
        </div>
      </div>
      {/* <div>
        <div></div>
      </div> */}
    </div>
  )
}

export default Banner

// function Banner() {
//   return (
//     <div className='banner-main'>
//       <div>
//         <h1>Deep Market Analysis and Multi-perspective Valdiation. Delivered in Minutes.</h1>
//       </div>
//     </div>
//   )
// }

// export default Banner