import {
	Editor,
	TLShapeId,
	createShapeId,
} from 'tldraw'

import { distributeShapes } from '../lib/distributeShapes'

const labelColor = 'black'
const userTextboxColor = 'black'
const promptTextboxColor = 'light-blue'
const promptResponseTextboxColor = 'light-green'

const xCoord: number = 25,
	yTextboxLabelCoord: number = 125,
	yTextboxCoord: number = 155

const gap: number = yTextboxCoord - yTextboxLabelCoord,
	distance: number = 200,
	lessonPlanXCoord: number = 1500,
	lessonPlanYCoord: number = 30,
	growYCoord: number = 0,
	smallTextBoxWidth: number = 250, smallTextBoxHeight: number = 60,
	mediumTextBoxWidth: number = 350, mediumTextBoxHeight: number = smallTextBoxHeight,
	largeTextBoxWidth: number = 450, largeTextBoxHeight: number = 120

const gradeTextboxId: TLShapeId = createShapeId(),
	subjectTextboxId: TLShapeId = createShapeId(),
	lessonTitleTextboxId: TLShapeId = createShapeId(),
	durationTextboxId: TLShapeId = createShapeId(),
	lessonObjectivesTextboxId: TLShapeId = createShapeId()

export function createTextboxLabel(editor: Editor, x: number, y: number, label: string, color?: string) {
	// Create an ID for the text box label
	const textboxLabelId: TLShapeId = createShapeId()

	// Create the text box label
	editor.createShape({
		id: textboxLabelId,
		type: 'text',
		x: x,
		y: y,
		props: {
			color: color ? color : labelColor,
			font: 'draw',
			size: 's',
			textAlign: 'start',
			text: label
		}
	})

	return textboxLabelId
}

export function createTextboxArea(editor: Editor, x: number, y: number, size: string, color?: string, text?: string) {
	// Create an ID for the text box area
	const textboxAreaId: TLShapeId = createShapeId()

	// Create the small text box area
	if (size == 's') {
		editor.createShape({
			id: textboxAreaId,
			type: 'geo',
			x: x,
			y: y,
			props: {
				align: 'start',
				color: color ? color : userTextboxColor,
				dash: 'draw',
				fill: 'solid',
				font: 'draw',
				geo: 'rectangle',
				growY: growYCoord,
				size: 's',
				verticalAlign: 'start',
				w: smallTextBoxWidth,
				h: smallTextBoxHeight,
				text: text ? text : ''
			}
		})
	}
	// Create the medium text box
	else if (size == 'm') {
		editor.createShape({
			id: textboxAreaId,
			type: 'geo',
			x: x,
			y: y,
			props: {
				align: 'start',
				color: color ? color : userTextboxColor,
				dash: 'draw',
				fill: 'solid',
				font: 'draw',
				geo: 'rectangle',
				growY: growYCoord,
				size: 's',
				verticalAlign: 'start',
				w: mediumTextBoxWidth,
				h: mediumTextBoxHeight,
				text: text ? text : ''
			}
		})
	}
	// Create the large text box
	else {
		editor.createShape({
			id: textboxAreaId,
			type: 'geo',
			x: x,
			y: y,
			props: {
				align: 'start',
				color: color ? color : userTextboxColor,
				dash: 'draw',
				fill: 'solid',
				font: 'draw',
				geo: 'rectangle',
				growY: 25,
				size: 's',
				verticalAlign: 'start',
				w: largeTextBoxWidth,
				h: largeTextBoxHeight,
				text: text ? text : ''
			}
		})
	}

	return textboxAreaId
}

export function createTextbox(editor: Editor, label: string, size: string, source?: string, text?: string) {
	const TextboxId: TLShapeId = createShapeId()

	let textboxLabel: TLShapeId
	let textboxArea: TLShapeId
	let selectedShapeId: TLShapeId
	let selectedShapeTextboxAreaId: any

	if (source) {
		// Create text boxes for the "Information" section
		if (source == 'information') {
			if (label != 'Prompt') {
				textboxLabel = createTextboxLabel(editor, xCoord, yTextboxLabelCoord, label)
				textboxArea = createTextboxArea(editor, xCoord, yTextboxCoord, size, userTextboxColor)
	
				// Select and group the text box and its label
				if (label == 'Grade') {
					editor.groupShapes([textboxLabel, textboxArea], {
						groupId: gradeTextboxId,
						select: false
					})
				}
				else if (label == 'Subject') {
					editor.groupShapes([textboxLabel, textboxArea], {
						groupId: subjectTextboxId,
						select: false
					})
				}
				else if (label == 'Lesson Title/Topic') {
					editor.groupShapes([textboxLabel, textboxArea], {
						groupId: lessonTitleTextboxId,
						select: false
					})
				}
				else if (label == 'Duration') {
					editor.groupShapes([textboxLabel, textboxArea], {
						groupId: durationTextboxId,
						select: false
					})
				}
				else if (label == 'Lesson Objectives') {
					editor.groupShapes([textboxLabel, textboxArea], {
						groupId: lessonObjectivesTextboxId,
						select: false
					})
				}
			}
			// Distribute all shapes in the "Information" section
			let informationTextboxIds = [gradeTextboxId, subjectTextboxId, lessonTitleTextboxId, durationTextboxId, lessonObjectivesTextboxId]
			distributeShapes(editor, informationTextboxIds)
		}
		else if (source == 'lesson plan') {
			if ((label.startsWith('Description')) || (label.startsWith('Activity'))) {
				const contentTextboxId = createShapeId()

				textboxLabel = createTextboxLabel(editor, lessonPlanXCoord, lessonPlanYCoord + gap, label)
				textboxArea = createTextboxArea(editor, lessonPlanXCoord, lessonPlanYCoord + (gap * 2), size, promptResponseTextboxColor, text)
	
				editor.groupShapes([textboxLabel, textboxArea], {
					groupId: contentTextboxId,
					select: false
				})

				return contentTextboxId
			}
		}
		else if (source == 'toolbar') {
			if (label == 'Prompt') {
				const { currentPagePoint } = editor.inputs
				const promptTextboxIdToolbar = createShapeId()

				textboxLabel = createTextboxLabel(editor, currentPagePoint.x, currentPagePoint.y, label)
				textboxArea = createTextboxArea(editor, currentPagePoint.x, currentPagePoint.y + gap, size, promptTextboxColor)

				// Change the tool back to 'Select'
				editor.setCurrentTool('select')

				// Select and group the text box and its label
				editor.groupShapes([textboxLabel, textboxArea], {
					groupId: promptTextboxIdToolbar,
					select: true
				})

				// Lock the "Prompt" label
				editor.toggleLock([textboxLabel])

				// Add metadata about textbox type
				editor.updateShape({
					id: promptTextboxIdToolbar,
					type: 'group',
					meta: {
						textboxType: 'Prompt'
					}
				})

				// editor.setEditingShape(textboxArea)
			}
		}
	}
	else {
		if (
			(label == 'Category') ||
			(label == 'Text')
		) {
			// Retrieve the coordinates of where the cursor has been clicked on the editor
			const { currentPagePoint } = editor.inputs

			textboxLabel = createTextboxLabel(editor, currentPagePoint.x, currentPagePoint.y, label)
			textboxArea = createTextboxArea(editor, currentPagePoint.x, currentPagePoint.y + gap, size, userTextboxColor)

			// Change the tool back to 'Select'
			editor.setCurrentTool('select')

			// Select and group the text box and its label
			editor.groupShapes([textboxLabel, textboxArea], {
				groupId: TextboxId,
				select: true
			})
			// editor.zoomToSelection()

			// // Select the text box for editing
			// editor.setEditingShape(textboxArea)
		}
		else if (label == 'Prompt') {
			const promptTextboxId = createShapeId()
			const arrowId = createShapeId()

			selectedShapeId = editor.getOnlySelectedShapeId()!

			if (selectedShapeId) {
				const {maxX, minY} = editor.getSelectionPageBounds()!
	
				editor.getShapeAndDescendantIds([selectedShapeId]).forEach((shapeId) => {
					if (editor.getShape(shapeId)?.type == 'geo') {
						selectedShapeTextboxAreaId = shapeId
					}
				})
	
				textboxLabel = createTextboxLabel(editor, maxX + distance, minY, label)
				textboxArea = createTextboxArea(editor, maxX + distance, minY + gap, size, promptTextboxColor)
	
				// Select and group the text box and its label
				editor.groupShapes([textboxLabel, textboxArea], {
					groupId: promptTextboxId,
					select: false
				})
				
				// Lock the "Prompt" label
				editor.toggleLock([textboxLabel])
	
				// Add metadata about textbox type
				editor.updateShape({
					id: promptTextboxId,
					type: 'group',
					meta: {
						textboxType: 'Prompt'
					}
				})
				
				// Create an arrow to connect the two textboxes
				// Reference: https://stackblitz.com/edit/vitejs-vite-313x9m?file=src%2FApp.tsx
				editor.createShape({
					id: arrowId,
					type: 'arrow',
				})
	
				editor.createBindings([
					{
						type: 'arrow',
						fromId: arrowId,
						toId: selectedShapeTextboxAreaId,
						props: {
							terminal: 'start',
							normalizedAnchor: { x: 0.5, y: 0.5 },
							isExact: false,
							isPrecise: true
						},
					},
					{
						type: 'arrow',
						fromId: arrowId,
						toId: textboxArea,
						props: {
							terminal: 'end',
							normalizedAnchor: { x: 0.5, y: 0.5 },
							isExact: false,
							isPrecise: true
						},
					},
				])
	
				// Select the text box for editing
				editor.setEditingShape(textboxArea)
				
				setTimeout(() => {
					editor.zoomToSelection()
				}, 25);
			}
			else {
				// TODO: Fix
				if (text == 'info') {
					textboxLabel = createTextboxLabel(editor, xCoord + (mediumTextBoxWidth * 1.75), yTextboxLabelCoord, label)
					textboxArea = createTextboxArea(editor, xCoord + (mediumTextBoxWidth * 1.75), yTextboxCoord, size, promptTextboxColor)
					
					// Select and group the text box and its label
					editor.groupShapes([textboxLabel, textboxArea], {
						groupId: promptTextboxId,
						select: false
					})
					
					// Lock the "Prompt" label
					editor.toggleLock([textboxLabel])
					
					// Add metadata about textbox type
					editor.updateShape({
						id: promptTextboxId,
						type: 'group',
						meta: {
							textboxType: 'Prompt'
						}
					})
				}
			}
		}
		else if (label == 'Response') {
			const promptResponseTextboxId: TLShapeId = createShapeId()
			const arrowId: TLShapeId = createShapeId()

			const {maxX, minY} = editor.getSelectionPageBounds()!
			selectedShapeId = editor.getOnlySelectedShapeId()!

			editor.getShapeAndDescendantIds([selectedShapeId]).forEach((shapeId) => {
				if (editor.getShape(shapeId)?.type == 'geo') {
					selectedShapeTextboxAreaId = shapeId
				}
			})

			textboxLabel = createTextboxLabel(editor, maxX + distance, minY, label)

			// TODO: text for textbox area needs to get retrieved from getAiInsights()
			textboxArea = createTextboxArea(editor, maxX + distance, minY + gap, size, promptResponseTextboxColor, text!)

			// Select and group the text box and its label
			editor.groupShapes([textboxLabel, textboxArea], {
				groupId: promptResponseTextboxId,
				select: false
			})

			// Lock the "Response" label
			editor.toggleLock([textboxLabel])

			// Add metadata about textbox type
			editor.updateShape({
				id: promptResponseTextboxId,
				type: 'group',
				meta: {
					textboxType: 'Response'
				}
			})

			// Create an arrow to connect the two textboxes
			editor.createShape({
				id: arrowId,
				type: 'arrow',
			})

			editor.createBindings([
				{
					type: 'arrow',
					fromId: arrowId,
					toId: selectedShapeTextboxAreaId,
					props: {
						terminal: 'start',
						normalizedAnchor: { x: 0.5, y: 0.5 },
						isExact: false,
						isPrecise: true
					},
				},
				{
					type: 'arrow',
					fromId: arrowId,
					toId: textboxArea,
					props: {
						terminal: 'end',
						normalizedAnchor: { x: 0.5, y: 0.5 },
						isExact: false,
						isPrecise: true
					},
				},
			])

			editor.select(textboxArea)
			editor.zoomToSelection()
			editor.deselect(textboxArea)
		}
	}
}

export function createPromptTextbox(editor: Editor, size: string, source?: string, text?: string) {
	createTextbox(editor, 'Prompt', size, source!, text!)
}

export function createPromptReponseTextbox(editor: Editor, size: string, source?: string, text?: string) {
	createTextbox(editor, 'Response', size, source!, text!)
	console.log(text)
}