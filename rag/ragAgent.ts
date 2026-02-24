import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import "dotenv/config";
import { OpenAIEmbeddings } from "@langchain/openai";
import { SafeSearchType } from "@langchain/community/tools/duckduckgo_search";


const loader = new PDFLoader("/Users/svocd/playground/Nike-Inc-2025_10K.pdf");
const docs = await loader.load();
//console.log(docs[0].pageContent);

const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });
const chunks = await textSplitter.splitDocuments(docs);
console.log(chunks.length);

const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-large",
});

const vectorStore = new MemoryVectorStore(embeddings);
await vectorStore.addDocuments(chunks);

const results = await vectorStore.similaritySearch("What is the company's business model?");

console.log(results);