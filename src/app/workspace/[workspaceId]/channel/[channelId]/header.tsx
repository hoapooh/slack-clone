import { toast } from "sonner";
import { Trash } from "lucide-react";
import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/use-confirm";
import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useUpdateChannel } from "@/features/channels/api/use-update-channel";
import { useRemoveChannel } from "@/features/channels/api/use-remove-channel";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogHeader,
	DialogTrigger,
	DialogContent,
	DialogTitle,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog";

interface HeaderProps {
	title: string;
}

const Header = ({ title }: HeaderProps) => {
	const router = useRouter();
	const channelId = useChannelId();
	const workspaceId = useWorkspaceId();
	const [confirm, ConfirmDialog] = useConfirm(
		"Delete this channel?",
		"You are about to delete this channel. This action is irreversible."
	);

	const [value, setvalue] = useState(title);
	const [editOpen, setEditOpen] = useState(false);

	const { data: member } = useCurrentMember({ workspaceId });
	const { mutate: updateChannel, isPending: updatingChannel } = useUpdateChannel();
	const { mutate: removeChannel, isPending: removingChannel } = useRemoveChannel();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
		setvalue(value);
	};

	const handleEditOpen = (value: boolean) => {
		if (member?.role !== "admin") return;

		setEditOpen(value);
	};

	const handleDelete = async () => {
		const ok = await confirm();

		if (!ok) return;

		removeChannel(
			{ channelId },
			{
				onSuccess: () => {
					toast.success("Channel deleted successfully");
					router.replace(`/workspace/${workspaceId}`);
				},
				onError: () => {
					toast.error("Failed to delete channel");
				},
			}
		);
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		updateChannel(
			{ channelId, name: value },
			{
				onSuccess: () => {
					toast.success("Channel updated successfully");
					setEditOpen(false);
				},
				onError: () => {
					toast.error("Failed to update channel");
				},
			}
		);
	};

	return (
		<div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
			{ConfirmDialog}
			<Dialog>
				<DialogTrigger asChild>
					<Button
						variant={"ghost"}
						className="text-lg font-semibold px-2 overflow-hidden w-auto"
						size={"sm"}
					>
						<span className="truncate"># {title}</span>
						<FaChevronDown className="size-2.5 ml-2" />
					</Button>
				</DialogTrigger>

				<DialogContent className="p-0 bg-gray-50 overflow-hidden">
					<DialogHeader className="p-4 border-b bg-white">
						<DialogTitle># {title}</DialogTitle>
					</DialogHeader>

					<div className="px-4 pb-4 flex flex-col gap-y-2">
						<Dialog open={editOpen} onOpenChange={handleEditOpen}>
							<DialogTrigger asChild>
								<div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
									<div className="flex items-center justify-between">
										<p className="text-sm font-semibold">Channel name</p>
										{member?.role === "admin" && (
											<p className="text-sm text-[#1264a3] hover:underline font-semibold">Edit</p>
										)}
									</div>
									<p className="text-sm"># {title}</p>
								</div>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Rename this channel</DialogTitle>
								</DialogHeader>
								<form className="space-y-4" onSubmit={handleSubmit}>
									<Input
										value={value}
										disabled={updatingChannel}
										onChange={handleChange}
										required
										autoFocus
										minLength={3}
										maxLength={80}
										placeholder="e.g. plan-budget"
									/>
									<DialogFooter>
										<DialogClose asChild>
											<Button variant={"outline"} disabled={updatingChannel}>
												Cancel
											</Button>
										</DialogClose>
										<Button disabled={updatingChannel}>Save</Button>
									</DialogFooter>
								</form>
							</DialogContent>
						</Dialog>

						{member?.role === "admin" && (
							<button
								disabled={removingChannel}
								onClick={handleDelete}
								className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50 text-rose-600"
							>
								<Trash className="size-4" />
								<p className="text-sm font-semibold">Delete channel</p>
							</button>
						)}
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default Header;
