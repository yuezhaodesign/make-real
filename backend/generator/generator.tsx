import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


interface LessonPlanInput {
  grade: string;
  subject: string;
  topic: string;
  duration: string;
  learningObjectives: string;
  kbPrinciples: string[];
  classroomContext: string;
}

interface LessonPlanSections {
  learningObjectives: string;
  materialNeeded: string;
  warmUp: string;
  introduction: string;
  activities: string;
  assessment: string;
  wrapUp: string;
}

interface HistoryEntry {
  section: keyof LessonPlanSections;
  previousContent: string;
  newContent: string;
  timestamp: Date;
}

class LessonPlanGenerator {
  private history: HistoryEntry[] = [];

  async generateLessonPlan(input: LessonPlanInput): Promise<LessonPlanSections> {
    const prompt = `You are a teacher designing lesson plans based on the **12 Principles of Knowledge Building** as outlined by the Knowledge Building International community.

    Generate one age-appropriate, engaging, and inclusive lesson plan based on the following inputs:

    - Grade: ${input.grade}
    - Subject: ${input.subject}
    - Topic: ${input.topic}
    - Duration: ${input.duration}
    - Learning Objectives: ${input.learningObjectives}
    - Knowledge Building Principles: ${input.kbPrinciples.join(", ")}
    - Classroom Context: ${input.classroomContext}

    Ensure the lesson plans are interactive, inclusive, and aligned with the selected Knowledge Building principles: ${input.kbPrinciples.join(", ")}.

    Here are some explanations of the Knowledge Building principles:

    1. Real Ideas, Authentic Problems: Starts with a question rooted in real-world biological phenomena; students investigate how traits support survival in actual ecosystems.  
    2. Improvable Ideas: Students revise their explanations during discussions and after peer feedback.  
    3. Idea Diversity: Group work exposes students to a range of traits and environments; discussion encourages exploring multiple perspectives.  
    4. Rise Above: Students synthesize individual trait analyses into broader concepts of natural selection and adaptation.  
    5. Epistemic Agency: Students pose their own questions during group work and choose traits and environments to explore.  
    6. Community Knowledge, Collective Responsibility: Group activities require shared construction of knowledge; class discussion reinforces collective growth.  
    7. Democratizing Knowledge: All students contribute to class discussion and group analysis, recognizing everyone's input.  
    8. Symmetric Knowledge Advancement: Teachers and students co-construct knowledge by investigating misconceptions and evolving understanding together.  
    9. Pervasive Knowledge Building: Homework and extension tasks continue the inquiry beyond the classroom; students reflect on real-life implications.  
    10. Constructive Use of Authoritative Sources: Use of textbooks, videos, and research tasks help students build on reliable sources.  
    11. Knowledge Building Discourse: Discussions encourage sustained idea improvement, questioning, and theory-building.  
    12. Embedded and Transformative Assessment: Ongoing group monitoring, discussions, and peer-sharing ensure assessment drives deeper understanding. 

    Here are one example of lesson plan you can refer to:
    
    Lesson Plan Version A: Fully Integrated with All 12 Knowledge Building Principles 

    Objective: 

    Students will be able to construct an explanation based on evidence that describes how genetic variations of traits in a population increase some individuals' probability of surviving and reproducing in a specific environment. 

    Standards Addressed: 

    NGSS MS-LS4-4: Construct an explanation based on evidence that describes how genetic variations of traits in a population increase some individuals' probability of surviving and reproducing in a specific environment. 
    NGSS MS-ETS1-3: Analyze data from tests to determine similarities and differences among products. 

    Opening (Real Ideas, Authentic Problems; Epistemic Agency; Democratizing Knowledge): 

    Begin with the question: 'Why do some animals survive in certain environments while others do not?' 
    Show a short video highlighting adaptations of various animals in different ecosystems. Then, ask students to jot down at least two questions they have from the video. Use a collaborative board (digital or paper-based) where students post their questions. 
    Facilitate a short discussion on the nature of their questions, emphasizing that many scientific discoveries begin with curiosity about real-world phenomena. 

    Introduction to New Material (Constructive Use of Authoritative Sources; Idea Diversity; Improvable Ideas): 

    Introduce natural selection through a visual story or simulation (e.g., how a population of moths changed color over time). 
    Ask students: 'How might this process look different in another environment?' Encourage diverse perspectives. 
    Explicitly discuss the role of genetic variation, using diverse real-world examples (e.g., beak shapes in finches, fur thickness in arctic animals). 
    Clarify that individuals don't evolve in a lifetime—populations evolve over generations. 
    Discuss multiple sources (videos, diagrams, expert texts) to evaluate what we know and where there are uncertainties. 

    Guided Practice (Community Knowledge; Improvable Ideas; Knowledge Building Discourse; Embedded and Transformative Assessment): 

    In small groups, assign different ecosystems (e.g., tundra, desert, rainforest, urban). Ask each group to: 
    - Identify a trait that could help an organism survive there. 
    - Explain how this trait could affect reproduction. 
    - Use probability language to describe how the trait might spread. 
    Groups then rotate to peer review others' work—suggesting improvements and posing new questions. 
    Ask groups to revise their explanations based on peer feedback. 
    Reinforce collective responsibility for the growth of understanding across the class. 

    Independent Practice (Epistemic Agency; Rise Above; Pervasive Knowledge Building): 

    Each student selects one adaptation and writes a detailed explanation including: 
    - Description of the genetic variation and environmental context 
    - Explanation of how it affects survival and reproduction 
    - A simple probabilistic model (e.g., '60% of the population may survive due to this trait') 
    - A reflection on how their explanation changed after discussions with peers 

    Closing (Rise Above; Knowledge Building Discourse; Symmetric Knowledge Advancement): 

    Have students share their ideas with a peer and then volunteer to present evolving understandings. 
    As a class, co-create a visual map connecting all the traits and ideas discussed. Identify higher-level concepts (e.g., environmental pressure, population shifts). 
    Use this concept map to reflect on how their understanding has deepened through collaboration. 

    Extension (Pervasive Knowledge Building; Real Ideas): 

    Ask students to research a species currently facing environmental change (e.g., polar bears, coral reefs) and describe the adaptations necessary for future survival. 
    They should create a short presentation or infographic, which will be shared with peers for feedback. 

    Homework (Democratizing Knowledge; Embedded Assessment): 

    Read the assigned textbook chapter. Instead of standard questions, students are to write two new questions based on the reading and propose possible answers. 
    These will be used to start the next class's discussion. 

    Generate a detailed lesson plan with the following sections. Format each section using <start> and <end> tags. The format should be as follows:

    <objectives start>${input.learningObjectives}<objectives end>

    <materials start>
    [List the materials needed]
    <materials end>

    <warmup start>
    (1) Opening  
    (2) Warm-up activity  
    (3) Review/ activate prior learning  
    <warmup end>

    <introduction start>
    (1) Directed instruction  
    - Rote (teacher-class)  
    - Recitation (teacher-class or teacher-group)  
    - Instruction/exposition (teacher-class, teacher-group, or teacher-individual)  
    (2) Interactive instruction  
    - Discussion (teacher-class, teacher-group, or pupil-pupil)  
    - Dialogue (teacher-class, teacher-group, teacher-individual, or pupil-pupil)  
    <introduction end>

    <activities start>
    (1) Individual activity/ Independent practice  
    - Complete a worksheet  
    - Do exercises  
    (2) Group activity/ Guided practice  
    - Group discussion  
    - Problem-solving  
    - Scaffolding questions  
    - Experiment  
    - Debate  
    <activities end>

    <assessment start>
    (1) Formative  
    - Self-evaluation  
    - Peer-review  
    - Use questioning  
    - Classroom discussion 
    (2) Summative  
    - Test (multiple-choice questions)  
    - Report/ Essay  
    - Oral exam  
    <assessment end>

    <wrapup start>
    (1) Quick review  
    (2) Exit ticket  
    (3) Reflection  
    - Share in a group or to the whole class  
    - Complete (Online) survey  
    - Assign homework  
    (4) Next steps (Plan for next lesson)  
    <wrapup end>

    Make sure to include all the sections and format them correctly.`;

    console.log("Sending prompt to OpenAI:", prompt); // Log the prompt being sent

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "system", content: prompt }],
      max_tokens: 1000,
    });

   // Log the response from OpenAI but exclude the system prompt
   if (response.choices && response.choices[0].message?.content) {
    console.log("Generated Lesson Plan Content:", response.choices[0].message.content.trim());  // Log only the content without system prompt
  } else {
    console.log("No content received from API response");
  }

  return this.parseLessonPlan(response.choices[0].message.content || "");
}

  private parseLessonPlan(text: string): LessonPlanSections {
    console.log("Parsing Text:", text);  // Log the entire response content
    
    const extractSection = (startTag: string, endTag: string) => {
      const regex = new RegExp(`${startTag}([\\s\\S]*?)${endTag}`, "m");
      const match = text.match(regex);
      console.log(`Extracting ${startTag} -> ${endTag}:`, match ? match[1].trim() : "Not Found");
      return match ? match[1].trim() : "";
    };
  
    return {
      learningObjectives: extractSection("<objectives start>", "<objectives end>"),
      materialNeeded: extractSection("<materials start>", "<materials end>"),
      warmUp: extractSection("<warmup start>", "<warmup end>"),
      introduction: extractSection("<introduction start>", "<introduction end>"),
      activities: extractSection("<activities start>", "<activities end>"),
      assessment: extractSection("<assessment start>", "<assessment end>"),
      wrapUp: extractSection("<wrapup start>", "<wrapup end>"),
    };
  }
}

class LessonPlanRefiner {
  private history: any[] = [];

  // Refine a specific section of the lesson plan based on user input
  async refineSection(
    section: string,
    userPrompt: string,
    currentContent: string
  ): Promise<string> {
    // Create the prompt for OpenAI to refine the section
    const prompt = `Refine the following section of a lesson plan:\n\nCurrent ${section}:\n${currentContent}\n\nUser request: ${userPrompt}\n\nProvide an improved version.`;

    // Log only the relevant parts (section being refined and user request)
    console.log(`Refining "${section}":`, userPrompt);  // Log the section and user request

    // Call the OpenAI API to generate the refined content
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "system", content: prompt }],
      max_tokens: 500,
    });

    // Extract and log the refined content (only relevant information)
    const refinedContent = response.choices[0].message?.content?.trim() || currentContent;
    console.log(`Refined "${section}":`, refinedContent);  // Log the refined content

    // Save the history of changes (for potential future tracking or comparison)
    this.history.push({
      section,
      previousContent: currentContent,
      newContent: refinedContent,
      timestamp: new Date(),
    });

    // Return the refined content to use elsewhere
    return refinedContent;
  }

  // Retrieve the history of refinements (if needed for later use)
  getRefinementHistory(): any[] {
    return this.history;
  }
}

// Usage Example

const lessonPlanGenerator = new LessonPlanGenerator();
const lessonPlanRefiner = new LessonPlanRefiner();

// Lesson Input Data
const lessonInput = {
  grade: "6",
  subject: "Science",
  topic: "Adaptation in Animals",
  duration: "60 minutes",
  learningObjectives: "Understand how genetic variation affects survival in different environments.",
  kbPrinciples: ["Real Ideas, Authentic Problems", "Epistemic Agency", "Community Knowledge, Collective Responsibility"],
  classroomContext: "Class of 30 students, diverse learning needs."
};

// Test Lesson Plan Generation and Refinement
async function testLessonPlan() {
  const plan = await lessonPlanGenerator.generateLessonPlan(lessonInput);
  console.log("Generated Lesson Plan:\n", plan);

  // Test Refinement Feature
  await testRefinement(plan);
}

// Test Refinement Function
async function testRefinement(plan: any) {
  const testSection = "activities";
  const userPrompt = "Make the activity more interactive with a hands-on experiment.";
  const currentContent = plan.activities || "No activities section found.";

  const refinedContent = await lessonPlanRefiner.refineSection(
    testSection,
    userPrompt,
    currentContent
  );

  console.log("\nRefined Activities Section:\n", refinedContent);
  console.log("\nRefinement History:\n", lessonPlanRefiner.getRefinementHistory());
}

// Execute Tests
testLessonPlan();