
"use client"
import { Dispatch, SetStateAction, useState } from 'react';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

type propsTypes = {
    selectedFiles: File[],
    setSelectedFiles: Dispatch<SetStateAction<File[]>>,
    onSubmit:()=>void,
    pending:boolean,
    txSignature:string,
    setTxSignature: Dispatch<SetStateAction<string>>
}

function UploadImages({txSignature,setTxSignature,pending,selectedFiles,setSelectedFiles,onSubmit}:propsTypes) {
    // Declare state to store selected images as an array of Image objects
    
    const { publicKey, sendTransaction } = useWallet();
    const {connection} = useConnection();

    const makePayment = async ()=>{
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey:publicKey!,
                toPubkey:new PublicKey(process.env.NEXT_PUBLIC_PARENT_WALLET as string),
                lamports:1000_000_000
            })
        )
        const {
            context: { slot: minContextSlot },
            value: { blockhash, lastValidBlockHeight }
        } = await connection.getLatestBlockhashAndContext();

        const signature = await sendTransaction(transaction, connection, { minContextSlot });

        try{
        await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature });
        }
        catch(error)
        {
            console.log(error);
        }

        console.log(signature);
        
        setTxSignature(signature);

    }
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (files.length + selectedFiles.length > 8) {
            alert('You can only select up to 8 files.');
            return;
        }
        setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    };

    return (
        <div className='w-full'>
            <div className="flex flex-row justify-between">
                <input
                    onChange={handleFileChange}
                    name="image"
                    className="p-2"
                    type="file"
                    required
                    multiple // Allow multiple file selection
                />
                {(!pending&&txSignature)?<button disabled={pending}  onClick={onSubmit} className="text-2xl font-bold p-2 text-blue-500">
                    Submit
                </button>:<button onClick={makePayment} className="text-2xl font-bold p-2 text-blue-500">{pending?"Submitting":"Pay"}</button>}
            </div>
            <div className=' w-full h-[40%] flex flex-wrap'>
                {selectedFiles.map((file, index) => (
                    <img key={index} style={{ maxWidth: '180px', marginTop: '10px', margin: '5px', objectFit: 'contain' }} alt='images uploaded by user' src={URL.createObjectURL(file)} />
                ))}
            </div>
        </div>
    );
}

export default UploadImages;
