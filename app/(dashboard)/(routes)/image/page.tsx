"use client";

import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Download, ImageIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Heading from "@/components/Heading";
import Empty from "@/components/Empty";
import Loader from "@/components/Loader";
import { Card, CardFooter } from "@/components/ui/card";
import { useProModal } from "@/hooks/use-pro-modal";

const formSchema = z.object({
  prompt: z.string().min(1, { message: "Image prompt is required" }),
  // amount: z.string().min(1),
  resolution: z.string().min(1),
});

const amountOptions = [
  {
    value: "1",
    label: "1 Photo",
  },
  {
    value: "2",
    label: "2 Photos",
  },
  {
    value: "3",
    label: "3 Photos",
  },
  {
    value: "4",
    label: "4 Photos",
  },
  {
    value: "5",
    label: "5 Photos",
  },
];

const resolutionOptions = [
  // {
  //   value: "256x256",
  //   label: "256x256",
  // },
  // {
  //   value: "512x512",
  //   label: "512x512",
  // },
  {
    value: "1024x1024",
    label: "1024x1024",
  },
  {
    value: "1024x1792",
    label: "1024x1792",
  },
  {
    value: "1792x1024",
    label: "1792x1024",
  },
];

const ImagePage = () => {
  const proModal = useProModal();

  const router = useRouter();

  const [images, setImages] = useState<string[]>([
    // "https://filesystem.site/cdn/20240218/cnxRUKiX4DNtliQx91JQm7R7dDPfxb.webp",
    // "https://oaidalleapiprodscus.blob.core.windows.net/private/org-7BN3tEdx2d8HyU8DmazQLzHT/user-cPqwklWaPmbpe9IvaeQByj1m/img-O5DcCSBtWy0qYg7Wn4ChQCo6.png?st=2024-02-18T12%3A25%3A40Z&se=2024-02-18T14%3A25%3A40Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-02-18T08%3A16%3A47Z&ske=2024-02-19T08%3A16%3A47Z&sks=b&skv=2021-08-06&sig=egi/AER0LLBF8KM8h7VsFvG0pJmxEmdvnUAfI69aHDY%3D",
    // "https://oaidalleapiprodscus.blob.core.windows.net/private/org-7BN3tEdx2d8HyU8DmazQLzHT/user-cPqwklWaPmbpe9IvaeQByj1m/img-P17WHEvrYV5VRby9fR8606pl.png?st=2024-02-18T12%3A29%3A06Z&se=2024-02-18T14%3A29%3A06Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-02-18T01%3A22%3A12Z&ske=2024-02-19T01%3A22%3A12Z&sks=b&skv=2021-08-06&sig=sensZJodM22f8gL8a3Yt5oweZ0cKZw20prM3PgAtg3k%3D",
    // "https://oaidalleapiprodscus.blob.core.windows.net/private/org-7BN3tEdx2d8HyU8DmazQLzHT/user-cPqwklWaPmbpe9IvaeQByj1m/img-PzYOsmRCcWwHOEyTv9SLCPgi.png?st=2024-02-18T12%3A30%3A50Z&se=2024-02-18T14%3A30%3A50Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-02-18T08%3A21%3A27Z&ske=2024-02-19T08%3A21%3A27Z&sks=b&skv=2021-08-06&sig=QIV/1kWpi1fT0VqWNTDwD6adKL3ecpU03m01ZyU5aRk%3D",
    // 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-7BN3tEdx2d8HyU8DmazQLzHT/user-cPqwklWaPmbpe9IvaeQByj1m/img-z9CzW9Zi4nAf5xRJzarw83cp.png?st=2024-02-18T12%3A37%3A59Z&se=2024-02-18T14%3A37%3A59Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-02-18T10%3A18%3A08Z&ske=2024-02-19T10%3A18%3A08Z&sks=b&skv=2021-08-06&sig=nasIGqz5L/eqgtWxlIq8Ooi50WC%2B4y3o%2B2KBBMFp%2B60%3D'
  ]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      // amount: "1",
      resolution: "1024x1024",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setImages([]);

      const response = await axios.post("/api/image", values);

      const urls = response.data.map((image: { url: string }) => image.url);
      setImages(urls);

      form.reset();
    } catch (error: any) {
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
        title="Image Generation"
        description="Turn your prompt into an image."
        icon={ImageIcon}
        iconColor="text-pink-700"
        bgColor="bg-pink-700/10"
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
                  <FormItem className="col-span-12 lg:col-span-6">
                    <FormControl className="m-0 p-0">
                      <Input
                        className=" border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="A picture of a horse in Swiss alps"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {/* <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-2">
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {amountOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              /> */}
              <FormField
                control={form.control}
                name="resolution"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-4">
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {resolutionOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
            <div className="p-20">
              <Loader></Loader>
            </div>
          )}
          {images.length === 0 && !isLoading && (
            <Empty label="No images generate."></Empty>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
            {images.map((src) => (
              <Card key={src} className="rounded-lg overflow-hidden">
                <div className="relative aspect-square">
                  <Image fill alt="Generated" src={src} />
                </div>
                <CardFooter className="p-2">
                  <Button
                    onClick={() => window.open(src)}
                    variant="secondary"
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePage;
