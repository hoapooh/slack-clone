import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { Id } from "../../../../convex/_generated/dataModel"

const userItemVariants = cva(
	"flex items-center gap-1.5 justify-start font-normal px-4 h-7 px-[18px] text-sm overflow-hidden",
	{
		variants: {
			variant: {
				default: "text-[#f9edffcc]",
				active: "text-[#481349] bg-white/90 hover:bg-white/90",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	}
)

interface UserItemProps {
	id: Id<"members">
	label?: string
	image?: string
	variant?: VariantProps<typeof userItemVariants>["variant"]
}

export const UserItem = ({ id, label = "Member", image, variant }: UserItemProps) => {
	const workspaceId = useWorkspaceId()
	const avatarFallback = label.charAt(0).toUpperCase()

	return (
		<Button
			variant={"transparent"}
			className={cn(userItemVariants({ variant }))}
			size={"sm"}
			asChild
		>
			<Link href={`/workspaces/${workspaceId}/member/${id}`}>
				<Avatar className="size-5 rounded-md mr-1">
					<AvatarImage src={image} className="rounded-md" />
					<AvatarFallback className="bg-sky-500 text-white font-semibold rounded-md">
						{avatarFallback}
					</AvatarFallback>
				</Avatar>
				<span className="truncate text-md">{label}</span>
			</Link>
		</Button>
	)
}
