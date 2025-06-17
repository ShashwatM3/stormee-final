import React, { useState } from 'react';
import "./HIW.css"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card";
import st1 from "@/components/icons/st1.png"
import st2 from "@/components/icons/st2.png";
import st3 from "@/components/icons/st3.png"
import Image from 'next/image';

function HIW() {
  const [current, setCurrent] = useState(0);
  const [expanded, setExpanded] = useState([false, false, false]);
  const slides = [
    {
      ima: st1 
    },
    {
      ima: st2
    },
    {
      ima: st3
    }
  ]; // You can extend this list

  const updateOpacity = (activeIndex) => {
    // Reset all to 50% opacity
    ['hiw-1', 'hiw-2', 'hiw-3'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.style.opacity = "30%";
      }
    });

    // Set active slide to 100% opacity
    const activeEl = document.getElementById(`hiw-${activeIndex + 1}`);
    if (activeEl) {
      activeEl.style.opacity = "100%";
    }
  };

  const prevSlide = () => {
    const newCurrent = current === 0 ? slides.length - 1 : current - 1;
    setCurrent(newCurrent);
    updateOpacity(newCurrent);
  };

  const nextSlide = () => {
    const newCurrent = current === slides.length - 1 ? 0 : current + 1;
    setCurrent(newCurrent);
    updateOpacity(newCurrent);
  };
  
  return (
    <div className='hiw-main' id="hiw-main">
      <div>
        <div>
          <div>
            <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>So how does it work?</h1>
            <div id="hiw-1" onClick={() => {
              if(current==1) {
                prevSlide();
              } else if (current==2) {
                nextSlide();
              }
            }}>
              {/* <h1>1. Brainstorm with Muse AI</h1>
              <h3>
                {expanded[0]
                  ? "This is the first stage of Stormee AI. The founder would be able to brainstorm with a creative AI assistant who helps you find critical aspects of your idea. This stage is where you can give your idea clarity. You may also choose to answer pre-defined questions manually to express as much as you wish."
                  : "This is the first stage of Stormee AI. The founder would be able to brainstorm with a creative AI assistant who helps you find critical aspects of your idea..."}
                <span
                  onClick={(e) => {
                    e.stopPropagation(); // so it doesn't trigger the carousel change
                    const newExpanded = [...expanded];
                    newExpanded[0] = !newExpanded[0];
                    setExpanded(newExpanded);
                  }}
                  style={{ color: "green", cursor: "pointer", marginLeft: "5px" }}
                >
                  {expanded[0] ? "Read Less" : "Read More"}
                </span>
              </h3> */}
              <h1>1. Let us know your idea</h1>
              <h3>
                {expanded[0]
                  ? "This is the first stage of Stormee AI. The founder would be prompted to answer few basic questions about their idea. This stage is where the Stormee AI truly understands the founder's complete idea."
                  : "This is the first stage of Stormee AI. The founder would be prompted to answer few basic questions..."}
                <span
                  onClick={(e) => {
                    e.stopPropagation(); // so it doesn't trigger the carousel change
                    const newExpanded = [...expanded];
                    newExpanded[0] = !newExpanded[0];
                    setExpanded(newExpanded);
                  }}
                  style={{ fontWeight: "200", borderBottom: "1px solid grey", cursor: "pointer", marginLeft: "5px" }}
                >
                  {expanded[0] ? "Read Less" : "Read More"}
                </span>
              </h3>
            </div>
            <div id="hiw-2" onClick={() => {
              if(current==0) {
                nextSlide();
              } else if (current==2) {
                prevSlide();
              }
            }}>
              <h1>2. Get Validation Report</h1>
              <h3>
                {expanded[1]
                  ? "This is the second stage of Stormee AI. Once the idea has been defined, Stormee AI will generate a concise, simple but powerful Validation Report that tells the founder: Will your idea work or not? Why/Why not? The founder may refine their idea even further with Muse AI if they aren't satisfied."
                  : "This is the second stage of Stormee AI. Once the idea has been defined, Stormee AI will...."}
                <span
                  onClick={(e) => {
                    e.stopPropagation(); // so it doesn't trigger the carousel change
                    const newExpanded = [...expanded];
                    newExpanded[1] = !newExpanded[1];
                    setExpanded(newExpanded);
                  }}
                  style={{ fontWeight: "200", borderBottom: "1px solid grey", cursor: "pointer", marginLeft: "5px" }}
                >
                  {expanded[1] ? "Read Less" : "Read More"}
                </span>
              </h3>
            </div>
            <div id="hiw-3" onClick={() => {
              if(current==0) {
                prevSlide();
              } else if (current==1) {
                nextSlide();
              }
            }}>
              <h1>3. Founder Dashboard</h1>
              <h3>
                {expanded[2]
                  ? "Post-validation stage, the founder will be able to access the MVP Dashboard, which contains an In-Depth Competitive Landscape Analysis, where critical details of past as well as current competitors of the same niche would be reported"
                  : "Post-validation stage, the founder will be able to access the MVP Dashboard, which contains...."}
                <span
                  onClick={(e) => {
                    e.stopPropagation(); // so it doesn't trigger the carousel change
                    const newExpanded = [...expanded];
                    newExpanded[2] = !newExpanded[2];
                    setExpanded(newExpanded);
                  }}
                  style={{ fontWeight: "200", borderBottom: "1px solid grey", cursor: "pointer", marginLeft: "5px" }}
                >
                  {expanded[2] ? "Read Less" : "Read More"}
                </span>
              </h3>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className='container'>
          <button className='arrow' onClick={prevSlide}>←</button>
          <div className='card'>
            <Image alt="" src={slides[current].ima}/>
          </div>
          <button className='arrow' onClick={nextSlide}>→</button>
        </div>
      </div>
    </div>
  )
}

export default HIW