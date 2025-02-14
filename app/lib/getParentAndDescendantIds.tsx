import {
	Editor,
	TLShapeId
} from "tldraw";

export function getParentAndDescendantIds(editor: Editor, buttonId:TLShapeId) {
	// Get the id of the parent frame that the button is located in
	const parentFrameId = editor.findShapeAncestor(buttonId, (parentShape) => parentShape.type === 'frame')!.id
	
	if (parentFrameId) {
		// Get the ids of the descendant shape(s) in the parent frame
		const descendantShapeIds = editor.getShapeAndDescendantIds([parentFrameId])
		
		return {
			parent: parentFrameId,
			descendants: descendantShapeIds
		}
	}
}