import { auth } from "@clerk/nextjs";
import axios from "axios";
import { NextResponse } from "next/server";
import OpenAI from "openai";

import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
  baseURL: process.env.BASE_URL + '/v1'
});

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    const body = await req.json();
    const { prompt, amount = '1', resolution = '512x512' } = body

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!openai.apiKey) {
      return new NextResponse("OpenAI API key not set", { status: 500 });
    }

    if (!prompt) {
      return new NextResponse("Prompt are required", { status: 400 });
    }

    // if (!amount) {
    //   return new NextResponse("Amount are required", { status: 400 });
    // }

    if (!resolution) {
      return new NextResponse("Resolution are required", { status: 400 });
    }

    const freeTrial = await checkApiLimit()

    if(!freeTrial) {
      return new NextResponse("Free trial has expired", { status: 403 });
    }

    // const response = await openai.images.generate({
    //   prompt,
    //   amount: parseInt(amount, 10),
    //   size: resolution,
    // });
    // return NextResponse.json(response.data.data);

    // TODO 需要梯子，用第三方服务替代
    const response = await axios.post(process.env.BASE_URL + '/v1' + '/images/generations', {
      prompt,
      model: "dall-e-3",
      // amount: parseInt(amount, 10),
      size: resolution,
      // style: 'natural'
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPEN_AI_API_KEY}`
      }
    })

    await increaseApiLimit()
  
    return NextResponse.json(response.data.data);
  } catch (error) {
    console.log('[IMAGE_ERROR]', error)
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}