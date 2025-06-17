"use client"

import React, { useEffect, useState } from 'react';
import DashboardPage from "./DashboardPage";
import { useSession } from 'next-auth/react';
import supabase from '@/app/config/supabaseClient';
import { useRouter } from 'next/navigation';
import "./Dashboardstyles.css"
import { Button } from '@/components/ui/button';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"

function Page() {
  type User = {
    id: number,
    email: string,
    username: string,
    Idea: string,
    Target_Audience: string,
    Problem: string,
    Unique: string,
    End_To_End: string,
    final: string
  };  

  const router = useRouter();
  const { data: session, status } = useSession();
  const [dt, setDt] = useState<User[] | null>(null);
  const [endToEndValue, setEndToEndValue] = useState<string>("");

  async function fetchSupaData() {
    if (session) {
      const { data, error } = await supabase
        .from('Users')
        .select()
        .eq('email', session.user?.email);

      if (data) {
        setDt(data);
        setEndToEndValue(data[0]?.End_To_End || "");
        if (data[0].Idea !== '') {
          if (data[0].Idea !== 'Done') {
            const rid = document.getElementById("refine-idea-dashboard");
            if (rid) {
              rid.style.display = "none";
            }
            const md = document.getElementById("main-dashboard");
            if(md) {
              md.style.opacity="1";
            }
          } else {
            const md = document.getElementById("main-dashboard");
            if(md) {
              md.style.opacity="1";
            }
          }
        } else {
          router.push("/Home");
        }
      }
    }
  }

  useEffect(() => {
    fetchSupaData();
  }, [router, status]);

  async function finalSetIdea() {
    console.log(endToEndValue);
    if (session) {
      const { error } = await supabase
      .from('Users')
      .update({ Idea: endToEndValue, End_To_End: endToEndValue })
      .eq('email', session.user?.email);
      router.push("/Home/Main");
    }
  }

  return (
    <>
      <div id="main-dashboard">
        <DashboardPage />
      </div>
      {dt && dt.length > 0 && dt[0].Idea=="Done" && (
        <div id="refine-idea-dashboard">
          <div>
            <h1>Before we continue to your dashboard, let's give your idea a final revision</h1>
            <h3>Confirm/Refine your idea below</h3>
            <textarea 
              onChange={(e) => setEndToEndValue(e.target.value)} 
              value={endToEndValue} 
              id="refine-idea-dashboard-textarea"
            />
            <div className='flex items-center justify-center gap-3'>
              <Button onClick={() => {
                const eteinput = document.getElementById("refine-idea-dashboard-textarea") as HTMLTextAreaElement;
                if (eteinput) {
                  eteinput.value = dt[0]?.End_To_End;
                }
              }}>Reset to Original</Button>
              <Button onClick={finalSetIdea} variant={'secondary'}>Yes it's fine</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Page;

// import React from 'react'

// function Page() {
//   return (
//     <div>Page</div>
//   )
// }

// export default Page