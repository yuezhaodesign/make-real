import {
	DefaultKeyboardShortcutsDialog,
	DefaultKeyboardShortcutsDialogContent,
	DefaultToolbar,
	DefaultToolbarContent,
	TLComponents,
	TLUiOverrides,
	TldrawUiMenuItem,
	useIsToolSelected,
	useTools,
} from 'tldraw'
import { LoadTemplateButton } from '../components/LessonDesignButtons'
import { ContextToolbar } from '../components/ContextToolbar'

export const uiOverrides: TLUiOverrides = {
	tools(editor, tools) {
		// Create the "Textbox" tool
		tools.textbox = {
			id: 'textbox',
			icon: 'color',
			label: 'Textbox',
			kbd: 't',
			onSelect: () => {
				editor.setCurrentTool('textbox')
			},
		},
		// Create the "Prompt Textbox" tool
		tools.prompt = {
			id: 'prompt',
			icon: 'group',
			label: 'Prompt Textbox',
			kbd: 'p',
			onSelect: () => {
				editor.setCurrentTool('prompt')
			}
		}
		
		return tools
	},
}

export const components: TLComponents = {
	Toolbar: (props) => {
		const tools = useTools()
		const isTextboxSelected = useIsToolSelected(tools['textbox'])
		const isPromptTextboxSelected = useIsToolSelected(tools['prompt'])

		return (
			<DefaultToolbar {...props}>
				<TldrawUiMenuItem {...tools['textbox']} isSelected={isTextboxSelected} />
				<TldrawUiMenuItem {...tools['prompt']} isSelected={isPromptTextboxSelected} />
				<DefaultToolbarContent />
			</DefaultToolbar>
		)
	},
	KeyboardShortcutsDialog: (props) => {
		const tools = useTools()
		return (
			<DefaultKeyboardShortcutsDialog {...props}>
				<TldrawUiMenuItem {...tools['textbox']} />
				<TldrawUiMenuItem {...tools['prompt']} />
				<DefaultKeyboardShortcutsDialogContent />
			</DefaultKeyboardShortcutsDialog>
		)
	},
	SharePanel: LoadTemplateButton,
	InFrontOfTheCanvas: ContextToolbar
}