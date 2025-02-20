import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const chaptersDir = './chapters';

// Read all files in the chapters directory
const files = fs.readdirSync(chaptersDir);

// Filter markdown files
const mdFiles = files.filter(file => file.endsWith('.md'));

mdFiles.forEach(file => {
    const filePath = path.join(chaptersDir, file);
    const [chapter, section] = file.match(/\d+/g);

    // Only process files from chapter 10
    if (chapter === '10') {
        try {
            // Execute translate.js for each file
            const stdout = execSync(`node translateOneSection.js ${chapter} ${section}`);
            console.log(`Successfully processed file ${file}:\n${stdout}`);
        } catch (err) {
            console.error(`Error processing file ${file}:`, err);
        }
    }
});
