"use client"
import React, { useEffect, useState } from 'react';

type Props = {
  params: {
    taskID: string;
  };
};

type TaskOption = {
  // Define the structure of the option object here
  // For example, if the option object contains a name and value, you can define it as:
  name: string;
  value: string;
};

type TaskData = {
  [key: string]: {
    count: number;
    option: {
      [key: string]: TaskOption;
    };
  };
};

const Page: React.FC<Props> = ({ params }) => {
  const [data, setData] = useState<TaskData | null>(null);
  // const [token, setToken] = useState("");
  const token = localStorage.getItem("token") as string;


  
  useEffect(() => {
    // setToken(tokenValue);
    const fetchData = async () => {
      try{
        const getTaskResponse = await fetch(`http://localhost:3000/v1/user/task?taskid=${params.taskID}`, {
          method: 'GET',
          headers: {
            Authorization:
              token,
          },
        });  
        const resultData = await getTaskResponse.json();
        setData(resultData.result);
      }
      catch(error)
      {
        console.log(error);
        
      }      
     
    };

    fetchData();
  }, [params.taskID]);

  if (!data) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return <>Please login first</>
  }

  return (
    <div className='h-auto min-h-screen flex flex-row justify-center items-center flex-wrap' >
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className='flex flex-col justify-center items-center'>
          <p>Count: {value.count}</p>
          <div >
            {value.option ? (
              <ul >
                {Object.entries(value.option).map(([optKey, optValue]) => (
                  <li key={optKey}>
                    <img style={{ maxWidth: '400px', marginTop: '10px', margin: '5px', objectFit: 'contain' }} alt='images uploaded by user' src={optValue.toString()} />

                  </li>
                ))}
              </ul>
            ) : (
              <p>No options available</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Page;
