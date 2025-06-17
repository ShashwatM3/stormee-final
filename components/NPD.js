import React, { useState } from 'react';
import "./NPD.css";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card"
import { Button } from './ui/button';
import { BorderBeam } from './magicui/border-beam';

function NPD() {
  const [curr, setCurr] = useState(0)
  const stages = [
    {
      title: "Idea Generation",
      description: "Brainstorming and gathering innovative ideas.",
      stormee: 'yes',
      content: "Collect ideas from internal teams, customers, competitors, or market trends."
    },
    {
      title: "Idea Screening",
      description: "Filtering viable ideas.",
      stormee: 'yes',
      content: "Evaluate potential, feasibility, and alignment with business goals."
    },
    {
      title: "Concept Development and Testing",
      description: "Refining and testing the idea.",
      stormee: 'yes',
      content: "Develop detailed concepts and test them with target audiences."
    },
    {
      title: "Marketing Strategy and Business Analysis",
      description: "Planning and financial evaluation.",
      stormee: 'no',
      content: "Build marketing strategies and conduct cost-benefit analysis."
    },
    {
      title: "Product Development",
      description: "Creating the product.",
      stormee: 'no',
      content: "Design, prototype, and develop the product with iterative feedback."
    },
    {
      title: "Test Marketing",
      stormee: 'no',
      description: "Market testing.",
      content: "Launch in a controlled environment to gather feedback and optimize."
    },
    {
      title: "Product Launch",
      stormee: 'no',
      description: "Full-scale release.",
      content: "Launch the final product to the target market with a promotion strategy."
    }
  ];

  function setWithoutStormee() {
    const withoutSection = document.getElementById("withoutStormee");
    const withSection = document.getElementById("withStormee");
    setCurr(0)
    if(withoutSection) withoutSection.style.display = "flex";
    if(withSection) withSection.style.display = "none";
  }

  function setWithStormee() {
    const withoutSection = document.getElementById("withoutStormee");
    const withSection = document.getElementById("withStormee");
    setCurr(1)
    if(withoutSection) withoutSection.style.display = "none";
    if(withSection) withSection.style.display = "flex";
  }
  
  return (
    <div className='npd-main'>
      <div>
        <div className='flex items-center justify-center flex-col gap-10 mb-10'>
          <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>The <HoverCard><HoverCardTrigger className=''>NPD</HoverCardTrigger><HoverCardContent className='dark'><b><i>New Product Development</i></b> &#8212; process of bringing a new product or service to market through a structured approach involving several stages from ideation to launch. </HoverCardContent></HoverCard> Journey</h1>
          {curr==0 ? (
            <div className='flex gap-2'>
              <Button onClick={() => {setWithoutStormee()}}className='dark cursor-pointer'>Without Stormee AI</Button>
              <Button variant='secondary' onClick={() => {setWithStormee()}}className='dark cursor-pointer'>With Stormee AI</Button>
            </div>
          ):(
            <div className='flex gap-2'>
              <Button variant='secondary' onClick={() => {setWithoutStormee()}}className='dark cursor-pointer'>Without Stormee AI</Button>
              <Button onClick={() => {setWithStormee()}}className='dark cursor-pointer'>With Stormee AI</Button>
            </div>
          )}
        </div>
        <div id="withoutStormee" className='flex items-start justify-center gap-3 flex-wrap'>
          {stages.map((stage, index) => (
            <Card key={index} className='dark w-[20vw] min-h-[20vh]'>
              <CardHeader>
                <CardTitle className='leading-[120%]'>Stage {index + 1}: {stage.title}</CardTitle>
                <CardDescription>{stage.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {/* <p>{stage.content}</p> */}
              </CardContent>
              <CardFooter>
              </CardFooter>
            </Card>
          ))}
          <Card className='bg-transparent border-none w-[20vw] min-h-[20vh] text-white'>
            <CardHeader>
              <CardTitle className='leading-[120%]'>This entire process consumes a large amount of time: weeks to months, depending on how heavy your idea is.</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
              {/* <p>{stage.content}</p> */}
            </CardContent>
            <CardFooter>
            </CardFooter>
          </Card>
        </div>

        <div id="withStormee" className='flex items-start justify-center gap-3 flex-wrap'>
          {stages.map((stage, index) => (
              stage.stormee=='yes' ? (
                <Card key={index} className='dark w-[20vw] min-h-[20vh]'>
                  <CardHeader>
                    <CardTitle className='leading-[120%]'>Stage {index + 1}: <s>{stage.title}</s> <span className='text-[pink]'>Done by Stormee</span></CardTitle>
                    <CardDescription>{stage.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* <p>{stage.content}</p> */}
                  </CardContent>
                  <CardFooter>
                  </CardFooter>
                </Card>
            ) : (
              <Card key={index} className='dark w-[20vw] min-h-[20vh]'>
              <CardHeader>
                <CardTitle className='leading-[120%]'>Stage {index + 1}: {stage.title}</CardTitle>
                <CardDescription>{stage.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {/* <p>{stage.content}</p> */}
              </CardContent>
              <CardFooter>
              </CardFooter>
            </Card>
            )
          ))}
          <Card className='bg-transparent border-none w-[20vw] min-h-[20vh] text-white'>
            <CardHeader>
              <CardTitle className='leading-[120%]'>We give a jumpstart for any founder in the <i>idea stage</i> boosting them across 1-2 weeks of research and Idea Conceptualization.</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
              {/* <p>{stage.content}</p> */}
            </CardContent>
            <CardFooter>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default NPD