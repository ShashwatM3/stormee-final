"use client"

import AIChat from '@/components/AIChat'
import Nav from '@/components/Nav'
import React, { useEffect, useState } from 'react';
import supabase from '@/app/config/supabaseClient';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

function Page() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isIdea, setIsIdea] = useState(false)
  async function fetchSupaData() {
    if (session) {
      const { data, error } = await supabase
      .from('Users')
      .select()
      .eq('email', session.user?.email)
      if(data) {
        if(data[0].Idea != '') {
          setIsIdea(true)
        }
      }
    }
  }
  useEffect(() => {
    fetchSupaData();
  }, [status])
  
  return (
    <div>
      <Nav/>
      {isIdea ? (
        <h1>Damn gurl</h1>
      ):(
        <div>
          <br/>
          <br/>
          <AIChat/>
        </div>
      )}
    </div>
  )
}

export default Page

// import React from 'react'

// function Page() {
//   return (
//     <div>Page</div>
//   )
// }

// export default Page