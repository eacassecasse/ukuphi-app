"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { toast, useToast } from "@/hooks/use-toast"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import useApi from "@/hooks/use-api"
import { Loader } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useNavigation } from "@/context/NavigationContext";
import { useAuth } from "@/context/AuthContext"

const formSchema = z.object({
    pin: z.string().min(6, {
        message: "Your one-time password must be 6 characters.",
    }),
})

export function InputOTPForm({ id }: { id: string | null }) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            pin: "",
        },
    })

    const { fetch } = useApi();
    const { toast } = useToast();
    const { setActivePage } = useNavigation();
    const { user } = useAuth();

    const [loading, setLoading] = useState(false);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const payload = formSchema.safeParse(values);

        if (payload.success) {
            setLoading(true);
            try {
                const data = await fetch('/auth/verify-otp', {
                    method: 'POST',
                    data: {
                        userId: id,
                        otp: payload.data.pin
                    },
                });

                setLoading(false);

                toast({
                    title: "OTP Verification",
                    description: (
                        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                            <code className="text-white">{data.message}</code>
                        </pre>
                    ),
                })

                if (user?.role === "ATTENDEE") {
                    setActivePage("landing");
                } else {
                    setActivePage("dashboard");
                }
            } catch (error) {
                setLoading(false);
                toast({
                    title: "OTP Verification",
                    description: (
                        <pre className="mt-2 w-[340px] rounded-md bg-fire-engine-red p-4">
                            <code className="text-white">{(error as Error).message}</code>
                        </pre>
                    ),
                    duration: 5000,
                })
                console.error(error);
            }
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                <FormField
                    control={form.control}
                    name="pin"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>One-Time Password</FormLabel>
                            <FormControl>
                                <InputOTP maxLength={6} {...field}>
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                            </FormControl>
                            <FormDescription>
                                Please enter the one-time password sent to your phone.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <span>Verifying... <Loader className="animate-spin" /> </span> : "Verify OTP"}
                </Button>
            </form>
        </Form>
    )
}


