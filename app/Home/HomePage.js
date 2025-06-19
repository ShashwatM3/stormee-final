import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import supabase from '../config/supabaseClient';
import { Button } from '@/components/ui/button';
import "./HomePage.css";
import tick from "@/components/icons/tick.png"
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import muse from "@/components/icons/muse.png"
import { useRouter } from 'next/navigation';
import cross from "@/components/icons/cross.png";
import inprogress from "@/components/icons/inprogress.png";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

function HomePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  // const [tutorial, setTutorial] = useState(false);
  const [stage, setStage] = useState("Tutorial");
  const [idea, setIdea] = useState("");
  const [targetAudience, setTargetAudience] = useState('');
  const [problem, setProblem] = useState('');
  const [unique, setUnique] = useState('');
  const [features, setFeatures] = useState('');
  const [endToEndDescription, setEndToEndDescription] = useState('');
  const [location, setLocation] = useState('')
  const [currentStage, setCurrentStage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [oneliner, setOneLiner] = useState("");
  const [probSt, setProbSt] = useState("");
  const [targaud, setTargAud] = useState("");
  const [usp, setUSP] = useState("");
  const [feat, setFeat] = useState("");
  const fieldValues = {
    targetAudience,
    problem,
    unique,
    features,
    endToEndDescription,
    idea
  };
  const fieldData = {
    idea: "Your Idea",
    targetAudience: "Target Audience",
    problem: "Problem Statement",
    unique: "Unique Value Proposition",
    features: "Key Features",
  };

  const simpleGPTResp = async (prompt) => {
    try {
      // Make sure prompt is a string and not empty
      if (!prompt || typeof prompt !== 'string') {
        throw new Error('Prompt must be a non-empty string');
      }
  
      const res = await fetch("/api/sendback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt }),
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        console.error('API error response:', errorText);
        throw new Error(`HTTP error! status: ${res.status}`);
      }
  
      const text = await res.text(); // First get the raw text
      if (!text) {
        throw new Error('Empty response received');
      }
  
      try {
        const data = JSON.parse(text);
        if (!data.reply && !data.error) {
          throw new Error('Response missing required fields');
        }
        return data.reply;
      } catch (e) {
        console.error('Failed to parse JSON:', text);
        throw new Error('Invalid JSON response from server');
      }
    } catch (error) {
      console.error('Error in simpleGPTResp:', error);
      // Check if toast is defined before using it
      if (typeof toast !== 'undefined') {
        toast.error('Failed to get AI response. Please try again.');
      }
      throw error;
    }
  };

  async function fetchData(userEmail) {
    const { data, error } = await supabase
      .from('Users')
      .select()
      .eq('email', userEmail)

    if(data && data.length>0) {
      setUserData(data);
      setOneLiner(data[0].Idea || '');
      setProbSt(data[0].Problem || '');
      setTargAud(data[0].Target_Audience || '');
      setUSP(data[0].Unique || '');
      setFeat(data[0].Features || '');
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      fetchData(session.user.email);
    }
  }, [status, session]);

  async function handleSubmitForm() {
    try {

      const form1 = document.getElementById("form1");
      const form2 = document.getElementById("form2");
      const form3 = document.getElementById("form3");
      const form4 = document.getElementById("form4");
      const form5 = document.getElementById("form5");
      const form6 = document.getElementById("form6");
      let cnt = 0;

      // if(form1) {
      //   if(form1.value.trim().length>0) {
      //     cnt+=1;
      //   }
      // }
      // if(form2) {
      //   if(form2.value.trim().length>0) {
      //     cnt+=1;
      //   }
      // }
      // if(form3) {
      //   if(form3.value.trim().length>0) {
      //     cnt+=1;
      //   }
      // }
      // if(form4) {
      //   if(form4.value.trim().length>0) {
      //     cnt+=1;
      //   }
      // }
      // if(form5) {
      //   if(form5.value.trim().length>0) {
      //     cnt+=1;
      //   }
      // }
      // if(form6) {
      //   if(form6.value.trim().length>0) {
      //     cnt+=1;
      //   }
      // }

      if(form1.value.trim().length>0 && form2.value.trim().length>0 && form3.value.trim().length>0) {
        try {
          const el1 = document.getElementById("idea-questions");
          if(el1) {
            toast.custom((t) => (
              <div id="waveringElement" className="p-6 bg-neutral-900 rounded-lg border border-neutral-600 shadow">
                Storing your idea for validation + MVP Dashboard
              </div>
            ));
          }
          const resp = await simpleGPTResp(`
            I have the following inputs from a founder:
            Idea: ${form1.value}
            Problem: ${form2.value}
            Target Audience: ${form3.value}
            Unique Value Proposition: ${form4.value}
            Key Features: ${form5.value}
            Geographic Location: ${form6.value}

            Using the above inputs, return a JSON object with grammatically refined and powerful versions of each section.

            Strict Output Requirements:
            - Return only a valid JSON object.
            - Avoid using the em dash (—) in your generated content
            - The JSON must have the following keys (all string values):
              "The Idea"
              "The Problem"
              "The Target Audience"
              "The Unique Value Proposition"
              "The Key Features"
              "The End-to-End Description"
            - Use only the provided content for transformation.
            - Ensure the values are refined for grammar, clarity, and tone.
            - Do not include anything outside the JSON object (no markdown, no explanation, no preamble).

            Strict Output Format:
            {
              "The Idea": "refined text here",
              "The Problem": "refined text here",
              "The Target Audience": "refined text here",
              "The Unique Value Proposition": "refined text here",
              "The Key Features": "refined text here",
              "The Location": "Only and only if the user has mentioned any geographic location",
              "The End-to-End Description": "refined and aggregated summary using all above information"
            }
          `);


          // console.log('AI Response:', resp);
          let respo = resp.substring(resp.indexOf("{"), resp.indexOf("}")+1);
          let data = JSON.parse(respo);
          
          // Update the state with the form values
          setIdea(data["The Idea"]);
          setProblem(data["The Problem"]);
          setTargetAudience(data["The Target Audience"]);
          setUnique(data["The Unique Value Proposition"]);
          setFeatures(data["The Key Features"]);
          setEndToEndDescription(data["The End-to-End Description"]);
          setLocation(data["The Location"]);
          // console.log(data);
          
          const { error } = await supabase
            .from('Users')
            .update({
              Idea: data["The Idea"],
              Target_Audience: data["The Target Audience"],
              Problem: data["The Problem"],
              Unique: data["The Unique Value Proposition"],
              Features: data["The Key Features"],
              location: data["The Location"],
              End_To_End: data["The End-to-End Description"],
            })
            .eq('email', session.user?.email);

          // console.log(error);

          if(error==null) {
            
            // Update local state
            setCurrentStage('validation');
            
            // Show success message and navigate
            toast.success('Idea submitted successfully! Moving to validation stage.');
            
            // Close the sheet if it's open
            const sheetClose = document.getElementById("sheet-close");
            if (sheetClose) {
              sheetClose.click();
            }
            
            // Optional: Add a small delay before showing the next stage
            setTimeout(() => {
              // The page will automatically show the validation stage due to state change
            }, 1000);
          }
        } catch (error) {
          console.error('Error submitting form:', error);
          toast.error('Failed to submit idea. Please try again.');
        }
      } else {
        toast.error('Please fill out all the required fields');
      }
    } catch (error) {
      console.error('Error in handleSubmitForm:', error);
      toast.error('An unexpected error occurred');
    }
  }

  async function handleIdeaRefine() {
    const el = document.getElementById("form-idea");
    if(el) {el.innerHTML="Loading..."}
    
    const { error } = await supabase
      .from('Users')
      .update({
        Idea: oneliner,
        Target_Audience: targaud,
        Problem: probSt,
        Unique: usp,
        Features: feat,
      })
      .eq('email', session.user?.email);

    if (error) {
      console.log(error);
      toast.error("Failed to update details");
    } else {
      toast.success("Details successfully updated");
      fetchData(session.user.email);
      document.getElementById("sheet-close").click();
    }
  }
  
  useEffect(() => {
    async function getSupaData() {
      if (status !== 'authenticated' || !session?.user?.email) {
        // console.log('Waiting for session to load...');
        setIsLoading(true);
        return;
      }
      
      setIsLoading(false);
      // console.log('Fetching data for email:', session.user.email);
      
      try {
        const { data, error } = await supabase
          .from('Users')
          .select()
          .eq('email', session.user.email);

        if (error) {
          console.error('Error fetching user data:', error);
          return;
        }

        if (data && data.length > 0) {
          // console.log(data[0].Stage);
          setStage(data[0].Stage);
          setIdea(data[0].Idea || '');
          setTargetAudience(data[0].Target_Audience || '');
          setProblem(data[0].Problem || '');
          setUnique(data[0].Unique || '');
          setFeatures(data[0].Features || '');
          setEndToEndDescription(data[0].End_To_End || '');
          // console.log(data[0].final)

          if (!data[0].Idea || data[0].Idea.trim() === '') {
            setCurrentStage("muse");
          } else if (data[0].Idea.trim().length > 0) {
            setCurrentStage("validation");
          }

          if(data[0].final == "Yes") {
            setCurrentStage("canvas")
          }
        } else {
          // router.push("/");
        }
      } catch (err) {
        console.error('Error in getSupaData:', err);
      }
    }

    getSupaData();
  }, [status, session, router]);

  if (isLoading || status === 'loading') {
    return (
      <div className='home-page-main'>
        <div className="flex items-center justify-center h-screen">
          <div className="loader1"></div>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/auth');
    return null;
  }

  return (
    <div className='home-page-main'>
      {currentStage == "canvas" ? (
        <div className='hpm-1'>
          {/* <div className='user-progress'>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant='secondary' className='dark'>Your Progress</Button>
              </DialogTrigger>
              <DialogContent className='dark'>
                <DialogHeader>
                  <DialogTitle>Your Progress, {session?.user?.name}</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                  {currentStage=="muse" && (
                    <>
                    <span className='flex gap-2 mb-2'><Image alt="" src={inprogress}/>Stage 1: Idea Creation</span>

                    <span className='flex gap-2 mb-2'><Image alt="" src={cross}/><span>Stage 2: Validation Engine</span></span>

                    <span className='flex gap-2'><Image alt="" src={cross}/><span>Stage 3: Stormee Canvas</span></span>
                    </>
                  )}
                  {currentStage=="validation" && (
                    <>
                    <span className='flex gap-2 mb-2'><Image alt="" src={tick}/>Stage 1: Idea Creation</span>

                    <span className='flex gap-2 mb-2'><Image alt="" src={inprogress}/><span>Stage 2: Validation Engine</span></span>

                    <span className='flex gap-2'><Image alt="" src={cross}/><span>Stage 3: Stormee Canvas</span></span>
                    </>
                  )}
                </DialogDescription>
              </DialogContent>
            </Dialog>
          </div> */}
          <h2 className='scroll-m-20 text-2xl font-light tracking-tight'>Welcome, {session?.user?.name}</h2>
          <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>Stage 3: MVP Dashboard</h1>
          <h3 className='opacity-[70%]'><b>View detailed competitive and market analysis tailored to your idea</b></h3>
          <div className='flex items-center justify-center gap-4 mt-2'>
            <Card className='dark w-[30vw] px-5'>
              <CardHeader>
                <CardTitle className='scroll-m-20 text-2xl font-semibold tracking-tight'>MVP Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='opacity-[60%]'>Actionable Insights on your competition and the current market demand for your startup idea</p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => {router.push("/Home/Business-Canvas")}} className='w-full'>Launch MVP Dashboard</Button>
              </CardFooter>
            </Card>
          </div>
          <div className='flex items-center justify-center gap-2'>
            {/* <Sheet>
              <SheetTrigger asChild>
                <Button className='dark cursor-pointer py-1' variant='secondary'>Refine Idea</Button>
              </SheetTrigger>
              <SheetContent className='dark p-5 pt-10'>
                <SheetHeader className='form-idea' id="form-idea">
                  <SheetTitle className='text-xl border-b pb-4 border-neutral-600'>Describe your idea</SheetTitle><br/>
                  <h3 className='mb-2'>Refine your one-line startup idea</h3>
                  <Textarea 
                    onChange={(e) => {
                      setOneLiner(e.target.value);
                    }} 
                    value={oneliner || userData[0]?.Idea} 
                    id="form1-1" 
                    className='mb-4'
                  />

                  <h3 className='mb-2'>Refine your problem statement</h3>
                  <Textarea 
                    onChange={(e) => {
                      setProbSt(e.target.value);
                    }}
                    value={probSt || userData[0]?.Problem} 
                    id="form2-1" 
                    className='mb-4'
                  />

                  <h3 className='mb-2'>Refine your primary target audience</h3>
                  <Textarea 
                    onChange={(e) => {
                      setTargAud(e.target.value);
                    }}
                    value={targaud || userData[0]?.Target_Audience} 
                    id="form3-1" 
                    className='mb-4'
                  />

                  <h3 className='mb-2'>Refine your USP (What makes your product unique)</h3>
                  <Textarea 
                    onChange={(e) => {
                      setUSP(e.target.value);
                    }}
                    value={usp || userData[0]?.Unique} 
                    id="form4-1" 
                    className='mb-4'
                  />

                  <h3 className='mb-2'>Refine what features your product offers</h3>
                  <Textarea 
                    onChange={(e) => {
                      setFeat(e.target.value);
                    }}
                    value={feat || userData[0]?.Features} 
                    id="form5-1" 
                    className='mb-4'
                  />

                  <Button onClick={handleIdeaRefine} className='w-full'>Submit</Button>
                </SheetHeader>
                <SheetClose id="sheet-close">Close</SheetClose>
              </SheetContent>
            </Sheet> */}

            <Dialog>
              <DialogTrigger asChild>
                <Button className='dark cursor-pointer'>View your idea</Button>
              </DialogTrigger>
              <DialogContent className='dark'>
                <DialogHeader>
                  <DialogTitle className='mb-4'>Synthesis of Your Idea</DialogTitle>
                  <DialogDescription>
                    {Object.entries(fieldData).map(([key, label]) => (
                        <span key={key}>
                          <b>{label}:</b> {fieldValues[key]}<br/><br/>
                        </span>
                    ))}
                  </DialogDescription>
                </DialogHeader>
                {/* <DialogFooter>
                  <div className='w-[100%] flex flex-wrap gap-2 flex items-center justify-center'>
                  <Button className='dark' variant='outline'>Edit Idea</Button>
                  <Button className='dark' variant='outline'>Edit Target Aud.</Button>
                  <Button className='dark' variant='outline'>Edit Problem St.</Button>
                  <Button className='dark' variant='outline'>Edit UVP</Button>
                  <Button className='dark' variant='outline'>Edit Features</Button>
                  </div>
                </DialogFooter> */}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      ): currentStage=="validation" ? (
        <div className='hpm-1'>
          {/* <div className='user-progress'>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant='secondary' className='dark'>Your Progress</Button>
              </DialogTrigger>
              <DialogContent className='dark'>
                <DialogHeader>
                  <DialogTitle>Your Progress, {session?.user?.name}</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                  {currentStage=="muse" && (
                    <>
                    <span className='flex gap-2 mb-2'><Image alt="" src={inprogress}/>Stage 1: Idea Creation</span>
                    <div className='h-6 w-[1px] bg-gray-200 mx-4'></div>
                    <span className='flex gap-2 mb-2'><Image alt="" src={cross}/><span>Stage 2: Validation Engine</span></span>
                    <div className='h-6 w-[1px] bg-gray-200 mx-4'></div>
                    <span className='flex gap-2'><Image alt="" src={cross}/><span>Stage 3: Stormee Canvas</span></span>
                    </>
                  )}
                  {currentStage=="validation" && (
                    <>
                    <span className='flex gap-2 mb-2'><Image alt="" src={tick}/>Stage 1: Idea Creation</span>
                    <div className='h-6 w-[1px] bg-gray-200 mx-4'></div>
                    <span className='flex gap-2 mb-2'><Image alt="" src={inprogress}/><span>Stage 2: Validation Engine</span></span>
                    <div className='h-6 w-[1px] bg-gray-200 mx-4'></div>
                    <span className='flex gap-2'><Image alt="" src={cross}/><span>Stage 3: Stormee Canvas</span></span>
                    </>
                  )}
                </DialogDescription>
              </DialogContent>
            </Dialog>
          </div> */}
          <h2 className='scroll-m-20 text-2xl font-light tracking-tight'>Welcome, {session?.user?.name}</h2>
          <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>Stage 2: Validation Stage</h1>
          <h3 className='opacity-[70%]'>Now, let's see if your idea will <b>make or break</b></h3>
          <div className='flex items-center justify-center gap-4 mt-2'>
            <Card className='dark w-[30vw] px-5'>
              <CardHeader>
                <CardTitle className='scroll-m-20 text-2xl font-semibold tracking-tight'>Validation Engine</CardTitle>
                <CardDescription>Test the potential of your idea </CardDescription>
              </CardHeader>
              <CardContent>
                <p className='opacity-[60%]'>Understand how well your idea performs against validator metrics and multi-field perspectives</p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => {router.push("/Home/Validation-Engine")}} className='w-full'>Launch Validation Engine</Button>
              </CardFooter>
            </Card>
          </div>
          <div className='flex items-center justify-center gap-2'>
            {/* <Button className='dark cursor-pointer py-1' variant='secondary'>Refine Idea</Button> */}
            <Dialog>
              <DialogTrigger asChild>
                <Button className='dark cursor-pointer'>View your idea</Button>
              </DialogTrigger>
              <DialogContent className='dark'>
                <DialogHeader>
                  <DialogTitle className='mb-4'>Synthesis of Your Idea</DialogTitle>
                  <DialogDescription>
                    {Object.entries(fieldData).map(([key, label]) => (
                        <span key={key}>
                          <b>{label}:</b> {fieldValues[key]}<br/><br/>
                        </span>
                    ))}
                  </DialogDescription>
                </DialogHeader>
                {/* <DialogFooter>
                  <div className='w-[100%] flex flex-wrap gap-2 flex items-center justify-center'>
                  <Button className='dark' variant='outline'>Edit Idea</Button>
                  <Button className='dark' variant='outline'>Edit Target Aud.</Button>
                  <Button className='dark' variant='outline'>Edit Problem St.</Button>
                  <Button className='dark' variant='outline'>Edit UVP</Button>
                  <Button className='dark' variant='outline'>Edit Features</Button>
                  </div>
                </DialogFooter> */}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      ):(
        <div className='home-page-main'>
          {/* <div className='user-progress'>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant='secondary' className='dark'>Your Progress</Button>
              </DialogTrigger>
              <DialogContent className='dark'>
                <DialogHeader>
                  <DialogTitle>Your Progress, {session?.user?.name}</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                  {currentStage=="muse" && (
                    <>
                    <span className='flex gap-2 mb-2'><Image alt="" src={inprogress}/>Stage 1: Idea Creation</span>
                    <div className='h-6 w-[1px] bg-gray-200 mx-4'></div>
                    <span className='flex gap-2 mb-2'><Image alt="" src={cross}/><span>Stage 2: Validation Engine</span></span>
                    <div className='h-6 w-[1px] bg-gray-200 mx-4'></div>
                    <span className='flex gap-2'><Image alt="" src={cross}/><span>Stage 3: Stormee Canvas</span></span>
                    </>
                  )}
                  {currentStage=="validation" && (
                    <>
                    <span className='flex gap-2 mb-2'><Image alt="" src={tick}/>Stage 1: Idea Creation</span>
                    <div className='h-6 w-[1px] bg-gray-200 mx-4'></div>
                    <span className='flex gap-2 mb-2'><Image alt="" src={inprogress}/><span>Stage 2: Validation Engine</span></span>
                    <div className='h-6 w-[1px] bg-gray-200 mx-4'></div>
                    <span className='flex gap-2'><Image alt="" src={cross}/><span>Stage 3: Stormee Canvas</span></span>
                    </>
                  )}
                </DialogDescription>
              </DialogContent>
            </Dialog>
          </div> */}
          {stage === "Tutorial" ? (
            <>
            <div className='hpm-1' id="hpm-1-1">
              <h1>Welcome to Stormee AI</h1>
              <h3>Before we continue into the main product development stages, let's guide you through <b>how to use this platform</b></h3>
              <div className='flex items-center justify-center gap-2'>
                <Button onClick={() => {
                    const s11 = document.getElementById("hpm-1-1");
                    const s12 = document.getElementById("hpm-1-2");
                    const s13 = document.getElementById("hpm-1-3");
                    const s14 = document.getElementById("hpm-1-4");
                    const s15 = document.getElementById("hpm-1-5");
                    if(s11 && s12 && s13 && s14 && s15) {
                      s11.style.display="none";
                      s12.style.display="block";
                      s13.style.display="none";
                      s14.style.display="none";
                      s15.style.display="none";
                    }
                  }}  className='dark'>Launch Stormee Guide</Button>
                  {/* <Button onClick={() => {console.log(stage)}}>Stage</Button> */}
                {/* <Button className='dark' variant={'secondary'}>TL;DR</Button> */}
              </div>
            </div>
    
    
            <div className='hpm-1' id="hpm-1-2">
              <h1>What is Stormee AI</h1>
              <h3>Stormee AI turns your rough idea into a <b>clear, pitch-ready business plan</b> in minutes</h3>
              <div>
                <div>
                  <h3>What Stormee AI gives you</h3>
                  <p className='flex items-center'>
                    <Image alt="" className='tick' src={tick}/>
                    Honest No-BS AI validation from expert lenses
                  </p>
                  <p className='flex items-center'>
                    <Image alt="" className='tick' src={tick}/>
                    Deep and powerful competitor analysis for your product
                  </p>
                  <p className='flex items-center'>
                    <Image alt="" className='tick' src={tick}/>
                    Structured Thinking without Structured Effort: AI-Guided Product Development
                  </p>
                  <p className='flex items-center'>
                    <Image alt="" className='tick' src={tick}/>
                    Obtain 2-3 days worth of market research + validation, in minutes
                  </p>
                </div>
              </div>
              <div className='flex items-center justify-center gap-2'>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant={'secondary'} className='dark'>What you need</Button>
                  </DialogTrigger>
                  <DialogContent className='dark'>
                    <DialogHeader>
                      <DialogTitle>What you need for using Stormee AI</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                      Just a few words to describe a rough idea or even a single theme. Stormee handles the rest, step by step.
                    </DialogDescription>
                  </DialogContent>
                </Dialog>
                <Button onClick={() => {
                    const s11 = document.getElementById("hpm-1-1");
                    const s12 = document.getElementById("hpm-1-2");
                    const s13 = document.getElementById("hpm-1-3");
                    const s14 = document.getElementById("hpm-1-4");
                    const s15 = document.getElementById("hpm-1-5");
                    if(s11 && s12 && s13 && s14 && s15) {
                      s11.style.display="none";
                      s12.style.display="none";
                      s13.style.display="block";
                      s14.style.display="none";
                      s15.style.display="none";
                    }
                  }}  className='dark'>Next: Stages of Stormee AI</Button>
                {/* <Button className='dark' variant={'secondary'}>TL;DR</Button> */}
              </div>
            </div>
    
    
    
            <div id="hpm-1-3">
              <Card className='min-w-[30vw] dark'>
                <CardHeader>
                  <CardTitle className='mb-4'>Stage 1: Ignite ⚡️</CardTitle>
                  <CardDescription>This is the first stage of the process, where you explain your idea to brainstorm together.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 flex items-start justify-center">
                  {/* <div className=" flex items-center space-x-4 rounded-md border p-4 w-[20vw]">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Brainstorm with Muse AI
                      </p><br/>
                      <p className="text-sm text-muted-foreground">
                        Chat with Muse AI and brainstorm about the idea.
                      </p>
                      <Image alt="" className='mt-4 rounded-md border' src={muse}/>
                    </div>
                  </div> */}
                  <div className=" flex items-center space-x-4 rounded-md border p-4 w-[20vw]">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-bold leading-none mb-3">
                        Pre-defined questions
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Answer a set of pre-defined questions to describe your idea perfectly.
                      </p>
                      {/* <Image alt="" className='mt-4 rounded-md border' src={muse}/> */}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => {
                    const s11 = document.getElementById("hpm-1-1");
                    const s12 = document.getElementById("hpm-1-2");
                    const s13 = document.getElementById("hpm-1-3");
                    const s14 = document.getElementById("hpm-1-4");
                    const s15 = document.getElementById("hpm-1-5");
                    if(s11 && s12 && s13 && s14 && s15) {
                      s11.style.display="none";
                      s12.style.display="none";
                      s13.style.display="none";
                      s14.style.display="block";
                      s15.style.display="none";
                    }
                  }}  className="w-full">
                    Next Stage 
                  </Button>
                </CardFooter>
              </Card>
            </div>
    
    
    
    
    
            <div id="hpm-1-4">
              <Card className='min-w-[40vw] dark'>
                <CardHeader>
                  <CardTitle className=' text-2xl'>Stage 2: <b>The Validation Engine ✅</b></CardTitle>
                  {/* <CardDescription>This is the Validation Engine. Your Idea gets evaluted from multiple perspectives and your idea is validated with real-time honest feedback</CardDescription> */}
                </CardHeader>
                <CardContent>
                  <div className='flex items-start justify-center gap-4'>
                    <Card className='rounded-sm w-[45%]'>
                      <CardHeader>
                        <CardTitle className='mb-2'>Product Fit Validation</CardTitle>
                        <CardDescription>Stormee uses different metrics of product validation to provide you with field-specific validation</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className='bg-transparent border border-neutral-500 w-full p-3 text-white rounded-sm text-center mb-3'>
                          <h1 className='text-sm'>Stormee Validation Cards</h1>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className='rounded-sm w-[45%] '>
                      <CardHeader>
                      <CardTitle className='mb-2'>Expert Feedback</CardTitle>
                      <CardDescription>Stormee gives sharp feedback on the Business, Product, and Tech aspects of building out a successful product.</CardDescription>
                      </CardHeader>
                      <CardContent>
                      <div className='bg-transparent border border-neutral-500 w-full p-3 text-white rounded-sm text-center'>
                          <h1 className='text-sm'>Field-Specific Feedback and Insights</h1>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => {
                    const s11 = document.getElementById("hpm-1-1");
                    const s12 = document.getElementById("hpm-1-2");
                    const s13 = document.getElementById("hpm-1-3");
                    const s14 = document.getElementById("hpm-1-4");
                    const s15 = document.getElementById("hpm-1-5");
                    if(s11 && s12 && s13 && s14 && s15) {
                      s11.style.display="none";
                      s12.style.display="none";
                      s13.style.display="none";
                      s14.style.display="none";
                      s15.style.display="block";
                    }
                  }}  className="w-full">
                    Next Stage
                  </Button>
                </CardFooter>
              </Card>
            </div>
    
    
    
    
            <div id="hpm-1-5">
              <Card className='w-[60vw] dark'>
                <CardHeader>
                  <CardTitle className='mb-4'>Stage 3: <b>The Stormee Canvas</b></CardTitle>
                  <CardDescription>This is the end stage that Stormee AI takes you to. View a deep analysis of your product delivered to you by Stormee AI. This is your <b><i>FOUNDER HUB.</i></b></CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='flex items-start justify-center gap-4'>
                    {/* <Card className='rounded-sm w-[45%]'>
                      <CardHeader>
                        <CardTitle className='mb-2'>Executive Summary</CardTitle>
                        <CardDescription>Stormee uses different metrics of product validation to provide you with field-specific validation</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className='bg-transparent border border-neutral-500 w-full p-3 text-white rounded-sm text-center mb-3'>
                          <h1 className='text-sm'>Elevator Pitch</h1>
                        </div>
                        <div className='bg-transparent border border-neutral-500 w-full p-3 text-white rounded-sm text-center mb-3'>
                          <h1 className='text-sm'>Problem Statement</h1>
                        </div>
                        <div className='bg-transparent border border-neutral-500 w-full p-3 text-white rounded-sm text-center mb-3'>
                          <h1 className='text-sm'>Target Audience</h1>
                        </div>
                        <div className='bg-transparent border border-neut ral-500 w-full p-3 text-white rounded-sm text-center mb-3'>
                          <h1 className='text-sm'>Unique Value Prop.</h1>
                        </div>
                      </CardContent>
                    </Card> */}
                    <Card className='rounded-sm w-[45%]'>
                      <CardHeader>
                        <CardTitle className='mb-2'>Competitive Landscape</CardTitle>
                        <CardDescription>Understand who tried and failed, and who you're competing against</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className='bg-transparent border border-neutral-500 w-full p-3 text-white rounded-sm mb-3 py-4'>
                          <h1 className='text-sm'>Graveyard - "Who tried and failed"</h1>
                          <p className='text-xs opacity-70 mt-1'>What they tried. Why they failed. What you can learn from them</p>
                        </div>
                        <div className='bg-transparent border border-neutral-500 w-full p-3 text-white rounded-sm py-4'>
                          <h1 className='text-sm'>Current Players - "Who you're up against"</h1>
                          <p className='text-xs opacity-70 mt-1'>Key Players/Competitors. What they offer. Their weaknesses. Their strengths</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className='rounded-sm w-[45%] '>
                      <CardHeader>
                      <CardTitle className='mb-2'>Validation Report</CardTitle>
                      <CardDescription>Multi-perspective feedback on Business, Product, and Technical aspects of building out the product</CardDescription>
                      </CardHeader>
                      <CardContent>
                      <div className='bg-transparent border border-neutral-500 w-full p-3 text-white rounded-sm py-4'>
                          <h1 className='text-sm'>Powerful Validator Metrics</h1>
                          <p className='text-xs opacity-70 mt-1'>To 'break-down' any idea and provide actionable insights</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={async () => {
                    try {
                      const { error } = await supabase
                        .from('Users')
                        .update({ Stage: 'No-Payment' })
                        .eq('email', session.user?.email);
                      
                      if (error) {
                        console.error('Error updating stage:', error);
                      }
                      
                      setStage("No-payment");
                      // Show the "Let's get started" message
                      // const s11 = document.getElementById("hpm-1-1");
                      // const s12 = document.getElementById("hpm-1-2");
                      // const s13 = document.getElementById("hpm-1-3");
                      // const s14 = document.getElementById("hpm-1-4");
                      // const s15 = document.getElementById("hpm-1-5");
                      // if(s11 && s12 && s13 && s14 && s15) {
                      //   s11.style.display = "none";
                      //   s12.style.display = "none";
                      //   s13.style.display = "none";
                      //   s14.style.display = "none";
                      //   s15.style.display = "block";
                      // }
                      window.location.reload();
                      toast("Alright. Let's get started! First up: Stage 1")
                    } catch (err) {
                      console.error('Error in Get Started:', err);
                    }
                  }} className="w-full">
                    Get Started
                  </Button>
                </CardFooter>
              </Card>
            </div>
            </>
          ): stage === "No-Payment" ? (
            <div className='hpm-1'>
              <h2 className='scroll-m-20 text-2xl font-light tracking-tight'>Welcome, {session?.user?.name}</h2>
              <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>Stage 1: Idea Creation</h1>
              <h3 className='opacity-[70%]'>First, let's get a basic concept of what your idea is.</h3>
              <div className='flex items-center justify-center gap-4 mt-8'>
                {/* <Card className='dark w-[24vw]'>
                  <CardHeader>
                    <CardTitle className='scroll-m-20 text-2xl font-semibold tracking-tight'>Brainstorm with Muse AI</CardTitle>
                    <CardDescription>AI-Assisted Brainstorm Session </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className='opacity-[60%]'>Brainstorm your next big idea in a 2 minute guided discussion with Muse AI.</p>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => {router.push("/Home/Muse")}} className='w-full'>Launch Muse AI</Button>
                  </CardFooter>
                </Card> */}
                <Card className='dark w-[24vw]'>
                  <CardHeader>
                    <CardTitle className='scroll-m-20 text-2xl font-semibold tracking-tight'>Structured Idea Input Form</CardTitle>
                    <CardDescription>AI-Assisted Brainstorm Session </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className='opacity-[60%]'>Fill out a quick form to define your idea step by step—with total control.</p>
                  </CardContent>
                  <CardFooter>
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button className='w-full'>Launch Form</Button>
                      </SheetTrigger>
                      <SheetContent className='dark p-5 pt-10'>
                        <SheetHeader className='form-idea'>
                          <SheetTitle className='text-xl border-b pb-4 border-neutral-600'>Describe your idea</SheetTitle><br/>
                          <div id="idea-questions">
                            <h3 className='mb-2'>What's your startup idea in 1-2 lines?</h3>
                            <Input id="form1" className='mb-4'/>
                            <h3 className='mb-2'>What problem are you solving?</h3>
                            <Input id="form2" className='mb-4'/>
                            <h3 className='mb-2'>Who is your primary target audience?</h3>
                            <Input id="form3" className='mb-4'/>
                            <h3 className='mb-2'>What do you think makes your solution unique or better than existing ones?&nbsp;<span className='opacity-[60%] border-b border-neutral-500'>Optional</span></h3>
                            <Input id="form4" className='mb-4'/>
                            <h3 className='mb-2'>Some features that come to your mind for this idea?&nbsp;<span className='opacity-[60%] border-b border-neutral-500'>Optional</span></h3>
                            <Textarea id="form5" className='mb-3'/>
                            <h3 className='mb-2'>Any geographic specifities?&nbsp;<span className='opacity-[60%] border-b border-neutral-500'>Optional</span></h3>
                            <Input id="form6" className='mb-4'/>
                            <Button onClick={handleSubmitForm} className='w-full'>Submit</Button>
                          </div>
                        </SheetHeader>
                      </SheetContent>
                    </Sheet>
                  </CardFooter>
                </Card>
              </div>
            </div>
          ) : (
            <div className='hpm-1'>
              <h1>Loading...</h1>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default HomePage