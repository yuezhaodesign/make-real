import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import OpenAI from "openai/index.mjs";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Debug log to verify the API key is loaded
console.log("OpenAI API Key:", process.env.OPENAI_API_KEY);

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
        res.status(400).json({ error: "All fields are required." });
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
          error: `Invalid KB principles selected: ${invalidPrinciples.join(", ")}`,
        });
        return;
      }

    // Create the prompt for OpenAI
    const prompt = `You are a teacher designing lesson plans based on the **12 Principles of Knowledge Building** as outlined by the Knowledge Building International community (https://www.kbsingapore.org/12-principles-of-kb). 

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
    
    Knowledge Building Principles to Incorporate:
    - Real ideas, authentic problems: Knowledge Building focuses on addressing real-world problems and ideas that matter to students. Instead of pre-packaged or hypothetical scenarios, students engage with authentic, meaningful questions that connect to their lives and the world around them.
    - Improvable ideas: Ideas are treated as dynamic and evolving rather than fixed or final. Students are encouraged to continuously refine and improve their ideas through collaboration, research, and feedback.
    - Idea diversity: A wide range of ideas and perspectives is encouraged to enrich the learning process. Diversity of thought fosters creativity and deeper understanding, as students build on each other’s unique contributions.
    - Rise above: Students synthesize and integrate multiple ideas to create higher-level understandings or solutions. This principle encourages moving beyond individual ideas to develop more comprehensive and sophisticated knowledge.
    - Collective knowledge advancement: Knowledge Building is a collaborative process where the group’s collective understanding advances together. The focus is on shared progress rather than individual achievement.
    - Epistemic agency: Students take ownership of their learning by setting goals, asking questions, and directing their inquiry. They act as active participants in the knowledge creation process rather than passive recipients of information.
    - Community knowledge: Knowledge is seen as a communal resource that belongs to the group rather than individuals. The classroom becomes a knowledge-building community where everyone contributes to and benefits from shared understanding.
    - Democratizing knowledge: All students, regardless of background or ability, have equal opportunities to contribute to and benefit from the knowledge-building process. This principle promotes inclusivity and equity in the classroom.
    - Symmetric knowledge advancement: Knowledge Building benefits all participants equally, including teachers and students. Teachers learn alongside students, creating a reciprocal learning environment.
    - Constructive use of authoritative sources: While students are encouraged to generate their own ideas, they also learn to critically engage with authoritative sources (e.g., textbooks, research articles) to deepen their understanding.
    - Knowledge building discourse: Classroom discussions are structured to promote deep, meaningful exchanges of ideas. Students learn to articulate their thoughts, listen to others, and build on each other’s contributions.
    - Embedded and transformative assessment: Assessment is integrated into the learning process and focuses on growth and improvement rather than just final outcomes. Students reflect on their progress and set goals for further learning.

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
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });


    // Extract the generated lesson plan
    const lessonPlan = response.choices[0].message?.content?.trim();

    // Send the response
    res.status(200).json({ lessonPlan });
    } catch (error) {
    console.error("Error generating lesson plan:", error);
    res.status(500).json({ error: "Failed to generate lesson plan." });
    }
    });

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});