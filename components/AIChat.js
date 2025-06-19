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

function AIChat() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [targetAudience, setTargetAudience] = useState('');
  const [problem, setProblem] = useState('');
  const [unique, setUnique] = useState('');
  const [features, setFeatures] = useState('');
  const [endToEndDescription, setEndToEndDescription] = useState('');
  const [finalized, setFinalized] = useState(false);
  const [next, setNext] = useState(false);

  const fieldValues = {
    targetAudience,
    problem,
    unique,
    features,
    endToEndDescription
  };

  const roleAI = `
You are a business brainstorming assistant who uses the maximum of your creative capabilities. Your sole purpose and range of tasks is to help users brainstorm and outline a business idea.

Your responses must help the user understand and develop the following core components:
1. their idea in one line which is detailed and not general (As referred to field OneLineIdea in the JSON Format)
2. Target Audience (As referred to field TargetAudience in the JSON Format)
3. Problem they are solving (As referred to field Problem in the JSON Format)
4. What makes their idea unique (As referred to field Unique in the JSON Format)
5. Key Features of their solution (As referred to field Features in the JSON Format)
6. End-to-End Description (As referred to EndToEndDescription in the JSON Format)

Rules for Response: DO NOT say things like "Here's your response". STRICTLY ONLY send the JSON object. Keep conversational text (your_response) friendly but sharp. You must lead the user through the brainstorming process, and take control. ALWAYS ASK A QUESTION AT THE END OF YOUR REPLY. Always speak in a friendly, professional, and focused tone. Always ask smart, probing questions specifically designed to complete the missing fields. Each field must have a clear and direct statement that pertains to the idea. DO NOT only ask questions and SOMETIMES provide your own opinion. If the user provides an uncertain reply, provide your own opinion and verify with the user if it satisfies them. Assume the user HAS A VERY VAGUE IDEA ABOUT THEIR OWN IDEA.

Output Format:

You must strictly respond with the following JSON Format with no extra text or markdown:

{
  "your_response": "Friendly conversational guidance or follow-up question. Write as if speaking to a startup founder. Only and strictly upto 14 words of a response.",
  "OneLineIdea": "If completed, fill the analysis; otherwise, 'Awaiting further input.'",
  "TargetAudience": "If completed, fill the analysis; otherwise, 'Awaiting further input.'",
  "Problem": "If completed, fill the analysis; otherwise, 'Awaiting further input.'",
  "Unique": "If completed, fill the analysis; otherwise, 'Awaiting further input.'",
  "Features": "If completed, fill the analysis; otherwise, 'Awaiting further input.'",
  "EndToEndDescription": "If all components are complete, generate full description; otherwise, 'Awaiting further input.'",
  "finalized": "If OneLineIdea, TargetAudience, Problem, Unique, Features, and EndToEndDescription fields of JSON are completed, and the user is completely fine with the respective content of each, this will have a true value. Otherwise false."
}
`

  const [messages, setMessages] = useState([]);  
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fields = [
    "TargetAudience",
    "Problem",
    "Unique",
    "Features",
    "EndToEndDescription"
  ];
  const fieldData = {
    targetAudience: "Target Audience",
    problem: "Problem Statement",
    unique: "Unique Value Proposition",
    features: "Key Features",
    endToEndDescription: "End-to-End Description"
  };

  async function setDetailsUser() {
    const { error } = await supabase
      .from('Users')
      .update({ 
        Idea: 'Done',
        Target_Audience: targetAudience,
        Problem: problem,
        Unique: unique,
        Features: features,
        End_To_End: endToEndDescription
      })
      .eq('email', `${session?.user?.email}`);
    // if(error == null) {
    //   alert("Something went wrong. Try again!")
    // } else {
    //   router.push("/Home")
    // }
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
      // console.log('API Response:', data);
      const reply = data.choices?.[0]?.message;
      // console.log('Reply content:', reply?.content);

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
                TargetAudience: "Awaiting further input.",
                Problem: "Awaiting further input.",
                Unique: "Awaiting further input.",
                Features: "Awaiting further input.",
                EndToEndDescription: "Awaiting further input."
              };
            }
          }
          
          const formattedReply = {
            role: 'assistant',
            content: parsedContent.your_response.includes('**Target Audience**') ? 
            "Let's keep refining your idea step by step. What would you like next?" : parsedContent.your_response,
            persona: 'assistant'
          };

          if (parsedContent.TargetAudience !== "Awaiting further input." && parsedContent.TargetAudience?.trim() !== "") {
            setTargetAudience(parsedContent.TargetAudience);
          }
          if (parsedContent.Problem !== "Awaiting further input." && parsedContent.Problem?.trim() !== "") {
            setProblem(parsedContent.Problem);
          }
          if (parsedContent.Unique !== "Awaiting further input." && parsedContent.Unique?.trim() !== "") {
            setUnique(parsedContent.Unique);
          }
          if (parsedContent.Features !== "Awaiting further input." && parsedContent.Features?.trim() !== "") {
            setFeatures(parsedContent.Features);
          }
          if (parsedContent.EndToEndDescription !== "Awaiting further input." && parsedContent.EndToEndDescription?.trim() !== "") {
            setEndToEndDescription(parsedContent.EndToEndDescription);
          }   
          if (parsedContent.TargetAudience !== "Awaiting further input." && parsedContent.TargetAudience?.trim() !== "" && 
              parsedContent.Problem !== "Awaiting further input." && parsedContent.Problem?.trim() !== "" && 
              parsedContent.Unique !== "Awaiting further input." && parsedContent.Unique?.trim() !== "" && 
              parsedContent.Features !== "Awaiting further input." && parsedContent.Features?.trim() !== "" && 
              parsedContent.EndToEndDescription !== "Awaiting further input." && parsedContent.EndToEndDescription?.trim() !== "") {
            setFinalized(true);
            setMessages([...newMessages, formattedReply]);
          }

          setFinalized(parsedContent.finalized);
          setMessages([...newMessages, formattedReply]);
        } catch (err) {
          console.error('Failed to parse JSON response:', err);
          console.error('Raw content that failed to parse:', reply.content);
        
          const fallbackMessage = {
            role: 'assistant',
            content: "Oops! Something went wrong while understanding your idea. Could you rephrase?",
            persona: 'assistant'
          };
        
          setMessages([...newMessages, fallbackMessage]);
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
                Let's Brainstorm.
              </MemoizedTextAnimate>
              </h1>
              <div className='flex gap-5 items-center'>
                <div>
                  <h1>Discuss your <span className='font-bold'>own idea</span> with Muse</h1>
                </div>
                or
                <div>
                  <h1>Brainstorm a <span className='font-bold'>new idea</span> with Muse</h1>
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
          <div className='flex items-start gap-10 py-4'>
            <div className='successitems flex items-center justify-center gap-4 flex-col'>
              <div className='flex items-center justify-center gap-2'>
                <Image src={tick} alt="" />
                <span>Target Audience</span>
              </div>

              <div className='flex items-center justify-center gap-2'>
                <Image src={tick} alt="" />
                <span>Problem Statement</span>
              </div>

              <div className='flex items-center justify-center gap-2'>
                <Image src={tick} alt="" />
                <span>Unique Value Proposition</span>
              </div>

              <div className='flex items-center justify-center gap-2'>
                <Image src={tick} alt="" />
                <span>Key Features</span>
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

export default AIChat;
