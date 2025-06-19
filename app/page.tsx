"use client"

import Image from "next/image";
import Banner from "@/components/Banner"
import Nav from "@/components/Nav";
import { useSession } from "next-auth/react";
import AIChat from "@/components/AIChat";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import "./styles.css";
import HIW from "@/components/HIW";
import TLDR from "@/components/TLDR";
import NPD from "@/components/NPD";
import GotAnidea from "@/components/GotAnidea"
import FeatureMap from "@/components/FeatureMap"
import Unique from "@/components/Unique";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/Home");
    }
    // console.log(session);
    setTimeout(() => {
      const m = document.getElementById("main");
      if(m) {
        m.style.display="block";
      }
      const l = document.getElementById("loadingsc");
      if(l) {
        l.style.display="none";
      }
    }, 800);
  }, [status]);
  return (
    <>
    <div id="loadingsc">
      <div className="loader1"></div>
    </div>
    <div id="main">
      <Nav/>
      <Banner/>
      <TLDR/>
      <HIW/>
      <NPD/><br/><br/><br/>
      <Unique/><br/>
      {/* <FeatureMap/><br/><br/><br/> */}
      <GotAnidea/>
      <br/><br/><br/>
      <div className="w-full bg-black text-white text-center p-4 cursor-pointer">
        Built by <a onClick={() => {window.open("https://shashwatm.vercel.app/", "_self")}}>Shashwat M</a>
      </div>
    </div>
    </>
  );
}
