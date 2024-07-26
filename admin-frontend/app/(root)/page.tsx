"use client"

import { useEffect, useState } from "react";
import axios from "axios";
interface Task {
  "id": number,
  "amount": number,
  "title": string,
  "options": {
    id: number;
    image_url: string;
    task_id: number
  }[]
}

export default function Home() {
  const [task, setTask] = useState<Task | null>();
  const [loading, setLoading] = useState(true);
  const [fetchTaskAgain, setFetchTaskAgain] = useState(false);
  useEffect(() => {
    setLoading(true);

    const getNextTask = async () => {
      const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
      const token = localStorage.getItem("token")
      if(!token)
            return;
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: backendURL + 'v1/worker/nextTask',
        headers: {
          'Authorization': token
        },
      };

      axios.request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          setTask(response.data.task);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    getNextTask();
  }, [fetchTaskAgain])


  const handleOptionSubmit = async (event: any) => {
    const token = localStorage.getItem('token');
    setLoading(true);
    const selection: string = event.target.id;
    const taskId = task?.id.toString();
    const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
    let data = JSON.stringify({
      taskId,
      selection
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: backendURL + 'v1/worker/submission',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setTask(response.data.nextTaskToDisplay);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });

  }
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center w-full h-auto my-10">
        <p>Loading...</p>
      </div>)
  }
  if (!task) {

    return (
      <div className="flex flex-col justify-center items-center w-full h-auto my-10">
        <p>No task left, check back after some time</p></div>)
  }
  return (
    <div className="flex flex-col justify-center items-center w-full h-auto">
      <label className=" p-4 font-semibold text-2xl">Title - {task.title}</label>
      <div className=" flex flex-row flex-wrap h-auto min-h-screen w-full justify-center items-center">
        {task.options.map(eachOption => {

          return <div key={eachOption.id} onClick={handleOptionSubmit}> <img id={eachOption.id.toString()} style={{ maxWidth: '600px', marginTop: '10px', margin: '5px', objectFit: 'contain' }} alt='images uploaded by user' src={eachOption.image_url} /></div>
        })}
      </div>
    </div>
  );
}
