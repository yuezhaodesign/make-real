import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Debug log to verify the API key is loaded
console.log("OpenAI API Key:", process.env.OPENAI_API_KEY ? "Loaded" : "Missing");

// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory store to keep track of conversation state
interface ConversationState {
  initialInputs: LessonPlanRequest;
  lessonPlan: string;
  history: Array<{
    role: string;
    content: string;
    timestamp: string;
  }>;
}

const conversationState = new Map<string, ConversationState>();

// Define the LessonPlanRequest interface
interface LessonPlanRequest {
  grade: string;
  subject: string;
  topic: string;
  duration: string;
  learningObjectives: string;
  kbPrinciples: string[];
  classroomContext: string;
}

// Root route
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Lesson Plan Generator API! Use the /generate-lesson-plan endpoint to generate a lesson plan.");
});

// API endpoint to generate a lesson plan
app.post("/generate-lesson-plan", async (req: Request, res: Response) => {
  try {
    const {
      grade,
      subject,
      topic,
      duration,
      learningObjectives,
      kbPrinciples,
      classroomContext,
    }: LessonPlanRequest = req.body;

    // Validate input
    if (
      !grade ||
      !subject ||
      !topic ||
      !duration ||
      !learningObjectives ||
      !kbPrinciples ||
      !classroomContext
    ) {
      res.status(400).json({ success: false, error: "All fields are required." });
      return;
    }

    // List of valid KB principles
    const validKBPrinciples = [
      "Real Ideas, Authentic Problems",
      "Idea Diversity",
      "Improvable Ideas",
      "Rise Above",
      "Epistemic Agency",
      "Pervasive Knowledge Building",
      "Constructive Use of Authoritative Sources",
      "Embedded and Transformative Assessments",
      "Community Knowledge, Collective Responsibility",
      "Democratizing Knowledge",
      "Symmetric Knowledge Advancement",
      "Knowledge Building Discourse",
    ];

    // Validate KB principles
    const invalidPrinciples = kbPrinciples.filter(
      (principle) => !validKBPrinciples.includes(principle)
    );

    if (invalidPrinciples.length > 0) {
      res.status(400).json({
        success: false,
        error: `Invalid KB principles selected: ${invalidPrinciples.join(", ")}`,
      });
      return;
    }

    // Create the prompt for OpenAI
    const prompt = `You are a teacher designing lesson plans based on the **12 Principles of Knowledge Building** as outlined by the Knowledge Building International community.

Generate **two versions** of age-appropriate, engaging, and inclusive lesson plans based on the following inputs:
    - Grade: ${grade}
    - Subject: ${subject}
    - Topic: ${topic}
    - Duration: ${duration}
    - Learning Objectives: ${learningObjectives}
    - Knowledge Building Principles: ${kbPrinciples.join(", ")}
    - Classroom Context: ${classroomContext}

Each lesson plan should include:
1. Lesson Title
2. Learning Objectives
3. Introduction
4. Main Content (key concepts, activities, teaching methods)
5. Assessment
6. Conclusion
7. Additional Resources

Ensure the lesson plans are interactive, inclusive, and aligned with the selected Knowledge Building principles: ${kbPrinciples.join(", ")}.

    Here are some examples of lesson plans based on the provided inputs:
    
    Lesson Plan 1: Renewable Energy Explorers
    Grade Level: Elementary School (Grade 4)  
    Objective: Students will explore renewable energy sources, understand their importance, and collaboratively propose solutions to increase their use in their community.  
    
    Materials:
    - Tablets or computers with internet access  
    - Collaborative online platform (e.g., Knowledge Forum or Padlet)  
    - Videos and articles about renewable energy  
    - Chart paper and markers  
    
    Lesson Plan:  
    
    1. Introduction (10 minutes):  
       - Begin with a short video on renewable energy (e.g., solar, wind, hydro).  
       - Introduce the driving question: *"How can we use renewable energy to make our community more sustainable?"*  
       - Discuss the importance of renewable energy and its impact on the environment.  
    
    2. Group Formation (5 minutes):
       - Divide students into small groups (3-4 students each).  
       - Assign each group a renewable energy source (e.g., solar, wind, hydro, geothermal).  
    
    3. Research and Idea Generation (20 minutes):
       - Groups research their assigned energy source using provided resources.  
       - Students post their initial ideas and questions on the collaborative platform (e.g., *"How can solar panels be used in our school?"*).  
    
    4. Idea Improvement (15 minutes): 
       - Groups review and comment on each other’s posts, suggesting improvements or additional ideas.  
       - Encourage students to build on ideas and think creatively (e.g., *"What if we combined solar and wind energy?"*).  
    
    5. Synthesis and Presentation (15 minutes):  
       - Each group creates a poster or digital presentation summarizing their findings and proposing a solution for their community.  
       - Groups present their solutions to the class, explaining how their idea addresses the driving question.  
    
    6. Reflection (5 minutes):
       - Students reflect on the process: *"How did working together help us come up with better ideas?"*  
       - Discuss how their understanding of renewable energy improved through collaboration.  
    
    Assessment: 
    - Evaluate group presentations based on creativity, feasibility, and alignment with the driving question.  
    - Assess individual contributions through their posts and comments on the collaborative platform.  
    
    Additional Resources:
    - National Geographic Kids: Renewable Energy  
    - Interactive simulations on renewable energy (e.g., PhET Interactive Simulations) 
    
Format the output lesson plans in a readable format. Ensure that the lesson plans are engaging, interactive, and aligned with the selected Knowledge Building principles.

Now, generate two versions of lesson plans based on the provided inputs.`;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that creates detailed lesson plans for teachers based on Knowledge Building principles."
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    // Extract the generated lesson plan
    const lessonPlan = response.choices[0]?.message?.content?.trim() || "No lesson plan generated";

    // Store the initial conversation state
    const conversationId = Date.now().toString(); // Simple unique ID for the conversation
    const timestamp = new Date().toISOString();
    
    conversationState.set(conversationId, {
      initialInputs: {
        grade,
        subject,
        topic,
        duration,
        learningObjectives,
        kbPrinciples,
        classroomContext,
      },
      lessonPlan,
      history: [
        { role: "system", content: "System initialized", timestamp },
        { role: "user", content: prompt, timestamp },
        { role: "assistant", content: lessonPlan, timestamp }
      ]
    });

    // Send the response with the conversation ID
    res.status(200).json({ 
      success: true,
      lessonPlan,
      conversationId,
      history: conversationState.get(conversationId)?.history || []
    });
  } catch (error) {
    console.error("Error generating lesson plan:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to generate lesson plan.",
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// API endpoint to refine a lesson plan
app.post("/refine-lesson-plan", async (req: Request, res: Response) => {
  try {
    const { conversationId, refinements } = req.body;

    // Validate input
    if (!conversationId || !refinements) {
      res.status(400).json({ 
        success: false,
        error: "Conversation ID and refinements are required." 
      });
      return;
    }

    // Retrieve the conversation state
    const conversation = conversationState.get(conversationId);
    if (!conversation) {
      res.status(404).json({ 
        success: false,
        error: "Conversation not found." 
      });
      return;
    }

    // Add user refinements to history
    const userMessage = {
      role: "user",
      content: refinements,
      timestamp: new Date().toISOString()
    };
    conversation.history.push(userMessage);

    // Create the refinement prompt
    const refinementPrompt = `Please refine the lesson plan based on the following feedback:
${refinements}

Current lesson plan:
${conversation.lessonPlan}

Original requirements:
- Grade: ${conversation.initialInputs.grade}
- Subject: ${conversation.initialInputs.subject}
- Topic: ${conversation.initialInputs.topic}
- KB Principles: ${conversation.initialInputs.kbPrinciples.join(", ")}

Please provide the refined lesson plan that:
1. Incorporates all requested changes
2. Maintains alignment with original objectives and KB principles
3. Preserves all required sections (Title, Objectives, etc.)
4. Remains interactive and engaging`;

    // Call OpenAI API with full conversation history
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that refines lesson plans for teachers based on their feedback."
        },
        ...conversation.history
          .filter(msg => msg.role !== "system")
          .map(msg => ({ role: msg.role as "user" | "assistant", content: msg.content }))
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    // Extract the refined lesson plan
    const refinedLessonPlan = response.choices[0]?.message?.content?.trim() || conversation.lessonPlan;

    // Update the conversation state
    const assistantMessage = {
      role: "assistant",
      content: refinedLessonPlan,
      timestamp: new Date().toISOString()
    };
    conversation.lessonPlan = refinedLessonPlan;
    conversation.history.push(assistantMessage);

    // Send the response
    res.status(200).json({ 
      success: true,
      refinedLessonPlan,
      conversationId,
      history: conversation.history
    });
  } catch (error) {
    console.error("Error refining lesson plan:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to refine lesson plan.",
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// Endpoint to get conversation details
app.get("/conversation/:id", (req: Request, res: Response) => {
  try {
    const conversation = conversationState.get(req.params.id);
    if (!conversation) {
      res.status(404).json({ 
        success: false,
        error: "Conversation not found." 
      });
      return;
    }

    res.status(200).json({ 
      success: true,
      initialInputs: conversation.initialInputs,
      currentLessonPlan: conversation.lessonPlan,
      history: conversation.history
    });
  } catch (error) {
    console.error("Error retrieving conversation:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to retrieve conversation." 
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});