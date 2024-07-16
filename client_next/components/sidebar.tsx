"use client";

import React, { ReactNode, Ref, useRef, useState } from 'react';
import { SlHome, SlMenu } from "react-icons/sl";
import { SlLogout } from "react-icons/sl";
import { MdAbc } from 'react-icons/md';
import { SlArrowRight,SlArrowLeft,SlEnvolopeLetter,SlBubble } from "react-icons/sl";
import { signOut } from 'firebase/auth';
import "../app/assistant/assistant.css"
import { auth } from '@/services/firebase';
import { useSidebar } from '@/Context/SidebarContext';
import Link from "next/link";

const SideBar = ({setPassActive}:{setPassActive:(active: boolean) => void}) => {
  const navRef = useRef<HTMLElement | null>(null);

  const [ active, setActive ] = useState(false);

  const handleLogOut = () => {
    signOut(auth)
    window.location.pathname = "/"
  }


  return (
        <LoggedOn_Navbar 
        navRef={navRef}
        active={active}
        setActive={setActive}
        handleLogOut={handleLogOut}
        setPassActive={setPassActive}
        />
  );
};

export default SideBar;


const LoggedOn_Navbar = ({
  navRef,
  active,
  setActive,
  handleLogOut,
  setPassActive
}:{
  navRef: Ref<any>;
  active: boolean;
  setActive: (active: boolean) => void;
  handleLogOut:() => void;
  setPassActive: (active: boolean) => void

}) => {
  return(
    <>
    {active ? (
    <nav ref={navRef} className='sidebar active'>
      <div style={{display:"flex",flexDirection:"column",width:"100%",justifyContent:"space-between",height:"100%",alignItems:"center"}}>
        <span style={{width:"100%",flexDirection:"column",display:"flex",justifyContent:"center"}}>
          <a style={{textDecoration:"none",fontWeight:500,color:"white",fontSize:20,textAlign:"center",opacity:0.6}} href="/">Pocket Protect</a>
          <div onClick={() => {setActive(!active),setPassActive(!active)}} style={{zIndex:100,backgroundColor:"black",borderRadius:5,padding:9,flexDirection:"column",display:"flex",width:"100%",justifyContent:"center",alignItems:"center",cursor:"pointer",marginTop:10}}>
            <SlArrowLeft size={13} color='white' />
          </div>
        </span>

        <div style={{flexDirection:"column",width:"100%",display:"flex"}}>
          <NavItem 
            link={`/assistant`}
            title='Home'
            icon={() => <SlHome  size={22} color='white' opacity={0.7} />  }
          />
          <NavItem 
            link={`/assistant/requests`}
            title='Job Requests'
            icon={() => <SlEnvolopeLetter  size={22} color='white' opacity={0.7} />  }
          />
          <NavItem 
            title='Active Sessions'
            icon={() => <SlBubble size={22} color='white' opacity={0.7}  />  }
            link={`/assistant/sessions`}
          /> 
        </div>

        <div style={{flexDirection:"column",display:"flex",width:"100%"}}>
          <div className="nav-more">
            <SlMenu />
            <a href="/auth/login">Settings</a>
          </div>
          <div className="nav-more" style={{background:"black",width:"100%",marginTop:10}}>
            <SlLogout color='white' />
            <a href="/auth/login" style={{color:"white",fontWeight:400}} >Logoff</a>
          </div>
        </div>
      </div>
    </nav>
    ) : (
      <nav ref={navRef} className='sidebar'>
      <div style={{display:"flex",flexDirection:"column",width:"100%",justifyContent:"space-between",height:"100%"}}>
        <span style={{width:"100%",padding:0,fontSize:20,fontWeight:500,color:"black",textDecoration:"none",flexDirection:"column",display:"flex"}}>
          <a style={{textDecoration:"none",fontWeight:500,color:"white",opacity:0.6}} href="/">PP</a>
          <div onClick={() => {setActive(!active),setPassActive(!active)}} style={{zIndex:100,backgroundColor:"black",borderRadius:5,padding:9,flexDirection:"column",display:"flex",width:"100%",justifyContent:"center",alignItems:"center",cursor:"pointer",marginTop:10}}>
            <SlArrowRight size={13} color='white' />
          </div>
        </span>

        <div style={{flexDirection:"column",width:"100%",display:"flex",alignItems:"center"}}>
          <Link href={`/assistant`} className='navIcon'>
            <SlHome size={22} color='white' />
          </Link>
          <Link href={`/assistant/requests`} className='navIcon'>
            <SlEnvolopeLetter size={22} color='white' />
          </Link>
          <Link href={`/assistant/sessions`} className='navIcon' >
            <SlBubble size={22} color='white' />
          </Link>
        </div>
        

        <div style={{flexDirection:"column",display:"flex"}}>
          <div className="nav-more">
            <SlMenu />
          </div>
          <div onClick={handleLogOut} className='logOffBtn'>
            <SlLogout style={{marginRight:5}} size={20} color='white' />            
          </div>
        </div>
      </div>
    </nav>
    )
  }
  </>
  )
}

const NavItem = ({
  icon,
  title,
  link
}:
{
  icon:() => ReactNode;
  title: string;
  link: string;
}) => {
  return(
  <Link href={link} className='navItem'>
    {icon()}
    <h5 style={{marginLeft:15,fontSize:17,color:"white",opacity:0.6,fontWeight:"400"}}>{title}</h5>
  </Link>
  )
}