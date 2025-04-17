import React, { useState } from "react";

import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const useConfirm = (
	title: string,
	message: string
): [() => Promise<unknown>, React.JSX.Element] => {
	const [promise, setPromise] = useState<{ resolve: (value: boolean) => void } | null>(null);

	// NOTE: call this function to show the confirm dialog
	const confirm = () =>
		new Promise((resolve, _reject) => {
			setPromise({ resolve });
		});

	const handleClose = () => {
		setPromise(null);
	};

	// INFO: call this function to close the confirm dialog and resolve the promise with false
	const handleCancel = () => {
		promise?.resolve(false);
		handleClose();
	};

	// INFO: call this function to close the confirm dialog and resolve the promise with true
	const handleConfirm = () => {
		promise?.resolve(true);
		handleClose();
	};

	const ConfirmDialog = (
		<Dialog open={promise !== null} onOpenChange={handleClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{message}</DialogDescription>
				</DialogHeader>
				<DialogFooter className="pt-2">
					<Button variant={"outline"} onClick={handleCancel}>
						Cancel
					</Button>
					<Button onClick={handleConfirm}>Confirm</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);

	return [confirm, ConfirmDialog];
};
