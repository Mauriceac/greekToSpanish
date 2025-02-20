## Ancient Greek Texts Translator

This is a collection of scripts I use to translate Greek Church Father texts to Spanish.

This is how I do it (so far):

1. First, I download a PDF of the text I want to translate. 
2. Since they usually come in the same format, I use the `pdf2markdown.py` script to extract the content to markdown format.
3. Then, I use `extractChapters.js` (or a variant) to divide the text into smaller files so the the LLM can later process them.
4. Then I use `translateAll2JSON.js` to all process the files in the `/chapters` folder and translate them. Due to token limitations, it might be necessary to translate only a couple at a time. So I move the files that I won't translate during the iteration to the `/temp` folder.
5. If adjustments are required, I adjust the LLM prompt in `translate2JSON.js` and `schema.js`