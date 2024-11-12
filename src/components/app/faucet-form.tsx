"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "@/components/ui/input";
import { addressSchema, messageResultSchema } from "./validation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { EChoices } from "./types";
import { useState } from "react";

const formSchema = z.object({
  address: addressSchema,
  choice: z.enum([EChoices.ELF, EChoices.TOKEN, EChoices.NFT]),
});

export function FaucetForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
      choice: EChoices.ELF,
    },
  });
  const [result, setResult] = useState<z.infer<typeof messageResultSchema>>({
    isSuccess: false,
    code: 0,
    message: "",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await fetch(
      `${import.meta.env.FAUCET_BACKEND_URL}/api/${
        {
          [EChoices.ELF]: "claim",
          [EChoices.TOKEN]: "claim-seed",
          [EChoices.NFT]: "claim-nft-seed",
        }[values.choice]
      }?walletAddress=${values.address}`,
      { method: "POST" }
    );
    const json = await res.json();

    const result = messageResultSchema.parse(json);

    setResult(result);
  }

  const isSeed = form.watch("choice") !== EChoices.ELF;

  return (
    <div className="mx-auto md:w-[800px]">
      <h1 className="text-4xl font-bold text-gray-800">
        AElf Testnet {isSeed ? "Seed" : "Token"} Faucet
      </h1>
      <div className="sm:rounded-md p-6 border border-gray-300 my-4 md:min-h-[500px] flex flex-col">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a valid aelf address here"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter a valid aelf address here.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="choice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Choice</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(e) => field.onChange(e as EChoices)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>ELF Token</SelectLabel>
                          <SelectItem value={EChoices.ELF}>ELF</SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel>Seed</SelectLabel>
                          <SelectItem value={EChoices.TOKEN}>
                            Token Seed
                          </SelectItem>
                          <SelectItem value={EChoices.NFT}>NFT Seed</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
            {result.message.length > 0 ? (
              <p
                aria-live="polite"
                role="status"
                className={`px-4 py-3 mt-4 rounded ${
                  result?.isSuccess
                    ? "bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900"
                    : "bg-red-100 border border-red-400 text-red-700"
                }`}
              >
                {result?.message}
              </p>
            ) : null}
          </form>
        </Form>
        <div className="text-sm py-2 mt-auto">
          <p>
            Click &quot;Get {isSeed ? "Seed" : "Tokens"}&quot; to receive the{" "}
            {isSeed ? "test seed" : "100 ELF test tokens"} to try out the aelf
            wallet.
          </p>
          <p>Note:</p>
          <ol className="list-decimal ml-4">
            <li>
              Each aelf Wallet address can only receive test{" "}
              {isSeed ? "seed" : "tokens"} once.
            </li>
            <li>
              {isSeed ? (
                <>
                  The test seed can be used to{" "}
                  <a
                    className="underline underline-offset-4"
                    href="https://doc.portkey.finance/docs/QuickStartGuides/LaunchTokenAndNFTCollection/CreateTokensViaEOAAddress"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    try out token creation on aelf testnet
                  </a>
                  .
                </>
              ) : (
                "The test token can be used to try out the same-chain/cross-chain transfer, resource purchasing, voting, and transaction fee in aelf testnet."
              )}
            </li>
            <li>
              Any test {isSeed ? "seed" : "tokens"} has nothing to do with the
              official {isSeed ? "seed" : "tokens"} and has no value. Please do
              not trade outside of testnet to avoid loss.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
