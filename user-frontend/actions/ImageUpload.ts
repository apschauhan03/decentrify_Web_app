// "use server";

// import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation";

// export const Upload = async (formData: FormData) => {
//   console.log("====================================");
//   console.log(formData);
//   console.log("====================================");
//   const imagesToUpload = formData.getAll("image");


//  const promise =  imagesToUpload.map(async (imageToUpload) => {
//     try {
//       const response = await fetch(
//         "http://localhost:3000/v1/user/generatepresignedurl",
//         {
//           method: "GET", // or 'POST' depending on your API
//           headers: {
//             Authorization:
//               token,
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }

      
//       const data = await response.json();
//       const uploadToS3 = await fetch(data.preSignedUrl, {
//         method: "PUT",
//         body: imageToUpload,
//         // Add headers if required by your S3 configuration (e.g., Content-Type)
//         // headers: { 'Content-Type': 'jpeg' },
//       });
//       if (!uploadToS3.ok) {
//         console.log("====================================");
//         console.log(uploadToS3.statusText);
//         console.log("====================================");
//         throw new Error("there was a problem in uploading images to s3");
//       }

//       const option = {
//         imageUrl:"https://d27y5v7hn8wlh.cloudfront.net/"+data.key
//       }

//       return option;
      
//     } catch (error) {
//       console.error("Fetch error:", error);
//       throw error;
//     }
//   });

//   const options = await Promise.all(promise);
//   console.log("options",options);



//   const task = {
//     options,
//     title:formData.get('title'),
//     signature:"sign"
//   };

//   const taskJSON =  JSON.stringify(task);
//   console.log('====================================');
//   console.log("task",taskJSON);
//   console.log('====================================');

//   const taskCreateResponse = await fetch("http://localhost:3000/v1/user/task",{
//     method:"POST",
//     headers: {
//       "Content-Type": "application/json" ,
//       Authorization:
//         token,
//     },
//     body:taskJSON
//   })
//   // You can potentially return a success message or data here
//   if(!taskCreateResponse.ok)
//   {
//     throw new Error("task not created");
//   }
//   const dataTask = await taskCreateResponse.json();
//   console.log('====================================');
//   console.log(dataTask);
//   console.log('====================================');

//   revalidatePath('/') // Update cached posts
//   redirect(`/task/${dataTask.id}`) 
  
//   return { message: "File uploaded successfully",taskID:dataTask.id };
// };
