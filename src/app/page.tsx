"use client"

import { useAuthActions } from "@convex-dev/auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function Home() {
	const { signOut } = useAuthActions()
	const router = useRouter()

	const handleSignOut = async () => {
		await signOut()
		router.push("/auth") // Redirect to auth page after signing out
	}

	return (
		<div>
			Logged in!
			<Button onClick={handleSignOut}>Sign out</Button>
		</div>
	)
}
