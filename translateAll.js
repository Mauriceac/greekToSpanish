import fs from 'fs';
import { exec } from 'child_process';
import path from 'path';

const chaptersDir = './chapters';

// Read all files in the chapters directory
fs.readdir(chaptersDir, (err, files) => {
    if (err) {
        console.error('Error reading chapters directory:', err);
        process.exit(1);
    }

    // Filter markdown files
    const mdFiles = files.filter(file => file.endsWith('.md'));

    mdFiles.forEach(file => {
        const [chapter, section] = file.match(/\d+/g);

        // Execute translate.js for each file
        exec(`node translate.js ${chapter} ${section}`, (err, stdout, stderr) => {
            if (err) {
                console.error(`Error processing file ${file}:`, err);
                return;
            }
            if (stderr) {
                console.error(`Error output for file ${file}:`, stderr);
                return;
            }
            console.log(`Successfully processed file ${file}:\n${stdout}`);
        });
    });
});
