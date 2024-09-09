import { useState } from "react";

interface PdfUploaderProps {
  onUpload: (file: File) => void;
  uploadError: string;
  isUploaded: boolean;
}

export default function PdfUploader({ onUpload, uploadError, isUploaded }: PdfUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">Upload PDF</span>
      </label>
      <input
        type="file"
        accept=".pdf"
        className="file-input file-input-bordered w-full max-w-xs"
        onChange={handleFileChange}
      />
      {selectedFile && (
        <p className="mt-2 text-sm">Selected file: {selectedFile.name}</p>
      )}
      <button
        className="btn btn-primary mt-4"
        onClick={handleUpload}
        disabled={!selectedFile || isUploaded}
      >
        {isUploaded ? 'File Uploaded' : 'Upload and Start Review'}
      </button>
      {uploadError && (
        <div className="alert alert-error mt-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
}
