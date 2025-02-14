import {
	createShapeId,
	Editor,
	TLShapeId
}
from "tldraw"

import { fitFrameIntoViewPort } from "../lib/fitFrameIntoViewport"

export function createFrame (editor: Editor, label: string, type: string, x: number, y: number) {
	// Create an ID for the frame
	const frameId: TLShapeId = createShapeId()
	let xCoord: number = 0
	let yCoord: number = 0
	let width: number = 0
	let height: number = 0
	let gap: number = 2000

	if (type == 'information') {
		xCoord = x
		yCoord = y
		width = 1250
		height = 1000
	}
	else if (type == 'lesson plan') {
		xCoord = x
		yCoord = y
		width = 1250
		height = 1000
	}
	else if (type == 'section') {
		xCoord = x
		yCoord = y
		width = 1250
		height = 1250
	}

	// Create the frame
	editor.createShape({
		id: frameId,
		type: 'frame',
		x: xCoord,
		y: yCoord,
		props: {
			w: width,
			h: height,
		},
		meta: {
			name: label,
		}
	})

	if (type == 'information') {
		// Fit the frame into the viewport
		fitFrameIntoViewPort(editor, frameId)
	}
}