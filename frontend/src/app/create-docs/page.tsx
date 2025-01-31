"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { MerkleTree } from "merkletreejs";
import { SHA3 } from "crypto-js";
import { Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Alert, AlertDescription } from "@/components/ui/alert";
import NavbarComponents from "@/components/layouts/NavbarComponents";

type FileData = {
  content: string;
  fileName: string;
};

const ACCEPTED_FILE_TYPES = {
  "application/json": "JSON",
};

const CreateDocsPage = () => {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Function to generate hash using SHA3
  const generateSHA3Hash = (value: any): string => {
    return SHA3(String(value)).toString();
  };

  // Function to add hash suffix to each field value
  const addHashToValue = (value: any, type: string = "string"): string => {
    const hash = generateSHA3Hash(value);
    return `${hash}:${type}:${value}`;
  };

  // Function to process nested data and hash it
  const processNestedData = (data: any): any => {
    if (Array.isArray(data)) {
      return data.map(item => processNestedData(item));
    }
    
    if (typeof data === "object" && data !== null) {
      const processedObj: any = {};
      for (const [key, value] of Object.entries(data)) {
        processedObj[key] = processNestedData(value);
      }
      return processedObj;
    }

    let type = "string";
    if (typeof data === "number") type = "number";
    if (typeof data === "boolean") type = "boolean";
    
    return addHashToValue(data, type);
  };

  // Function to create a Merkle Tree and generate a root hash
  const createMerkleRoot = (data: any[]): string => {
    const leaves = data.map(item => generateSHA3Hash(item));
    const merkleTree = new MerkleTree(leaves, SHA3, { sortPairs: true });
    return merkleTree.getRoot().toString("hex");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      await handleFileUpload(file);
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      setIsProcessing(true);
      setError(null);

      if (!Object.keys(ACCEPTED_FILE_TYPES).includes(file.type)) {
        throw new Error(`Unsupported file type. Please upload ${Object.values(ACCEPTED_FILE_TYPES).join(" or ")} file.`);
      }

      const fileContent = await file.text();
      let jsonData: any;

      jsonData = JSON.parse(fileContent);

      // Process the data to add hashes to all fields
      const processedData = processNestedData(jsonData);

      // Create Merkle Root for the data
      const merkleRoot = createMerkleRoot([processedData]);

      // Create the final TradeTrust document
      const ttFileContent = JSON.stringify({
        version: "open-attestation/3.0",
        data: processedData,
        signature: {
          type: "SHA3MerkleProof",
          targetHash: merkleRoot,
        },
        created_at: new Date().toISOString(),
      }, null, 2);

      setFileData({
        content: ttFileContent,
        fileName: file.name.replace(/\.[^/.]+$/, "")
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unexpected error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  const saveTTFile = () => {
    if (!fileData) return;
    
    const blob = new Blob([fileData.content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileData.fileName}.tt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavbarComponents />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Create Document</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-center">
                Create .tt file Document
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`
                  border-2 border-dashed rounded-lg p-8 
                  transition-colors duration-300 ease-in-out
                  ${dragActive 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-gray-300"
                  }
                  ${isProcessing ? "opacity-50 cursor-wait" : "cursor-pointer"}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleFileClick}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 mb-2">
                  {isProcessing ? "Processing file..." : (
                    <>
                      Drag and drop your files here, or{" "}
                      <span className="text-white-500 hover:text-white-600">
                        click to browse
                      </span>
                    </>
                  )}
                </p>
                <p className="text-xs text-gray-500">
                  Supported formats: {Object.values(ACCEPTED_FILE_TYPES).join(", ")}
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".json,.csv"
                  onChange={handleFileChange}
                  disabled={isProcessing}
                />
              </div>

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {fileData && (
                <div className="mt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-green-600">File processed successfully!</p>
                    <Button 
                      onClick={saveTTFile}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      Download .tt
                    </Button>
                  </div>
                  <div className="relative">
                    <pre className="mt-4 p-4 rounded-lg text-xs overflow-x-auto max-h-64">
                      {fileData.content}
                    </pre>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap justify-center gap-4 mt-6">
                <Link 
                  href="https://docs.tradetrust.io/docs/reference/document-creator/config-file/" 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm">
                    Learn How to Create One
                  </Button>
                </Link>
                <Link href="/load-config">
                  <Button variant="secondary" size="sm">
                    Create Config
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="hidden md:flex justify-center">
            <Image 
              src="/upload.svg" 
              alt="Upload illustration" 
              width={400} 
              height={400} 
              className="max-w-full"
              priority
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateDocsPage;
