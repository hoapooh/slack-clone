import { useState } from "react"
import { useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { useCreateWorkspace } from "../api/use-create-workspace"
import { useCreateWorkspaceModal } from "../store/use-create-workspace-modal"
import { toast } from "sonner"

export const CreateWorkspaceModal = () => {
	const [open, setOpen] = useCreateWorkspaceModal()
	const [name, setName] = useState("")

	const router = useRouter()
	const { mutate, isPending } = useCreateWorkspace()

	const handleClose = () => {
		setOpen(false)
		setName("")

		// TODO: clear form
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		mutate(
			{ name },
			{
				onSuccess: (id) => {
					toast.success("Workspace created successfully")
					router.push(`/workspace/${id}`)
					handleClose()
				},
			}
		)
	}

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent aria-describedby={undefined}>
				<DialogHeader>
					<DialogTitle>Add a workspace</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					<Input
						value={name}
						onChange={(e) => setName(e.target.value)}
						disabled={isPending}
						required
						autoFocus
						minLength={3}
						placeholder="Workspace name e.g.'Work', 'Personal', 'Home'"
					/>
					<div className="flex justify-end">
						<Button disabled={isPending}>Create</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}
