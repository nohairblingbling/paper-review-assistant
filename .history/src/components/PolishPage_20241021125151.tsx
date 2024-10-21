import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { getApiConfig } from "../utils/storage";

export default function PolishPage() {
  const [inputText, setInputText] = useState("");
  const [polishedText, setPolishedText] = useState("");
  const [isPolishing, setIsPolishing] = useState(false);
  const [language, setLanguage] = useState("English");
  const [polishLevel, setPolishLevel] = useState(50);
  const [error, setError] = useState("");

  const handlePolish = async () => {
    setError("");
    setIsPolishing(true);
    try {
      const apiConfig = getApiConfig();
      if (!apiConfig) {
        throw new Error("API configuration not found");
      }

      const response = await axios.post("/api/polish-text", {
        text: inputText,
        language,
        polishLevel,
        apiConfig,
      });
      setPolishedText(response.data.polishedText);
    } catch (error) {
      console.error("Text polishing failed:", error);
      setError("Failed to polish text. Please try again.");
    } finally {
      setIsPolishing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Language Polish</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Input Text</h2>
            <textarea
              className="textarea textarea-bordered w-full h-64"
              placeholder="Enter your text here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            ></textarea>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Language</span>
              </label>
              <select
                className="select select-bordered w-full max-w-xs"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="English">English</option>
                <option value="Chinese">Chinese</option>
                <option value="Japanese">Japanese</option>
                <option value="German">German</option>
                <option value="French">French</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Polish Level</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={polishLevel}
                className="range"
                step="25"
                onChange={(e) => setPolishLevel(Number(e.target.value))}
              />
              <div className="w-full flex justify-between text-xs px-2">
                <span>Light</span>
                <span>Moderate</span>
                <span>Heavy</span>
                <span>Rewrite</span>
              </div>
            </div>
            <div className="card-actions justify-end">
              <button
                className="btn btn-primary"
                onClick={handlePolish}
                disabled={isPolishing || !inputText}
              >
                {isPolishing ? "Polishing..." : "Polish Text"}
              </button>
            </div>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Polished Text</h2>
            <textarea
              className="textarea textarea-bordered w-full h-64"
              placeholder="Polished text will appear here..."
              value={polishedText}
              readOnly
            ></textarea>
            <div className="card-actions justify-end">
              <button
                className="btn btn-secondary"
                onClick={() => navigator.clipboard.writeText(polishedText)}
                disabled={!polishedText}
              >
                Copy Polished Text
              </button>
            </div>
          </div>
        </div>
      </div>
      {error && (
        <div className="alert alert-error mt-4">
          <div className="flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 mx-2 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
            </svg>
            <label>{error}</label>
          </div>
        </div>
      )}
    </div>
  );
}
