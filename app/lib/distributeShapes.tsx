import {
	TLShapeId,
	Editor, 
} from "tldraw";
import { getParentAndDescendantIds } from "./getParentAndDescendantIds";

export function distributeShapes(editor: Editor, shapeIdList?: any, buttonId?: any, gap?: number) {
	const distance = gap ? gap : 30
	if (shapeIdList && !buttonId) {
		stackAndAlignShapes(editor, shapeIdList)
	}
	else if (buttonId && !shapeIdList) {
		// Get the ids of the descendant shapes in the parent frame of the button
		const descendantShapeIds = getParentAndDescendantIds(editor, buttonId)!.descendants
		
		// Get an array of the ids of the descendent shape(s) in the parent frame that are grouped shapes
		const informationCategories = Array.from(descendantShapeIds).map( (descendantShapeId) => {
			const descendantShape = editor.getShape(descendantShapeId)!
			return descendantShape
		})
		.filter((shape) => {
			return (shape.type === 'group')
		}).map((groupedShape) => {
			return(groupedShape.id)
		})
		
		stackAndAlignShapes(editor, informationCategories, distance)
	}
}

function stackAndAlignShapes(editor: Editor, shapes: TLShapeId[], gap?: number) {
	const stackOperation = 'vertical'
	gap = gap ? gap : 30
	const alignOperation = 'left'

	editor.stackShapes(shapes, stackOperation, gap)
	editor.alignShapes(shapes, alignOperation)
}