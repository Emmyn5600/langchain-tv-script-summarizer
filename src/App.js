import React from "react";
import Layout from "./components/Layout/Layout";
// import SummaryComponent from "./components/Movie/MovieScriptSummarizer";
import ScriptSender from "./components/Movie/ScriptSenderSummary";
import "./App.css";

const App = () => {
  return (
    <Layout>
      <div className="main">
        <div className="gradient" />
      </div>
      <div className="app">
        {/* <SummaryComponent /> */}
        <ScriptSender />
      </div>
    </Layout>
  );
};

export default App;
