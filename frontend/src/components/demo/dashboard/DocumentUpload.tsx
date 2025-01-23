import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload } from "lucide-react";
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import AlertDocuments from "./AlertDocuments";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface DocumentUploadProps {
  onUploadSuccess: (newDocument: any) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ onUploadSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [description, setDescription] = useState("");
  const [verificationMethod, setVerificationMethod] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [status, setStatus] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isPdf, setIsPdf] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedFile) {
      setStatus("Please select a file.");
      return;
    }

    if (!description || !verificationMethod || !documentType) {
      setStatus("Please fill in all the required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("description", description);
    formData.append("verificationMethod", verificationMethod);
    formData.append("documentType", documentType);

    try {
      const response = await axios.post(
        "http://localhost:5001/verificator/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setStatus("Document uploaded successfully!");
      onUploadSuccess(response.data.documentDetails);
    } catch (error) {
      setStatus("Failed to upload document.");
      if (axios.isAxiosError(error)) {
        console.error("Upload failed:", error.response?.data || error.message);
      } else {
        console.error("Upload failed:", error);
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileExtension = file.name.split(".").pop()?.toLowerCase();

      // Generate preview for images and PDFs
      if (fileExtension === "pdf") {
        setFilePreview(URL.createObjectURL(file));
        setIsPdf(true);
      } else if (["jpg", "jpeg", "png"].includes(fileExtension || "")) {
        setFilePreview(URL.createObjectURL(file));
        setIsPdf(false);
      } else {
        setFilePreview(null);
        setIsPdf(false);
      }

      setSelectedFile(file);
    }
  };

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
          <CardDescription>
            Upload your document, provide a description, and select verification details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showAlert && (
            <AlertDocuments message={alertMessage} onClose={() => setShowAlert(false)} />
          )}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Drag and drop your files here, or click to browse
            </p>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
              onChange={handleFileChange}
            />
          </div>

          {/* Display selected file preview */}
          {filePreview && (
            <div className="mt-4">
              {isPdf ? (
                <embed
                  src={filePreview}
                  type="application/pdf"
                  className="w-full h-96 border rounded-lg"
                />
              ) : (
                <img
                  src={filePreview}
                  alt="Selected file preview"
                  className="max-w-full h-auto border rounded-lg"
                />
              )}
            </div>
          )}

          <Textarea
            className="mt-4"
            placeholder="Enter a description for the document."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Input
            className="mt-4"
            placeholder="Enter verification method (e.g., Automated)"
            value={verificationMethod}
            onChange={(e) => setVerificationMethod(e.target.value)}
          />
          <Input
            className="mt-4"
            placeholder="Enter document type (e.g., Land Certificate)"
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
          />

          <Button type="submit" className="mt-4">
            Upload and Verify Document
          </Button>

          {status && <p className="mt-2 text-sm text-gray-600">{status}</p>}
        </CardContent>
      </form>
    </Card>
  );
};

export default DocumentUpload;
