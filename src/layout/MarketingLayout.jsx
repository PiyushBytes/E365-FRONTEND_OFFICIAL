import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./NavBar";
import BrandLogo from "../components/BrandLogo";
import ChatWidget from "../components/ChatWidget";
import VideoBackground from "../components/common/VideoBackground";

const MarketingLayout = () => {
  return (
    <>
      <BrandLogo />
      <Navbar />
      <VideoBackground />
      <main className="relative z-10">
        <Outlet />
      </main>
      <ChatWidget />
    </>
  );
};

export default MarketingLayout;
