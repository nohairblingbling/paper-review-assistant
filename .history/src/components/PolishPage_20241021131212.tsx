import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { getApiConfig } from "../utils/storage";
import { FaMagic } from "react-icons/fa";

export default function PolishPage() {
  const [inputText, setInputText] = useState("");
  const [polishedText, setPolishedText] = useState("");
  const [isPolishing, setIsPolishing] = useState(false);
  const [language, setLanguage] = useState("English");
  const [polishLevel, setPolishLevel] = useState(50);
  const [error, setError] = useState("");

  const handlePolish = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl p-8 bg-base-100 rounded-lg shadow-xl"
      >
        <h1 className="text-3xl font-bold text-center mb-6">Language Polish</h1>
        <form onSubmit={handlePolish}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Input Text</span>
            </label>
            <textarea
              className="textarea textarea-bordered h-32"
              placeholder="Enter your text here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="flex flex-wrap -mx-2 mt-4">
            <div className="w-full md:w-1/2 px-2 mb-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Language</span>
                </label>
                <select
                  className="select select-bordered w-full"
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
            </div>
            <div className="w-full md:w-1/2 px-2 mb-4">
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
            </div>
          </div>
          <div className="form-control mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="btn btn-primary"
              disabled={isPolishing || !inputText}
            >
              {isPolishing ? "Polishing..." : "Polish Text"} <FaMagic className="ml-2" />
            </motion.button>
          </div>
        </form>
        {polishedText && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mt-8"
          >
            <h2 className="text-2xl font-bold mb-4">Polished Text</h2>
            <textarea
              className="textarea textarea-bordered w-full h-32"
              value={polishedText}
              readOnly
            ></textarea>
            <div className="mt-4 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-secondary"
                onClick={() => navigator.clipboard.writeText(polishedText)}
              >
                Copy Polished Text
              </motion.button>
            </div>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="alert alert-error mt-4"
          >
            <div className="flex-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 mx-2 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
              </svg>
              <label>{error}</label>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
