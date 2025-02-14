import ollama from 'ollama/browser'
import {
	LESSON_DESIGN_SYSTEM_PROMPT,
	LESSON_DESIGN_USER_PROMPT
}
from '../AI/prompts'

import {
	createShapeId,
	Editor,
} from 'tldraw'
import { EXAMPLE_LESSON_PLAN } from '../AI/tests'
import { createTextbox, createTextboxLabel } from '../components/Textboxes'
import { distributeShapes } from './distributeShapes'

export async function getAiInsights(editor: Editor, action: string, content: string) {
	try {
		if (action == 'generate') {
			const AiResponse = EXAMPLE_LESSON_PLAN
			// // useAiApi(LESSON_DESIGN_SYSTEM_PROMPT, `${LESSON_DESIGN_USER_PROMPT}\n${content}`)
			
			let descriptionList: any = []
			let activityList: any = []

			parseAiResponse(editor, AiResponse).forEach((response: any) => {
				let sectionTitle = response.sectionTitle
				let sectionDescriptions = response.sectionDescriptions
				let sectionActivities = response.sectionActivities
				let sectionDescriptionTextboxId
				let sectionActivityTextboxId
				
				let sectionTitleId = createTextboxLabel(editor, 1500, 0, sectionTitle, 'red')

				//  For sections that have an "Activity" heading
				if (sectionActivities) {
					let activityGroupId = createShapeId()
					// for (let i = 0; i < sectionActivities.length; i++) {
					// 	let sectionActivityTitle = sectionActivities[i].activityTitle
					// 	let sectionActivityDescriptions = sectionActivities[i].activityDescriptions

					// 	sectionActivityTextboxId = createTextbox(editor, sectionActivityTitle, 'l', 'lesson plan', sectionActivityDescriptions)
						
					// 	activityList.push(sectionActivityTextboxId)
					// }
					// console.log(activityList)

					sectionActivities.forEach((activity: any) => {
						let sectionActivityTitle = activity.activityTitle
						let sectionActivityDescriptions = activity.activityDescriptions
						
						sectionActivityTextboxId = createTextbox(editor, sectionActivityTitle, 'l', 'lesson plan', sectionActivityDescriptions)

						// editor.groupShapes([sectionTitleId, sectionActivityTextboxId!], {
						// 	groupId: activityGroupId,
						// 	select: false
						// })
						
						// // Distribute the section title in relation to the activities in the section
						// distributeShapes(editor, [sectionTitleId, sectionActivityTextboxId])
						
					})
					// activityList.push(sectionActivityTextboxId)
					// console.log(activityList)

					// Distribute all sections in relation to each other
					// distributeShapes(editor, activityList)
				}
				// For sections that have descriptions, but no "Activity" heading
				else if (!sectionActivities && sectionDescriptions) {
					let sectionGroupId = createShapeId()
					sectionDescriptionTextboxId = createTextbox(editor, 'Description', 'l', 'lesson plan', sectionDescriptions)
					
					editor.groupShapes([sectionTitleId, sectionDescriptionTextboxId!], {
						groupId: sectionGroupId,
						select: false
					})
	
					// Distribute the section title in relation to the description(s) of the section
					distributeShapes(editor, [sectionTitleId, sectionDescriptionTextboxId])
					
					descriptionList.push(sectionGroupId)
				}

				// Distribute all sections in relation to each other
				distributeShapes(editor, descriptionList)
				// distributeShapes(editor, activityList)
			})
		}
		else if (action == 'collaborate') {

		}
	}
	catch {
		console.log('Error')
	}
}

async function useAiApi(systemPrompt: string, userPrompt: string) {
	const response = await ollama.chat({
		model: 'llama3.1',
		messages: [
			{
				role: 'system',
				content: systemPrompt
			},
			{
				role: 'user',
				content: userPrompt
			}
		],
	})

	// return response.message.content
	console.log(response.message.content)
}

function parseAiResponse(editor: Editor, response: string)
// (response: Promise<string>)
{	
	let sectionInformationList: any = []
	let activityGroupsList: any = []
	let sectionTitle: string = ''
	let sectionTitleId

	// Get all sections of the lesson plan
	const sections = response.trim().split(/(?=# Section)/).map(section => section.trim())

	// For each section of the lesson plan:
	sections.forEach(section => {
		let sectionActivities: any = []
		let sectionAndActivitiesList: any = []
		let activityGroupId
		let sectionGroupIdList: any = []

		let sectionAndActivities = section.split(/(?=## Activity)/)

		// If the section has an "Activity" heading
		if (sectionAndActivities.length > 1) {
			// Get its title
			sectionTitle = sectionAndActivities[0].replace('# ', '').replace('\n', '')
			sectionTitleId = createTextboxLabel(editor, 1500, 0, sectionTitle, 'red')
			sectionAndActivitiesList.push(sectionTitleId)

			// Get all activities and its information (title and description)
			sectionAndActivities.slice(1).forEach(sectionActivity => {
				let activities = sectionActivity.split(/## (.*?)(?=\n|$)/).slice(1)
				
				let activityTitle = activities[0]
				if (activityTitle.includes('"')) {
					activityTitle = activityTitle.replaceAll('"', '')
				}

				let activityDescriptions = activities[1]
				
				
				// let activityDescriptionTextboxId = createTextbox(editor, activityTitle, 'l', 'lesson plan', activityDescriptions)
				// sectionAndActivitiesList.push(activityDescriptionTextboxId)
				
				// activityGroupId = createShapeId()
				
				let activityInfo = {
						activityTitle: activityTitle,
						activityDescriptions: activityDescriptions
				}
				
				sectionActivities.push(activityInfo)
			})
			
			// activityGroupsList.push(activityGroupId)
			
			// distributeShapes(editor, sectionAndActivitiesList)
			
			// editor.groupShapes(sectionAndActivitiesList, {
			// 	groupId: activityGroupId,
			// 	select: false
			// })
			
			// distributeShapes(editor, activityGroupsList)
			
			sectionInformationList.push({
				sectionTitle: sectionTitle,
				sectionActivities
			})
		}
		// If the section doesn't have an "Activity" heading
		else {
			let sectionDescriptions: string = ''
			// let sectionGroupIdList: any = []

			sectionAndActivities.forEach(section => {
				let sectionItems = section.split('\n')
				// let sectionDescriptionTextboxId
				// let sectionGroupId = createShapeId()

				for (let i = 0; i < sectionItems.length; i++) {
					if (sectionItems[i].startsWith('# Section')) {
						sectionTitle = sectionItems[i].replace('# ', '')
					}
					else if (sectionItems[i].startsWith('-')) {
						if (i != (sectionItems.length - 1)) {
							sectionDescriptions += `${sectionItems[i]}\n`
						}
						else {
							sectionDescriptions += sectionItems[i]
						}
					}
				}
				// sectionGroupIdList.push(sectionGroupId)
				// sectionTitleId = createTextboxLabel(editor, 1500, 0, sectionTitle, 'red')
				// sectionDescriptionTextboxId = createTextbox(editor, 'Description', 'l', 'lesson plan', sectionDescriptions)

				// editor.groupShapes([sectionTitleId, sectionDescriptionTextboxId!], {
				// 	groupId: sectionGroupId,
				// 	select: false
				// })
				// distributeShapes(editor, sectionGroupIdList)

				sectionInformationList.push({
					sectionTitle: sectionTitle,
					sectionDescriptions: sectionDescriptions
				})

			})
		}
	})
	
	editor.zoomToBounds({
		x: 2000,
		y: 0,
		w: 500,
		h: 1500
	})
	
	return sectionInformationList
}