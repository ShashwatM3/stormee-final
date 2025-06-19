"use client"

// import supabase from '@/app/config/supabaseClient';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import "./Dashboardstyles.css";
// import Nav from '@/components/Nav';
import rocket from "@/components/icons/rocket.png"
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import ExecutiveSummary from "./ExecutiveSummary";
import ExportPage from "./ExportPage";
import BusinessComponents from "./BusinessComponents";
import ValidationRiskReport from "./ValidationRiskReport";
import QueryBot from "./QueryBot";
import { NumberTicker } from "@/components/magicui/number-ticker";

function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  // async function fetchSupaData() {
  //   if (session) {
  //     const { data, error } = await supabase
  //     .from('Users')
  //     .select()
  //     .eq('email', session.user?.email)
  //     if(data) {
  //       if(data[0].Idea != '') {
          
  //       }
  //     }
  //   }
  // }
  // useEffect(() => {
  //   fetchSupaData();
  // }, [router, status])

  useEffect(() => {
    // console.log(status)
    setTimeout(() => {
      const dt = document.getElementById("dashboard-ticker");
      if(dt) {
        dt.style.display="none"
      }
      const dp = document.getElementById("dashboard-page");
      if(dp) {
        dp.style.opacity="1"
      }
    }, 1000);
  })

  return (
    <>
    <div id="dashboard-ticker">
      <NumberTicker
        id="numberticker"
        value={10.0}
        decimalPlaces={2}
        className="whitespace-pre-wrap text-8xl font-medium tracking-tighter text-white"
      />
    </div>
     <div className='dashboard-page' id="dashboard-page">
      <div className='navbar-dashboard flex items-center justify-between w-full'>
        <h1 className='flex items-center gap-4'>
          <Image src={rocket} alt=""/>
          Stormee AI
        </h1>
        <div className='flex items-center justify-center gap-10'>
          <a onClick={() => {
            router.push("/")
          }}>Home</a>
          <a>Features</a>
          <a>Demo</a>
          <a>Coming soon</a>
          <a>Contact</a>
        </div>
        <h1>{session?.user?.name} Dashboard</h1>
      </div>
      <div className='flex items-center justify-between mb-2'>
        <div></div>
        <Button onClick={() => {router.push("/Home")}} variant={'secondary'}>Go Back</Button>
      </div>

      <div className='flex items-start justify-between'>
        <div className='flex1'>
          <ExecutiveSummary/>
          <ExportPage/>
        </div>
        <div className='flex2'>
          <BusinessComponents/>
          <div className='flex items-center justify-center w-full gap-2'>
            <QueryBot/>
            <ValidationRiskReport/>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default DashboardPage