"use client"


import "../../css/globals.css";
import SideBar from "../../components/sidebar";
import { SidebarProvider } from "@/Context/SidebarContext";
import { useSidebar } from "@/Context/SidebarContext";
import { useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}
>) {

  const [ active, setActive] = useState(false)

  return (
    <SidebarProvider>
      <div style={{flexDirection:"row",display:"flex",width:"100%",height:"100%"}}>
          <SideBar setPassActive={setActive} />
          <main className={!active ? "assistant-layout-main" : "assistant-layout-main-active"} >
              {children}
          </main>
      </div>
      </SidebarProvider>
  );
}
