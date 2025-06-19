"use client"
import React, { useEffect, useState } from 'react';
import "./styles/Nav.css";
import rocket from "./icons/rocket.png"
import Image from 'next/image';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react';
import { Input } from './ui/input';
import supabase from '@/app/config/supabaseClient';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { signOut } from 'next-auth/react';

function Nav() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [idea, setIdea] = useState("");
  const [targetaudience, setTargetAudience] = useState("");
  const [problemstatement, setProblemStatement] = useState("");
  const [features, setFeatures] = useState("");
  const [uniqueness, setUniqueness] = useState("");

  async function fetchData(userEmail) {
    const { data, error } = await supabase
    .from('Users')
    .select()
    .eq("email", userEmail)

    // console.log(data);

    if(data && data.length>0) {
      setIdea(data[0].End_To_End);
      setTargetAudience(data[0].Target_Audience);
      setProblemStatement(data[0].Problem);
      setUniqueness(data[0].Unique);
      setFeatures(data[0].Features);
    }
  }
  
  // Initialize local state with session values when session is available
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
      fetchData(session.user.email);
    }
  }, [session]);

  return (
    <>
    <div className='nav-main'>
      <h1 className='flex items-center gap-4'>
        <Image src={rocket} alt=""/>
        Stormee AI
      </h1>
      {(pathname.includes("/Home")) ? (
        <React.Fragment>
          <div>
            {pathname.includes("/Business-Canvas") ? (
              <a onClick={() => {
                const el = document.getElementById("business-canvas-intro");
                if(el) {el.style.display="flex"};
                const el2 = document.getElementById("businesscanvas");
                if(el2) {el2.style.display="none"};
              }}>Your MVP Dashboard</a>
            ) : (
              <a onClick={() => {router.push("/Home/Business-Canvas")}}>Your MVP Dashboard</a>
            )}
          </div>
          <Button onClick={() => {
            const el = document.getElementById("profile-main");
            if(el) {
              el.style.display="flex";
            }
          }} variant={'secondary'}>Your Profile</Button>
        </React.Fragment>
      ): (
        <React.Fragment>
        {(!(pathname.includes("/auth"))) ? (
            <Button onClick={() => {router.push("/auth")}}>Register</Button>
        ): (
          <></>
        )}
        </React.Fragment>
      )}
    </div>
    {session && (
      <div id='profile-main'>
        <div>
          <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight text-balance mb-5'>Your Profile</h1>
          <div className='flex items-center justify-between mb-6'>
          <h2 className='font-light'>Your Name</h2>
          <Input className='dark' id="name-profile" onChange={(e) => {
            document.getElementById("update-button").disabled=false;
            setName(e.target.value)
          }} value={name}/>
          </div>
          <div className='flex items-center justify-between'>
          <h2 className='font-light'>Your Email</h2>
          <Input className='dark' id="email-profile" onChange={(e) => {
            setEmail(e.target.value)
          }} value={email}/>
          </div>
          <br/>
          <h1 className='scroll-m-20 pb-2 text-2xl font-semibold tracking-tight first:mt-0 mb-2'>Your Current Idea</h1>
          <div className='px-4 py-4 mb-5 border dark border-neutral-800 rounded-md bg-neutral-900'>
            {idea}
          </div>
          <Button className='mb-3 bg-neutral-800' onClick={(e) => {
            const el1 = document.getElementById("mainComponents");
            if(el1.style.display=="flex") {
              e.target.innerHTML="Open Components of Idea"
              el1.style.display="none";
            } else {
              e.target.innerHTML="Hide Components"
              el1.style.display="flex";
            }
          }}>Open Components of Idea</Button>
          {(idea && targetaudience && problemstatement && uniqueness && features) ? (
            <div id="mainComponents">
              <div className='idea-component'>
                <h2>Your Target Audience</h2>
                <h3>{targetaudience}</h3>
                <div className='flex items-center justify-between'>
                  <span></span>
                  {/* <Dialog>
                    <DialogTrigger asChild>
                      <Button className='dark'>Edit</Button>
                    </DialogTrigger>
                    <DialogContent className='dark'>
                      <DialogHeader>
                        <DialogTitle>Edit Target Audience Field</DialogTitle>
                        <DialogDescription>
                          Once you edit your target audience, your competitive landscape & validation dashboard will be <b>revamped</b>. <b>This action cannot be undone</b>
                        </DialogDescription>
                        <div id="ta-div">
                          <span className='mt-3'>Current Target Audience: </span>
                          <Textarea value={targetaudience} readOnly/><br/>
                          <span className='mt-3 font-bold'>New Target Audience: </span>
                          <Textarea id="newTargetAudience"/>
                          <Button onClick={() => {setNewTargetAudience}}>Set Target Audience</Button>
                        </div>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog> */}
                </div>
              </div>
              <div className='idea-component'>
                <h2>Problem being addressed</h2>
                <h3>{problemstatement}</h3>
                <div className='flex items-center justify-between'>
                  <span></span>
                  {/* <Button className='dark'>Edit</Button> */}
                </div>
              </div>
              <div className='idea-component'>
                <h2>Features Included</h2>
                <h3>{features}</h3>
                <div className='flex items-center justify-between'>
                  <span></span>
                  {/* <Button className='dark'>Edit</Button> */}
                </div>
              </div>
              <div className='idea-component'>
                <h2>What makes your idea unique</h2>
                <h3>{uniqueness}</h3>
                <div className='flex items-center justify-between'>
                  <span></span>
                  {/* <Button className='dark'>Edit</Button> */}
                </div>
              </div>
              {/* <div className='idea-component'>
                <h2>Current Features</h2>
                <h3>{features}</h3>
                <div className='flex items-center justify-between'>
                  <span></span>
                  <Button className='dark'>Edit</Button>
                </div>
              </div> */}
            </div>
          ) : (
            <div>Loading...</div>
          )}

          <br/><br/>
          <div className='flex items-center gap-2'>
            <Button onClick={() => {
              document.getElementById("profile-main").style.display="none";
            }} id="update-button" className='dark'>Go Back</Button>
            <Button id="update-button" className='dark' disabled>Update Changes</Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className='dark' variant='outline'>Log out</Button>
              </DialogTrigger>
              <DialogContent className='dark w-[30vw]'>
                <DialogHeader>
                  <DialogTitle className='mb-4'>Are you absolutely sure?</DialogTitle>
                  <DialogDescription className='mb-4'>
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers.
                  </DialogDescription>
                  <Button onClick={() => {
                    signOut({ callbackUrl: '/' });
                  }}>
                    Yes, I wish to log out
                  </Button>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    )}
    </>
  )
}

export default Nav

// "use client"
// import React, { useEffect, useState } from 'react';
// import "./styles/Nav.css";
// import rocket from "./icons/rocket.png"
// import Image from 'next/image';
// import { Button } from './ui/button';
// import { useRouter } from 'next/navigation';
// import { usePathname } from 'next/navigation'

// function Nav() {
//   const router = useRouter();
//   const pathname = usePathname();
  
//   return (
//     <div className='nav-main'>
//       <h1 onClick={() => {router.push("/")}} className='flex items-center gap-4 cursor-pointer'>
//         <Image src={rocket} alt=""/>
//         Stormee AI
//       </h1>
//     <Button 
//       className='bg-transparent border border-neutral-700 text-white hover:text-black hover:font-light hover:bg-white' 
//       onClick={() => {router.push("/waitlist")}} 
//       variant={'secondary'}>
//       Join Stormee AI
//     </Button>
//     </div>
//   )
// }

// export default Nav