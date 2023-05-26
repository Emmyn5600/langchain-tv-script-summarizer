import React, { useState } from "react";
import { OpenAI } from "langchain/llms/openai";
import { loadSummarizationChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import SummaryResult from "./SummaryResult";

const SummaryComponent = () => {
  const [script, setScript] = useState("");
  const [summary, setSummary] = useState("");
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isValid, setIsValid] = useState(false);

  const handleInputChange = (event) => {
    setScript(event.target.value);
  };

  const apikey = process.env.REACT_APP_OPEN_AI_API_KEY;

  const handleSummarizeClick = async () => {
    if (script.length === 0) {
      setIsValid(true);
      setIsLoading(false);
    }
    setIsLoading(true);

    if (!apikey) {
      setError("OpenAI API key not found. Please check your configuration.");
      setIsLoading(false);
      return;
    }

    const model = new OpenAI({
      openAIApiKey: apikey,
      temperature: 0,
    });

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
    });

    const docs = await textSplitter.createDocuments([script]);

    // This convenience function creates a document chain prompted to summarize a set of documents.
    const chain = loadSummarizationChain(model, { type: "map_reduce" });

    try {
      const res = await chain.call({
        input_documents: docs,
      });
      setSummary(res.text);
      setError(null);
      // Extract characters from the script
      const extractedCharacters = extractNamesFromScript(res.text);
      setCharacters(extractedCharacters);
    } catch (error) {
      setError(error.message);
      setSummary("");
      setCharacters([]);
    } finally {
      setIsLoading(false);
    }
  };

  const extractNamesFromScript = (text) => {
    const namePattern = /\b[A-Z][a-z]{2,}\b/g;
    const names = text.match(namePattern) || [];
    const uniqueNames = [...new Set(names)];
    return uniqueNames;
  };

  return (
    <section className="mt-16 w-full max-w-xl flex-none h-14">
      <div>
        <h1 className="p-3 font-satoshi font-bold text-gray-600 text-xl">
          Movie Script Summarizer
        </h1>
        <textarea
          required
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          rows={10}
          cols={50}
          placeholder="Enter movie script here..."
          value={script}
          onChange={handleInputChange}
        />

        <div className="mr-2">
          <button
            onClick={handleSummarizeClick}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Summarize
          </button>
        </div>
      </div>
      {isValid ? (
        <p className="text-red-700 text-opacity-100 p-3">
          Please enter the valid script{" "}
        </p>
      ) : (
        <SummaryResult
          isLoading={isLoading}
          error={error}
          summary={summary}
          characters={characters}
        />
      )}
    </section>
  );
};

export default SummaryComponent;
