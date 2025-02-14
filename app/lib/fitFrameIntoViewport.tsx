import { Editor, TLShapeId } from "tldraw"

export function fitFrameIntoViewPort (editor: Editor, frameId: TLShapeId) {
	// Fit the frame into the viewport
	editor.select(frameId)
	editor.zoomToSelection()
	editor.deselect(frameId)
}