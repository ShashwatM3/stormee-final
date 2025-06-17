'use client'

import React, { useState } from 'react';
import "./styles.css";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Nav from '@/components/Nav';
import { useRouter } from 'next/navigation';
import supabase from '../config/supabaseClient';
import { toast } from 'sonner';

function Page() {
  const router = useRouter();
  const [code, setCode] = useState(" ");
  const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

  async function joinWaitlist() {
    const email_user = document.getElementById("email-waitlist") as HTMLInputElement;
    if(email_user) {
      const email = email_user.value;
      if (validateEmail(email)) {
        const { data, error } = await supabase
          .from('waitlist_users')
          .select()
          .eq('userEmail', email);
        if(data.length == 0) {
          const { error } = await supabase
          .from('waitlist_users')
          .insert({ userEmail: email })
          if(error==null) {
            const el1 = document.getElementById("s1");
            if(el1) {
              el1.style.display="none";
            }
            const el2 = document.getElementById("s2");
            if(el2) {
              el2.style.display="block";
            }
          } else {
            toast("Error Occurred! Please refresh and try again.")
          }
        } else {
          const el1 = document.getElementById("s1");
          if(el1) {
            el1.style.display="none";
          }
          const el2 = document.getElementById("s2");
          if(el2) {
            el2.style.display="block";
          }
          const el3 = document.getElementById("already");
          if(el3) {
            el3.innerHTML=" already "
          }
        }
      } else {
        toast("Incorrect email provided!")
      }
    }
  }
  return (
    <>
    <Nav/>
    <div className='waitlist-main'>
      <div>
        <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-6xl'>Join the waitlist</h1>
        <h2 className='scroll-m-20 text-xl font-semibold tracking-tight'>Currently, we're working on our MVP. Our mission is powerful and we intend to make the experience as productive as possible for you. But don't worry! <b>We're really close to sending it out!</b></h2>
        <h3>Enter your mail below and we'll keep you in the loop for updates and the launch</h3>
        <div id="s1">
          <div className='flex gap-2 w-full items-center justify-center mb-4'>
            <Input id="email-waitlist" placeholder='john.doe@gmail.com'/><Button onClick={() => {
              joinWaitlist()
            }} className='dark'>Let me know!</Button>
          </div>
          <Button onClick={() => {
            router.push("/");
          }} className='dark' variant='secondary'>Back to Home</Button>
        </div>
        <div id="s2">
          <Button className='w-full bg-transparent border border-neutral-700 mb-3'>You're on the waitlist ⚡️</Button>
          <h2 className='opacity-[50%]'>P.S. You'll get a 20% discount 🎉</h2>
        </div>
      </div>
    </div>
    </>
  )
}

export default Page