import React, { useState } from "react";
import PdfUploader from "./PdfUploader";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { getApiConfig } from "../utils/storage";

export default function ReviewPage() {
  const [pdfUploaded, setPdfUploaded] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfText, setPdfText] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [field, setField] = useState("");
  const [reviewFocus, setReviewFocus] = useState("");
  const [paperType, setPaperType] = useState("");
  const [detailedReview, setDetailedReview] = useState("");
  const [outputLanguage, setOutputLanguage] = useState("English");
  const [strictnessLevel, setStrictnessLevel] = useState<number>(50);
  const [additionalRequirements, setAdditionalRequirements] = useState("");
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewResult, setReviewResult] = useState<string | null>(null);
  const [animationStep, setAnimationStep] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [reviewProgress, setReviewProgress] = useState(0);

  const handlePdfUpload = async (file: File) => {
    setPdfFile(file);
    setUploadError("");
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post("/api/extract-pdf-text", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });
      setPdfText(response.data.text);
      setAnimationStep(1);
      setTimeout(() => {
        setPdfUploaded(true);
        setAnimationStep(2);
      }, 800);
    } catch (error) {
      console.error("PDF text extraction failed:", error);
      setUploadError(
        "PDF upload failed. Please try again or choose another file."
      );
    } finally {
      setUploadProgress(100);
    }
  };

  const handleReview = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Submitting review...");
    setIsReviewing(true);
    setReviewResult(null);
    setReviewProgress(0);

    try {
      const apiConfig = getApiConfig();
      if (!apiConfig) {
        throw new Error("API configuration not found");
      }

      // Simulate progress
      const progressInterval = setInterval(() => {
        setReviewProgress((prev) => Math.min(prev + 10, 90));
      }, 1000);

      const response = await axios.post("/api/review-paper", {
        pdfText,
        field,
        reviewFocus,
        paperType,
        detailedReview,
        outputLanguage,
        strictnessLevel,
        additionalRequirements,
        apiConfig,
      });
      
      clearInterval(progressInterval);
      setReviewProgress(100);

      console.log("Review response:", response.data);
      setReviewResult(response.data.review);
    } catch (error) {
      console.error("Review failed:", error);
    } finally {
      setIsReviewing(false);
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <motion.div className="hero-content flex-col lg:flex-row-reverse" layout>
        <AnimatePresence>
          {animationStep === 0 && (
            <motion.div
              className="text-center lg:text-left"
              initial={{ opacity: 1, x: 0 }}
              animate={{ opacity: animationStep === 0 ? 1 : 0, x: animationStep === 0 ? 0 : -100 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl font-bold">Paper Review</h1>
              <p className="py-6">
                Upload your paper and set review parameters to get started.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100"
          layout
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            duration: 0.8
          }}
        >
          <div className="card-body">
            <PdfUploader
              onUpload={handlePdfUpload}
              uploadError={uploadError}
              isUploaded={pdfUploaded}
            />
            <AnimatePresence>
              {animationStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <form onSubmit={handleReview}>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Field</span>
                      </label>
                      <select
                        className="select select-bordered w-full max-w-xs"
                        value={field}
                        onChange={(e) => setField(e.target.value)}
                      >
                        <option disabled value="">Select Field</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Biology">Biology</option>
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Environmental Science">Environmental Science</option>
                        <option value="Psychology">Psychology</option>
                      </select>
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Review Focus</span>
                      </label>
                      <select
                        className="select select-bordered w-full max-w-xs"
                        value={reviewFocus}
                        onChange={(e) => setReviewFocus(e.target.value)}
                      >
                        <option disabled value="">Select Review Focus</option>
                        <option value="All">All</option>
                        <option value="Methodology">Methodology</option>
                        <option value="Results">Results</option>
                        <option value="Discussion">Discussion</option>
                        <option value="Literature Review">Literature Review</option>
                        <option value="Theoretical Framework">Theoretical Framework</option>
                        <option value="Data Analysis">Data Analysis</option>
                        <option value="Experimental Design">Experimental Design</option>
                        <option value="Conclusions">Conclusions</option>
                      </select>
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Paper Type</span>
                      </label>
                      <select
                        className="select select-bordered w-full max-w-xs"
                        value={paperType}
                        onChange={(e) => setPaperType(e.target.value)}
                      >
                        <option disabled value="">
                          Select Paper Type
                        </option>
                        <option value="Original Research">
                          Original Research
                        </option>
                        <option value="Review">Review</option>
                      </select>
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Detailed Review?</span>
                      </label>
                      <select
                        className="select select-bordered w-full max-w-xs"
                        value={detailedReview}
                        onChange={(e) => setDetailedReview(e.target.value)}
                      >
                        <option disabled value="">
                          Detailed Review?
                        </option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Output Language</span>
                      </label>
                      <select
                        className="select select-bordered w-full max-w-xs"
                        value={outputLanguage}
                        onChange={(e) => setOutputLanguage(e.target.value)}
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
                        <span className="label-text">Strictness Level</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={strictnessLevel}
                        className="range"
                        step="10"
                        onChange={(e) =>
                          setStrictnessLevel(Number(e.target.value))
                        }
                      />
                      <div className="w-full flex justify-between text-xs px-2">
                        <span>0</span>
                        <span>20</span>
                        <span>40</span>
                        <span>60</span>
                        <span>80</span>
                        <span>100</span>
                      </div>
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">
                          Additional Requirements
                        </span>
                      </label>
                      <textarea
                        className="textarea textarea-bordered h-24"
                        placeholder="Additional requirements or comments"
                        value={additionalRequirements}
                        onChange={(e) =>
                          setAdditionalRequirements(e.target.value)
                        }
                      ></textarea>
                    </div>
                    <div className="form-control mt-6">
                      <button
                        className="btn btn-primary"
                        disabled={isReviewing}
                      >
                        {isReviewing ? "Reviewing..." : "Review Paper"}
                      </button>
                    </div>
                  </form>
                  {reviewResult && (
                    <div className="form-control mt-6">
                      <button
                        className="btn btn-secondary"
                        disabled={isReviewing || isDownloading}
                        onClick={async () => {
                          try {
                            setIsDownloading(true);
                            const response = await axios.post(
                              "/api/generate-pdf",
                              { markdown: reviewResult },
                              { responseType: "blob" }
                            );
                            const blob = new Blob([response.data], {
                              type: "application/pdf",
                            });
                            const url = window.URL.createObjectURL(blob);
                            const link = document.createElement("a");
                            link.href = url;
                            link.setAttribute("download", "review.pdf");
                            document.body.appendChild(link);
                            link.click();
                            if (link.parentNode) {
                              link.parentNode.removeChild(link);
                            }
                          } catch (error) {
                            console.error("PDF generation failed:", error);
                          } finally {
                            setIsDownloading(false);
                          }
                        }}
                      >
                        {isDownloading ? "Downloading..." : "Download Review as PDF"}
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
