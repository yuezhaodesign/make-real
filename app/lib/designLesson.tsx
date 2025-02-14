import {
	Editor,
	TLShapeId
} from 'tldraw'

import { getTextInFrame } from './getText'
import { getAiInsights } from './getAiInsights'
import { getSelectionAsText } from './getSelectionAsText'
import { createFrame } from '../components/Frames'

export function designLesson(editor: Editor, action: string, buttonId: TLShapeId) {
	if (action == 'generate') {
		// Create a frame for the lesson plan
		createFrame(editor, 'Lesson Plan', 'lesson plan', 0, 1250)

		// Get all text in the "Information" frame
		const informationContent = getTextInFrame(editor, buttonId)
		
		// Prompt the LLM to design a lesson based on the text in the "Information" frame
		getAiInsights(editor, action, informationContent)
	}
	else if (action == 're-generate') {
		console.log('re-generate')
	}
	else if (action == 'collaboration') {
		console.log('collab')
	}
}