import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import fs from 'fs';

// Read the markdown file
const filePath = 'texts/input/originals/de_caelesti_hierarchia.md';
const fileContent = readFileSync(filePath, 'utf-8');

// Split the content by lines
const lines = fileContent.split('\n');
console.log(`File ${filePath} read with ${lines.length} lines`);

// Variables to hold chapter data
let chapters = [];
let currentChapter = null;

// Regular expression to identify chapter start
const chapterStartRegex = /<([VIXLCDM]+)./;
const sectionStartRegex = /\[\[\d+>]]/;

// Process each line
lines.forEach((line, index) => {
    //console.log(`Processing line ${index + 1}: ${line}`);
    if (chapterStartRegex.test(line)) {
        // If a new chapter starts, save the current chapter and start a new one
        if (currentChapter) {
            chapters.push(currentChapter);
            console.log(`Chapter saved: ${currentChapter.title}`);
        }
        currentChapter = {
            title: line.match(chapterStartRegex)[0],
            content: line + '\n',
            sections: []
        };
        console.log(`New chapter started: ${currentChapter.title}`);
    } else if (currentChapter) {
        // If inside a chapter, check for section start
        if (sectionStartRegex.test(line)) {
            currentChapter.sections.push({
                title: line.match(sectionStartRegex)[0],
                content: line + '\n'
            });
        } else if (currentChapter.sections.length > 0) {
            // Add line to the last section
            currentChapter.sections[currentChapter.sections.length - 1].content += line + '\n';
        } else {
            // Add line to the chapter content if no sections yet
            currentChapter.content += line + '\n';
        }
    }
});

// Add the last chapter if it exists
if (currentChapter) {
    chapters.push(currentChapter);
    console.log(`Final chapter saved: ${currentChapter.title}`);
}

// Check if the chapters folder exists. If not, create it.
const chaptersFolder = '/Users/malva/Documents/REPOS/greekToSpanish/chapters';
if (!fs.existsSync(chaptersFolder)) {
    fs.mkdirSync(chaptersFolder);
    console.log(`Folder ${chaptersFolder} created`);
}

// Write each chapter and its sections to separate markdown files
chapters.forEach((chapter, index) => {
    const chapterFileName = `chapter_${index + 1}.md`;
    const chapterFilePath = join('/Users/malva/Documents/REPOS/greekToSpanish/chapters', chapterFileName);
    let chapterContent = chapter.content;

    // Append sections to chapter content
    chapter.sections.forEach((section, sectionIndex) => {
        const sectionFileName = `chapter_${index + 1}_section_${sectionIndex + 1}.md`;
        const sectionFilePath = join('/Users/malva/Documents/REPOS/greekToSpanish/chapters', sectionFileName);
        writeFileSync(sectionFilePath, section.content, 'utf-8');
        console.log(`Section ${sectionIndex + 1} of Chapter ${index + 1} written to ${sectionFilePath}`);
        chapterContent += section.content;
    });

    // writeFileSync(chapterFilePath, chapterContent, 'utf-8');
    // console.log(`Chapter ${index + 1} written to ${chapterFilePath}`);
});