import { StateNode } from 'tldraw'
import { createPromptTextbox, createTextbox } from '../components/Textboxes'

export class TextBoxTool extends StateNode {
	static override id = 'textbox'
	static override initial = 'idle'

	override onEnter() {
		this.editor.setCursor({type: 'cross'})
	}

	override onPointerDown() {
		createTextbox(this.editor, 'Text', 'm')
	}
}

export class PromptTextBoxTool extends StateNode {
	static override id = 'prompt'
	static override initial = 'idle'

	override onEnter() {
		this.editor.setCursor({type: 'cross'})
	}

	override onPointerDown() {
		// Add source: 'toolbar'
		createPromptTextbox(this.editor, 'm')
	}
}