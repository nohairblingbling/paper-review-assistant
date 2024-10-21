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
    } finally {
      setIsPolishing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Language Polish</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <textarea
            className="textarea textarea-bordered w-full h-64"
            placeholder="Enter your text here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          ></textarea>
          <div className="flex space-x-4">
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
            <div className="w-full">
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
          </div>
          <button
            className="btn btn-primary w-full"
            onClick={handlePolish}
            disabled={isPolishing || !inputText}
          >
            {isPolishing ? "Polishing..." : "Polish Text"}
          </button>
        </div>
        <div className="space-y-4">
          <textarea
            className="textarea textarea-bordered w-full h-64"
            placeholder="Polished text will appear here..."
            value={polishedText}
            readOnly
          ></textarea>
          <button
            className="btn btn-secondary w-full"
            onClick={() => navigator.clipboard.writeText(polishedText)}
            disabled={!polishedText}
          >
            Copy Polished Text
          </button>
        </div>
      </div>
    </div>
  );
}
