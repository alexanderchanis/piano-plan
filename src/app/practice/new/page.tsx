"use client"

import { trpc } from '@/app/_trpc/client'
import Icons from '@/app/components/Icons'
import { cn } from '@/app/lib/utils'
import { PracticeSessionValidator, TPracticeSessionValidator } from '@/app/lib/validators/practice-session-validator'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { ChangeEvent, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { ZodError } from 'zod'

const NewPractice = () => {

    const router = useRouter()

    const { 
        register,
        handleSubmit, 
        formState: { errors },
        control,
    } = useForm<TPracticeSessionValidator>({
        resolver: zodResolver(PracticeSessionValidator),
    })

    const { append, remove, fields } = useFieldArray({ name: 'components', control })

    const handleAddComponent = () => {
        append({ name: '', duration: null, desc: '' })
    }

    const handleRemoveComponent = ( compIndex: number ) => {
        remove(compIndex)
    }

    const { mutate: createSession, isLoading } = trpc.newPractice.useMutation({
        onError: (err) => {
            console.log("Error is: ")
            console.log(err)
            if (err.data?.code === 'UNAUTHORIZED') {
                toast.error(
                    'Sign in to create a practice session.'
                )

                return

            } else if (err instanceof ZodError) {
                toast.error(err.issues[0].message)

                return
            }

            toast.error(
                'Something went wrong. Please try again.'
            )
        },
        onSuccess: ({ key }) => {
            toast.success(`New practice session successfully created`)
            router.push('/session/' + key)
        }
    })
    
    const onSubmit = (input: TPracticeSessionValidator) => {
        createSession(input)
    }


    return <>
    <div className="container relative flex pt-20 flex--col items-center justify-center lg:px-0">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col items-center space-y-2 text-center">
                <Icons.logo className="h-20 w-20" />
                <h1 className="text-2xl font-bold">
                    New practice session
                </h1>
            </div>

            <div className="grid gap-6">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-2">
                        <div className="grid gap-1 py-4">
                            <Label htmlFor='title'>Session name</Label>
                            <Input
                                {...register("session")}
                                placeholder='Session name'
                            />
                            {errors?.session && (
                                    <p className="text-sm text-red-500">
                                        {errors.session?.message}
                                    </p>
                            )}
                        </div>

                        {fields.map((component, componentIndex) => (
                            <div key={component.id} className="grid gap-1 py-2">

                                <div className='flex items-center'>
                                    <Label htmlFor='exercise'>Component {componentIndex + 1}</Label>
                                    <Button
                                        type="button"
                                        onClick={() => handleRemoveComponent(componentIndex)}
                                        size="sm"
                                        className="bg-red-800 ml-auto"
                                    >
                                        Remove
                                    </Button>
                                </div>
                                
                                <Input
                                    {...register(`components.${componentIndex}.name`)}
                                    placeholder='Component name'
                                />
                                {errors.components?.[componentIndex]?.name && (
                                    <p className="text-sm text-red-500">
                                        {errors.components?.[componentIndex]?.name.message}
                                    </p>
                                )}
                                <Input
                                    type="number"
                                    {...register(`components.${componentIndex}.duration`, { valueAsNumber: true })}
                                    placeholder='Duration (minutes)'
                                />
                                {errors.components?.[componentIndex]?.duration && (
                                    <p className="text-sm text-red-500">
                                        {errors?.components?.[componentIndex]?.duration.message}
                                    </p>
                                )}
                                <Input
                                    {...register(`components.${componentIndex}.desc`)}
                                    placeholder='Description (optional)'
                                />
                                {errors.components?.[componentIndex]?.desc && (
                                    <p className="text-sm text-red-500">
                                        {errors?.components?.[componentIndex]?.desc.message}
                                    </p>
                                )}
                        </div>
                        ))}

                        <Button
                            type="button"
                            className={buttonVariants({
                                variant: "default",
                                className: "bg-green-800 mb-4"
                            })}
                            onClick={handleAddComponent}
                        >      
                            Add component
                        </Button>

                        <Button
                            disabled={isLoading}
                            className={buttonVariants({
                                variant: "default",
                                className: "bg-gray-900"
                            })}
                        >
                            {isLoading && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Create session
                        </Button>

                        {errors.components && (
                            <p className="text-sm text-red-500">
                                {errors?.components?.message}
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </div>
    </div>
    </>
}

export default NewPractice