import React, { useState, useEffect } from "react";
import axios from "axios";
import Summary from "./Summary";

const CombinedComponent = () => {
  const [script, setScript] = useState("");
  const [response, setResponse] = useState(null);
  const [summary, setSummary] = useState("");
  const [actors, setActors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isValid, setIsValid] = useState(false);

  // Function to handle script submission
  const handleSummarizeClick = async () => {
    if (script.trim() === "") {
      setIsValid(true);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post("http://localhost:5000/api/script", {
        script: script,
      });
      setResponse(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Function to handle textarea value change
  const handleInputChange = (event) => {
    setScript(event.target.value);
  };

  const handleTextAreaBlur = () => {
    if (script.trim() === "") {
      setIsValid(true);
    }
  };

  // Fetch data from the backend on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/summary");
        setSummary(response.data.summary);

        const regex = /• ([^\n]+)/g;
        const extractedActors =
          response.data.summary
            .match(regex)
            ?.map((actor) => actor.substring(2).trim()) || [];
        setActors(extractedActors);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching summary:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
          onBlur={handleTextAreaBlur}
        />

        <div className="mr-2">
          <button
            onClick={handleSummarizeClick}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Summarize
          </button>
          {response && <div>Server Response: {response.message}</div>}
        </div>
      </div>
      {isValid && (
        <p className="text-red-700 text-opacity-100 p-3">
          Please enter the valid script{" "}
        </p>
      )}
      {!isValid && (
        <Summary
          isLoading={isLoading}
          error={error}
          summary={summary}
          actors={actors}
        />
      )}
    </section>
  );
};

export default CombinedComponent;
