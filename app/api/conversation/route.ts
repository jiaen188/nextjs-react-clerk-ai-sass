
import { auth } from "@clerk/nextjs";
import axios from "axios";
import { NextResponse } from "next/server";
import OpenAI from "openai";

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

    // const response = await openai.chat.completions.create({
    //   messages,
    //   model: "gpt-3.5-turbo",
    // });

    // TODO 需要翻墙或者梯子，用第三方服务
    const response = await axios.post(process.env.BASE_URL + '/v1' + '/chat/completions', {
      messages,
      model: "gpt-3.5-turbo",
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPEN_AI_API_KEY}`
      }
    })
  
    return NextResponse.json(response.data.choices[0].message);
  } catch (error) {
    console.log('[CONVERSATION_ERROR]', error)
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}