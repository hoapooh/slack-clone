import { Plus } from "lucide-react"
import { FaCaretRight } from "react-icons/fa"

import { Hint } from "@/components/hint"
import { Button } from "@/components/ui/button"

import { useToggle } from "react-use"
import { cn } from "@/lib/utils"

interface WorkspaceSectionProps {
	children: React.ReactNode
	label: string
	hint: string
	onNew?: () => void
}

export const WorkspaceSection = ({ children, label, hint, onNew }: WorkspaceSectionProps) => {
	const [open, toggle] = useToggle(true)

	return (
		<div className="flex flex-col mt-3 px-2">
			<div className="flex items-center px-3.5 group">
				<Button
					variant={"transparent"}
					className="p-0.5 text-sm text-[#f9edffcc] shrink-0 size-6"
					onClick={toggle}
				>
					<FaCaretRight className={cn("size-4 transition-transform", open && "rotate-90")} />
				</Button>
				<Button
					variant={"transparent"}
					size={"sm"}
					className="px-1.5 text-sm text-[#f9edffcc] h-[28px] justify-start overflow-hidden"
				>
					<span className="truncate">{label}</span>
				</Button>
				{onNew && (
					<Hint label={hint} side="top" align="center">
						<Button
							onClick={onNew}
							variant={"transparent"}
							size={"iconSm"}
							className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto p-0.5 text-sm text-[#f9edffcc] size-6 shrink-0"
						>
							<Plus className="size-5" />
						</Button>
					</Hint>
				)}
			</div>
			{open && children}
		</div>
	)
}