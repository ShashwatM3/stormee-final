import React, { useEffect, useState } from 'react';
import './styles/ES.css';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import supabase from '@/app/config/supabaseClient';
import { useRouter } from 'next/navigation';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const MarkdownRenderer = ({ text }) => {
  // Insert newline or double line break before each sentence that starts with bold (**)
  const processedText = text.replace(/(?<!\n)\s*(\*\*[A-Z])/g, '<br><br>$1');

  const html = marked(processedText);
  const cleanHtml = DOMPurify.sanitize(html);

  return <span className="prose" dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
};


function ExecutiveSummary() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const mainprompt = `
  **Output Format (Markdown):**

  ### Brief Description
  [Synthesize the product idea in 2-3 sentences, focusing on what it is, what it does, and who it is for. Include the core functionality or service and the primary use case.]

  ### Unique Value Proposition
  [Your task for this part is to synthesize a clear, concise, and persuasive UVP, within 3-4 sentences, that resonates with the user's ideal readers/customers. First section will be PROBLEM. This will highlight the customer's problem and why it is significant. Then second section will be the SOLUTION. This will present the solution and the benefits they will experience. The third section will be the CALL TO ACTION. This invites them to join the movement]

  ### Target Audience
  [Your task for this part is to analyze the target Audience.
  1st section, will be 3 lines, where you determine the demographics, psychographics, and behaviors of the potential customers who would benefit most from the startup's offerings. Include a newline space after this
  2nd section will be 3 lines, where you analyze market needs. Consider the current market trends and needs that align with the startup's offerings and how the target audience fits into this landscape. Include a newline space after this
  3rd section will be 3 lines. Clearly describe the target audience, including their characteristics, needs, and how the startup addresses these needs.]

  ### Problem Statement
  [ Your task is to generate a concise and compelling two-sentence problem statement. Make sure it is free from solutions, symptoms, causes, or blame. Instead, clearly identify the core real-world problem being solved, specify who is impacted, where and when it occurs, and why it matters. Ensure it is written in human terms, is relatable, and implies that a solution is both necessary and possible]

  Please ensure each section is clearly labeled and well-structured.
`

  const [briefDesc, setBriefDesc] = useState('');
  const [uvp, setUVP] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [briefDescNew, setBriefDescNew] = useState(briefDesc);
  const [uvpNew, setUVPNew] = useState('');
  const [targetAudienceNew, setTargetAudienceNew] = useState('');
  const [problemStatementNew, setProblemStatementNew] = useState('');

  async function handleCopy(textToCopy) {
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast("Copied to Clipboard!")
    } catch (err) {
      toast("Couldn't copy to clipboard!", {
        description: "Please try again",
      })
    }
  };

  async function fetchSupaData() {
    const { data: dataES, error: errorES } = await supabase
    .from('Executive_Summary')
    .select()
    .eq('user_email', session.user?.email);

    if(dataES.length == 0) {
      const { data: data2, error: error2 } = await supabase
      .from('Users')
      .select()
      .eq('email', session.user?.email);
  
      async function generateFields(promptin) {
        try {
          const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: [{ role: 'user', content: promptin }]
            }),
          });
  
          if (res.status === 429) {
            console.log('Rate limit exceeded. Please wait a moment.');
            return;
          }
  
          if (!res.ok) {
            const errorData = await res.json();
            console.error('API Error:', errorData.error);
            return;
          }
  
          const data = await res.json();
          return(data);
        } catch (err) {
          console.error('Failed to send message:', err);
        }
      }
  
      // console.log(data2);
  
      const prompt = `
      You are a creative brainstorming assistant, assisting a user in forming a powerful and detailed executive summary for their startup.
      Below is information about the user's product/startup idea that you must use when crafting your responses:
      ${data2[0].Idea}
      ${data2[0].Market_Analysis}
      ${data2[0].Real_World_Demand}
      ${data2[0].Competitor_Analysis}
      ${data2[0].SWOT_Analysis}
      ${data2[0].Growth_Strategy}
  
      Voice & Tone requirements:
      Persuasive
      Clear and professional, suitable for a business context.
      Empowering
      `
  
      // if (!data2 || !data2[0] || !data2[0].Idea) {
      //   console.error("User startup data missing or incomplete.");
      //   return;
      // }    
      // console.log("data2[0]:", data2[0]);
      
      const totalgen = await generateFields(prompt + " " + mainprompt);

      console.log(totalgen);
      
      if (totalgen) {
        const message = totalgen.choices[0].message.content;
      
        const briefDesc = message.substring(
          message.indexOf("### Brief Description"),
          message.indexOf("### Unique Value Proposition")
        );
      
        const uvp = message.substring(
          message.indexOf("### Unique Value Proposition"),
          message.indexOf("### Target Audience")
        );
      
        const targetAudience = message.substring(
          message.indexOf("### Target Audience"),
          message.indexOf("### Problem Statement")
        );
      
        const problemStatement = message.substring(
          message.indexOf("### Problem Statement")
        );
      
        setBriefDesc(briefDesc);
        setUVP(uvp);
        setTargetAudience(targetAudience);
        setProblemStatement(problemStatement);
      
        const { error } = await supabase
          .from('Executive_Summary')
          .insert({
            user_email: session.user?.email,
            brief_description: briefDesc,
            uvp: uvp,
            target_audience: targetAudience,
            problem_statement: problemStatement
          });
      
        if (error) {
          console.error('Insert error:', error);
        }
      }
      
    } else {
      setBriefDesc(dataES[0].brief_description);
      setProblemStatement(dataES[0].problem_statement);
      setTargetAudience(dataES[0].target_audience);
      setUVP(dataES[0].uvp);
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      fetchSupaData();
    }
  }, [status]);

  useEffect(() => {
  if (briefDesc) {
    setBriefDescNew(briefDesc);
  }
}, [briefDesc]);

  return (
    <div className='es-main'>
      <h1>Executive Summary</h1>
      <h3>Your startup idea in a nutshell</h3>

      <div className='flex items-center justify-center flex-col gap-2'>

        <div className='card-es'>
          <h1>Brief Description of Product</h1>
          <h3>What is your idea?</h3>
          <div className='flex items-center justify-between'>
            <span></span>
            <Sheet className='dark'>
              <SheetTrigger asChild>
                <Button variant='secondary'>View</Button>
              </SheetTrigger>
              <SheetContent className='dark p-6 overflow-scroll'>
                <SheetHeader>
                  <SheetTitle>Brief Description of your product</SheetTitle>
                  <SheetDescription className='mt-6'>
                    <span id="brief-description-h1" className='text-md'>
                      {briefDesc && (
                        <>
                          <MarkdownRenderer text={briefDesc} />
                          <br/><br/>
                          <Button onClick={() => {
                            handleCopy(briefDesc);
                          }} className='mr-2'>Copy</Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button className='mr-2' variant={'secondary'}>Edit</Button>
                            </DialogTrigger>
                            <DialogContent className='dark'>
                              <DialogTitle className='mb-5 mt-2'>Edit Brief Description of your product</DialogTitle>
                              <DialogDescription>
                                <Textarea
                                  onChange={(e) => setBriefDescNew(e.target.value)}
                                  value={briefDescNew}
                                />
                              </DialogDescription>
                              <DialogFooter>
                                <Button onClick={async () => {
                                  const { error } = await supabase
                                  .from('Executive_Summary')
                                  .update({ brief_description: briefDescNew })
                                  .eq('user_email', session.user?.email);
                                  toast("Changes saved successfully!")
                                }}>Save Changes</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          {/* <Button className='bg-transparent border text-white hover:bg-transparent hover:border-white cursor-pointer'>Edit with AI</Button> */}
                        </>
                      )}
                    </span>
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className='card-es'>
          <h1>Unique Value Proposition</h1>
          <h3>Making your idea stand out</h3>
          <div className='flex items-center justify-between'>
            <span></span>
            <Sheet className='dark'>
              <SheetTrigger asChild>
                <Button variant='secondary'>View</Button>
              </SheetTrigger>
              <SheetContent className='dark p-6'>
                <SheetHeader>
                  <SheetTitle>Your Unique Value Proposition</SheetTitle>
                  <SheetDescription className='mt-6'>
                    <span id="brief-description-h1" className='text-md'>
                      {uvp && (
                        <>
                          <MarkdownRenderer text={uvp} />
                          <br/><br/>
                          <Button onClick={() => {
                            handleCopy(uvp);
                          }} className='mr-2'>Copy</Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button className='mr-2' variant={'secondary'}>Edit</Button>
                            </DialogTrigger>
                            <DialogContent className='dark'>
                              <DialogTitle className='mb-5 mt-2'>Edit Unique Value Proposition</DialogTitle>
                              <DialogDescription>
                                <Textarea
                                  onChange={(e) => setUVPNew(e.target.value)}
                                  value={uvpNew || uvp}
                                />
                              </DialogDescription>
                              <DialogFooter>
                                <Button onClick={async () => {
                                  const { error } = await supabase
                                    .from('Executive_Summary')
                                    .update({ uvp: uvpNew || uvp })
                                    .eq('user_email', session.user?.email);
                                  toast("Changes saved successfully!");
                                  setUVP(uvpNew);
                                }}>Save Changes</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          {/* <Button className='bg-transparent border text-white hover:bg-transparent hover:border-white cursor-pointer'>Edit with AI</Button> */}
                        </>
                      )}
                    </span>
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className='card-es'>
          <h1>Target Audience</h1>
          <h3>Who is your product for?</h3>
          <div className='flex items-center justify-between'>
            <span></span>
            <Sheet className='dark'>
              <SheetTrigger asChild>
                <Button variant='secondary'>View</Button>
              </SheetTrigger>
              <SheetContent className='dark p-6 overflow-scroll'>
                <SheetHeader>
                  <SheetTitle>The Target Audience of your Product</SheetTitle>
                  <SheetDescription className='mt-6'>
                    <span id="brief-description-h1" className='text-md'>
                      {targetAudience && (
                        <>
                          <MarkdownRenderer text={targetAudience} />
                          <br/><br/>
                          <Button onClick={() => {
                            handleCopy(targetAudience);
                          }} className='mr-2'>Copy</Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button className='mr-2' variant={'secondary'}>Edit</Button>
                            </DialogTrigger>
                            <DialogContent className='dark'>
                              <DialogTitle className='mb-5 mt-2'>Edit Target Audience</DialogTitle>
                              <DialogDescription>
                                <Textarea
                                  onChange={(e) => setTargetAudienceNew(e.target.value)}
                                  value={targetAudienceNew || targetAudience}
                                />
                              </DialogDescription>
                              <DialogFooter>
                                <Button onClick={async () => {
                                  const { error } = await supabase
                                    .from('Executive_Summary')
                                    .update({ target_audience: targetAudienceNew || targetAudience })
                                    .eq('user_email', session.user?.email);
                                  toast("Changes saved successfully!");
                                  setTargetAudience(targetAudienceNew);
                                }}>Save Changes</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          {/* <Button className='bg-transparent border text-white hover:bg-transparent hover:border-white cursor-pointer'>Edit with AI</Button> */}
                        </>
                      )}
                    </span>
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className='card-es'>
          <h1>Problem Statement</h1>
          <h3>Your Product - The Main Problem Statement</h3>
          <div className='flex items-center justify-between'>
            <span></span>
            <Sheet className='dark'>
              <SheetTrigger asChild>
                <Button variant='secondary'>View</Button>
              </SheetTrigger>
              <SheetContent className='dark p-6'>
                <SheetHeader>
                  <SheetTitle>Problem Statement</SheetTitle>
                  <SheetDescription className='mt-6'>
                    <span id="brief-description-h1" className='text-md'>
                      {problemStatement && (
                        <>
                          <MarkdownRenderer text={problemStatement} />
                          <br/><br/>
                          <Button onClick={() => {
                            handleCopy(problemStatement);
                          }} className='mr-2'>Copy</Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button className='mr-2' variant={'secondary'}>Edit</Button>
                            </DialogTrigger>
                            <DialogContent className='dark'>
                              <DialogTitle className='mb-5 mt-2'>Edit Problem Statement</DialogTitle>
                              <DialogDescription>
                                <Textarea
                                  onChange={(e) => setProblemStatementNew(e.target.value)}
                                  value={problemStatementNew || problemStatement}
                                />
                              </DialogDescription>
                              <DialogFooter>
                                <Button onClick={async () => {
                                  const { error } = await supabase
                                    .from('Executive_Summary')
                                    .update({ problem_statement: problemStatementNew || problemStatement })
                                    .eq('user_email', session.user?.email);
                                  toast("Changes saved successfully!");
                                  setProblemStatement(problemStatementNew);
                                }}>Save Changes</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          {/* <Button className='bg-transparent border text-white hover:bg-transparent hover:border-white cursor-pointer'>Edit with AI</Button> */}
                        </>
                      )}
                    </span>
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ExecutiveSummary;
