'use client'

import dynamic from 'next/dynamic'
import 'tldraw/tldraw.css'

import { components, uiOverrides } from './utils/ui-overrides'
import { TextBoxTool, PromptTextBoxTool } from './utils/custom-tools'
import { FrameButtonsUtil } from './components/FrameButtons'
// import { ContainerShapeUtil } from './components/AutoLayoutFrame'

const Tldraw = dynamic(async () => (await import('tldraw')).Tldraw, {
	ssr: false,
})

export default function App() {
	return (
		<div className='editor'>
			<Tldraw persistenceKey='make-real'
				// Pass in the array of custom shape classes
				shapeUtils={[FrameButtonsUtil]}

				// Pass in the array of custom tool classes
				tools={[TextBoxTool, PromptTextBoxTool]}

				// Pass in any overrides to the user interface
				overrides={uiOverrides}

				// Pass in the new Keyboard Shortcuts component
				components={components}
			>
			</Tldraw>
		</div>
	)
}