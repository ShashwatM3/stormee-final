import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react";

const CurrentCompetitor = ({ 
  description, differentiator, funding_stage, geographic_location, key_insight, name, sources, strengths, weaknesses
}) => {
  const [sourcess, setSourcess] = useState(null);
  const [showDescription, setShowDescription] = useState(true);
  
  // if(sources) {
  //   console.log(sources)
  // }
  // console.log("----------CurrentCompetitors---------")
  return (
    <Card className="bg-neutral-900 min-h-[60vh] border-neutral-800 w-[45vw] text-white p-8 rounded-2xl shadow-lg max-w-xl mb-3 text-left">
      <h2 className="text-3xl border-b border-neutral-600 pb-3 font-extrabold mb-2">{name}</h2>
      
      <div className="mb-4">
        {!showDescription ? (
          <Button 
            className="dark" 
            variant="secondary" 
            onClick={() => setShowDescription(true)}
          >
            View Description
          </Button>
        ) : (
          <p className="text-gray-300 text-lg font-bold mb-2">
            {description.substring(description.indexOf(": ")+1)}
          </p>
        )}
      </div>

      <div className="mb-1">
        <h3 className="font-semibold text-red-400 mb-1">What makes them Unique</h3>
        <Dialog>
        <DialogTrigger asChild>
          <Button className="dark mt-2" variant="secondary">View Differentiator</Button>
        </DialogTrigger>
        <DialogContent className="dark">
          <DialogTitle>Why {name} <b>is UNIQUE</b></DialogTitle>
          <DialogDescription>
            {differentiator.substring(differentiator.indexOf(": ")+1)}
          </DialogDescription>
        </DialogContent>
      </Dialog>
      </div>

      <div className="mb-1">
        <h3 className="font-semibold text-green-400 mb-1">What you can learn from this - <span className="italic font-light">Key Insight</span></h3>
        <Dialog>
          <DialogTrigger>Key Insights</DialogTrigger>
          <DialogContent className="dark">
            <DialogHeader>
              <DialogTitle>Key Points</DialogTitle>
              <DialogDescription>
                {key_insight.substring(key_insight.indexOf(": ")+1)}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      {/* <div className="flex justify-between items-center text-sm text-gray-400 mt-0"> */}
        {/* <span>Funding Stage: {funding_stage.substring(funding_stage.indexOf(": ")+1)}</span> */}
        <div>
        <h1 className="scroll-m-20 mb-2 pb-0 text-2xl font-bold tracking-tight text-balance">Funding Status</h1>
        {funding_stage.substring(funding_stage.indexOf(": ")+1)}
        </div>

        <div>
        <h1 className="scroll-m-20 mb-4 pb-0 text-2xl font-bold tracking-tight text-balance">Source(s)</h1>
        {sources.map((source, index) => (
          <Button onClick={() => {window.open(source.url)}} className="dark" key={index}>{`${source.title.substring(0, 20)}..` || `Source ${index + 1}`}</Button>
        ))}
        </div>

      {/* <div>{JSON.parse(source.substring(source.indexOf(": [")+2).trim()).map((src) => (
        <div key={src}>{src}</div>
      ))}</div> */}
              <span>📍 {geographic_location.substring(geographic_location.indexOf(": ")+1)}</span>
    </Card>
  );
};

export default CurrentCompetitor;
