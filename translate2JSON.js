import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import fs from "fs";
import { author, title } from "./constants.js";
import schema from "./schema.js";

dotenv.config();

// Get chapter and section from command-line arguments
const [chapter, section] = process.argv.slice(2);

// For chapter and section obtained from command-line arguments, set the file name here
const fileName = `chapter_${chapter}_section_${section}`;

// For individual file processing, set the file name here
//const fileName = 'chapter_1_section_2.md';

// get chapter and section from the file name
// const [chapter, section] = fileName.match(/\d+/g);

// Check if the file exists. If not, return error message and exit.
if (!fs.existsSync(`./chapters/${fileName}.md`)) {
    console.error(`ERROR: File ${fileName}.md not found.`);
    process.exit(1);
}

let greekText = fs.readFileSync(`./chapters/${fileName}.md`, "utf8");

async function translateText() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    
    const generationConfig = {
        //   temperature: 1.0,
        //   topP: 0.95,
        //   topK: 16,
        responseMimeType: "application/json",
        responseSchema: schema
    };
    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig,
    });
    const prompt = `
    You're working to help Spanish-speaking Orthodox Christians learn about ancient Christian texts. 
    Use the [Original Greek Text] of ${title} written by ${author} found below.
    Combine lines from the original Greek text to form comprehensible sentences or phrases.
    In each object, include the orignal Greek sentence or phrase and the translated Spanish text.
    Include line numbers in the JSON object to help with reference.
    Optionally, add notes about Greek terms, linguistics, and/or references to other literary sources, like the Bible. Notes should be in Spanish.
    =======
    Author = ${author}
    Title = ${title}
    Chapter = ${chapter}
    Section = ${section}
    Original Greek Text = ${greekText}
    `;


    // Add to the prompt later:
    // 

    const geminiResponse = await model.generateContent(prompt);
    //console.log(geminiResponse.response.candidates[0].content.parts[0].text);

    // const responseText = geminiResponse.response.candidates[0].content.parts[0].text;

    let translatedData = geminiResponse.response.candidates[0].content.parts[0].text;
    // let translatedData;

    try {
        // Parse the JSON string
        translatedData = JSON.parse(translatedData);
        fs.writeFileSync(`./output/translated_${fileName}.md.json`, JSON.stringify(translatedData, null, 2));

        // Now you can work with translatedData as a normal JavaScript object
    } catch (error) {
        console.error("Error parsing JSON:", error);
        console.error(`Raw response text in : "./output/ERROR_${fileName}.md.json"`); // Print the raw response for debugging
        fs.writeFileSync(`./output/ERROR_${fileName}.md.json`, JSON.stringify(translatedData, null, 2));
    }

    //console.log(translatedData);
    console.log(geminiResponse.response.usageMetadata);

}

translateText();