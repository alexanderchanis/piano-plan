import { z } from "zod";

const schemaComponent = z.object({
    name: z.string().min(1, { message: "Component name is required" }),
    duration: z.nullable(z.number()),
    desc: z.string()
})

export const PracticeSessionValidator = z.object({
    session: z.string()
        .max(255, { message: "Session name too long (max 255 characters)" })
        .min(2, { message: "Session name too short (min 2 characters)" }),
    components: z.array(schemaComponent).min(1, { message: "At least one component is required to create a new sesson" })
})

export type TPracticeSessionValidator = z.infer<typeof PracticeSessionValidator>