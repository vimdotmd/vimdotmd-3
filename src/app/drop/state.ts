import * as React from "react";
import { FileState } from "~src/components/file/state";

interface AppDropState {
	dragging: boolean;
	handlers: Pick<
		React.DOMAttributes<HTMLDivElement>,
		"onDrop" | "onDragOver" | "onDragEnter" | "onDragLeave"
	>;
}

interface Params {
	file: FileState;
}

export const useAppDrop = (params: Params): AppDropState => {
	// Keep a counter to reliably detect when the drag is still there. We can
	// not mute pointer-events on App's children (editor and toolbar).
	// https://stackoverflow.com/a/21002544
	const counter = React.useRef(0);
	// Since ref does not trigger re-render, we still need a state, but we will
	// only set this state when counter is changed between 0 and 1 to avoid
	// unnecessary re-renders
	const [dragging, setDragging] = React.useState(false);

	const onDrop = async (event: React.DragEvent) => {
		event.preventDefault();
		setDragging(false);
		counter.current = 0;

		const { items } = event.dataTransfer;
		if (1 < items.length || items[0].kind !== "file")
			throw Error("Only a single file upload is supported.");

		const file = await items[0].getAsFileSystemHandle();
		if (file) params.file.setFile(file as FileSystemFileHandle);
	};

	const onDragOver = (event: React.DragEvent): void => {
		// Specifying this as a drop target
		// https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#droptargets
		event.preventDefault();
	};

	const onDragEnter = (event: React.DragEvent): void => {
		// Specifying this as a drop target
		// https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#droptargets
		event.preventDefault();
		if (counter.current === 0) setDragging(true);
		counter.current = counter.current + 1;
	};

	const onDragLeave = (_event: React.DragEvent): void => {
		if (counter.current === 1) setDragging(false);
		counter.current = counter.current - 1;
	};

	const handlers: AppDropState["handlers"] = {
		onDrop,
		onDragEnter,
		onDragLeave,
		onDragOver,
	};

	return { handlers, dragging };
};