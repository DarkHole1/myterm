import { z } from "zod";

export const Result = z.discriminatedUnion('success', [
    z.object({
        success: z.literal(true),
        data: z.unknown()
    }),
    z.object({
        success: z.literal(false),
        reason: z.string().optional()
    })
])
export type Result = z.infer<typeof Result>

export const EmptyResult = z.discriminatedUnion('success', [
    z.object({
        success: z.literal(true)
    }),
    z.object({
        success: z.literal(false),
        reason: z.string().optional()
    })
])
export type EmptyResult = z.infer<typeof EmptyResult>