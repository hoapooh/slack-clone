import { useState } from "react"

import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { Trash } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { useRouter } from "next/navigation"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { useUpdateWorkspace } from "@/features/workspaces/api/use-update-workspace"
import { useRemoveWorkspace } from "@/features/workspaces/api/use-remove-workspace"
import { useConfirm } from "@/hooks/use-confirm"

interface PreferencesModalProps {
	open: boolean
	setOpen: (open: boolean) => void
	initialValue: string
}

export const PreferencesModal = ({ open, setOpen, initialValue }: PreferencesModalProps) => {
	const router = useRouter()
	const workspaceId = useWorkspaceId()
	const [confirm, ConfirmDialog] = useConfirm(
		"Are you sure?",
		"Deleting this workspace will remove all its data and cannot be undone."
	)

	const [value, setValue] = useState(initialValue)
	const [editOpen, setEditOpen] = useState(false)

	const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } = useUpdateWorkspace()
	const { mutate: removeWorkspace, isPending: isRemovingWorkspace } = useRemoveWorkspace()

	const handleRemove = async () => {
		const ok = await confirm()

		if (!ok) return

		removeWorkspace(
			{ id: workspaceId },
			{
				onSuccess: () => {
					toast.success("Workspace removed successfully")
					// INFO: Redirect to home page, use replace instead of push
					// INFO: to prevent user from going back to the workspace
					router.replace("/")
				},
				onError: () => {
					toast.error("Failed to remove workspace")
				},
			}
		)
	}

	const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		updateWorkspace(
			{ id: workspaceId, name: value },
			{
				onSuccess: () => {
					toast.success("Workspace updated successfully")
					setEditOpen(false)
				},
				onError: () => {
					toast.error("Failed to update workspace")
				},
			}
		)
	}

	return (
		<>
			{ConfirmDialog}
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="p-0 bg-gray-50 overflow-hidden">
					<DialogHeader className="p-4 border-b bg-white">
						<DialogTitle>{value}</DialogTitle>
					</DialogHeader>
					<div className="px-4 pb-4 flex flex-col gap-y-2">
						<Dialog open={editOpen} onOpenChange={setEditOpen}>
							<DialogTrigger asChild>
								<div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
									<div className="flex items-center justify-between">
										<p className="text-sm font-semibold">Workspace name</p>
										<p className="text-sm text-[#1264A3] hover:underline font-semibold">Edit</p>
									</div>
									<p className="text-sm">{value}</p>
								</div>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Rename this workspace</DialogTitle>
								</DialogHeader>
								<form className="space-y-4" onSubmit={handleEdit}>
									<Input
										value={value}
										disabled={isUpdatingWorkspace}
										onChange={(e) => setValue(e.target.value)}
										required
										autoFocus
										minLength={3}
										maxLength={80}
										placeholder="Workspace name e.g.'Work', 'Personal', 'Home'"
									/>
									<DialogFooter>
										<DialogClose asChild>
											<Button variant={"outline"} disabled={isUpdatingWorkspace}>
												Cancel
											</Button>
										</DialogClose>
										<Button disabled={isUpdatingWorkspace}>Save</Button>
									</DialogFooter>
								</form>
							</DialogContent>
						</Dialog>

						<button
							disabled={isRemovingWorkspace}
							onClick={handleRemove}
							className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600"
						>
							<Trash className="size-4" />
							<p className="text-sm font-semibold">Delete workspace</p>
						</button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	)
}
