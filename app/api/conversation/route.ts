
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
    const { messages } = body

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!openai.apiKey) {
      return new NextResponse("OpenAI API key not set", { status: 500 });
    }

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const freeTrial = await checkApiLimit()

    if(!freeTrial) {
      return new NextResponse("Free trial has expired", { status: 403 });
    }

    // const response = await openai.chat.completions.create({
    //   messages,
    //   model: "gpt-3.5-turbo",
    // });
    // return NextResponse.json(response.choices[0].message);

    // TODO 需要梯子，用第三方服务替代
    const response = await axios.post(process.env.BASE_URL + '/v1' + '/chat/completions', {
      messages,
      model: "gpt-3.5-turbo",
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPEN_AI_API_KEY}`
      }
    })

    await increaseApiLimit()
  
    return NextResponse.json(response.data.choices[0].message);
  } catch (error) {
    console.log('[CONVERSATION_ERROR]', error)
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}