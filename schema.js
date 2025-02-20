import { SchemaType } from "@google/generative-ai";

const schema = {
    description: "Sentences or phrases translated text from Greek to Spanish",
    type: SchemaType.ARRAY,
    items: {
        type: SchemaType.OBJECT,
        properties: {
          author: {
            type: SchemaType.STRING,
          },
          title: {
            type: SchemaType.STRING,
          },  
          chapter: {
                type: SchemaType.NUMBER
            },
            section: {
                type: SchemaType.NUMBER
            },
            lines: {
                type: SchemaType.ARRAY,
                items: {
                    type: SchemaType.NUMBER
                }
            },
            greek: {
                type: SchemaType.STRING
            },
            spanish: {
                type: SchemaType.STRING
            },
            notes: {
                type: SchemaType.STRING
            },
        },
        required: ["author", "title", "chapter", "section", "lines", "greek", "spanish"],
    },
};

export default schema;