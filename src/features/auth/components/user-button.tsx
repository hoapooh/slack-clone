"use client"

import { useRouter } from "next/navigation"
import { Loader, LogOut } from "lucide-react"
import { useAuthActions } from "@convex-dev/auth/react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCurrentUser } from "../hooks/use-current-user"

export const UserButton = () => {
	const router = useRouter()
	const { signOut } = useAuthActions()
	const { data, isLoading } = useCurrentUser()

	const handleSignOut = async () => {
		await signOut()
		router.push("/auth") // Redirect to auth page after signing out
	}

	if (isLoading) return <Loader className="size-4 animate-spin text-muted-foreground" />

	if (!data) return null

	const { image, name } = data

	// The exclamation mark is a non-null assertion operator.
	// It tells TypeScript that the value is not null or undefined.
	const avatarFallback = name!.charAt(0).toUpperCase()

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger className="outline-none relative">
				<Avatar className="size-10 hover:opacity-75 transition">
					<AvatarImage alt={name} src={image} />
					<AvatarFallback className="bg-sky-500 text-white font-semibold">
						{avatarFallback}
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="center" side="right" className="w-60">
				<DropdownMenuItem onClick={handleSignOut} className="h-10 cursor-pointer">
					<LogOut className="size-4 mr-2" />
					Log out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
