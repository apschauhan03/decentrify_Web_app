"use client"

import { useEffect } from "react";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import axios from 'axios';
import { useRouter } from "next/navigation";

type propsType = {
  setBalance: React.Dispatch<React.SetStateAction<number>>
}

function Wallet({setBalance}:propsType) {
  const { publicKey, signMessage } = useWallet();
  const router = useRouter();

  const signAndSend = async () => {
    if (!publicKey||!signMessage)
      return;
    const message = new TextEncoder().encode("Sign in to Decentrify as a worker.");
    const signature = await signMessage?.(message);
    const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${backendURL}v1/worker/signin`,
      data : {
        signature,
        publicKey
      }
    };
    
    axios.request(config)
    .then((response) => {
      localStorage.setItem('token',response.data.token);
      console.log(response.data);
      
      setBalance(response.data.balance);
      router.refresh();
    })
    .catch((error) => {
      console.log(error);
    });


  }
  useEffect(() => {
    signAndSend();
  }, [publicKey]);
  return (
    <div>
      <section>
        {publicKey ? <WalletDisconnectButton /> : <WalletMultiButton />}
      </section>
    </div>
  )
}

export default Wallet
