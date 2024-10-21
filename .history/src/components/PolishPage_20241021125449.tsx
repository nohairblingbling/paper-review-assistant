import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
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
    <div className="hero min-h-screen bg-base-200">
      <motion.div className="hero-content flex-col lg:flex-row-reverse" layout>
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Language Polish</h1>
          <p className="py-6">
            Enhance your text with our advanced language polishing tool. Simply input your text,
            select your preferences, and let our AI refine your writing.
          </p>
        </div>
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <form onSubmit={handlePolish} className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Input Text</span>
              </label>
              <textarea
                className="textarea textarea-bordered h-24"
                placeholder="Enter your text here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                required
              ></textarea>
            </div>
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
            <div className="form-control mt-6">
              <button
                className="btn btn-primary"
                type="submit"
                disabled={isPolishing || !inputText}
              >
                {isPolishing ? "Polishing..." : "Polish Text"} <FaMagic className="ml-2" />
              </button>
            </div>
          </form>
        </div>
      </motion.div>
      <AnimatePresence>
        {polishedText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8 w-full max-w-2xl"
          >
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Polished Text</h2>
                <textarea
                  className="textarea textarea-bordered w-full h-64"
                  value={polishedText}
                  readOnly
                ></textarea>
                <div className="card-actions justify-end">
                  <button
                    className="btn btn-secondary"
                    onClick={() => navigator.clipboard.writeText(polishedText)}
                  >
                    Copy Polished Text
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
