"use client"
import UploadImages from "./UploadImages"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


function TaskCreate() {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [pending,setPending] = useState<boolean>(false);
    const [title, setTitle] = useState("");
    const [token,setToken] = useState("");
    const [txSignature, setTxSignature] = useState("");
    const router = useRouter();

    useEffect(()=>{
        const tokenFromStorage = localStorage.getItem("token");
        if(tokenFromStorage)
            setToken(tokenFromStorage);
    },[])
    const onSubmit = async () => {

        setPending(true);
        if (!token)
            return;

        const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
        console.log(backendURL);


        const promise = selectedFiles.map(async (imageToUpload) => {
            try {
                const response = await fetch(
                    `${ backendURL }v1/user/generatepresignedurl`,
                    {
                        method: "GET", // or 'POST' depending on your API
                        headers: {
                            Authorization:
                                token,
                        },
                    }
                );

                if (!response.ok) {

                    console.log(response);
                    
                    throw new Error("Network response was not ok");

                }


                const data = await response.json();
                const uploadToS3 = await fetch(data.preSignedUrl, {
                    method: "PUT",
                    body: imageToUpload,
                    // Add headers if required by your S3 configuration (e.g., Content-Type)
                    // headers: { 'Content-Type': 'jpeg' },
                });
                if (!uploadToS3.ok) {
                    console.log("====================================");
                    console.log(uploadToS3.statusText);
                    console.log("====================================");
                    throw new Error("there was a problem in uploading images to s3");
                }

                console.log("here 2");
                

                const option = {
                    imageUrl: "https://d27y5v7hn8wlh.cloudfront.net/" + data.key
                }


                return option;
            } catch (error) {
                console.error("Fetch error:", error);
                throw error;
            }
        });

        const options = await Promise.all(promise);

        const task = {
            options,
            title: title,
            signature: txSignature
        };
        try{
            const taskJSON = JSON.stringify(task);
            console.log('====================================');
            console.log("task", taskJSON);
            console.log('====================================');
    
            const taskCreateResponse = await fetch(`${ backendURL }v1/user/task`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        token,
                },
                body: taskJSON
            });
            if (!taskCreateResponse.ok) {
                // throw new Error("task not created");
                console.log(taskCreateResponse);
                
            }

            const dataTask = await taskCreateResponse.json();
            console.log('====================================');
            console.log(dataTask);
            console.log('====================================');
            setPending(false);
            router.push('/task/'+dataTask.id);

        }catch(error){
            console.log('====================================');
            console.log(error);
            console.log('====================================');
        }
    }

 

    if(!token)
    {
        return <>Please Login!</>
    }
    return (
        <div className=" w-full flex flex-col justify-center items-center">
            <div className="w-full  flex flex-col justify-center items-center">
                <section className="flex flex-col w-1/2">
                    <input onChange={(e) => setTitle(e.target.value)} name="title" value={title} className="h-8 p-2 w-full outline-none bg-black border-b" placeholder="Enter the title of the task" required />
                </section>
                <section className="flex flex-col w-1/2">
                    <UploadImages txSignature={txSignature} setTxSignature={setTxSignature}  pending={pending} onSubmit={onSubmit} selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} />
                </section>
            </div>
        </div>
    )
}

export default TaskCreate
