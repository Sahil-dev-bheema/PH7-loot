import React from "react";
import LotteryCards from "../components/LotteryCards";
import HeroBanner from "../components/HeroBanner";
import HowToplay from "../components/HowToPlay";
import HowToPlaySteps from "../components/HowToPlaySteps";
import PowerballResult from "../components/PowerballResult";
import PrizeTiers from "../components/PrizeTiers";

const About = () => {
  return (
    <div className="bg-white">
     
      <HeroBanner />
  <HowToplay />
   <HowToPlaySteps />
  <PowerballResult />
   <PrizeTiers />

     
    </div>
  );
};

export default About;
