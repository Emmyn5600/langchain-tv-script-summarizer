import React, { Fragment } from "react";
import loader from "../../assets/loader.svg";

const Summary = ({ isLoading, error, summary, actors }) => {
  return (
    <Fragment>
      <div className="my-10 max-w-full flex justify-center items-center">
        {isLoading ? (
          <img src={loader} alt="loader" className="w-20 h-20 object-contain" />
        ) : error ? (
          <p className="font-inter font-bold text-black text-center">
            Well, that wasn't supposed to happen...
            <br />
            <span className="font-satoshi font-normal text-gray-700">
              {error.message}
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

      <div className="my-10 max-w-full flex justify-center items-center">
        {actors.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2 className="font-satoshi font-bold text-gray-600 text-xl">
              Movie Characters
            </h2>
            <ul>
              {actors.map((actor, index) => (
                <li
                  key={index}
                  className="font-inter font-medium text-sm text-gray-700"
                >
                  {actor}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default Summary;
