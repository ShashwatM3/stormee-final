import React, { useEffect, useState } from 'react';
import "./styles/BC.css"
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import supabase from '@/app/config/supabaseClient';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

function BusinessComponents() {
  const { data: session, status } = useSession();
  const [paid, setPaid] = useState(false)
  useEffect(() => {
    async function fetchSupabaseData() {
      const {data, error} = await supabase
      .from('Users')
      .select()
      .eq('email', session.user?.email)
      console.log(Object.keys(data[0]).includes("Paid"));
    }
    if (status == 'authenticated') {
      fetchSupabaseData()
    }
  }, [status])
  
  return (
    <div className='bc-main'>
      <h1>Business Components</h1>
      <h3>All your startup components. All @ One Dashboard</h3>
      <div className='flex items-center justify-start gap-3 mb-[10px]'>
        <div className='bc-ch-con'>
          <Button>Market Analysis</Button>
          {paid ? (
              <Button>SWOT Analysis</Button>
          ):(
            <Dialog>
              <DialogTrigger asChild>
                <Button>SWOT Analysis</Button>
              </DialogTrigger>
              <DialogContent className='dark'>
                <DialogTitle>Message from Stormee AI</DialogTitle>
                <DialogDescription>
                  To access this section of your dashboard, you must pay the one-time fee of 15$.
                </DialogDescription>
              </DialogContent>
            </Dialog>
          )}
          {paid ? (
            <Button>Revenue Strategy</Button>
          ):(
            <Dialog>
              <DialogTrigger asChild>
                <Button>Revenue Strategy</Button>
              </DialogTrigger>
              <DialogContent className='dark'>
                <DialogTitle>Message from Stormee AI</DialogTitle>
                <DialogDescription>
                  To access this section of your dashboard, you must pay the one-time fee of 15$.
                </DialogDescription>
              </DialogContent>
            </Dialog>
          )}
        </div>
        <div className='flex gap-[10px]'>
          {paid ? (
            <Button>Marketing Strategy</Button>
          ):(
            <Dialog>
              <DialogTrigger asChild>
                <Button>Marketing Strategy</Button>
              </DialogTrigger>
              <DialogContent className='dark'>
                <DialogTitle>Message from Stormee AI</DialogTitle>
                <DialogDescription>
                  To access this section of your dashboard, you must pay the one-time fee of 15$.
                </DialogDescription>
              </DialogContent>
            </Dialog>
          )}
          {paid ? (
            <Button>Version Schedule</Button>
          ):(
            <Dialog>
              <DialogTrigger asChild>
                <Button>Version Schedule</Button>
              </DialogTrigger>
              <DialogContent className='dark'>
                <DialogTitle>Message from Stormee AI</DialogTitle>
                <DialogDescription>
                  To access this section of your dashboard, you must pay the one-time fee of 15$.
                </DialogDescription>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
      <div id='main-content-bc'></div>
    </div>
  )
}

export default BusinessComponents