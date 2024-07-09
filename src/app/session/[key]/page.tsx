"use client"

import { trpc } from "@/app/_trpc/client"
import Icons from "@/app/components/Icons"
import { Button } from "@/components/ui/button"
import { useEffect, useRef, useState } from "react"


const Page = ({ params }: { params: { key: string } }) => {
    
    const { data: sessionData, isLoading: sessIsLoading } = trpc.fetchSession.useQuery(params.key)
    const { data: compData, isLoading: compIsLoading } = trpc.fetchSessionComponents.useQuery(params.key)
    
    const [timers, setTimers] = useState<number[]>([])
    const timerIds = useRef<NodeJS.Timeout[]>([])

    useEffect(() => {
        if ( compData ) {
            setTimers(compData.map(comp => comp.duration * 60000)) // convert minutes to milliseconds
            console.log(timers)
            timerIds.current = compData.map((_, index) => timerIds.current[index])
        }
    }, [compData])

    const getFormattedTime = (milliseconds: number) => {
        let total_seconds = Math.floor(milliseconds / 1000)
        let total_minutes = Math.floor(total_seconds / 60)
        let total_hours = Math.floor(total_minutes / 60)

        let seconds = total_seconds % 60
        let minutes = total_minutes % 60
        let hours = total_hours % 24

        return `${hours}: ${minutes}: ${seconds}`
    }

    const startTimer = (index: number) => {
        timerIds.current[index] = setInterval(() => {
            setTimers(prevTimers => {
                const newTimers = [...prevTimers]
                newTimers[index] = newTimers[index] - 1000
                if ( newTimers[index] < 1000 ) {
                    clearInterval(timerIds.current[index])
                }
                return newTimers
            })
        }, 1000)
    }


    return <>
    {(sessionData && compData) ? ( 
    <div className="container relative flex pt-20 flex--col items-center justify-center lg:px-0">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col items-center space-y-2 text-center">
                <Icons.logo className="h-20 w-20" />
                <h1 className="text-2xl font-bold">
                    {sessionData.title}
                </h1>
            </div>

            <div className="grid gap-6">
                    <div className="grid gap-2">
                        <div className="grid gap-1 py-4">

                        </div>

                        {compData.map((component, componentIndex) => (
                            <div key={componentIndex} className="grid gap-1 py-2">
                                <div className='flex items-center'>
                                    <p>{component.title}</p><br/>
                                </div>
                                <div className='flex items-center'>
                                    <p>{component.description}</p><br/>
                                </div>
                                <Button onClick={() => startTimer(componentIndex)}>Start</Button>
                                <p>Time Remaining: {getFormattedTime(timers[componentIndex])}</p>
                            </div>
                        ))}
                    </div>
            </div>
        </div>
    </div>
    ) : (<p>Not found</p>)}
    </>
}


export default Page