"use client"

import React, { Component, FC, useEffect, useState } from "react";
import { useAuth } from "../../Context/UserAuthContext";
import { fetchSingleAssistantData } from "@/services/api";
import { SlArrowRightCircle,SlBubble,SlEnvolopeLetter } from "react-icons/sl";
import Link from "next/link";
import "./assistant.css";
import { AssistantData } from "@/utils/types";
import { AssistData_Default } from "@/utils/initialValues";

const Assistant_Dashboard: FC = () => {
  const { currentuser } = useAuth();
  const [userData, setUserData] = useState<AssistantData>(AssistData_Default); 

  const fetchUserData = async () => {
    if( currentuser){ 
      try {
        const response = await fetchSingleAssistantData({
          userId: currentuser.uid,
        });
        if (!response) return;
        setUserData(response);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  useEffect(() => {
    if (currentuser?.uid) {
      fetchUserData();
    }
  }, [currentuser?.uid]);

  return (
    <div className="dashboard_container">
      <div className="board_welcome">
        <img src={userData.profileUrl} alt="profile_picture" 
          style={{
            padding: 0,
            borderRadius: 100,
            border: "2px solid black",
            height: 150,
            width: 150,
          }}
        />
        <div>
          <h3>Hi {userData.fullname}!</h3>
          <h5>You have 12 notifications</h5>
          <h6 style={{ position: "absolute", right: 30, top: 30, opacity: 0.3 }}>
            {currentuser?.uid}
          </h6>
        </div>
      </div>

      <div className="home-services">
        {/* TITLE */}
        <div className="services-title">
          <h6>Your Services</h6>
          <h2>Dashboard</h2>
        </div>
        {/* ROW 1 */}
        <div className="services-row">
          {/* Box 1 */}
          <Dashboard_Item path="/assistant/requests" icon={ <SlEnvolopeLetter />} desc={"Assess your risk for cardiovascular diseases"} title={"Job Requests"} />
          {/* Box 2 */}
          <Dashboard_Item path="/assistant/sessions" icon={ <SlBubble />} desc={"Assess your risk for cardiovascular diseases"} title={"Active Sessions"} />
          {/* Box 3 */}
          <Dashboard_Item path="/assistant/sessions" icon={ <SlBubble />} desc={"Assess your risk for cardiovascular diseases"} title={"Cardiovascular Risk"} />
        </div>
      </div>
    </div>
  );
};

export default Assistant_Dashboard;

const IconMenu_Item: FC<{ iconComponent: () => React.ReactNode; title: string }> = ({ iconComponent, title }) => {
  return (
    <div style={{ flexDirection: "column", alignItems: "center", textAlign: "center" }}>
      {iconComponent()}
      <h3>{title}</h3>
    </div>
  );
};

const Dashboard_Item: FC<{ title: string; notification?: number; desc: string; icon: any; path: string }> = ({ title, notification, desc,icon,path }) => {
  return (
    <div className="service-box">
      <div className="service-box-title">
        {icon}
        <h4>{title}</h4>
      </div>
      <h6>{desc}</h6>
        <Link
          href={path}
        >
          <div className="service-box-btn">Open</div>
        </Link>
    </div>
  );
};


{/*  <div className="board_icon_menu"> <IconMenu_Item title={"Job Requests"} iconComponent={() => <SlArrowRightCircle size={30} />} />
<IconMenu_Item title={"Active Sessions"} iconComponent={() => <SlArrowRightCircle size={30} />} />
<IconMenu_Item title={"Job Requests"} iconComponent={() => <SlArrowRightCircle size={30} />} />
<IconMenu_Item title={"Job Requests"} iconComponent={() => <SlArrowRightCircle size={30} />} />
</div> */}
