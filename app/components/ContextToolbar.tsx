import {
	TldrawUiIcon,
	track,
	useEditor,
	Editor,
} from 'tldraw'

import 'tldraw/tldraw.css'

import {
	IconSquarePlus2,
	IconMessageBolt,
	IconZoomInArea,
	IconCopyPlus,
	IconTrash
} from '@tabler/icons-react';

import { createPromptTextbox, createPromptReponseTextbox, createTextbox } from './Textboxes'

const defaultTextboxToolbarActions = [
	// {
	// 	title: 'Add to Lesson Plan',
	// 	icon: '⬆️'
	// },
	{
		title: 'Add Textbox',
		icon: <IconSquarePlus2 stroke={2} />
	},
	{
		title: 'Collaborate with AI', 
		icon: <IconMessageBolt stroke={2} />
	},
	// {
		// 	title: 'Re-generate Text',
		// 	icon: '🔄'
		// },
		// {
			// 	title: 'Get Feedback',
			// 	icon: '✅'
			// },
	{
		title: 'Zoom In', 
		icon: <IconZoomInArea stroke={2} />
	},
	{
		title: 'Duplicate', 
		icon: <IconCopyPlus stroke={2} />
	},
	{
		title: 'Delete',
		// icon: '🗑️'
		icon: <IconTrash color='#E03131' stroke={2} />
	}
] as const

const promptTextboxToolbarActions = [
	{
		title: 'Send',
		icon: '➡️'
	}
]

// Reference: https://tldraw.dev/examples/ui/context-toolbar
export const ContextToolbar = track(() => {
	const editor = useEditor()
	
	const showToolbar = editor.isIn('select.idle')
	if (!showToolbar) return null

	const selectionRotatedPageBounds = editor.getSelectionRotatedPageBounds()
	if (!selectionRotatedPageBounds) return null
	const pageCoordinates = editor.pageToViewport(selectionRotatedPageBounds.point)

	// If the selected shape is in the "Information" frame or if the shape is NOT a grouped shape, don't add context toolbar to it
	const selectedShape = editor.getOnlySelectedShape()!
	if (selectedShape) {
		const inInformationFrame = editor.getShape((selectedShape?.parentId!))?.meta?.name == 'Information'
		if (inInformationFrame) return null
	}
	else {
		return null
	}
	// const isGroupShape = editor.getShape(selectedShape)?.type == 'group'
	// if (!isGroupShape) return null
	
	const isPromptTextbox = editor.getShape(selectedShape)?.meta?.textboxType == 'Prompt'

	// TODO: refactor (simplify code)
	if (!isPromptTextbox) {
		return (
			<div
				style={{
					position: 'absolute',
					pointerEvents: 'all',
					top: pageCoordinates.y - 42,
					left: pageCoordinates.x,
					width: selectionRotatedPageBounds.width * editor.getZoomLevel(),
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}

				onPointerDown={(e) => e.stopPropagation()}
			>
				<div
					style={{
						borderRadius: 8,
						display: 'flex',
						boxShadow: '0 0 0 1px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.1)',
						background: 'var(--color-panel)',
						width: 'fit-content',
						alignItems: 'center',
					}}
				>
	
					{defaultTextboxToolbarActions.map(({ title, icon }) => {
						return (
							<div
								key={title}
								title={title}
								className='context-toolbar'
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									height: 36,
									width: 36,
									background: 'transparent',
									cursor: 'pointer',
									fontSize: '1.5em',
								}}
								onClick={() => {
									const selectedShape = editor.getSelectedShapeIds()[0]
									
									if (title == 'Add Textbox') {
										// TODO: fix such that new textbox is to the right of the selected textbox
										createTextbox(editor, 'Text', 'm')
									}
									// else if (title == 'Add to Lesson Plan') {
									// 	console.log('add')
									// }
									else if (title == 'Collaborate with AI') {
										createPromptTextbox(editor, 'm')
										// TODO: get text in shape
										// TODO: send text to API
										// TODO: createPromptResponseTextbox
									}
									// else if (title == 'Re-generate Text') {
									// 	console.log('re-gen')
									// }
									// else if (title == 'Get Feedback') {
									// 	console.log('feedback')
									// }
									else if (title == 'Zoom In') {
										editor.zoomToSelection()
									}
									else if (title == 'Duplicate') {
										editor.duplicateShapes([selectedShape],
											{
												x: 150,
												y: 150
											}
										)
									}
									else if (title == 'Delete') {
										editor.deleteShape(selectedShape)
										// Toolbar doesn't show up when selected multiple items
									}
								}}
							> {icon} </div>
						)
					})}
				</div>
			</div>
		)

	}
	else {
		return (
			<div
				style={{
					position: 'absolute',
					pointerEvents: 'all',
					top: pageCoordinates.y - 42,
					left: pageCoordinates.x,
					width: selectionRotatedPageBounds.width * editor.getZoomLevel(),
					display: 'flex',
					justifyContent: 'flex-end',
					alignItems: 'center',
				}}

				onPointerDown={(e) => e.stopPropagation()}
			>
				<div
					style={{
						borderRadius: 8,
						display: 'flex',
						boxShadow: '0 0 0 1px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.1)',
						background: 'var(--color-panel)',
						width: 'fit-content',
						alignItems: 'center',
					}}
				>
					{promptTextboxToolbarActions.map(({ title, icon }) => {
						return (
							<div
								key={title}
								title={title}
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									height: 36,
									width: 36,
									background: 'transparent',
									cursor: 'pointer',
									fontSize: '1.5em'
								}}
								onClick={() => {
										if (title == 'Send') {
											createPromptReponseTextbox(editor, 'l', undefined, 'Qui deserunt magna enim ad. Ad magna dolor mollit ad nostrud.')
										}
									}
								}
							> {icon} </div>
						)
					})}
				</div>
			</div>
		)
	}
})