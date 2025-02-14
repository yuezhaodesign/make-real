import {
	Editor,
	createShapeId,

	TLBaseShape,
	HTMLContainer,
	ShapeUtil,
	RecordProps,
	T,
	Rectangle2d
} from "tldraw";

const CONTAINER_PADDING = 24

export type ContainerShape = TLBaseShape<
	'element',
	{
		height: number,
		width: number 
	}
>

export class ContainerShapeUtil extends ShapeUtil<ContainerShape> {
	static override type = 'container' as const
	static override props: RecordProps<ContainerShape> = { height: T.number, width: T.number }

	override getDefaultProps() {
		return {
			width: 100 + CONTAINER_PADDING * 2,
			height: 100 + CONTAINER_PADDING * 2,
		}
	}

	override canBind({
		fromShapeType,
		toShapeType,
		bindingType,
	}: {
		fromShapeType: string
		toShapeType: string
		bindingType: string
	}) {
		return fromShapeType === 'container' && toShapeType === 'element' && bindingType === 'layout'
	}
	// override canEdit() {
	// 	return false
	// }
	override canResize() {
		return true
	}
	// override hideRotateHandle() {
	// 	return true
	// }
	// override isAspectRatioLocked() {
	// 	return true
	// }

	override getGeometry(shape: ContainerShape) {
		return new Rectangle2d({
			width: shape.props.width,
			height: shape.props.height,
			isFilled: true,
		})
	}

	override component(shape: ContainerShape) {
		// TODO: change to default frame
		return (
			<HTMLContainer
				style={{
					backgroundColor: '#efefef',
					width: shape.props.width,
					height: shape.props.height,
				}}
			/>
		)
	}

	override indicator(shape: ContainerShape) {
		return
		// <rect width={shape.props.width} height={shape.props.height} />
	}
}

export function createAutoLayoutFrame (editor: Editor, label: string) {
	// Create an ID for the frame
	const frameId = createShapeId()

	if (label == 'information') {
		editor.createShape({
			id: frameId,
			type: 'container'
		})
	}
}