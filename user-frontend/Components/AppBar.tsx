"use client"
import React, { useMemo } from 'react';
// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';

import { Exo } from "next/font/google";
import Wallet from './Wallet';
import { useRouter } from 'next/navigation';
const exo = Exo({
  weight: '400',
  subsets: ['latin'],
})

function AppBar() {
  const router = useRouter();
  
  return (
 
          <header className="border-solid border-b-[1px] py-4 px-8 flex flex-row justify-between items-center text-2xl">
            <section onClick={()=>router.push("/")}  className=' cursor-pointer'>
              <span className={exo.className}>Decentrify</span>
              </section>
           <Wallet/>
          </header>
       
  )
}

export default AppBar
