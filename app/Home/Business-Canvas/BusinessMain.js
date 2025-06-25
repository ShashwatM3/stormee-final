import React, { useEffect, useState } from 'react';
import "./BusinessCanvas.css";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import supabase from '@/app/config/supabaseClient';
import CompetitorCard from "./CompetitorCard";
import CurrentCompetitor from "./CurrentCompetitor";
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from '@/components/ui/textarea';

function BusinessMain() {
  const { data: session, status } = useSession();
  const [idea, setIdea] = useState("");
  const [targetaudience, setTargetAudience] = useState("");
  const [problemstatement, setProblemStatement] = useState("");
  const [uniqueness, setUniqueness] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [yearsFailureGraveyard, setyearsFailureGraveyard] = useState("");
  const [geolocationsGraveyard, setgeolocationsGraveyard] = useState("");
  const [sourcesGraveyard, setSourcesGraveyard] = useState("");
  const [fundingGraveyard, setFundingGraveyard] = useState("");
  const [namesGraveyard, setNamesGraveyard] = useState("");
  const [descriptionsGraveyard, setDescriptionsGraveyard] = useState("");
  const [failureReasonsGraveyard, setFailureReasonsGraveyard] = useState("");
  const [lessonsGraveyard, setLessonsGraveyard] = useState("");

  const router = useRouter();
  const [features, setFeatures] = useState("");

  const [currentCompetitors, setCurrentCompetitors] = useState(null);
  const [isLoadingCurrent, setIsLoadingCurrent] = useState(false);

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

  async function fetchDataGraveyard(userEmail) {
    const { data , error } = await supabase
      .from('Users')
      .select()
      .eq('email', userEmail);

    if (error) {
      console.error("Error fetching user data in fetchDataGraveyard:", error);
    }

    if(data.length>0) {
      // console.log("Fetched user data business main ", data);
      setIdea(data[0].Idea);
      setTargetAudience(data[0].Target_Audience);
      setProblemStatement(data[0].Problem);
      setUniqueness(data[0].Unique);
      setFeatures(data[0].Features);
    }

    const {data: data2, error: err2} = await supabase
    .from('graveyard')
    .select()
    .eq('email', userEmail);

    if (err2) {
      console.error("Error fetching graveyard data:", err2);
    }

    if(data2.length>0) {
      setIsLoading(false);
      // console.log("data2 object:", data2[0]);
      setyearsFailureGraveyard(data2[0].yearsOfFailure);
      setgeolocationsGraveyard(data2[0].geographic_location);
      setSourcesGraveyard(data2[0].sources);
      // setFundingGraveyard(data2[0].fundingGraveyard);
      setNamesGraveyard(data2[0].names);
      setDescriptionsGraveyard(data2[0].descriptions);
      setFailureReasonsGraveyard(data2[0].failure_reasons);
      setLessonsGraveyard(data2[0].lessons);
    } else {
      // console.log("starting prompt");
      const resp = await simpleGPTResp(`

      A user has entered the following startup idea:

      ${data[0].Idea}
      ${data[0].Target_Audience}
      ${data[0].Problem}
      ${data[0].Unique}
      ${data[0].Features}
      Location (Is not available or specified at): ${data[0].location}

      You are a **startup postmortem analyst,** who has experience of over 20+ years understanding the real world market and the startups, companies or projects that have impacted the user's industry in a negative as well as positive way.

      Your task is to identify 4 failed companies, startups, or projects** that attempted almost similar or same goals to the user's idea and **failed*. If and only the user has mentioned a specific geographic location of the startup, emphasize on finding failed companies/startups/projects in the proximity of the location. Focus on delivering **insightful, contextual, and actionable** information.

      Return your output in **JSON format** using the structure below:


      {
        "graveyard": [
          {
            "name": "Company/Project Name",
            "description": "Brief explanation of what they tried to build or solve.",
            "failure_reason": "Insightful but concise explanation of why they failed.",
            "lesson": "Actionable takeaway for the user to avoid the same mistake.",
            "year_of_failure": "e.g. 2019",
            "geographic_location": "e.g. United States",
            "funding_stage": "e.g. Seed, Series A, Bootstrapped",
            "sources": [
              {
                "title": "Title of the source article or postmortem",
                "url": "https://example.com"
              } // Produce 2-3 per company
            ],
            "website_link": "A link to a website that exists for this company/startup. If not, then an article would be fine"
          }
          // Repeat to 3 failed entities
        ]
      }

      Strict Rules:
      1. Strictly stick to the JSON Format Output
      2. Avoid using the em dash (—) in your generated content
      3. Ensure high relevance to the user's idea: Each failed company must have attempted a product or solution that is meaningfully similar in audience, market, or value proposition. Do not mention unknown startups/companies.
      4. Geographic location must be country-level or regionally specific
      5. Focus majority of the competitors on around the specific geographic region mentioned in user's idea (only if mentioned)
      6. Focus on majorly delivering competitors that are close to the current year.
      7. **Funding stage must be based on publicly known funding levels** or "Unknown" if the data is not accessible.
      8. **Never fabricate information**: If credible data is not available for a field, return "Unknown" for that field
      9. DO NOT REPEAT ANY SOURCES. THIS IS A STRICT RULE.
      `)

      const start = resp.indexOf('{');
      const end = resp.lastIndexOf('}');
      const jsonString = resp.substring(start, end + 1);      

      let parsed;
      try {
        parsed = JSON.parse(jsonString);
        setIsLoading(false);
        // console.log("market demand generated: ", parsed);
      } catch (e) {
        console.error("Failed to parse GPT reply for graveyard data:", e);
        console.error("Raw response:", resp);
        toast.error("GPT sent a bad response. Try again.");
        return;
      }

      let jsonresp = parsed['graveyard'];
      let names = [];
      let descriptions = [];
      let failure_reasons = [];
      let lessons = [];
      let yearsOfFailure = [];
      let geographic_location = [];
      let sources = [];
      let funding = []
      
      for (let index in jsonresp) {
        let item = jsonresp[index];
        names.push(`NAME${index}: ${item['name']}`)
        descriptions.push(`DESC${index}: ${item['description']}`)
        failure_reasons.push(`FAIL${index}: ${item['failure_reason']}`)
        lessons.push(`LESS${index}: ${item['lesson']}`)
        yearsOfFailure.push(`YEAR${index}: ${item['year_of_failure']}`)
        geographic_location.push(`GEO${index}: ${item['geographic_location']}`)
        sources.push(`SOURCES${index}: ${JSON.stringify(item['sources'])}`)
        funding.push(`FUND${index}: ${JSON.stringify(item['funding_stage'])}`)
      }

      const { error } = await supabase
      .from('graveyard')
      .insert({ 
        email: userEmail,
        names: JSON.stringify(names),
        descriptions: JSON.stringify(descriptions),
        failure_reasons: JSON.stringify(failure_reasons),
        lessons: JSON.stringify(lessons),
        yearsOfFailure: JSON.stringify(yearsOfFailure),
        geographic_location: JSON.stringify(geographic_location),
        sources: JSON.stringify(sources),
        funding: JSON.stringify(funding)
       })

      if (error) {
        console.error("Error inserting graveyard data:", error);
      }

      setNamesGraveyard(JSON.stringify(names));
      setDescriptionsGraveyard(JSON.stringify(descriptions));
      setFailureReasonsGraveyard(JSON.stringify(failure_reasons));
      setLessonsGraveyard(JSON.stringify(lessons));
      setyearsFailureGraveyard(JSON.stringify(yearsOfFailure));
      setgeolocationsGraveyard(JSON.stringify(geographic_location));
      setSourcesGraveyard(JSON.stringify(sources));
      setFundingGraveyard(JSON.stringify(funding));
    }
  }
  async function fetchDataCurrent(userEmail) {
    try {
      setIsLoadingCurrent(true);
      const { data, error } = await supabase
        .from('Users')
        .select()
        .eq('email', userEmail);

      if (error) throw error;
      if (!data || data.length === 0) throw new Error('No user data found');

      const { data: currentData, error: currentError } = await supabase
        .from('current_competitors')
        .select()
        .eq('email', userEmail);

      if (currentError) throw currentError;

      if (currentData && currentData.length > 0) {
        // console.log("Found existing current competitors:", currentData[0]);
        setCurrentCompetitors(currentData[0]);
      } else {
        // console.log("Generating current competitors analysis...");
        const resp = await simpleGPTResp(`
          A user has entered the following startup idea:

          ${data[0].Idea}
          ${data[0].Target_Audience}
          ${data[0].Problem}
          ${data[0].Unique}
          ${data[0].Features}
          Location (Is not available or specified at): ${data[0].location}

          You are a **competitive intelligence analyst** with 20+ years of experience identifying and analyzing companies and startups within emerging industries.

          Your task is to identify 2-4 **current competitors** (companies, startups, or projects) that are actively building or offering something similar to the user's idea. If and only the user has mentioned a specific geographic location of the startup, emphasize on finding failed companies/startups/projects in the proximity of the location. These entities should be *globally sourced* (if geographical location is not mentioned by user) and must have demonstrated validated market value — such as user growth, product adoption, or significant funding.

          Return your output in **JSON format** using the structure below:

          {
            "competitors": [
              {
                "name": "Company/Startup Name",
                "description": "2–3 sentence explanation of what the company does and how it relates to the user's idea.",
                "strengths": [
                  "Concise points that reflect what they're doing well"
                ],
                "weaknesses": [
                  "Known gaps or areas they're struggling with"
                ],
                "differentiator": "1–2 sentence summary of what uniquely sets this company apart from others in the space.",
                "key_insight": "A practical takeaway for the user to consider when building or refining their own product.",
                "geographic_location": "e.g. United States, Europe, India",
                "funding_stage": "e.g. Seed, Series A, Bootstrapped, Public, Unknown",
                "sources": [
                  {
                    "title": "Title of the source article or company profile",
                    "url": "https://example.com"
                  }
                ]
              }
            ]
          }

          Strict Rules:
          - Stick strictly to the JSON format.
          - Avoid using the em dash (—) in your generated content
          - Each company must have attempted a product or solution that is meaningfully similar in audience, market, or value proposition. Do not mention unknown startups/companies.
          - Focus majority of the competitors on around the specific geographic region mentioned in user's idea (only if mentioned)
          - Focus on majorly delivering competitors that are close to the current year.
          - Maintain **2–3 sentence** limits for description, 'differentiator', and 'key_insight'.
          - Ensure all data is credible. If a field is unverifiable, omit the entry.
          - Sources must be cited as shown — no fabrication allowed.
        `);

        const start = resp.indexOf('{');
        const end = resp.lastIndexOf('}');
        const jsonString = resp.substring(start, end + 1);      

        let parsed;
        try {
          parsed = JSON.parse(jsonString);
          // console.log("Current competitors generated:", parsed);
          
          // Store in Supabase
          const { error: insertError } = await supabase
            .from('current_competitors')
            .insert({ 
              email: userEmail,
              competitors: parsed.competitors
            });

          if (insertError) throw insertError;
          
          setCurrentCompetitors({ competitors: parsed.competitors });
        } catch (e) {
          console.error("Failed to parse:", e);
          throw new Error("Failed to generate current competitors analysis");
        }
      }
    } catch (error) {
      console.error("Error in fetchDataCurrent:", error);
      throw error;
    } finally {
      setIsLoadingCurrent(false);
    }
  }

  async function setNewTargetAudience() {
    const newTarget = document.getElementById("newTargetAudience");
    const div = document.getElementById("ta-div");
    if(newTarget && div) {
      if(newTarget.value.length>2) {
        div.innerHTML="Loading...."
        const { error } = await supabase
          .from('Users')
          .update({ Target_Audience: newTarget.value })
          .eq('email', session.user.email)

        if (error) {
          console.error("Error updating target audience:", error);
        }

        const { error: deleteError1 } = await supabase
          .from('competitive_edge_metric')
          .delete()
          .eq('email', session.user.email)

        if (deleteError1) {
          console.error("Error deleting competitive edge data:", deleteError1);
        }

        const { error: deleteError2 } = await supabase
          .from('current_competitors')
          .delete()
          .eq('email', session.user.email)

        if (deleteError2) {
          console.error("Error deleting current competitors data:", deleteError2);
        }

        const { error: deleteError3 } = await supabase
          .from('graveyard')
          .delete()
          .eq('email', session.user.email)

        if (deleteError3) {
          console.error("Error deleting graveyard data:", deleteError3);
        }

        const { error: deleteError4 } = await supabase
          .from('market_demand')
          .delete()
          .eq('email', session.user.email)

        if (deleteError4) {
          console.error("Error deleting market demand data:", deleteError4);
        }

        const { error: deleteError5 } = await supabase
          .from('personas')
          .delete()
          .eq('email', session.user.email)

        if (deleteError5) {
          console.error("Error deleting personas data:", deleteError5);
        }

        const { error: deleteError6 } = await supabase
          .from('target_audience')
          .delete()
          .eq('email', session.user.email)

        if (deleteError6) {
          console.error("Error deleting target audience data:", deleteError6);
        }

        window.location.reload();
      }
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      try {
        fetchDataGraveyard(session.user.email);
        fetchDataCurrent(session.user.email);
      } catch (error) {
        console.error("Error in useEffect data fetching:", error);
      }
    } else {
      // console.log("User is not authenticated");
      router.push("/Home");
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return <div>Loading session...</div>;
  }

  // if (isLoading || isLoadingCurrent) {
  //   return (<div className='flex items-center justify-center w-[100vw] h-[100vh]'>
  //     <span id="waveringElement">Loading your dashboard data...</span>
  //   </div>);
  // }

  return (
    <div className='business-canvas'>
      <div>
        <br/>
        <h1 className='scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance mb-10'>The Competitive Landscape</h1>
        <h1 className='scroll-m-20 text-2xl font-semibold tracking-tight mb-7 text-center'><span className='px-6 py-3 bg-neutral-900 rounded-md'>Your Current Idea</span></h1>
        <div className='flex items-start justify-center gap-4 flex-wrap px-10'>
          {(idea && targetaudience && problemstatement && uniqueness && features) ? (
            <>
              <div className='idea-component'>
                <h2>Your Target Audience</h2>
                <h3>{targetaudience}</h3>
                <div className='flex items-center justify-between'>
                  <span></span>
                  {/* <Dialog>
                    <DialogTrigger asChild>
                      <Button className='dark'>Edit</Button>
                    </DialogTrigger>
                    <DialogContent className='dark'>
                      <DialogHeader>
                        <DialogTitle>Edit Target Audience Field</DialogTitle>
                        <DialogDescription>
                          Once you edit your target audience, your competitive landscape & validation dashboard will be <b>revamped</b>. <b>This action cannot be undone</b>
                        </DialogDescription>
                        <div id="ta-div">
                          <span className='mt-3'>Current Target Audience: </span>
                          <Textarea value={targetaudience} readOnly/><br/>
                          <span className='mt-3 font-bold'>New Target Audience: </span>
                          <Textarea id="newTargetAudience"/>
                          <Button onClick={() => {setNewTargetAudience}}>Set Target Audience</Button>
                        </div>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog> */}
                </div>
              </div>
              <div className='idea-component'>
                <h2>Problem being addressed</h2>
                <h3>{problemstatement}</h3>
                <div className='flex items-center justify-between'>
                  <span></span>
                  {/* <Button className='dark'>Edit</Button> */}
                </div>
              </div>
              <div className='idea-component'>
                <h2>What makes your idea unique</h2>
                <h3>{uniqueness}</h3>
                <div className='flex items-center justify-between'>
                  <span></span>
                  {/* <Button className='dark'>Edit</Button> */}
                </div>
              </div>
              {/* <div className='idea-component'>
                <h2>Current Features</h2>
                <h3>{features}</h3>
                <div className='flex items-center justify-between'>
                  <span></span>
                  <Button className='dark'>Edit</Button>
                </div>
              </div> */}
            </>
          ) : (
            <div>Loading...</div>
          )}
        </div>
        <br/><br/>
        <div className='flex' id="competitors-past">
          <div className='flex-1 competitor-div'>
            {(yearsFailureGraveyard && geolocationsGraveyard && sourcesGraveyard && namesGraveyard && descriptionsGraveyard && failureReasonsGraveyard && lessonsGraveyard) ? (
              <div>
                <h1 className='scroll-m-20 text-3xl font-semibold tracking-tight mb-11'><b><span className='text-red-400 p-2 bg-neutral-800 rounded-md px-5 pr-4'>Past Competitors</span></b> &#8212; who have tried to achieve your goal and <b className='border-b'>failed</b></h1>
                <div className=' flex items-start justify-center gap-4 flex-wrap'>
                  {JSON.parse(namesGraveyard).map((company, index) => {
                    // console.log("---------------------")
                    // console.log(company.substring(company.indexOf(": ")+1), index)
                    return (
                    <CompetitorCard
                      key={index}
                      name={company.substring(company.indexOf(": ")+1)}
                      description={JSON.parse(descriptionsGraveyard)[index]}
                      failureReason={JSON.parse(failureReasonsGraveyard)[index]}
                      lesson={JSON.parse(lessonsGraveyard)[index]}
                      year={JSON.parse(yearsFailureGraveyard)[index]}
                      location={JSON.parse(geolocationsGraveyard)[index]}
                      // fundingStage={JSON.parse(fundingGraveyard)[index]}
                      source={JSON.parse(sourcesGraveyard)[index]}
                    />
                    )
                  })}
                  <Card className="bg-neutral-900 min-h-[60vh] border-neutral-800 text-white p-6 rounded-2xl shadow-lg w-full mb-3 text-left">
                    <h2 className="text-2xl font-bold mb-2 font-light italic">{"Sources of Information"}</h2>
                    <p className="text-gray-300 text-sm mb-2 italic">We provide you with the sources of information that support our competitive landscape report</p>

                    {/* <div className="mb-1 flex items-center gap-2"> */}
                      {/* <Button> */}
                        {/* {JSON.parse(sourcesGraveyard)[0]} */}
                        {JSON.parse(sourcesGraveyard).map((sc, index) => {
                          let sourcesArr = [];
                          try {
                            sourcesArr = JSON.parse(sc.substring(sc.indexOf(": ")+2));
                          } catch (e) {
                            console.error("Error parsing sources data:", e);
                            sourcesArr = [];
                          }
                          return (
                            <div key={index} className="mb-2">
                              {Array.isArray(sourcesArr) && sourcesArr.map((source, idx) => (
                                <div key={idx} className="mb-1">
                                  <Button onClick={() => {window.open(source.url)}} className='dark text-sm bg-neutral-800 mb-1 cursor-pointer' variant='outline'>{source.title}</Button>
                                </div>
                              ))}
                            </div>
                          );
                        })}
                      {/* </Button> */}
                    {/* </div> */}
                  </Card>
                </div>
              </div>
            ) : (
              <div>Loading...</div>
            )}
            <br/><br/>
            {currentCompetitors ? (
            <div id="currentCompetitorsList">
              <h1 className='scroll-m-20 text-3xl font-semibold tracking-tight mb-11 leading-[140%]'>
                <b><span className='text-green-400 p-2 bg-neutral-800 rounded-md px-5 pr-4'>Current Competitors</span></b> &#8212; in your market space, playing within your ballgame
              </h1>
              <div className='flex items-start justify-center gap-4 flex-wrap'>
                {currentCompetitors.competitors.map((competitor, index) => {
                  // console.log(competitor)
                  return (
                    <CurrentCompetitor
                    key={index}
                    description={competitor.description}
                    differentiator={competitor.differentiator}
                    funding_stage={competitor.funding_stage}
                    geographic_location={competitor.geographic_location}
                    key_insight={competitor.key_insight}
                    name={competitor.name}
                    sources={competitor.sources}
                    strengths={competitor.strengths}
                    weaknesses={competitor.weaknesses}
                    />
                  )
                })}
              </div>
            </div>
          ) : (
            <div>Loading current competitors...</div>
          )}
          </div>
        </div>
      </div>
      {/* <div className='flex' id="competitors-current">
        <div className='flex-1 competitor-div'>
        </div>
      </div> */}
      <div className='fixed-sections'>
        <div id="toshowbutton" className='p-0'>
          <Button className='dark cursor-pointer' variant='outline' onClick={() => {
            const e1 = document.getElementById("hiddensections");
            const e2 = document.getElementById("toshowbutton");
            if(e1 && e2) {
              e1.style.display="block";
              e2.style.display="none";
            }
          }}>Show Page Contents</Button><br/>
          <Button 
            onClick={() => {
              const el = document.getElementById("business-canvas-intro");
              if(el) {el.style.display="flex"};
              const el2 = document.getElementById("businesscanvas");
              if(el2) {el2.style.display="none"};
            }} 
            className='dark mt-2 w-full border cursor-pointer' 
            variant='secondary'
          >
            Go back
          </Button>
        </div>
        <div id="hiddensections">
          <h1>Sections in this page</h1>
          <h3 onClick={() => {window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}}>Your Current Idea</h3>
          <h3 onClick={() => {
            const element = document.getElementById("competitors-past");
            if (element) {
              element.scrollIntoView({
                behavior: 'smooth'
              });
            }
          }}>Past Competitors</h3>
          <h3 onClick={() => {
            const element = document.getElementById("currentCompetitorsList");
            if (element) {
              element.scrollIntoView({
                behavior: 'smooth'
              });
            }
          }}>Current Competitors</h3>
          <Button onClick={() => {
            const e1 = document.getElementById("hiddensections");
            const e2 = document.getElementById("toshowbutton");
            if(e1 && e2) {
              e1.style.display="none";
              e2.style.display="block";
            }
          }} className='dark w-full mt-2 cursor-pointer' variant='secondary'>Hide</Button>
        </div>
      </div>
    </div>
  )
}

export default BusinessMain