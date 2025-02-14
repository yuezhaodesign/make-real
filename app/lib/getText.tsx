import { Editor, TLTextShape, TLGeoShape } from "tldraw";
import { getSelectionAsText } from "./getSelectionAsText";
import { getParentAndDescendantIds } from "./getParentAndDescendantIds";

export function getTextInFrame(editor: Editor, buttonId: any) {
	let text: string = ''

	// Get the ids of the descendant shapes in the parent frame of the button
	const descendantShapeIds = getParentAndDescendantIds(editor, buttonId)!.descendants

	// Of the descendant shape(s) in the parent frame, filter for 'text' shapes (textbox labels) and return its text and parent id
	const textboxLabelInfo = Array.from(descendantShapeIds).map( (descendantShapeId) => {
		const shape = editor.getShape(descendantShapeId)!
		return shape
	}).filter((descendantShape) => {
		return (
			descendantShape.type === 'text'
		)
	}).map(shape => {
		return (
			{
				text: (shape as TLTextShape | TLGeoShape).props.text,
				parentId: shape.parentId
			}
		)
	})

	// Of the descendant shape(s) in the parent frame, filter for 'geo' shapes (textboxes) and return its text and parent id
	const textboxInfo = Array.from(descendantShapeIds).map( (descendantShapeId) => {
		const shape = editor.getShape(descendantShapeId)!
		return shape
	}).filter((descendantShape) => {
		return (
			descendantShape.type === 'geo'
		)
	}).map(shape => {
		return (
			{
				text: (shape as TLTextShape | TLGeoShape).props.text || 'N/A',
				parentId: shape.parentId
			}
		)
	})

	// Match the textbox label and the textbox by parent id and return the text in the following form – Label: Text
	for (let x = 0; x < textboxLabelInfo.length; x++) {
		for (let y = 0; y < textboxInfo.length; y++) {
			if (textboxLabelInfo[x].parentId == textboxInfo[y].parentId) {
				text += (`${textboxLabelInfo[x].text}: ${textboxInfo[y].text} \n`)
			}
		
		}
	}

	return text
}

export function getText(editor: Editor, action: string, buttonId: any) {
	if (action == 'generate') {
		getTextInFrame(editor, buttonId)
	}
	else {
		const parentFrame = getParentAndDescendantIds(editor, buttonId)!.parent
		editor.select(parentFrame)
		getSelectionAsText(editor)
		editor.deselect(parentFrame)
	}
}