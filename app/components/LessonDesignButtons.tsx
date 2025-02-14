import {
	TLShapeId,
	useEditor,
	useToasts
}
from 'tldraw'

import { useCallback } from 'react'

import { createFrame } from './Frames'
import { createTextbox } from './Textboxes'
import { createFrameButtons } from './FrameButtons'
// import { createAutoLayoutFrame } from './AutoLayoutFrame'

export function LoadTemplateButton() {
	const editor = useEditor()
	const { addToast } = useToasts()

	const loadTemplate = useCallback(async () => {
		try {
			// createAutoLayoutFrame(editor, 'information')

			// Create the "Information" frame
			createFrame(editor, 'Information', 'information', 0, 0)
			
			// Create the buttons ("Add Category" and "Generate") for the "Information" frame
			createFrameButtons(editor, 'information')
			
			// Define the provided categories and their respective textbox sizes
			const informationCategories = {
				'Grade': 's',
				'Subject': 's',
				'Lesson Title/Topic': 'm',
				'Duration': 'm',
				'Lesson Objectives': 'l'
			}
			
			// Create a text box for each of the provided "Information" categories
			Object.entries(informationCategories).forEach(([category, size]) => {
				createTextbox(editor, category, size, 'information')
			});
			
			createTextbox(editor, 'Prompt', 'm', undefined, 'info')
		}
		catch (e) {
			addToast({
				icon: 'warning-triangle',
				title: 'Something went wrong',
				description: (e as Error).message.slice(0, 100),
			})
		}
	}, [editor, addToast])

	return (
		<button className='button' onClick={loadTemplate}> Load Template </button>
	)
}