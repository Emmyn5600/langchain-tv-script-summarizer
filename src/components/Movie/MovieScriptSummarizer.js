import React, { useState } from "react";
import { OpenAI } from "langchain/llms/openai";
import { loadSummarizationChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import loader from "../../assets/loader.svg";

const SummaryComponent = () => {
  const [script, setScript] = useState("");
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (event) => {
    setScript(event.target.value);
  };

  const handleSummarizeClick = async () => {
    setIsLoading(true);

    const model = new OpenAI({
      openAIApiKey: process.env.REACT_APP_OPEN_AI_API_KEY,
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
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
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

      {/* Display Result */}
      <div className="my-10 max-w-full flex justify-center items-center">
        {isLoading ? (
          <img src={loader} alt="loader" className="w-20 h-20 object-contain" />
        ) : error ? (
          <p className="font-inter font-bold text-black text-center">
            Well, that wasn't supposed to happen...
            <br />
            <span className="font-satoshi font-normal text-gray-700">
              {error?.data?.error}
            </span>
          </p>
        ) : (
          summary && (
            <div className="flex flex-col gap-3">
              <h2 className="font-satoshi font-bold text-gray-600 text-xl">
                Movie Script <span className="blue_gradient">Summary</span>
              </h2>
              <div className="summary_box">
                <p className="font-inter font-medium text-sm text-gray-700">
                  {summary}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default SummaryComponent;
