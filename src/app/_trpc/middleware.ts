import { createClient } from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const { nextUrl, cookies } = req
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if ( user && ['/sign-in', '/sign-up'].includes(nextUrl.pathname) ) {
        return NextResponse.redirect('localhost:3000')
    }
}