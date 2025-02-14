import {
	createShapeId,
	Editor,

	// ButtonUtil
	HTMLContainer,
	Rectangle2d,
	ShapeUtil,

	// FrameButtons
	TLBaseShape,
	TLDefaultColorStyle,

	// FrameButtonsProps
	DefaultColorStyle,
	RecordProps,
	T,
	TLShapeId,
} from 'tldraw'

import { createTextbox } from './Textboxes'
import { createFrame } from './Frames'
// import { getSelectionAsText } from '../lib/getSelectionAsText'
import { getTextInFrame } from '../lib/getText'
import { getAiInsights } from '../lib/getAiInsights';
import { designLesson } from '../lib/designLesson';
import { distributeShapes } from '../lib/distributeShapes';

// Create a type for the custom button shape
export type FrameButtons = TLBaseShape<
	'frame-buttons',
	{
		w: number
		h: number
		color: TLDefaultColorStyle
	}
>

// Validate our custom button shape's props, using one of tldraw's default styles
export const FrameButtonsProps: RecordProps<FrameButtons> = {
	w: T.number,
	h: T.number,
	color: DefaultColorStyle,
}

// Define how the buttons behaves and looks
export class FrameButtonsUtil extends ShapeUtil<FrameButtons> {
	static override type = 'frame-buttons' as const
	static override props = FrameButtonsProps

	getDefaultProps(): FrameButtons['props'] {
		return {
			w: 400,
			h: 50,
			color: 'black'
		}
	}

	getGeometry(shape: FrameButtons) {
		return new Rectangle2d({
			width: shape.props.w,
			height: shape.props.h,
			isFilled: true,
		})
	}

	component(shape: FrameButtons) {
		if(shape.meta.frameType == 'information') {
			// Create buttons for the "Information" frame
			if (shape.meta.frameType == 'information') {
				return (
					<HTMLContainer
						style={{
							display: 'flex',
							justifyContent: 'space-evenly',
							marginLeft: '-2.85em',
							width: '400px'
						}}
					>
							{createAddButton(this.editor, '+ Add Category')}
							{createGenerateButton(this.editor, 'generate', shape.id)}
					</HTMLContainer>
				)
			}
			// Create buttons for each "Section" frame
			else if (shape.meta.frameType == 'section') {
				return (
					<HTMLContainer className='button-group group1'>
						{createAddButton(this.editor, '+ Add Activity')}
						{createGenerateButton(this.editor, 're-generate', shape.id)}
					</HTMLContainer>
				)
			}
			// Create buttons for each "Activity" frame
			else if (shape.meta.frameType == 'activity') {
				return (
					<HTMLContainer className='button-group group1'>
						{createAddButton(this.editor, '+ Add Text')}
						{createGenerateButton(this.editor, 're-generate', shape.id)}
					</HTMLContainer>
				)
			}
		}
	}

	indicator(shape: FrameButtons) {
		return
	}
}

function createAddButton(editor: Editor, label: string) {
	return (
		<button className='button add'
			onClick={() => {
				if (label == '+ Add Category') {
					createTextbox(editor, 'Category', 'm')
				}
				else if (label == '+ Add Text') {
					createTextbox(editor, 'Text', 'm')
				}
			}
		}

		onPointerDown={(e) => e.stopPropagation()}
		> {label} </button>
	)
}

function createGenerateButton(editor: Editor, label: string, buttonId: TLShapeId) {
	return (
		<button className='button generate'
			onClick={() => designLesson(editor, label, buttonId)}

			onPointerDown={(e) => e.stopPropagation()}
		> ▶︎ Generate </button>
	)
}

export function createFrameButtons(editor: Editor, frameType: string) {
	// Create an ID for the frame buttons
	const FrameButtonsId: TLShapeId = createShapeId()

	// Assign x and y coordinates to the frame buttons
	let xCoord: number = 0
	let yCoord: number = 0

	if (frameType == 'information') {
		xCoord = 25
		yCoord = 25
	}
	// else if (type == 'lesson plan') {
	// 	editor.createShape({
	// 		id: FrameButtonsId,
	// 		type: 'frame-buttons',
	// 		x: 2025,
	// 		y: 25,
	// 		isLocked: true,
	// 		props: {
	// 			w: 800
	// 		},
	// 		meta: {
	// 			frameType: type
	// 		}
	// 	})
	// }
	else if (frameType == 'section') {
		xCoord = 2050
		yCoord = 225
	}
	else if (frameType == 'activity') {
		xCoord = 2075
		yCoord = 425
	}
	
	// Create frame buttons
	editor.createShape({
		id: FrameButtonsId,
		type: 'frame-buttons',
		x: xCoord,
		y: yCoord,
		isLocked: true,
		props: {
			w: 800
		},
		meta: {
			frameType: frameType
		}
	})
}

export function getFeedback(editor: Editor) {
	console.log('feedback')
}

export function viewHistory(editor: Editor) {
	console.log('history')
}