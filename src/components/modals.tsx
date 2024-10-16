"use client"

import { CreateWorkspaceModal } from "@/features/workspaces/components/create-workspace-modal"
import { useEffect, useState } from "react"

// Ensuring all modals that we added will only show up in the client side rendering
export const Modals = () => {
	// There might be a hydration error if we are using Zustand or jotai
	// Only open modal when we are in client side rendering
	const [mounted, setMounted] = useState(false)

	// The useEffect is used only in the client side rendering
	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) return null

	return (
		<>
			<CreateWorkspaceModal />
		</>
	)
}