'use client'
import React, { useState, memo } from 'react';
import './styles/AIChat.css'
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { TextAnimate } from './magicui/text-animate';
import supabase from '@/app/config/supabaseClient';
import tick from "./icons/tick.png";
import Image from 'next/image';
import { Textarea } from './ui/textarea';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const MemoizedTextAnimate = memo(TextAnimate);

function AIChat2() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [realWorldDemand, setRealWorldDemand] = useState('');
  const [marketAnalysis, setMarketAnalysis] = useState('');
  const [competitorAnalysis, setCompetitorAnalysis] = useState('');
  const [swotAnalysis, setSwotAnalysis] = useState('');
  const [growthStrategy, setGrowthStrategy] = useState('');
  // const [fundingGuidance, setFundingGuidance] = useState('');
  const [endToEndDescription, setEndToEndDescription] = useState('');
  const [finalized, setFinalized] = useState(false);
  const [next, setNext] = useState(false)

  const fieldValues = {
    realWorldDemand,
    marketAnalysis,
    competitorAnalysis,
    swotAnalysis,
    growthStrategy,
    // fundingGuidance,
    endToEndDescription
  };
  
  const roleAI = `
You are a business development assistant who uses the maximum of your brainstorming capabilities. Your sole purpose and range of tasks is to help users brainstorm and outline a business idea.

Your responses must help the user understand and develop the following 6 core components:

1. Real-world Demand
2. Market Analysis
3. Competitor Analysis
4. SWOT Analysis
5. Growth Strategy
6. End-to-End Description

Rules for Response:

1. DO NOT say things like "Here's your response". STRICTLY ONLY send the JSON object.
2. DO NOT use code formatting like \`\`\`json..
3. Keep conversational text (your_response) friendly but sharp.
4. You must lead the user through the brainstorming process, and take control
5. Always speak in a friendly, professional, and focused tone.
6. Always ask smart, probing questions specifically designed to complete the missing fields. Each field must have a clear and direct statement that pertains to the idea. DO NOT only ask questions and SOMETIMES provide your own opinion
7. Ask smart, probing questions specifically designed to complete the missing core components
8. If the user provides an uncertain reply, provide your own opinion and verify with the user if it it satisfies them 
9. Your reply must only guide toward completing all 7 components.

Output Format:

You must strictly respond with the following JSON Format with no extra text or markdown:

{

"your_response": "Conversational reply to the user with guidance, probing questions, or summaries that you must strictly synthesize MAXIMUM UPTO 14 WORDS.",

"RealWorldDemand": "If completed, fill the analysis; otherwise, 'Awaiting further input.'",

"MarketAnalysis": "If completed, fill the analysis; otherwise, 'Awaiting further input.'",

"CompetitorAnalysis": "If completed, fill the analysis; otherwise, 'Awaiting further input.'",

"SWOTAnalysis": "If completed, fill the analysis; otherwise, 'Awaiting further input.'",

"GrowthStrategy": "If completed, fill the strategy; otherwise, 'Awaiting further input.'",

"EndToEndDescription": "If all components are complete, generate full description; otherwise, 'Awaiting further input.'",

"finalized": "If RealWorldDemand MarketAnalysis CompetitorAnalysis SWOTAnalysis GrowthStrategy EndToEndDescription fields of JSON are completed, and the user is completely fine with the respective content of each, this will have a true value. This should be false if the two conditions I mentioned right now are not met ."

}
`  
  const [messages, setMessages] = useState([]);  
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fields = [
    "RealWorldDemand",
    "MarketAnalysis",
    "CompetitorAnalysis",
    "SWOTAnalysis",
    "GrowthStrategy",
    // "BasicFundingGuidance",
    "EndToEndDescription"
  ];
  const fieldData = {
    realWorldDemand: "Real World Demand",
    marketAnalysis: "Market Analysis",
    competitorAnalysis: "Competitor Analysis",
    swotAnalysis: "SWOT Analysis",
    growthStrategy: "Growth Strategy",
    // fundingGuidance: "Funding Guidance",
    endToEndDescription: "End-to-End Description"
  };

  async function setDetailsUser() {
    const { error } = await supabase
      .from('Users')
      .update({ 
        Idea: endToEndDescription,
        Market_Analysis: marketAnalysis,
        Real_World_Demand: realWorldDemand,
        Competitor_Analysis: competitorAnalysis,
        SWOT_Analysis: swotAnalysis,
        Growth_Strategy: growthStrategy,
        End_To_End: endToEndDescription
      })
      .eq('email', `${session?.user?.email}`);
    console.log(error);
    if(error == null) {
      alert("Something went wrong. Try again!")
    } else {
      router.push("/Home")
    }
  }
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setError('');
    const newMessages = [
      { role: 'system', content: roleAI },
      ...messages,
      { role: 'user', content: input, persona: 'user' }
    ];    
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });

      if (res.status === 429) {
        setError('Rate limit exceeded. Please wait a moment before trying again.');
        return;
      }

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || 'Something went wrong. Please try again.');
        return;
      }

      const data = await res.json();
      if(data.error) {
        if (data.error.message.includes("Rate limit exceeded")) {
          alert("Total number of prompts used. You must use a plan to continue");
        }
      }
      console.log('API Response:', data);
      const reply = data.choices?.[0]?.message;
      console.log('Reply content:', reply?.content);

      if (reply) {
        try {
          let parsedContent;
          try {
            parsedContent = JSON.parse(reply.content);
          } catch (e) {
            const jsonMatch = reply.content.match(/```json\n([\s\S]*?)\n```/);
            if (jsonMatch) {
              parsedContent = JSON.parse(jsonMatch[1]);
            } else {
              const lines = reply.content.split('\n').filter(line => line.trim());
              parsedContent = {
                your_response: reply.content,
                RealWorldDemand: "Awaiting further input.",
                MarketAnalysis: "Awaiting further input.",
                CompetitorAnalysis: "Awaiting further input.",
                SWOTAnalysis: "Awaiting further input.",
                GrowthStrategy: "Awaiting further input.",
                // BasicFundingGuidance: "Awaiting further input.",
                EndToEndDescription: "Awaiting further input."
              };
            }
          }
          
          const formattedReply = {
            ...reply,
            content: parsedContent.your_response,
            persona: 'assistant'
          };
          if (parsedContent.RealWorldDemand !== "Awaiting further input.") {
            setRealWorldDemand(parsedContent.RealWorldDemand);
          }
          if (parsedContent.MarketAnalysis !== "Awaiting further input.") {
            setMarketAnalysis(parsedContent.MarketAnalysis);
          }
          if (parsedContent.CompetitorAnalysis !== "Awaiting further input.") {
            setCompetitorAnalysis(parsedContent.CompetitorAnalysis);
          }
          if (parsedContent.SWOTAnalysis !== "Awaiting further input.") {
            setSwotAnalysis(parsedContent.SWOTAnalysis);
          }
          if (parsedContent.GrowthStrategy !== "Awaiting further input.") {
            setGrowthStrategy(parsedContent.GrowthStrategy);
          }
          // if (parsedContent.BasicFundingGuidance !== "Awaiting further input.") {
          //   setFundingGuidance(parsedContent.BasicFundingGuidance);
          // }
          if (parsedContent.EndToEndDescription !== "Awaiting further input.") {
            setEndToEndDescription(parsedContent.EndToEndDescription);
          }   
          setFinalized(parsedContent.finalized);
          setMessages([...newMessages, formattedReply]);
        } catch (err) {
          console.error('Failed to parse JSON response:', err);
          console.error('Raw content that failed to parse:', reply.content);
          setMessages([...newMessages, reply]);
        }
      }
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!finalized && (
        <div id="justchat">
          {messages.length > 0 ? (
            <div className="chat-main">
              <div className="messages">
                {messages
                  .filter((msg) => msg.role !== 'system')
                  .map((msg, i) => (
                    msg && msg.role && msg.content ? (
                      <div key={i} className={msg.role}>
                        {msg.persona === 'user' ? (
                          <div className='user-message flex items-center justify-between w-full'>
                            <span></span>
                            <p>{msg.content}</p>
                          </div>
                        ) : (
                          <div className='ai-message flex items-center justify-between w-full'>
                            <p>{msg.content}</p>
                            <span></span>
                          </div>
                        )}
                      </div>
                    ) : null
                  ))}
              </div>
              {error && (
                <div className="error-message" style={{ color: 'red', margin: '10px 0' }}>
                  {error}
                </div>
              )}
            </div>
          ) : (
            <div className='chat-home' id="chat-home">
              <h3>Welcome to Muse AI - Brainstorm and Ideation</h3>
              <h1>
              <MemoizedTextAnimate animation="blurInUp" by="character" once>
                How can I help?
              </MemoizedTextAnimate>
              </h1>
              <div className='flex gap-5 items-center'>
                <div>
                  <h1>Re-define your <span className='font-bold'>idea</span> with Muse</h1>
                </div>
                or
                <div>
                  <h1>Brainstorm a <span className='font-bold'>new idea</span> with Muse</h1>
                  <h3>Note: Your Biz.AI Dashboard would change adapt to your new idea</h3>
                </div>
              </div>
              <br/>
              <p>Then get a complete market and business analysis of the MVP</p>
            </div>
          )}
          <div className='inputform'>
            <form className='inputfromuser' onSubmit={handleSubmit}>
              <Input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={messages.length > 0 ? `Reply to Muse` : `Start a conversation with Muse`}
                disabled={loading}
              />
              {/* <Textarea
                className='resize-none'
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={messages.length > 0 ? `Reply to Muse` : `Start a conversation with Muse`}
                disabled={loading}
              /> */}
              <Button variant={'secondary'} type="submit" disabled={loading}>
                {loading ? (<div className='loader'></div>) : 'Send'}
              </Button>
            </form>
          </div>
        </div>
      )}
      {finalized && (
        <div id="success">
          <h1>Lovely Progress!</h1>
          <h2>Muse AI has fully defined every single aspect of your idea</h2>
          {/* <h3>Now let's do a complete market analysis of your MVP</h3> */}
          <div className='flex items-start gap-10 py-4'>
          <div className='successitems flex items-center justify-center gap-4 flex-col'>
            <div className='flex items-center justify-center gap-2'>
              <Image src={tick} alt="" />
              <span>Real-world Demand</span>
            </div>

            <div className='flex items-center justify-center gap-2'>
              <Image src={tick} alt="" />
              <span>Market Analysis</span>
            </div>

            <div className='flex items-center justify-center gap-2'>
              <Image src={tick} alt="" />
              <span>Competitor Analysis</span>
            </div>

            <div className='flex items-center justify-center gap-2'>
              <Image src={tick} alt="" />
              <span>SWOT Analysis</span>
            </div>
          </div>
          <div className='successitems flex items-center justify-center gap-4 flex-col'>

            <div className='flex items-center justify-center gap-2'>
              <Image src={tick} alt="" />
              <span>Growth Strategy</span>
            </div>

            <div className='flex items-center justify-center gap-2'>
              <Image src={tick} alt="" />
              <span>End-to-End Description</span>
            </div>
          </div>
          </div>
          <br/>
          <div className='flex items-center justify-center gap-2'>
            <Button onClick={() => {
              const s1 = document.getElementById("success");
              if(s1) {
                s1.style.display="none";
              }
              const js = document.getElementById("justchat");
              if(js) {
                js.style.display="none";
              }
              const ch = document.getElementById("chat-home");
              if(ch) {
                ch.style.display="none";
              }
              setNext(true);
            }} variant={'secondary'}>What's Next</Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className='bg-[#6969]'>TL;DR for your Idea</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className='text-black mb-4'>Synthesis of Your Idea</DialogTitle>
                  <DialogDescription>
                    {Object.entries(fieldData).map(([key, label]) => (
                        <span key={key}>
                          <b>{label}:</b> {fieldValues[key]}<br/><br/>
                        </span>
                    ))}
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}
      {next && (
        <div id="success2">
          <h1>
          Now, we will visualize the core business components of your idea such as demand, market, competitors, strategy, and more.
          </h1>
          <h3>Now your dashboard shall be ready</h3>
          <button onClick={() => {
            setDetailsUser();
          }}>Let's Go</button>
        </div>
      )}
    </>
  )
}

export default AIChat2;
