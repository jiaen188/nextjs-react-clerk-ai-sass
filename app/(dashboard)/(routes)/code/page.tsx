"use client";

import ReactMarkdown from "react-markdown";
import OpenAI from "openai";
import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Code } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";

import Heading from "@/components/Heading";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Empty from "@/components/Empty";
import Loader from "@/components/Loader";
import UserAvatar from "@/components/UserAvatar";
import BotAvatar from "@/components/BotAvatar";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useProModal } from "@/hooks/use-pro-modal";

const formSchema = z.object({
  prompt: z.string().min(1, { message: "prompt is required" }),
});

const CodePage = () => {
  const proModal = useProModal();

  const router = useRouter();

  const [messages, setMessages] = useState<
    OpenAI.Chat.ChatCompletionMessageParam[]
  >([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const useMessage: OpenAI.Chat.ChatCompletionMessageParam = {
        role: "user",
        content: values.prompt,
      };
      const newMessages = [...messages, useMessage];

      const response = await axios.post("/api/code", {
        messages: newMessages,
      });

      setMessages((current) => [...current, useMessage, response.data]);

      form.reset();
    } catch (error: any) {
      console.log("error", error);
      if (error?.response?.status === 403) {
        proModal.onOpen();
      }
    } finally {
      // 刷新 dashboard layout ，触发getApiLimitCount 更新
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Code Generation"
        description="Generate code using descriptive text"
        icon={Code}
        iconColor="text-green-700"
        bgColor="bg-green-700/10"
      ></Heading>
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
            >
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className=" border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="Simple toggle button using React hooks."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="col-span-12 lg:col-span-2 w-full"
                disabled={isLoading}
                type="submit"
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader></Loader>
            </div>
          )}
          {messages.length === 0 && !isLoading && (
            <Empty label="No conversation started."></Empty>
          )}
          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "p-8 w-full flex items-start gap-x-8 rounded-lg",
                  message.role === "user"
                    ? "bg-white border border-black/10"
                    : "bg-muted"
                )}
              >
                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                <ReactMarkdown
                  components={{
                    pre: ({ node, ...props }) => (
                      <div className=" overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                        <pre {...props}></pre>
                      </div>
                    ),
                    code: ({ node, ...props }) => (
                      <code
                        className=" bg-black/10 rounded-lg p-1"
                        {...props}
                      ></code>
                    ),
                  }}
                  className="text-sm overflow-hidden leading-7"
                >
                  {(message?.content as string) || ""}
                </ReactMarkdown>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodePage;
