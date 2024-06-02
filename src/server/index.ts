import { publicProcedure, router } from "./trpc";
import { AuthCredentialsValidator } from "@/app/lib/validators/account-credentials-validator";
import { createClient } from "@/utils/supabase/server";
import { TRPCError } from "@trpc/server";
import { LoginCredentialsValidator } from "@/app/lib/validators/login-credentials-validator";
import { PracticeSessionValidator } from "@/app/lib/validators/practice-session-validator";
import { z } from "zod";

type Session = {
    session_id: string,
    title: string,
    last_used: string,
    created_at: string,
    user_id: string
}

type Component = {
    component_id: string,
    title: string,
    description: string,
    duration: number,
    last_used: string,
    created_at: string,
    user_id: string
}

export const appRouter = router({
    createSupabaseUser: publicProcedure
        .input(AuthCredentialsValidator)
        .mutation(async ({ input }) => {
            
            const { email, password } = input
            const supabase = createClient()

            const info = {
                email: email as string,
                password: password as string,
              }

            const { data, error } = await supabase.auth.signUp(info)

            if (data?.user?.identities?.length === 0) {
                throw new TRPCError({ code: "CONFLICT" })
            }
            
            if (error?.code == "over_email_send_rate_limit") {
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })
            }

            console.log("Successfully signed up new user, verification email sent")
            return { success: true, sentToEmail: email }
        }),
    signInSupabaseUser: publicProcedure
        .input(LoginCredentialsValidator)
        .mutation(async ({ input }) => {

            const { email, password } = input
            const supabase = createClient()

            const { error } = await supabase.auth.signInWithPassword({ email, password })

            if ( error ) {
                console.log("Invalid credentials")
                throw new TRPCError({ code: "UNAUTHORIZED" })
            }

            console.log("Successfully signed in")
            return { success: true }
        }),
    newPractice: publicProcedure
        .input(PracticeSessionValidator)
        .mutation(async ({ input }) => {

            const { session, components } = input
            const supabase = createClient()
            const { error: authError } = await supabase.auth.getUser()

            if ( authError ) {
                console.log("Not signed in")
                throw new TRPCError({ code: "UNAUTHORIZED" })
            }           

            const time = ((new Date()).toISOString()).toLocaleString()

            const { data, error } = await supabase.rpc("create_session_components",
                { components: components, sessionname: session, ts: time }
            )
            
            if ( error ) {
                throw new TRPCError({ code: "BAD_REQUEST" })
            }

            return { success: true, key: data }
        }),
    fetchSession: publicProcedure
        .input(z.string())
        .query(async ( opts ) => {
            const { input } = opts
            const supabase = createClient()
            const { data } = await supabase.auth.getUser()

            if ( data?.user ) {
                const userAuth: string = data.user.id
            } else {
                throw new TRPCError({ code: "FORBIDDEN" })
            }

            const { data: queryResult, error } = await supabase.from('sessions').select().eq('session_id', input).single()

            console.log(queryResult)

            if ( error?.code == "PGRST116" ) {
                console.log("Not found")
                throw new TRPCError({ code: "NOT_FOUND" })
            }

            if ( !data?.user ) {
                console.log("Forbidden")
                throw new TRPCError({ code: "FORBIDDEN" })
            }

            const userAuth: string = data.user.id
            const dbAuth: string = queryResult.user_id

            if ( userAuth === dbAuth ) {
                if ( queryResult ) {
                    return queryResult as Session
                } else {
                    throw new TRPCError({ code: "NOT_FOUND" })
                }
            } else {
                throw new TRPCError({ code: "NOT_FOUND" })
            }
        }),
    fetchSessionComponents: publicProcedure
        .input(z.string())
        .query(async ( opts ) => {
            const { input } = opts
            const supabase = createClient()
            const { data } = await supabase.auth.getUser()

            if ( !data?.user ) {
                throw new TRPCError({ code: "UNAUTHORIZED" })
            }

            const { data: components, error } = await supabase.rpc("fetch_components",
                { sess_id: input }
            )

            if ( error?.code == "PGRST116" || components.length == 0 ) {
                console.log("Not found")
                throw new TRPCError({ code: "NOT_FOUND" })
            }

            if ( data.user.id === components[0].user_id ) {
                return components as Component[]
            } else {
                throw new TRPCError({ code: "NOT_FOUND" })
            }
        })
})

export type AppRouter = typeof appRouter

