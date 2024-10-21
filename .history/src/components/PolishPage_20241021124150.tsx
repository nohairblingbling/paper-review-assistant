import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { getApiConfig } from "../utils/storage";

export default function PolishPage() {
  const [inputText, setInputText] = useState("");
  const [polishedText, setPolishedText] = useState("");
  const [isPolishing, setIsPolishing] = useState(false);

  const handlePolish = async () => {
    setIsPolishing(true);
    try {
      const apiConfig = getApiConfig();
      if (!apiConfig) {
        throw new Error("API configuration not found");
      }

      const response = await axios.post("/api/polish-text", {
        text: inputText,
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
      <h1 className="text-3xl font-bold mb-6">Language Polish</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <textarea
            className="textarea textarea-bordered w-full h-64"
            placeholder="Enter your text here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          ></textarea>
          <button
            className="btn btn-primary mt-4"
            onClick={handlePolish}
            disabled={isPolishing || !inputText}
          >
            {isPolishing ? "Polishing..." : "Polish Text"}
          </button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <textarea
            className="textarea textarea-bordered w-full h-64"
            placeholder="Polished text will appear here..."
            value={polishedText}
            readOnly
          ></textarea>
        </motion.div>
      </div>
    </div>
  );
}

