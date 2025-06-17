import React from 'react';
import "./styles/QB.css"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

function QueryBot() {
  return (
    <>
    <div className='qb-main'>
      <h1>Do you have any queries, doubts regarding your dashboard?</h1>
      <div className='flex gap-3'>
        {/* <input placeholder='Ask a question....'/>
        <Button>Send</Button> */}
        <Button onClick={() => {
          const qb = document.getElementById("qb-chat");
          if(qb) {
            // qb.setAttribute("id", "fadeOutElement")
            qb.style.display="flex";
          }
        }}>Ask Personalized AI</Button>
      </div>
    </div>
    <div className='qb-chat' id="qb-chat">
      <div className='qb-chat-main'>
        <div>
          {/* <h1>Welcome to your personalized dashboard AI</h1> */}
          <h3>How can I help you?</h3>
        </div>
        <div>

        </div>
        <div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label className='opacity-[60%]' htmlFor="email">Enter query for AI Assistant</Label>
            <Input className='dark' id="query-ai" placeholder="Ex: Give me a summary of XXX " />
          </div>
          <Button variant={'secondary'}>Send</Button>
          <Button onClick={() => {
            const qb = document.getElementById("qb-chat");
            if(qb) {
              // qb.setAttribute("id", "fadeOutElement")
              qb.style.display="none";
            }
          }} className='dark' variant={'outline'}>Close Chat</Button>
        </div>
      </div>
    </div>
    </>
  )
}

export default QueryBot