import fs from 'fs';
import { execFile } from 'child_process';

const chaptersDir = './chapters';
const outputFilePath = './output/translatedChapters.json';

async function processFile(file) {
    const [chapter, section] = file.match(/\d+/g);
    console.log(`Processing chapter ${chapter}, section ${section}...`);

    return new Promise((resolve, reject) => {
        execFile('node', ['translate2JSON.js', chapter, section], (err, stdout, stderr) => {
            if (err) {
                console.error(`Error processing file ${file}:`, err);
                reject(err);
                return;
            }
            if (stderr) {
                console.error(`Error output for file ${file}:`, stderr);
                reject(stderr);
                return;
            }
            console.log(`Successfully processed file ${file}:\n${stdout}`);
            resolve(); // Resolve the promise when the command is successful
        });
    });
}

async function main() {
    const files = fs.readdirSync(chaptersDir);

    // Filter markdown files
    const mdFiles = files.filter(file => file.endsWith('.md'));

    for (const file of mdFiles) {
        try {
            await processFile(file);
        } catch (error) {
            console.error(`Failed to process ${file}:`, error);
        }
    }
}

main().catch(err => {
    console.error('Error processing files:', err);
    process.exit(1);
});
