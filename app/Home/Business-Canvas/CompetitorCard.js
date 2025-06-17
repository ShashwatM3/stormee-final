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

const CompetitorCard = ({ name, description, failureReason, lesson, year, location, fundingStage, source }) => {
  const [sources, setSources] = useState(null);
  const [showDescription, setShowDescription] = useState(true);
  
  if(source) {
    const sc = JSON.parse(source.substring(source.indexOf(": [")+2).trim())[0]
    // console.log(sc);
  }
  // console.log("-------------------")
  return (
    <Card className="bg-neutral-900 min-h-[40vh] border-neutral-800 w-[30vw] text-white p-6 rounded-2xl shadow-lg max-w-xl mb-3 text-left">
      <h2 className="text-2xl font-bold mb-2 font-light italic">{name}</h2>
      
      <div className="mb-2">
        {!showDescription ? (
          <Button 
            className="dark" 
            variant="secondary" 
            onClick={() => setShowDescription(true)}
          >
            View Description
          </Button>
        ) : (
          <p className="text-gray-300 text-lg mb-2 font-bold">
            {description.substring(description.indexOf(": ")+1)}
          </p>
        )}
      </div>

      <div className="mb-1">
        <h3 className="font-semibold text-red-400 mb-1">Reason for Failure</h3>
        <Dialog>
        <DialogTrigger asChild>
          <Button className="dark mt-2" variant="secondary">View reason of failure</Button>
        </DialogTrigger>
        <DialogContent className="dark">
          <DialogTitle>Why {name} <b>failed</b></DialogTitle>
          <DialogDescription>
            {failureReason.substring(failureReason.indexOf(": ")+1)}
          </DialogDescription>
        </DialogContent>
      </Dialog>
      </div>

      <div className="mb-1">
        <h3 className="font-semibold text-green-400 mb-1">What you can learn from this</h3>
        <Dialog>
          <DialogTrigger>Key Insights</DialogTrigger>
          <DialogContent className="dark">
            <DialogHeader>
              <DialogTitle>What you can <i>learn</i> from this failure</DialogTitle>
              <DialogDescription>
                {lesson.substring(lesson.indexOf(": ")+1)}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-400 mt-0">
        <span>📍 {location.substring(location.indexOf(": ")+1)}</span>
        <span>📆 {year.substring(year.indexOf(": ")+1)}</span>
      </div>

      {/* <div>{JSON.parse(source.substring(source.indexOf(": [")+2).trim()).map((src) => (
        <div key={src}>{src}</div>
      ))}</div> */}
    </Card>
  );
};

export default CompetitorCard;
