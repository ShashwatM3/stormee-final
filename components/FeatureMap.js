import React from 'react';
import "./FeatureMap.css"
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function FeatureMap() {
  const stormeeFeatures = [
    // {
    //   key: "muse-ai",
    //   title: "AI Brainstorming Assistant (Muse AI)",
    //   description: "Have a conversation with Muse AI to develop, refine, and clarify your raw idea through guided AI questioning."
    // },
    {
      key: "structured-form",
      title: "Structured Idea Form Submission",
      description: "Answer a predefined set of questions to break your idea down into critical components like value prop, audience, and problem."
    },
    {
      key: "idea-parser",
      title: "Automatic Idea Structuring Engine",
      description: "Transforms your idea into a formalized summary, ready for validation and execution planning."
    },
    {
      key: "validation-cards",
      title: "Validation Cards Dashboard",
      description: "Visual scorecards with color-coded assessments for Market Demand, Audience Clarity, Competitive Edge, and Feasibility."
    },
    {
      key: "validation-score",
      title: "Final Validation Score",
      description: "Get a numeric score for your idea, with improvement suggestions to move toward MVP readiness."
    },
    {
      key: "ai-personas",
      title: "Field-Specific Validation",
      description: "Receive expert-like multi-field feedback: Business, Tech, and Product."
    },
    // {
    //   key: "executive-summary",
    //   title: "Executive Summary Generator",
    //   description: "Auto-generate your pitch: Elevator Pitch, Problem, UVP, and Audience — editable and exportable."
    // },
    {
      key: "business-board",
      title: "Business Board Generator",
      description: "Get structured insights including Market Analysis, Revenue Strategy, SWOT, and a Release Plan."
    },
    {
      key: "validation-report",
      title: "Validation Report Viewer",
      description: "Access a detailed recap of all validation results and persona-based feedback in one place."
    },
    // {
    //   key: "refine-idea",
    //   title: "Refine Idea Button",
    //   description: "Instantly jump back into your idea with improvements based on the validation insights."
    // },
    // {
    //   key: "download-component",
    //   title: "Download Any Component",
    //   description: "One-click export any canvas section or business component as a PDF or PNG."
    // },
    // {
    //   key: "share-canvas",
    //   title: "Canvas Sharing via Link",
    //   description: "Share your full canvas securely via a unique URL — great for collaborators or mentors."
    // },
    {
      key: "tutorial-overlay",
      title: "In-App Guidance & Tooltips",
      description: "Step-by-step overlays and tooltips to onboard and guide users through the Stormee experience."
    },
    // {
    //   key: "autosave-progress",
    //   title: "Auto-Save Drafts & Progress Tracker",
    //   description: "Automatically save your work and track your progress through the idea-to-execution journey."
    // }
  ];  
  return (
    <div id="features" className='feature-map-main'>
      <div>
        <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>Our Feature Map</h1>
        <h3>Presenting to you <b>absolutely everything Stormee AI offers you</b></h3>
        <br/><br/>
        <div className='features'>
          {stormeeFeatures.map((feature) => (
            <Card className='dark' key={feature.key}>
              <CardHeader>
                <CardTitle className='leading-[110%]'>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {/* <p>Card Content</p> */}
              </CardContent>
              <CardFooter>
                {/* <p>Card Footer</p> */}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FeatureMap