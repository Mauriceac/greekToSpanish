import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const author = "John Chrysostomus";
const title = "Homilies on the Epistle of St. Paul to the Romans";

// Get chapter and section from command-line arguments
const chapter = "10";

// const fileName = `chapter_${chapter}_section_${section}.md`;
const fileName = 'chapter_10_section_2.md';

// Check if the file exists. If not, return error message and exit.
if (!fs.existsSync(`./chapters/${fileName}`)) {
    console.error(`ERROR: File ${fileName} not found.`);
    process.exit(1);
}

let greekText = fs.readFileSync(`./chapters/${fileName}`, "utf8");

async function translateText() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const generationConfig = {
      temperature: 1.0,
      topP: 0.95,
      topK: 16,
    };
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      generationConfig,
    });
    const prompt = `
    You're working to help Spanish-speaking Orthodox Christians learn about ancient texts. 
    Use the original Greek text from ${title} by ${author} found below.
    Make a table in Markdown format with a Spanish translation of each sentence or phrase. 
    Each row of the table should be a sentence or phrase from the original Greek text.
    Combine lines from the original Greek text to form comprehensible sentences or phrases.
    In the first column, titled "Líneas", indicate the span of line numbers used to make the sentence or phrase in the row. For example, "00001-00003" indicates that the first three lines were used to form the sentence or phrase.
    In the second column, titled "Griego Original", place sentence or phrase in the original Greek. Do not include line numbers in the content.
    In the third column, titled "Traducción IA", place the Spanish translation of the original Greek sentence or phrase.

    Original Greek text: ${greekText}
    `;
    
    console.log(`Processing chapter ${chapter}, section 3...`);
    
    const geminiResponse = await model.generateContent(prompt);
    console.log(geminiResponse.response.candidates[0].content.parts[0].text);

    if (!fs.existsSync(`./texts/${title}/chapter_${chapter}`)) {
        fs.mkdirSync(`./texts/${title}/chapter_${chapter}`, { recursive: true });
    }

    fs.writeFileSync(`./texts/${title}/chapter_${chapter}/${fileName}`, geminiResponse.response.candidates[0].content.parts[0].text);
    
    console.log(`File "${fileName}" processed and saved.`);
}

translateText();