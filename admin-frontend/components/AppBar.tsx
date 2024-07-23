"use client"
import React, { useEffect, useMemo, useState } from 'react';
// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';

import { Exo } from "next/font/google";
import Wallet from './Wallet';
import { useRouter } from 'next/navigation';
import axios from 'axios';
const exo = Exo({
  weight: '400',
  subsets: ['latin'],
})

function AppBar() {
  const router = useRouter();
  const [balance,setBalance] = useState(0);
  const [payoutPending,setPayoutPending] = useState(false);

  const handlePayout = async () =>{
    setPayoutPending(true);
    if(balance === 0)
        return;
    const token = localStorage.getItem("token");
    console.log(token);
    
    try{
      const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
      const res = await axios.post(`${backendURL}v1/worker/payout`,null,{
      headers:{
        Authorization:token
      }
    })
    console.log(res);
    
    setPayoutPending(false);
  }catch(error){
    console.log(error);
    
  }
  }
  
  return (
 
          <header className="border-solid border-b-[1px] py-4 px-8 flex flex-row justify-between items-center text-2xl">
            <section onClick={()=>router.push("/")}  className=' cursor-pointer'>
              <span className={exo.className}>Decentrify</span>
              </section>
              <section className=' flex gap-4'>
                {payoutPending?<p className='p-2 px-4'>Processing Payment...</p>:<button onClick={handlePayout} className=' text-sm font-semibold bg-blue-600 p-2 px-4 rounded-md'>Pay Out ({balance/100000000}) SOL</button>}
                <Wallet setBalance={setBalance}/>
              </section>
          
          </header>
       
  )
}

export default AppBar
