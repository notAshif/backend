import z from "zod";


export const createMarketSchema = z.object({
    title: z.string(),
    initialWager: z.number(), 
    side: z.enum(["yes", "no"]),
    expiry: z.coerce.date()
})

export const placeBetSchema = z.object({
    marketId: z.string(),
    amount: z.number().int().positive()
})  