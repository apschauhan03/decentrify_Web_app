require('dotenv').config();

import express, { Request, Response } from 'express';
import userRouter from "./routers/user";
import workerRouter from "./routers/worker";
import cors from "cors";

const PORT = process.env.PORT||3000;

const app = express();
app.use(cors());
// for allowing users to send data along too
app.use(express.json());

app.use("/v1/user",userRouter);
app.use("/v1/worker",workerRouter);


app.listen(PORT,()=>{
  console.log("server running at port ",PORT)
});