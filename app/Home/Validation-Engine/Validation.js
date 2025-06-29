'use client'

import React, { useEffect, useState } from 'react';
import "./styles.css";
import avatar from "@/components/icons/avatar.png"
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import supabase from '@/app/config/supabaseClient';
import ReactMarkdown from 'react-markdown';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

function Validation() {
  // const [marketDemand, setMarketDemand] = useState("");
  // const [marketDemandScore, setMarketDemandScore] = useState("");
  // const [targetAudience, setTargetAudience] = useState("");
  // const [targetAudienceScore, setTargetAudienceScore] = useState("");
  // const [competitiveEdge, setCompetitiveEdge] = useState({});
  // const [competitiveEdgeScore, setCompetitiveEdgeScore] = useState("");
  // const [investorPersona, setInvestorPersona] = useState("");
  // const [productManagerPersona, setProductManagerPersona] = useState("");
  // const [techLeadPersona, setTechLeadPersona] = useState("");

  // ------------------------------------------------------------------------------------------------
  //Check states
  const [marketDemandCheck, setMarketDemandCheck] = useState(false);
  const [targetAudienceCheck, setTargetAudienceCheck] = useState(false);
  const [competitiveEdgeCheck, setCompetitiveEdgeCheck] = useState(false);
  const [investorPersonaCheck, setInvestorPersonaCheck] = useState(false);
  const [productManagerPersonaCheck, setProductManagerPersonaCheck] = useState(false);
  const [techLeadPersonaCheck, setTechLeadPersonaCheck] = useState(false);

  // ------------------------------------------------------------------------------------------------
  //Persona States
  const [investorPersonaScore, setInvestorPersonaScore] = useState("");
  const [investorPersonaLabel, setInvestorPersonaLabel] = useState("");
  const [investorPersonaFeedback, setInvestorPersonaFeedback] = useState("");
  const [investorPersonaSummary, setInvestorPersonaSummary] = useState("");
  const [investorPersonaSources, setInvestorPersonaSources] = useState("");
  
  const [productPersonaScore, setProductPersonaScore] = useState("");
  const [productPersonaLabel, setProductPersonaLabel] = useState("");
  const [productPersonaFeedback, setProductPersonaFeedback] = useState("");
  const [productPersonaSummary, setProductPersonaSummary] = useState("");
  const [productPersonaSources, setProductPersonaSources] = useState("");
  
  const [techPersonaScore, setTechPersonaScore] = useState("");
  const [techPersonaLabel, setTechPersonaLabel] = useState("");
  const [techPersonaFeedback, setTechPersonaFeedback] = useState("");
  const [techPersonaSummary, setTechPersonaSummary] = useState("");
  const [techPersonaSources, setTechPersonaSources] = useState("");

  // Market Demand States
  const [marketDemandSummary, setMarketDemandSummary] = useState("");
  const [marketDemandScore, setMarketDemandScore] = useState("");
  const [marketDemandIndicators, setMarketDemandIndicators] = useState("");
  const [marketDemandRedFlags, setMarketDemandRedFlags] = useState("");
  const [marketDemandOptimization, setMarketDemandOptimization] = useState("");
  const [marketDemandSources, setMarketDemandSources] = useState("");

  // Competitive Edge States
  const [competitiveEdgeSummary, setCompetitiveEdgeSummary] = useState("");
  const [competitiveEdgeScore, setCompetitiveEdgeScore] = useState("");
  const [competitiveEdgeMetrics, setCompetitiveEdgeMetrics] = useState("");
  const [competitiveEdgeRedFlags, setCompetitiveEdgeRedFlags] = useState("");
  const [competitiveEdgeOptimization, setCompetitiveEdgeOptimization] = useState("");
  const [competitiveEdgeSources, setCompetitiveEdgeSources] = useState("");

  //Target Audience States
  const [targetAudienceSummary, setTargetAudienceSummary] = useState("");
  const [targetAudienceScore, setTargetAudienceScore] = useState("");
  const [targetAudienceEmpathyMarkers, setTargetAudienceEmpathyMarkers] = useState("");
  const [targetAudienceRedFlags, setTargetAudienceRedFlags] = useState("");
  const [targetAudienceOptimization, setTargetAudienceOptimization] = useState("");
  const [targetAudienceSources, setTargetAudienceSources] = useState("");

  const [modifiedAndUpdated, setModifiedAndUpdated] = useState("");

  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [oneliner, setOneLiner] = useState("");
  const [probSt, setProbSt] = useState("");
  const [targaud, setTargAud] = useState("");
  const [usp, setUSP] = useState("");
  const [feat, setFeat] = useState("");

  // Helper functions for safe JSON parsing
  const safeParseJSON = (jsonString) => {
    if (!jsonString || typeof jsonString !== 'string') return null;
    try {
      // Try to parse as JSON
      return JSON.parse(jsonString);
    } catch (error) {
      // If it fails, try to split by comma (for legacy data)
      if (jsonString.includes(',')) {
        // Remove brackets if present
        let cleaned = jsonString.trim();
        if (cleaned.startsWith('[') && cleaned.endsWith(']')) {
          cleaned = cleaned.slice(1, -1);
        }
        // Split by comma, but keep quoted commas together
        // This is a simple fallback, not a full CSV parser
        return cleaned.split(/,(?![^\"]*\")/).map(s => s.trim().replace(/^"|"$/g, ''));
      }
      // Otherwise, return as single-element array
      return [jsonString];
    }
  };

  const getScoreData = (scoreString) => {
    const parsed = safeParseJSON(scoreString);
    if (!parsed || !Array.isArray(parsed) || parsed.length < 2) {
      return { score: 0, label: '' };
    }
    return { score: parsed[0], label: parsed[1] };
  };

  // Helper function to get color for labels
  const getLabelColor = (label) => {
    if (label.includes("Strong") || label.includes("Defensible") || label.includes("Focused")) {
      return "bg-green-600";
    } else if (label.includes("Moderate") || label.includes("Marginal") || label.includes("Generic")) {
      return "bg-amber-300";
    } else if (label.includes("Weak") || label.includes("Vague")) {
      return "bg-red-400";
    }
    return "bg-gray-400"; // default fallback
  };

  const getArrayData = (arrayString) => {
    const parsed = safeParseJSON(arrayString);
    if (!parsed || !Array.isArray(parsed)) {
      return [];
    }
    return parsed;
  };

  function extractScore(resp) {
    const match = resp.match(/Score\s*\n?[*]*\n?(\d+(\.\d+)?)/);
    return match ? parseFloat(match[1]) : null;
  }  

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

  async function checkMarketDemand(data2, userEmail) {
    // console.log("Checking market demand.....");
    const { data, error } = await supabase
      .from('market_demand')
      .select()
      .eq('email', userEmail);

    if (error) {
      console.error("Error fetching market demand data:", error);
    }

    if (data && data.length > 0) {
      // console.log("Getting stuff for Market Demand")
      setMarketDemandSummary(data[0].tldr);
      setMarketDemandScore(data[0].score);
      setMarketDemandIndicators(data[0].indicators);
      setMarketDemandRedFlags(data[0].red_flags);
      setMarketDemandOptimization(data[0].optimization);
      setMarketDemandSources(data[0].sources);
      setMarketDemandCheck(true);
      // console.log("it's already there - Market Demand")
    } else {
      console.log("Writing prompt for Market Demand")
      const resp = await simpleGPTResp(`
        Consider yourself to be a brutally honest market demand validator. Analyze the market demand for a startup idea given below:
        Idea: ${data2[0].Idea}
        Problem: ${data2[0].Problem}
        Target Audience: ${data2[0].Target_Audience}
        Unique Value Proposition: ${data2[0].Unique}
        Key Features: ${data2[0].Features}
        Location (Is not available or specified at): ${data2[0].location}

        Respond strictly in the below format:
        {
          "score": ["....", "...."] (The first element is a number from 1 to 10 that corresponds to score out of 10. The second element corresponds to label(Strong, Moderate, Weak)),
          "indicators": ["I1: {indicator 1}", "I2: {indicator 2}", "I3: {indicator 3}"] (This array corresponds to 3 key indicators (with metric, value, and insight)),
          "red_flags": ["R1: {red flag 1}", "R2: {red flag 2}"] (red flags or limitations pertaining to idea in context of the market demand),
          "optimization_strategies": ["O1: {optimization 1}", "O2: {optimization 2}", "P1: {pivot 1}"] (The first two elements of this correspond to other ways to optimize or strengthen market demand, and the third element of this corresponds to a powerful pivot with same idea different angle(s) and so that the idea can focus on a niche where the pain is stronger),
          "summary": "Synthesize the information given above from indicators, red flags, optimization strategies, into a 1-2 line tldr",
          "sources": ["S1: {source 1}", "S2: {source 2}", "S3: {source 3}"] (2-3 sources with format "name, url" validating the market demand analysis)
        }

        Strict Guidelines: Strictly follow the output format given. Avoid using the em dash (—) in your generated content. Do NOT use [1], [2], or similar citation brackets in the text Each and everything of the content you produce MUST BE ONLY AND ONLY WITHIN THE REALM OF MARKET DEMAND. URL for each source must be complete, starting with the protocol (e.g., https://) and including all parts up to the parameters at the end.
      `);

      const start = resp.indexOf('{');
      const end = resp.lastIndexOf('}');
      const jsonString = resp.substring(start, end + 1);      

      let parsed;
      try {
        parsed = JSON.parse(jsonString);
        // console.log("market demand generated: ", parsed);
      } catch (e) {
        console.error("Failed to parse GPT reply:", resp);
        toast.error("GPT sent a bad response. Try again.");
        setIsLoading(false);
        return;
      }

      const tldr = parsed.summary || [];
      const Score = parsed.score || [];
      const Indicator = parsed.indicators || [];
      const Red_flags = parsed.red_flags || [];
      const Optimization = parsed.optimization_strategies || [];
      const Sources = parsed.sources || [];

      const { error } = await supabase
        .from('market_demand')
        .insert({ 
          tldr: tldr,
          score: Score,
          indicators: Indicator,
          red_flags: Red_flags,
          optimization: Optimization,
          sources: Sources,
          email: userEmail
        });

      if (error) {
        console.error("Error inserting market demand data:", error);
      }

      const { error:err2 } = await supabase
        .from('Users')
        .update({ final: "Yes" })
        .eq('email', userEmail)

      if (err2) {
        console.error("Error updating Users table for market demand:", err2);
      }

      setMarketDemandSummary(tldr);
      setMarketDemandScore(`${Score}`);
      setMarketDemandIndicators(`${Indicator}`);
      setMarketDemandRedFlags(`${Red_flags}`);
      setMarketDemandOptimization(`${Optimization}`);
      setMarketDemandSources(`${Sources}`);
      setMarketDemandCheck(true);
    }
  }
  
  async function checkCompetitiveEdge(data2, userEmail) {
    // console.log("Checking competitive edge.....");
    const { data, error } = await supabase
      .from('competitive_edge_metric')
      .select()
      .eq('email', userEmail);

    if (error) {
      console.error("Error fetching competitive edge data:", error);
    }

    if (data && data.length > 0) {
      // console.log("Getting stuff for Competitive Edge")
      setCompetitiveEdgeSummary(data[0].tldr);
      setCompetitiveEdgeScore(data[0].score);
      setCompetitiveEdgeMetrics(data[0].audience);
      setCompetitiveEdgeRedFlags(data[0].red_flags);
      setCompetitiveEdgeOptimization(data[0].optimization);
      setCompetitiveEdgeSources(data[0].sources);
      setCompetitiveEdgeCheck(true);
      // console.log("it's already there - Competitive Edge")
    } else {
      const resp = await simpleGPTResp(`
        You are a brutally honest Competitive Edge Analyst. Evaluate whether the startup idea below truly has a differentiated edge in the competitive landscape.
        Idea: ${data2[0].Idea}
        Problem: ${data2[0].Problem}
        Target Audience: ${data2[0].Target_Audience}
        Unique Value Proposition: ${data2[0].Unique}
        Key Features: ${data2[0].Features}
        Location (Is not available or specified at): ${data2[0].location}

        Respond strictly in the below format:
        {
          "score": ["....", "...."] (The first element corresponds to score out of 10. The second element corresponds to label(Defensible, Marginal, Weak)),
          "edge_metrics": ["M1: {metric 1. 1 line long strictly}", "M2: {metric 2. 1 line long strictly}", "M3: {metric 3. 1 line long strictly}"] (This array corresponds to 3 competitive edge metrics with value and insight),
          "red_flags": ["R1: {red flag 1}", "R2: {red flag 2}"] (competitive risks like replicability, reliance on trend, or saturated positioning),
          "optimization_strategies": ["O1: {strategy 1}", "O2: {strategy 2}", "P1: {pivot 1}"] (First two elements are strategies to strengthen moat, third is a pivot suggestion. Both must be in context of application to given startup idea),
          "summary": "A 1-2 line summary on whether this idea stands out meaningfully in its space",
          "sources": ["S1: {source 1}", "S2: {source 2}", "S3: {source 3}"] (2-3 sources with format "name, url" validating the competitive analysis)
        }

        Strict Guidelines: Strictly follow the output format given. Strictly avoid using the em dash (—) in your generated content. Do NOT use [1], [2], or similar citation brackets in the text. Each and everything of the content you produce MUST BE ONLY AND ONLY WITHIN THE REALM OF COMPETITIVE EDGE. Strictly produce only a JSON Format. Do not put any extra quotations or text behind and after the json. URL for each source must be complete, starting with the protocol (e.g., https://) and including all parts up to the parameters at the end.
      `);

      const start = resp.indexOf('{');
      const end = resp.lastIndexOf('}');
      const jsonString = resp.substring(start, end + 1);

      let parsed;
      try {
        parsed = JSON.parse(jsonString);
        // console.log("competitive edge generated: ", parsed);
      } catch (e) {
        console.error("Failed to parse GPT reply:", resp);
        toast.error("GPT sent a bad response. Try again.");
        setIsLoading(false);
        return;
      }

      const tldr = parsed.summary || [];
      const Score = parsed.score || [];
      const Edge_Metrics = parsed.edge_metrics || [];
      const Red_Flags = parsed.red_flags || [];
      const Optimization = parsed.optimization_strategies || [];
      const Sources = parsed.sources || [];

      const { error } = await supabase
        .from('competitive_edge_metric')
        .insert({ 
          tldr: tldr,
          score: Score,
          audience: Edge_Metrics,
          red_flags: Red_Flags,
          optimization: Optimization,
          sources: Sources,
          email: userEmail
        });

      if (error) {
        console.error("Error inserting competitive edge data:", error);
      }

      setCompetitiveEdgeSummary(tldr);
      setCompetitiveEdgeScore(`${Score}`);
      setCompetitiveEdgeMetrics(`${Edge_Metrics}`);
      setCompetitiveEdgeRedFlags(`${Red_Flags}`);
      setCompetitiveEdgeOptimization(`${Optimization}`);
      setCompetitiveEdgeSources(`${Sources}`);
      setCompetitiveEdgeCheck(true);
    }
  }

  async function checkTargetAudience(data2, userEmail) {
    // console.log("Checking target audience.....");
    const { data, error } = await supabase
      .from('target_audience')
      .select()
      .eq('email', userEmail);

    if (error) {
      console.error("Error fetching target audience data:", error);
    }

    if (data && data.length > 0) {
      // console.log("Getting stuff for Target Audience")
      setTargetAudienceSummary(data[0].tldr);
      setTargetAudienceScore(data[0].score);
      setTargetAudienceEmpathyMarkers(data[0].deep_markers);
      setTargetAudienceRedFlags(data[0]['red flags']);
      setTargetAudienceOptimization(data[0].optimization);
      setTargetAudienceSources(data[0].sources);

      setTargetAudienceCheck(true);
      // console.log("it's already there - Target Audience")
    } else {
      // console.log("Writing prompt for TA")
      const resp = await simpleGPTResp(`
        You are a brutally honest Target Audience Clarity Validator. Analyze how clearly the startup idea below understands and connects with its audience.
        Idea: ${data2[0].Idea}
        Problem: ${data2[0].Problem}
        Target Audience: ${data2[0].Target_Audience}
        Unique Value Proposition: ${data2[0].Unique}
        Location (Is not available or specified at): ${data2[0].location}
        Key Features: ${data2[0].Features}

        Respond strictly in the below format:
        {
          "score": ["....", "...."] (The first element corresponds to score out of 10. The second element corresponds to label(Focused, Generic, Vague)),
          "empathy_markers": ["M1: {marker 1}", "M2: {marker 2}", "M3: {marker 3}"] (3 points on emotional need, behavioral pattern, and urgency of pain),
          "red_flags": ["R1: {red flag 1}", "R2: {red flag 2}"] (clarity pitfalls like overly broad demographics),
          "optimization_strategies": ["O1: {strategy 1}", "P1: {pivot 1}"] (One strategy to improve clarity, one micro-pivot for sharper niche. Both must be in context of application to given startup idea),
          "summary": "1-2 line summary evaluating target audience clarity and specificity",
          "sources": ["S1: {source 1}", "S2: {source 2}", "S3: {source 3}"] (2-3 sources with format "name, url" validating the audience analysis)
        }

        Strict Guidelines: Strictly follow the output format given. Avoid using the em dash (—) in your generated content. Do NOT use [1], [2], or similar citation brackets in the text. Each and everything of the content you produce MUST BE ONLY AND ONLY WITHIN THE REALM OF TARGET AUDIENCE. Strictly produce only a JSON Format. Do not put any extra quotations or text behind and after the json. URL for each source must be complete, starting with the protocol (e.g., https://) and including all parts up to the parameters at the end.
      `);

      const start = resp.indexOf('{');
      const end = resp.lastIndexOf('}');
      const jsonString = resp.substring(start, end + 1);

      let parsed;
      try {
        parsed = JSON.parse(jsonString);
        // console.log("target audience generated: ", parsed);
      } catch (e) {
        console.error("Failed to parse GPT reply:", resp);
        toast.error("GPT sent a bad response. Try again.");
        setIsLoading(false);
        return;
      }

      const tldr = parsed.summary || [];
      const Score = parsed.score || [];
      const Empathy_Markers = parsed.empathy_markers || [];
      const Red_Flags = parsed.red_flags || [];
      const Optimization = parsed.optimization_strategies || [];
      const Sources = parsed.sources || [];

      const { error } = await supabase
        .from('target_audience')
        .insert({ 
          tldr: tldr,
          score: Score,
          deep_markers: Empathy_Markers,
          'red flags': Red_Flags,
          optimization: Optimization,
          sources: Sources,
          email: userEmail
        });

      if (error) {
        console.error("Error inserting target audience data:", error);
      }

      setTargetAudienceSummary(tldr);
      setTargetAudienceScore(`${Score}`);
      setTargetAudienceEmpathyMarkers(`${Empathy_Markers}`);
      setTargetAudienceRedFlags(`${Red_Flags}`);
      setTargetAudienceOptimization(`${Optimization}`);
      setTargetAudienceSources(`${Sources}`);

      setTargetAudienceCheck(true);
    }
  }

  async function checkPersonas(data2, userEmail) {
    // console.log("Checking personas.....");
    const { data, error } = await supabase
      .from('personas')
      .select()
      .eq('email', userEmail);

    if (error) {
      console.error("Error fetching personas data:", error);
    }

    if (data && data.length > 0) {
      // console.log("Getting stuff for Personas")
      // console.log(data[0])
      setInvestorPersonaScore(data[0].investor_persona_score);
      setInvestorPersonaLabel(data[0].investor_persona_label);
      setInvestorPersonaFeedback(data[0].investor_persona_feedback);
      setInvestorPersonaSummary(data[0].investor_persona_summary);
      setInvestorPersonaSources(data[0].investor_persona_sources);
      
      setProductPersonaScore(data[0].product_persona_score);
      setProductPersonaLabel(data[0].product_persona__label);
      setProductPersonaFeedback(data[0].product_persona__feedback);
      setProductPersonaSummary(data[0].product_persona__summary);
      setProductPersonaSources(data[0].product_persona__sources);
      
      setTechPersonaScore(data[0].tech_persona_score);
      setTechPersonaLabel(data[0].tech_persona_label);
      setTechPersonaFeedback(data[0].tech_persona_feedback);
      setTechPersonaSummary(data[0].tech_persona_summary);
      setTechPersonaSources(data[0].tech_persona_sources);

      setInvestorPersonaCheck(true);
      setProductManagerPersonaCheck(true);
      setTechLeadPersonaCheck(true);
      // console.log("it's already there - Personas")
    } else {
      // console.log("Typing prompt (personas)")
      const resp1 = await simpleGPTResp(`
        You are an experienced startup investor evaluating an early-stage idea:

        ${data2[0].Idea}
        ${data2[0].Problem}
        ${data2[0].Target_Audience}
        ${data2[0].Unique}
        Location (Is not available or specified at): ${data2[0].location}
        ${data2[0].Features}

        Respond strictly in the below format:
        {
          "score": ["....", "...."] (The first element corresponds to score out of 10. The second element corresponds to label(Strong, Moderate, Weak)),
          "feedback": ["F1: {feedback 1}", "F2: {feedback 2}", "F3: {feedback 3}"] (3 powerful, direct sentences assessing market size, differentiation, scalability, and monetizability of the idea and how idea can be optimized in this context),
          "summary": "1-2 line synthesis of the feedback above",
          "sources": ["S1: {source 1}", "S2: {source 2}"] (2 sources with format "name, url" validating the investor perspective)
        }

        Strict Guidelines: Be brutally honest and realistic. Avoid using the em dash (—) in your generated content. Do NOT use [1], [2], or similar citation brackets in the text. Each feedback point must be under 10 words and direct. Strictly produce only a JSON Format. Do not put any extra quotations or text behind and after the json. URL for each source must be complete, starting with the protocol (e.g., https://) and including all parts up to the parameters at the end.
      `);
      // console.log("Prompt 1 DONE WOOHOO")

      const resp2 = await simpleGPTResp(`
        You are a seasoned product manager reviewing a new product idea:

        ${data2[0].Idea}
        ${data2[0].Problem}
        ${data2[0].Target_Audience}
        ${data2[0].Unique}
        Location (Is not available or specified at): ${data2[0].location}
        ${data2[0].Features}

        Respond strictly in the below format:
        {
          "score": ["....", "...."] (The first element corresponds to score out of 10. The second element corresponds to label(Strong, Moderate, Weak)),
          "feedback": ["F1: {feedback 1}", "F2: {feedback 2}", "F3: {feedback 3}"] (3 powerful, direct sentences assessing user-centricity, feature feasibility, roadmap clarity, and MVP scope and how idea can be optimized in this context),
          "summary": "1-2 line synthesis of the feedback above",
          "sources": ["S1: {source 1}", "S2: {source 2}"] (2 sources with format "name, url" validating the product perspective)
        }

        Strict Guidelines: Be direct and unfiltered. Avoid using the em dash (—) in your generated content. Do NOT use [1], [2], or similar citation brackets in the text. Each feedback point must be under 10 words and powerful. Strictly produce only a JSON Format. Do not put any extra quotations or text behind and after the json. URL for each source must be complete, starting with the protocol (e.g., https://) and including all parts up to the parameters at the end.
      `);
      // console.log("Prompt 2 DONE WOOHOO")

      const resp3 = await simpleGPTResp(`
        You are a technical lead assessing the technical side of a product idea:

        ${data2[0].Idea}
        ${data2[0].Problem}
        ${data2[0].Target_Audience}
        ${data2[0].Unique}
        Location (Is not available or specified at): ${data2[0].location}
        ${data2[0].Features}

        Respond strictly in the below format:
        {
          "score": ["....", "...."] (The first element corresponds to score out of 10. The second element corresponds to label(Strong, Moderate, Weak)),
          "feedback": ["F1: {feedback 1}", "F2: {feedback 2}", "F3: {feedback 3}"] (3 powerful, direct sentences assessing implementation feasibility, architecture, bottlenecks, and security and how idea can be optimized in this context),
          "summary": "1-2 line synthesis of the feedback above",
          "sources": ["S1: {source 1}", "S2: {source 2}"] (2 sources with format "name, url" validating the technical perspective)
        }

        Strict Guidelines: Be honest and concise. Avoid using the em dash (—) in your generated content. Do NOT use [1], [2], or similar citation brackets in the text. Each feedback point must be under 10 words and direct. Strictly produce only a JSON Format. Do not put any extra quotations or text behind and after the json. URL for each source must be complete, starting with the protocol (e.g., https://) and including all parts up to the parameters at the end.
      `);
      // console.log("got prompts yayy (personas)")

      let parsed1, parsed2, parsed3;

      try {
        const start1 = resp1.indexOf('{');
        const end1 = resp1.lastIndexOf('}');
        const jsonString1 = resp1.substring(start1, end1 + 1);
        parsed1 = JSON.parse(jsonString1);
        // console.log("investor persona generated: ", parsed1);

        const start2 = resp2.indexOf('{');
        const end2 = resp2.lastIndexOf('}');
        const jsonString2 = resp2.substring(start2, end2 + 1);
        parsed2 = JSON.parse(jsonString2);
        // console.log("product manager persona generated: ", parsed2);

        const start3 = resp3.indexOf('{');
        const end3 = resp3.lastIndexOf('}');
        const jsonString3 = resp3.substring(start3, end3 + 1);
        parsed3 = JSON.parse(jsonString3);
        // console.log("tech lead persona generated: ", parsed3);
      } catch (e) {
        console.error("Failed to parse GPT reply:", e);
        toast.error("GPT sent a bad response. Try again.");
        setIsLoading(false);
        return;
      }

      const { error } = await supabase
      .from('personas')
      .insert({
        email: userEmail,
        investor_persona_score: parsed1.score[0],
        investor_persona_label: parsed1.score[1],
        investor_persona_feedback: parsed1.feedback,
        investor_persona_summary: parsed1.summary,
        investor_persona_sources: parsed1.sources,
      
        product_persona_score: parsed2.score[0],
        product_persona__label: parsed2.score[1],
        product_persona__feedback: parsed2.feedback,
        product_persona__summary: parsed2.summary,
        product_persona__sources: parsed2.sources,
      
        tech_persona_score: parsed3.score[0],
        tech_persona_label: parsed3.score[1],
        tech_persona_feedback: parsed3.feedback,
        tech_persona_summary: parsed3.summary,
        tech_persona_sources: parsed3.sources,
      })

      if (error) {
        console.error("Error inserting personas data:", error);
      }

      setInvestorPersonaScore(`${parsed1.score[0]}`);
      setInvestorPersonaLabel(`${parsed1.score[1]}`);
      setInvestorPersonaFeedback(`${parsed1.feedback}`);
      setInvestorPersonaSummary(`${parsed1.summary}`);
      setInvestorPersonaSources(`${parsed1.sources}`);
      setProductPersonaScore(`${parsed2.score[0]}`);
      setProductPersonaLabel(`${parsed2.score[1]}`);
      setProductPersonaFeedback(`${parsed2.feedback}`);
      setProductPersonaSummary(`${parsed2.summary}`);
      setProductPersonaSources(`${parsed2.sources}`);
      setTechPersonaScore(`${parsed3.score[0]}`);
      setTechPersonaLabel(`${parsed3.score[1]}`);
      setTechPersonaFeedback(`${parsed3.feedback}`);
      setTechPersonaSummary(`${parsed3.summary}`);
      setTechPersonaSources(`${parsed3.sources}`);

      setInvestorPersonaCheck(true);
      setProductManagerPersonaCheck(true);
      setTechLeadPersonaCheck(true);

      window.location.reload();
    }
  }

  async function fetchData(userEmail) {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('Users')
      .select()
      .eq('email', userEmail)

    if (error) {
      console.error("Error fetching user data:", error);
      setIsLoading(false);
      return;
    }

    if(data && data.length>0) {
      setUserData(data);
      setOneLiner(data[0].Idea || '');
      setProbSt(data[0].Problem || '');
      setTargAud(data[0].Target_Audience || '');
      setUSP(data[0].Unique || '');
      setFeat(data[0].Features || '');
      setModifiedAndUpdated(data[0].modifiedAndUpdated);

      // Run all checks in parallel
      await Promise.all([
        checkMarketDemand(data, userEmail),
        checkCompetitiveEdge(data, userEmail),
        checkTargetAudience(data, userEmail),
        checkPersonas(data, userEmail)
      ]);
      
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      fetchData(session.user.email);
    } else if (status === 'loading') {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [status, session]);

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
      console.error("Error updating user idea details:", error);
      toast.error("Failed to update details");
    } else {
      toast.success("Details successfully updated");
      fetchData(session.user.email);
      document.getElementById("sheet-close").click();
    }
  }

  async function regenerateDashboard() {
    const el = document.getElementById("modified-changes")
    if(el) { el.innerHTML="Loading..." }
    
    try {
      // Define all tables to delete from
      const tablesToDelete = [
        'competitive_edge_metric',
        'current_competitors', 
        'graveyard',
        'market_demand',
        'personas',
        'target_audience'
      ];

      // Delete from all tables in parallel for better performance
      const deletePromises = tablesToDelete.map(table => 
        supabase
          .from(table)
          .delete()
          .eq('email', session.user.email)
      );

      const deleteResults = await Promise.all(deletePromises);
      
      // Check for any deletion errors
      const errors = deleteResults
        .map((result, index) => result.error ? { table: tablesToDelete[index], error: result.error } : null)
        .filter(error => error !== null);

      if (errors.length > 0) {
        console.error("Errors during deletion:", errors);
        toast.error("Some data couldn't be deleted. Please try again.");
        if(el) { el.innerHTML="Error occurred. Click to retry." }
        return;
      }

      // Update user's final status to trigger re-generation
      const { error: updateError } = await supabase
        .from('Users')
        .update({ modifiedAndUpdated: "na" })
        .eq('email', session.user.email);

      if (updateError) {
        console.error("Error updating user status:", updateError);
        toast.error("Failed to reset user status");
        if(el) { el.innerHTML="Error occurred. Click to retry." }
        return;
      } else {
        alert("Everything's fine")
        router.push("/Home");
      }

    } catch (error) {
      console.error("Error in regenerateDashboard:", error);
      toast.error("Failed to regenerate dashboard. Please try again.");
      if(el) { el.innerHTML="Error occurred. Click to retry." }
    }
  }

  return (
    <>
    {marketDemandCheck && targetAudienceCheck && competitiveEdgeCheck && 
     investorPersonaCheck && productManagerPersonaCheck && techLeadPersonaCheck &&
     marketDemandSummary && marketDemandScore && marketDemandIndicators && marketDemandRedFlags && marketDemandOptimization && marketDemandSources &&
     targetAudienceSummary && targetAudienceScore && targetAudienceEmpathyMarkers && targetAudienceRedFlags && targetAudienceOptimization && targetAudienceSources &&
     investorPersonaScore && investorPersonaLabel && investorPersonaFeedback && investorPersonaSummary && investorPersonaSources &&
     productPersonaScore && productPersonaLabel && productPersonaFeedback && productPersonaSummary && productPersonaSources &&
     techPersonaScore && techPersonaLabel && techPersonaFeedback && techPersonaSummary && techPersonaSources ? (
      <div id="validation-main" className='validation-main'>
      <div>
        <h1 className='validationTitle scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-2'>Your Validation Engine</h1>
        <h3 className='mb-4'>View your validation metrics + field-wise feedback</h3>

        {modifiedAndUpdated.trim()=="No" && (
          <Alert variant="destructive" className='dark cursor-pointer flex items-center justify-center' onClick={() => {regenerateDashboard()}}>
            {/* <AlertTitle>Heads up!</AlertTitle> */}
            <AlertDescription>
              <span id="modified-changes">You have modified your idea. Click here to re-generate your validation dashboard to match your current modified idea.</span>
            </AlertDescription>
          </Alert>
        )}
        <div className='flex items-center w-[90vw] metrics-validate'>
          
          {/* -------------------------------------------------------------------------- */}
          {/* Market Demand */}
          <div className="flex-1 relative metric" onClick={() => {
            const el = document.getElementById("market-demand-main");
            if(el) {
              el.style.display="flex"
            }
          }}>
            <div>
              <h1>Market Demand</h1>
              <h3>Click to learn more.</h3>
            </div>
            {(() => {
              const scoreData = getScoreData(marketDemandScore);
              if (scoreData.label.includes("Strong")) {
                return (
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getLabelColor(scoreData.label)}`}></div>
                    <span className='text-green-600'>{scoreData.label}</span>
                  </div>
                );
              } else if (scoreData.label.includes("Moderate")) {
                return (
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getLabelColor(scoreData.label)}`}></div>
                    <span className='text-amber-300'>{scoreData.label}</span>
                  </div>
                );
              } else if (scoreData.label.includes("Weak")) {
                return (
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getLabelColor(scoreData.label)}`}></div>
                    <span className='text-red-400'>{scoreData.label}</span>
                  </div>
                );
              }
              return null;
            })()}
          </div>

          <div id="market-demand-main" className='metric-dashboard'>
            <div>
              <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-10'>Market Demand</h1>
              {/* Score */}
              <h3 className='text-center font-bold text-2xl opacity-[90%]'>
                Score:&nbsp;
                {(() => {
                  const scoreData = getScoreData(marketDemandScore);
                  return (
                    <>
                      <span className='mr-2'>{scoreData.score}/10</span>&mdash;
                      {scoreData.label.includes("Strong") && (
                        <span className='text-green-600 ml-2'>{scoreData.label}</span>
                      )}
                      {scoreData.label.includes("Moderate") && (
                        <span className='text-yellow-300 opacity-full ml-2'>{scoreData.label}</span>
                      )}
                      {scoreData.label.includes("Weak") && (
                        <span className='text-red-400 ml-2'>{scoreData.label}</span>
                      )}
                    </>
                  );
                })()}
              </h3>
              <br/>
              <div className='flex items-center justify-center min-h-[50vh] w-[70vw]'>  
                <div className='w-[40vw] mr-2'>
                  <div className='min-h-[20vh]'>
                    <div className='flex items-center justify-between mb-10'>
                      <h1>TL;DR</h1>
                      <h3 className='italic'>How your idea plays out in market demand</h3>
                    </div>
                    <h3 className='opacity-[60%]'>
                      {marketDemandSummary}
                    </h3>
                  </div>

                  {/* Red Flags */}
                  <div className='min-h-[10vh]'>
                    <div className='flex items-center justify-between gap-2 mb-5'>
                      <h1 className=''>Red Flags</h1>
                      <span>‼️</span>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className='dark cursor-pointer' variant='secondary'>View gaps in your idea</Button>
                      </DialogTrigger>
                      <DialogContent className='dark text-white'>
                        <DialogHeader>
                          <DialogTitle className='mb-2'>Some barriers you should consider</DialogTitle>
                        </DialogHeader>
                        {getArrayData(marketDemandRedFlags).map((redFlag, index) => (
                          <div className='opacity-[60%]' key={index}>
                            <span>{redFlag.split(": ")[1]}</span>
                          </div>
                        ))}
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* Suggestions */}
                  <div className='min-h-[10vh]'>
                    {(() => {
                      const scoreData = getScoreData(marketDemandScore);
                      return (
                        <>
                          {scoreData.label.includes("Strong") && (
                            <>
                              <h3 className='font-bold'>Some suggestions on how you can maximize your market demand</h3><br/>
                            </>
                          )}
                          {scoreData.label.includes("Moderate") && (
                            <>
                              <h3 className='font-bold'>How you can bring your market demand from Moderate to <span className='text-green-500'>Strong</span></h3><br/>
                            </>
                          )}
                          {scoreData.label.includes("Weak") && (
                            <>
                              <h3 className='font-bold'>How you can bring your market demand from Weak to <span className='border-b pb-4'>Strong</span></h3><br/>
                            </>
                          )}
                        </>
                      );
                    })()}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className='dark'>Check Suggestions</Button>
                      </DialogTrigger>
                      <DialogContent className='dark'>
                        <DialogHeader>
                          <DialogTitle className='mb-4'>How you can optimize</DialogTitle>
                          {getArrayData(marketDemandOptimization).map((optim, index) => (
                            <div className='opacity-[65%]' key={index}>
                              <span key={index}>{optim.split(": ")[1]}</span>
                              <br/><br/>
                            </div>
                          ))}
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </div>

                </div>
                <div className='w-[40vw]'>

                  {/* Indicators */}
                  <div className='min-h-[20vh]'>
                  <div className='flex items-center gap-2 mb-5'>
                      <span className='dot'/>
                      <h1 className=''>Indicators</h1>
                    </div>
                    <h3 className='opacity-[60%] border-t border-neutral-600 pt-4'>
                      {getArrayData(marketDemandIndicators).map((indicator, index) => (
                        <div key={index} className='border-b border-neutral-600 pb-4 mb-4'>
                          <li key={index}>{indicator.split(": ")[1]}</li>
                        </div>
                      ))}
                    </h3>
                  </div>

                  {/* Sources + button */}
                  <div className='flex items-center justify-center gap-2 bg-transparent p-0'>
                    <Button className='dark' variant='secondary' onClick={() => {
                      const el = document.getElementById("market-demand-main");
                      if(el) {
                        el.style.display="none"
                      }
                    }}>Back to Validation Engine</Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className='dark'>View Sources</Button>
                      </DialogTrigger>
                      <DialogContent className='dark w-[40vw] overflow-scroll'>
                        <DialogHeader>
                          <DialogTitle>Sources to information</DialogTitle><br/>
                            {getArrayData(marketDemandSources).map((source, index) => (
                              <div className='mb-4' key={index}>
                                <Button className='dark' variant='outline' onClick={() => {
                                  const urlStart = source.indexOf("http");
                                  if (urlStart !== -1) {
                                    window.open(source.substring(urlStart));
                                  }
                                }}>
                                  {(() => {
                                    const urlStart = source.indexOf("http");
                                    if (urlStart !== -1) {
                                      return source.substring(source.indexOf(": ")+2, urlStart).trim();
                                    }
                                    return source;
                                  })()}
                                </Button>
                              </div>
                            ))}
                            <span className='opacity-[60%]'>Some links may not open due to restrictivity.</span>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </div>

                </div>
              </div>
              <br/>
            </div>
          </div>

          {/* -------------------------------------------------------------------------- */}
          {/* Target Audience */}
          <div className="flex-1 relative metric" onClick={() => {
            const el = document.getElementById("target-audience-main");
            if(el) {
              el.style.display="flex"
            }
          }}>
            <div>
              <h1>Target Audience Clarity</h1>
              <h3>Click to learn more.</h3>
            </div>
            {(() => {
              const scoreData = getScoreData(targetAudienceScore);
              if (scoreData.label.includes("Focused")) {
                return (
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getLabelColor(scoreData.label)}`}></div>
                    <span className='text-green-600'>{scoreData.label}</span>
                  </div>
                );
              } else if (scoreData.label.includes("Generic")) {
                return (
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getLabelColor(scoreData.label)}`}></div>
                    <span className='text-amber-300'>{scoreData.label}</span>
                  </div>
                );
              } else if (scoreData.label.includes("Vague")) {
                return (
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getLabelColor(scoreData.label)}`}></div>
                    <span className='text-red-400'>{scoreData.label}</span>
                  </div>
                );
              }
              return null;
            })()}
          </div>

          <div id="target-audience-main" className='metric-dashboard'>
            <div>
              <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-10'>Target Audience</h1>

              <h3 className='text-center font-bold text-2xl opacity-[90%]'>
                Score:&nbsp;
                {(() => {
                  const scoreData = getScoreData(targetAudienceScore);
                  return (
                    <>
                      <span className='mr-2'>{scoreData.score}/10</span>&mdash;
                      {scoreData.label.includes("Focused") && (
                        <span className='text-green-600 ml-2'>{scoreData.label}</span>
                      )}
                      {scoreData.label.includes("Generic") && (
                        <span className='text-yellow-300 opacity-full ml-2'>{scoreData.label}</span>
                      )}
                      {scoreData.label.includes("Vague") && (
                        <span className='text-red-400 ml-2'>{scoreData.label}</span>
                      )}
                    </>
                  );
                })()}
              </h3>
              <br/>
              <div className='flex items-center justify-center min-h-[50vh] w-[70vw]'>  
                <div className='w-[40vw] mr-2'>
                  <div className='min-h-[20vh]'>
                    <div className='flex items-center justify-between mb-10'>
                      <h1>TL;DR</h1>
                      <h3 className='italic'>How clear/defined your target audience is</h3>
                    </div>
                    <h3 className='opacity-[60%] p-2'>
                      {targetAudienceSummary}
                    </h3>
                  </div>


                  <div className='min-h-[10vh]'>
                    <div className='flex items-center justify-between gap-2 mb-5'>
                      <h1 className=''>Red Flags</h1>
                      <span>‼️</span>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className='dark cursor-pointer' variant='secondary'>View gaps in your idea</Button>
                      </DialogTrigger>
                      <DialogContent className='dark text-white'>
                        <DialogHeader>
                          <DialogTitle className='mb-2'>Some barriers you should consider</DialogTitle>
                        </DialogHeader>
                        {getArrayData(targetAudienceRedFlags).map((redflag, index) => (
                          <div className='opacity-[60%]' key={index}>
                            <span>{redflag.substring(redflag.indexOf(": ")+2)}</span>
                          </div>
                        ))}
                      </DialogContent>
                    </Dialog>
                  </div>


                  <div className='min-h-[10vh]'>
                    {(() => {
                      const scoreData = getScoreData(targetAudienceScore);
                      return (
                        <>
                          {scoreData.label.includes("Focused") && (
                            <>
                              <h3 className='font-bold'>Some suggestions on how you can make your target audience sharper</h3><br/>
                            </>
                          )}
                          {scoreData.label.includes("Generic") && (
                            <>
                              <h3 className='font-bold'>How you can bring your target audience from Generic to <span className='text-green-500'>Focused</span></h3><br/>
                            </>
                          )}
                          {scoreData.label.includes("Vague") && (
                            <>
                              <h3 className='font-bold'>How you can bring your target audience from Vague to <span className='border-b pb-4'>Focused</span></h3><br/>
                            </>
                          )}
                        </>
                      );
                    })()}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className='dark'>Check Suggestions</Button>
                      </DialogTrigger>
                      <DialogContent className='dark'>
                        <DialogHeader>
                          <DialogTitle className='mb-4'>How you can optimize</DialogTitle>
                          {getArrayData(targetAudienceOptimization).map((optim, index) => (
                            <div className='opacity-[65%]' key={index}>
                              <span key={index}>{optim.split(": ")[1]}</span>
                              <br/><br/>
                            </div>
                          ))}
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <div className='w-[40vw]'>

                  <div className='min-h-[20vh]'>
                    <div className='flex items-center gap-2 mb-5'>
                      <span className='dot'/>
                      <h1 className=''>Emotional Drivers</h1>
                    </div>
                    <h3 className='opacity-[60%] border-t border-neutral-600 pt-4'>
                      {getArrayData(targetAudienceEmpathyMarkers).map((marker, index) => (
                        <div key={index} className='border-b border-neutral-600 pb-4 mb-4'>
                          <span>&#x2022;&nbsp;&nbsp;{marker.substring(marker.indexOf(": ")+2)}</span>
                        </div>
                      ))}
                    </h3>
                  </div>
                  

                  <div className='flex items-center justify-center gap-2 bg-transparent p-0'>
                    <Button className='dark' variant='secondary' onClick={() => {
                      const el = document.getElementById("target-audience-main");
                      if(el) {
                        el.style.display="none"
                      }
                    }}>Back to Validation Engine</Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className='dark'>View Sources</Button>
                      </DialogTrigger>
                      <DialogContent className='dark'>
                        <DialogHeader>
                          <DialogTitle>Sources to information</DialogTitle><br/>
                            {getArrayData(targetAudienceSources).map((source, index) => (
                              <div className='mb-4' key={index}>
                                <Button className='dark' variant='outline' onClick={() => {
                                  const urlStart = source.indexOf("http");
                                  if (urlStart !== -1) {
                                    window.open(source.substring(urlStart));
                                  }
                                }}>
                                  {(() => {
                                    const urlStart = source.indexOf("http");
                                    if (urlStart !== -1) {
                                      return source.substring(0, urlStart).trim();
                                    }
                                    return source;
                                  })()}
                                </Button>
                              </div>
                            ))}
                            <span className='opacity-[60%]'>Some links may not open due to restrictivity.</span>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
              <br/>
            </div>
          </div>

          {/* ------------------------------------------------------------------------- */}
           {/* Competitive Edge */}
          <div className="flex-1 relative metric" onClick={() => {
            const el = document.getElementById("competitive-edge-main");
            if(el) {
              el.style.display="flex"
            }
          }}>
            <div>
              <h1>Competitive Edge</h1>
              <h3>Click to learn more.</h3>
            </div>
            {(() => {
              const scoreData = getScoreData(competitiveEdgeScore);
              if (scoreData.label.includes("Defensible")) {
                return (
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getLabelColor(scoreData.label)}`}></div>
                    <span className='text-green-600'>{scoreData.label}</span>
                  </div>
                );
              } else if (scoreData.label.includes("Marginal")) {
                return (
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getLabelColor(scoreData.label)}`}></div>
                    <span className='text-amber-300'>{scoreData.label}</span>
                  </div>
                );
              } else if (scoreData.label.includes("Weak")) {
                return (
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getLabelColor(scoreData.label)}`}></div>
                    <span className='text-red-400'>{scoreData.label}</span>
                  </div>
                );
              }
              return null;
            })()}
          </div>

          <div id="competitive-edge-main" className='metric-dashboard'>
            <div>
              <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-10'>Competitive Edge</h1>

              <h3 className='text-center font-bold text-2xl opacity-[90%]'>
                Score:&nbsp;
                {(() => {
                  const scoreData = getScoreData(competitiveEdgeScore);
                  return (
                    <>
                      <span className='mr-2'>{scoreData.score}/10</span>&mdash;
                      {scoreData.label.includes("Defensible") && (
                        <span className='text-green-600 ml-2'>{scoreData.label}</span>
                      )}
                      {scoreData.label.includes("Marginal") && (
                        <span className='text-yellow-300 opacity-full ml-2'>{scoreData.label}</span>
                      )}
                      {scoreData.label.includes("Weak") && (
                        <span className='text-red-400 ml-2'>{scoreData.label}</span>
                      )}
                    </>
                  );
                })()}
              </h3>
              <br/>
              <div className='flex items-center justify-center min-h-[50vh] w-[70vw]'>  
                <div className='w-[40vw] mr-2'>
                  <div className='min-h-[20vh]'>
                    <div className='flex items-center justify-between mb-10'>
                      <h1>TL;DR</h1>
                      <h3 className='italic'>How does <i>your product</i> stand apart?</h3>
                    </div>
                    <h3 className='opacity-[60%] p-2'>
                      {competitiveEdgeSummary}
                    </h3>
                  </div>


                  <div className='min-h-[10vh]'>
                    <div className='flex items-center justify-between gap-2 mb-5'>
                      <h1 className=''>Red Flags</h1>
                      <span>‼️</span>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className='dark cursor-pointer' variant='secondary'>View gaps in your idea</Button>
                      </DialogTrigger>
                      <DialogContent className='dark text-white'>
                        <DialogHeader>
                          <DialogTitle className='mb-2'>Some barriers you should consider</DialogTitle>
                        </DialogHeader>
                        {getArrayData(competitiveEdgeRedFlags).map((redflag, index) => (
                          <div className='opacity-[60%]' key={index}>
                            <span>{redflag.substring(redflag.indexOf(": ")+2)}</span>
                          </div>
                        ))}
                      </DialogContent>
                    </Dialog>
                  </div>


                  <div className='min-h-[10vh]'>
                    {(() => {
                      const scoreData = getScoreData(competitiveEdgeScore);
                      return (
                        <>
                          {scoreData.label.includes("Defensible") && (
                            <>
                              <h3 className='font-bold'>Some suggestions on how you can maximize competitive edge</h3><br/>
                            </>
                          )}
                          {scoreData.label.includes("Marginal") && (
                            <>
                              <h3 className='font-bold'>How you can bring your competitive edge from Marginal to <span className='text-green-500'>Defensible</span></h3><br/>
                            </>
                          )}
                          {scoreData.label.includes("Weak") && (
                            <>
                              <h3 className='font-bold'>How you can bring your competitive edge from Weak to <span className='border-b pb-4'>Defensible</span></h3><br/>
                            </>
                          )}
                        </>
                      );
                    })()}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className='dark'>Check Suggestions</Button>
                      </DialogTrigger>
                      <DialogContent className='dark'>
                        <DialogHeader>
                          <DialogTitle className='mb-4'>How you can optimize</DialogTitle>
                          {getArrayData(competitiveEdgeOptimization).map((optim, index) => (
                            <div className='opacity-[65%]' key={index}>
                              <span key={index}>{optim.split(": ")[1]}</span>
                              <br/><br/>
                            </div>
                          ))}
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <div className='w-[40vw]'>

                  <div className='min-h-[20vh]'>
                    <div className='flex items-center gap-2 mb-5'>
                      <span className='dot'/>
                      <h1 className=''>Edge Metrics</h1>
                    </div>
                    <h3 className='opacity-[60%] border-t border-neutral-600 pt-4'>
                      {getArrayData(competitiveEdgeMetrics).map((marker, index) => (
                        <div key={index} className='border-b border-neutral-600 pb-4 mb-4'>
                          <span>&#9654;&nbsp;&nbsp;{marker.substring(marker.indexOf(": ")+2)}</span>
                        </div>
                      ))}
                    </h3>
                  </div>
                  

                  <div className='flex items-center justify-center gap-2 bg-transparent p-0'>
                    <Button className='dark' variant='secondary' onClick={() => {
                      const el = document.getElementById("competitive-edge-main");
                      if(el) {
                        el.style.display="none"
                      }
                    }}>Back to Validation Engine</Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className='dark'>View Sources</Button>
                      </DialogTrigger>
                      <DialogContent className='dark'>
                        <DialogHeader>
                          <DialogTitle>Sources to information</DialogTitle><br/>
                            {getArrayData(competitiveEdgeSources).map((source, index) => (
                              <div className='mb-4' key={index}>
                                <Button className='dark' variant='outline' onClick={() => {
                                  const urlStart = source.indexOf("http");
                                  if (urlStart !== -1) {
                                    window.open(source.substring(urlStart));
                                  }
                                }}>
                                  {(() => {
                                    const urlStart = source.indexOf("http");
                                    if (urlStart !== -1) {
                                      return source.substring(0, urlStart).trim();
                                    }
                                    return source;
                                  })()}
                                </Button>
                              </div>
                            ))}
                            <span className='opacity-[60%]'>Some links may not open due to restrictivity.</span>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
              <br/>
            </div>
          </div>

          {/* ------------------------------------------------------------------------- */}

        </div>
        <div className='flex items-center w-[90vw] personas-validate'>
           {/* Investor Persona */}
          <div className="flex-1 relative">
            <div className='flex items-center justify-center flex-col'>
              <div className='flex items-center justify-between w-full mb-7'>
                <h1 className='text-xl font-bold pr-5'>What would Investors say?</h1>
                <Image className='avatar-persona' alt="" src={avatar}/>
              </div>
              {investorPersonaSummary && investorPersonaSummary.length > 0 && (
                <div id="investor-persona" className='persona opacity-[60%]'>
                  {investorPersonaSummary.split(".").filter(line => line.trim() !== "").map((line, lineIndex) => (
                    <React.Fragment key={lineIndex}>
                      <li>{line.trim()}</li><br/>
                    </React.Fragment>
                  ))}
                </div>
              )}<br/>
              <div className='flex items-center justify-between w-full'>
                <span></span>
                <div className='flex items-center gap-2'>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className='dark'>More</Button>
                    </DialogTrigger>
                    <DialogContent className='dark'>
                      <DialogHeader>
                        <DialogTitle className='mb-3'>Additional Feedback</DialogTitle>
                        {getArrayData(investorPersonaFeedback).map((invest, index) => (
                          <div className='opacity-[65%]' key={index}>
                            <span className='mb-2 text-md'>{invest.substring(invest.indexOf(": ")+2)}</span>
                          </div>
                        ))}
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className='dark' variant='secondary'>Sources</Button>
                    </DialogTrigger>
                    <DialogContent className='dark'>
                      <DialogHeader>
                        <DialogTitle className='mb-3'>Relevant sources of information</DialogTitle>
                        {getArrayData(investorPersonaSources).map((source, index) => (
                          <div className='' key={index}>
                            <Button onClick={() => {
                              const urlStart = source.indexOf("http");
                              if (urlStart !== -1) {
                                window.open(source.substring(urlStart));
                              }
                            }}>
                              {(() => {
                                const urlStart = source.indexOf("http");
                                if (urlStart !== -1) {
                                  return source.substring(0, urlStart).trim();
                                }
                                return source;
                              })()}
                            </Button>
                          </div>
                        ))}
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
           {/* Product Manager Persona */}
          <div className="flex-1 relative">
            <div className='flex items-center justify-center flex-col'>
              <div className='flex items-center justify-between w-full mb-7'>
                <h1 className='text-xl font-bold pr-5'>How would Product Leaders judge this?</h1>
                <Image className='avatar-persona' alt="" src={avatar}/>
              </div>
              {productPersonaSummary && productPersonaSummary.length > 0 && (
                <div id="product-persona" className='persona opacity-[60%]'>
                  {productPersonaSummary.split(".").filter(line => line.trim() !== "").map((line, lineIndex) => (
                    <React.Fragment key={lineIndex}>
                      <li>{line.trim()}</li><br/>
                    </React.Fragment>
                  ))}
                </div>
              )}<br/>
              <div className='flex items-center justify-between w-full'>
                <span></span>
                <div className='flex items-center gap-2'>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className='dark'>More</Button>
                    </DialogTrigger>
                    <DialogContent className='dark'>
                      <DialogHeader>
                        <DialogTitle className='mb-3'>Additional Feedback</DialogTitle>
                        {getArrayData(productPersonaFeedback).map((feedback, index) => (
                          <div className='opacity-[65%]' key={index}>
                            <span className='mb-2 text-md'>{feedback.substring(feedback.indexOf(": ")+2)}</span>
                          </div>
                        ))}
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className='dark' variant='secondary'>Sources</Button>
                    </DialogTrigger>
                    <DialogContent className='dark'>
                      <DialogHeader>
                        <DialogTitle className='mb-3'>Relevant sources of information</DialogTitle>
                        {getArrayData(productPersonaSources).map((source, index) => (
                          <div className='' key={index}>
                            <Button onClick={() => {
                              const urlStart = source.indexOf("http");
                              if (urlStart !== -1) {
                                window.open(source.substring(urlStart));
                              }
                            }}>
                              {(() => {
                                const urlStart = source.indexOf("http");
                                if (urlStart !== -1) {
                                  return source.substring(0, urlStart).trim();
                                }
                                return source;
                              })()}
                            </Button>
                          </div>
                        ))}
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
           {/* Tech Lead Persona */}
          <div className="flex-1 relative">
            <div className='flex items-center justify-center flex-col'>
              <div className='flex items-center justify-between w-full mb-7'>
                <h1 className='font-bold text-xl pr-5'>What would Tech CEOs say about your idea?</h1>
                <Image className='avatar-persona' alt="" src={avatar}/>
              </div>
              {techPersonaSummary && techPersonaSummary.length > 0 && (
                <div id="tech-persona" className='persona opacity-[60%]'>
                  {techPersonaSummary.split(".").filter(line => line.trim() !== "").map((line, lineIndex) => (
                    <React.Fragment key={lineIndex}>
                      <li>{line.trim()}</li><br/>
                    </React.Fragment>
                  ))}
                </div>
              )}<br/>
              <div className='flex items-center justify-between w-full'>
                <span></span>
                <div className='flex items-center gap-2'>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className='dark'>More</Button>
                    </DialogTrigger>
                    <DialogContent className='dark'>
                      <DialogHeader>
                        <DialogTitle className='mb-3'>Additional Feedback</DialogTitle>
                        {getArrayData(techPersonaFeedback).map((feedback, index) => (
                          <div className='opacity-[65%]' key={index}>
                            <span className='mb-2 text-md'>{feedback.substring(feedback.indexOf(": ")+2)}</span>
                          </div>
                        ))}
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className='dark' variant='secondary'>Sources</Button>
                    </DialogTrigger>
                    <DialogContent className='dark'>
                      <DialogHeader>
                        <DialogTitle className='mb-3'>Relevant sources of information</DialogTitle>
                        {getArrayData(techPersonaSources).map((source, index) => (
                          <div className='' key={index}>
                            <Button onClick={() => {
                              const urlStart = source.indexOf("http");
                              if (urlStart !== -1) {
                                window.open(source.substring(urlStart));
                              }
                            }}>
                              {(() => {
                                const urlStart = source.indexOf("http");
                                if (urlStart !== -1) {
                                  return source.substring(0, urlStart).trim();
                                }
                                return source;
                              })()}
                            </Button>
                          </div>
                        ))}
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='flex items-center justify-center gap-2 mt-4'>
          <Button onClick={() => {router.push("/Home/Business-Canvas")}} className='dark'><span className='font-bold'>MVP Dashboard</span></Button>
          {/* <Sheet>
            <SheetTrigger asChild>
              <Button className='dark' variant='secondary'>Refine Idea</Button>
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
                  id="form1" 
                  className='mb-4'
                />

                <h3 className='mb-2'>Refine your problem statement</h3>
                <Textarea 
                  onChange={(e) => {
                    setProbSt(e.target.value);
                  }}
                  value={probSt || userData[0]?.Problem} 
                  id="form2" 
                  className='mb-4'
                />

                <h3 className='mb-2'>Refine your primary target audience</h3>
                <Textarea 
                  onChange={(e) => {
                    setTargAud(e.target.value);
                  }}
                  value={targaud || userData[0]?.Target_Audience} 
                  id="form3" 
                  className='mb-4'
                />

                <h3 className='mb-2'>Refine your USP (What makes your product unique)</h3>
                <Textarea 
                  onChange={(e) => {
                    setUSP(e.target.value);
                  }}
                  value={usp || userData[0]?.Unique} 
                  id="form4" 
                  className='mb-4'
                />

                <h3 className='mb-2'>Refine what features your product offers</h3>
                <Textarea 
                  onChange={(e) => {
                    setFeat(e.target.value);
                  }}
                  value={feat || userData[0]?.Features} 
                  id="form5" 
                  className='mb-4'
                />

                <Button onClick={handleIdeaRefine} className='w-full'>Submit</Button>
              </SheetHeader>
              <SheetClose id="sheet-close">Close</SheetClose>
            </SheetContent>
          </Sheet> */}
        </div>
      </div>
    </div>
    ):(
    <div id="loading-validation">
      <div>
        <h1>Setting up your validation dashboard</h1>
        <h3>This may take a few minutes...</h3>
      </div>
    </div>
    )}
    </>
  )
}

export default Validation