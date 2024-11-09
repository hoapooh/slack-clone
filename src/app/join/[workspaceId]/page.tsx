"use client"

import { useMemo, useEffect } from "react"

import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"

import Image from "next/image"
import { toast } from "sonner"
import { Loader } from "lucide-react"
import { Button } from "@/components/ui/button"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { useJoin } from "@/features/workspaces/api/use-join"
import { useGetWorkspaceInfo } from "@/features/workspaces/api/use-get-workspace-info"

const JoinPage = () => {
	const router = useRouter()
	const workspaceId = useWorkspaceId()

	const { mutate, isPending } = useJoin()
	const { data, isLoading } = useGetWorkspaceInfo({ id: workspaceId })

	const isMember = useMemo(() => data?.isMember, [data])

	useEffect(() => {
		if (isMember) {
			router.push(`/workspace/${workspaceId}`)
		}
	}, [isMember, router, workspaceId])

	const handleComplete = (otp: string) => {
		mutate(
			{ joinCode: otp, workspaceId },
			{
				onSuccess: (id) => {
					router.replace(`/workspace/${id}`)
					toast.success("Successfully joined workspace")
				},
				onError: () => {
					toast.error("Failed to join workspace")
				},
			}
		)
	}

	if (isLoading) {
		return (
			<div className="h-full flex items-center justify-center">
				<Loader className="size-6 animate-spin text-muted-foreground" />
			</div>
		)
	}

	return (
		<div className="h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-md">
			<Image src="/logo.svg" alt="Slack clone logo" width={120} height={30} className="h-auto" />
			<div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
				<div className="flex flex-col gap-y-2 items-center justify-center">
					<h1 className="text-2xl font-bold">Join {data?.name}</h1>
					<p className="text-md text-muted-foreground">Enter the workspace code to join</p>
				</div>

				<InputOTP
					disabled={isPending}
					onComplete={handleComplete}
					maxLength={6}
					autoFocus
					pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
				>
					<InputOTPGroup>
						<InputOTPSlot index={0} />
						<InputOTPSlot index={1} />
						<InputOTPSlot index={2} />
					</InputOTPGroup>
					<InputOTPSeparator />
					<InputOTPGroup>
						<InputOTPSlot index={3} />
						<InputOTPSlot index={4} />
						<InputOTPSlot index={5} />
					</InputOTPGroup>
				</InputOTP>

				<div className="flex gap-x-4">
					<Button size={"lg"} variant="outline" asChild>
						<Link href="/">Back to home</Link>
					</Button>
				</div>
			</div>
		</div>
	)
}

export default JoinPage
