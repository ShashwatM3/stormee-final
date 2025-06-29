'use client'
import React, { useEffect, useState } from 'react'
import "./styles.css";
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import BusinessMain from "./BusinessMain";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import supabase from '@/app/config/supabaseClient';
import { toast } from 'sonner';

function BusinessCanvas() {
  const [user, setUser] = useState("");
  const [openCanvas, setCanvas] = useState(false);
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState({});
  const [oneliner, setOneLiner] = useState("");
  const [probSt, setProbSt] = useState("");
  const [targaud, setTargAud] = useState("");
  const [usp, setUSP] = useState("");
  const [feat, setFeat] = useState("");
  const router = useRouter();

  async function handleIdeaRefine() {
    const el = document.getElementById("form-idea");
    if(el) {el.innerHTML="Loading..."}
    
    const { error } = await supabase
      .from('Users')
      .update({
        Idea: (oneliner == "" ? userData[0]?.Idea : oneliner),
        Target_Audience: (targaud == "" ? userData[0]?.Target_Audience : targaud),
        Problem: (probSt == "" ? userData[0]?.Problem : probSt),
        Unique: (usp == "" ? userData[0]?.Unique : usp),
        Features: (feat == "" ? userData[0]?.Features : feat),
        modifiedAndUpdated: "No"
      })
      .eq('email', session.user?.email);

    if (error) {
      // console.log(error);
      toast.error("Failed to update details");
    } else {
      toast.success("Details successfully updated");
      // Refresh the data after successful update
      fetchData(session.user.email);
      document.getElementById("sheet-close").click();
    }
  }

  async function fetchData(userEmail) {
    const { data, error } = await supabase
    .from('Users')
    .select()
    .eq('email', userEmail)

    if(data && data.length>0) {
      setUserData(data);
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      fetchData(session.user.email);
      setUser(session.user.name)
    }
  }, [])
  return (
    <>
    <div className='business-canvas-main' id="business-canvas-intro">
      <div>
        <h4 className='mb-2 text-xl font-light'>Welcome, {session?.user?.name}</h4>
        <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-5'>Your MVP Dashboard ⚡️</h1>
        <h3 className='opacity-[70%]'>Get pitch ready docs + market analysis + competitive landscape</h3>
        <br/><br/>
        <div className='cards-biz'>
          {/* <div className='card-biz'>
            <h1>Executive<br/>Summary ⚡️</h1> 
            <Button className='dark' variant={"outline"}>Launch</Button>
          </div> */}
          <div className='card-biz relative'>
            <h1 className='mb-5 border-b border-neutral-600 pb-3'>Your competitive landscape</h1>
            <h3 className='mb-5 w-[70%] opacity-[65%] text-lg'>Learn from a detailed report on the key details and insights relating to <b>current</b> as well as <b>failed</b> competitors</h3>
            <Button onClick={() => {
              const el = document.getElementById("business-canvas-intro");
              if(el) {el.style.display="none"};
              const el2 = document.getElementById("businesscanvas");
              if(el2) {el2.style.display="flex"};
            }} className='dark mb-2' variant={"outline"}>Launch</Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className='dark w-full'>What we give you</Button>
              </DialogTrigger>
              <DialogContent className='dark'>
                <DialogHeader>
                  <DialogTitle>Stormee AI Competitive Landscape</DialogTitle>
                </DialogHeader>
                <div className='px-4 mt-2 opacity-[70%]'>
                  <h3 className='mb-4'>In this final stage of Stormee AI, we give you everything you need to understand how "well" your idea will work out.</h3>
                  <hr className='border-neutral-700'/>
                  <h3 className='mb-2 mt-4'>What we offer in <b>Competitive Landscape</b></h3>
                  <div>
                    <li className='mb-2'><b className='italic'>Past Competitors</b> - what they were. why they failed. how you can learn from them</li>
                    <li className='mb-2'><b className='italic'>Current Competitors</b> - what they offer. their strengths and <b>pain points</b>. how you can learn from them</li>
                    <li>A similarity index indicating how similar your current idea is, to your competitors</li>
                  </div>
                  <hr className='border-neutral-700 mt-4'/>
                </div>
                <Button className='w-full'>Estimated Time Saved: <b><i>2-3 days.</i></b></Button>
              </DialogContent>
            </Dialog>
          </div>
          {/* <div className='card-biz relative'>
            <h1 className='mb-5'>In-depth Market Analysis</h1>
            <h3 className='mb-5 w-[70%] opacity-[65%] text-xl'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore</h3>
            <Button className='dark mb-2' variant={"outline"}>Launch</Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className='dark'>What we give you</Button>
              </DialogTrigger>
              <DialogContent className='dark'>
                <DialogHeader>
                  <DialogTitle>Stormee AI Competitive Landscape</DialogTitle>
                </DialogHeader>
                <div className='px-4 mt-2 opacity-[70%]'>
                  <h3 className='mb-4'>In this final stage of Stormee AI, we give you everything you need to understand how "well" your idea will work out.</h3>
                  <hr className='border-neutral-700'/>
                  <h3 className='mb-2 mt-4'>What we offer in <b>Competitive Landscape</b></h3>
                  <div>
                    <li className='mb-2'><b className='italic'>Past Competitors</b> - what they were. why they failed. how you can learn from them</li>
                    <li className='mb-2'><b className='italic'>Current Competitors</b> - what they offer. their strengths and <b>pain points</b>. how you can learn from them</li>
                    <li>A similarity index indicating how similar your current idea is, to your competitors</li>
                  </div>
                  <hr className='border-neutral-700 mt-4'/>
                </div>
                <Button className='w-full'>Estimated Time Saved: <b><i>2-3 days.</i></b></Button>
              </DialogContent>
            </Dialog>
          </div> */}
          <div className='card-biz relative flex'>
            <h1 className='mb-5 border-b border-neutral-600 pb-3'>Your Validation Report</h1>
            <h3 className='mb-5 w-[70%] opacity-[65%] text-lg'>Access a powerful <b>multi-perspective</b> validation report where your idea is analyzed from every angle.</h3>
            <Button onClick={() => {router.push("/Home/Validation-Engine")}} className='dark mb-2' variant={"outline"}>Launch</Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className='dark'>What we give you</Button>
              </DialogTrigger>
              <DialogContent className='dark'>
                <DialogHeader>
                  <DialogTitle>Stormee AI Validation Report</DialogTitle>
                </DialogHeader>
                <div className='px-4 mt-2 opacity-[70%]'>
                  <h3 className='mb-4'>Validate your startup idea with data-driven insights and risk assessment to understand potential success factors and challenges.</h3>
                  <hr className='border-neutral-700'/>
                  <h3 className='mb-2 mt-4'>What we offer in <b>Validation Report</b></h3>
                  <div>
                    <li className='mb-2'><b className='italic'>Market Validation</b> - demand analysis, market size assessment, and growth potential evaluation</li>
                    <li className='mb-2'><b className='italic'>Risk Assessment</b> - identification of potential challenges, market barriers, and failure points</li>
                    <li className='mb-2'><b className='italic'>Success Metrics</b> - key performance indicators and validation criteria for your idea</li>
                    <li>Data-driven recommendations for improving your startup's chances of success</li>
                  </div>
                  <hr className='border-neutral-700 mt-4'/>
                </div>
                <Button className='w-full'>Estimated Time Saved: <b><i>4-5 days.</i></b></Button>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {userData.length>0 && (
          <div className='flex items-center justify-center gap-2 mt-7'>
            <Button onClick={() => {
              const el = document.getElementById("profile-main");
              if(el) {
                el.style.display="flex";
              }
            }} className='dark px-10' variant='secondary'>View Current Idea</Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button className='dark' variant='secondary'>Refine Idea</Button>
              </SheetTrigger>
              <SheetContent className='dark p-5 pt-10 h-full overflow-scroll'>
                <SheetHeader className='form-idea' id="form-idea">
                  <SheetTitle className='text-xl border-b pb-4 border-neutral-600'>Describe your idea</SheetTitle><br/>
                  <h3 className='mb-2'>Refine your one-line startup idea</h3>
                  <Textarea 
                    onChange={(e) => {
                      setOneLiner(e.target.value);
                    }} 
                    value={oneliner || userData[0]?.Idea} 
                    id="form1" 
                    className='mb-4'
                  />

                  <h3 className='mb-2'>Refine your problem statement</h3>
                  <Textarea 
                    onChange={(e) => {
                      setProbSt(e.target.value);
                    }}
                    value={probSt || userData[0]?.Problem} 
                    id="form2" 
                    className='mb-4'
                  />

                  <h3 className='mb-2'>Refine your primary target audience</h3>
                  <Textarea 
                    onChange={(e) => {
                      setTargAud(e.target.value);
                    }}
                    value={targaud || userData[0]?.Target_Audience} 
                    id="form3" 
                    className='mb-4'
                  />

                  <h3 className='mb-2'>Refine your USP (What makes your product unique)</h3>
                  <Textarea 
                    onChange={(e) => {
                      setUSP(e.target.value);
                    }}
                    value={usp || userData[0]?.Unique} 
                    id="form4" 
                    className='mb-4'
                  />

                  <h3 className='mb-2'>Refine what features your product offers</h3>
                  <Textarea 
                    onChange={(e) => {
                      setFeat(e.target.value);
                    }}
                    value={feat || userData[0]?.Features} 
                    id="form5" 
                    className='mb-4'
                  />

                  <Button onClick={handleIdeaRefine} className='w-full'>Submit</Button>
                </SheetHeader>
                <SheetClose id="sheet-close">Close</SheetClose>
              </SheetContent>
            </Sheet>
          </div>
        )}
      </div>
    </div>
    <div id="businesscanvas">
      <BusinessMain/>
    </div>
    </>
  )
}

export default BusinessCanvas