"use client"

import { trpc } from "@/app/_trpc/client"


const Page = ({ params }: { params: { key: string } }) => {
    
    const { data: sessionData, isLoading: sessIsLoading } = trpc.fetchSession.useQuery(params.key)
    const { data: compData, isLoading: compIsLoading } = trpc.fetchSessionComponents.useQuery(params.key) 

    var found: boolean = false

    if ( sessionData ) {
        found = true
    }

    return (
        sessionData ?
            (
                <div>{sessionData.title}</div>
            ) : <div>Not found</div>
    )
}


export default Page