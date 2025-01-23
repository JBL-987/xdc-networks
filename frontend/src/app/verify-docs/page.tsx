"use client";
import NavbarComponents from "@/components/layouts/NavbarComponents";
import React, { useState } from "react";
import { Upload } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

const CreateDocsPage = () => {
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDragOver = (e: any) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    setDragActive(false);
    const files = e.dataTransfer.files;
    validateFile(files[0]);
  };

  const handleFileClick = () => {
    const fileInput = document.querySelector<HTMLInputElement>("#fileInput");
    fileInput?.click();
  };

  const handleFileChange = (e: any) => {
    const files = e.target.files;
    if (files.length > 0) {
      validateFile(files[0]);
    }
  };

  const validateFile = (file: File) => {
    const allowedExtensions = /\.tt$/i;
    if (!allowedExtensions.test(file.name)) {
      setErrorMessage(
        "Document is invalid\nThis document is not valid. Please upload a valid document."
      );
    } else {
      setErrorMessage(null);
      console.log("Valid file selected:", file);
  
      // Simulate clicking a link
      const link = document.createElement('a');
      link.href = '/verify-docs/viewer';
      link.click();
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavbarComponents />
      <main className="min-h-[calc(100vh-57px-97px)] flex-1">
        <div className="container relative max-w-[1280px] pt-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Verify Document</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <section className="justify-between mx-auto flex items-center gap-2 py-4">
            <Card className="w-3/4">
              <CardHeader>
                <CardTitle>Verify Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-300 py-32 ${
                    dragActive
                      ? "border-blue-500 bg-blue-50"
                      : errorMessage
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={handleFileClick}
                >
                  <Upload
                    className={`mx-auto h-12 w-12 ${
                      errorMessage ? "text-red-500" : "text-gray-400"
                    }`}
                  />
                  <p className="mt-2 text-sm text-gray-600">
                    Drag and drop your files here, or{" "}
                    <span className="hover:text-blue-500 underline cursor-pointer">
                      click to browse
                    </span>
                  </p>
                  {errorMessage && (
                    <div className="mt-4 text-left text-red-600 whitespace-pre-line">
                      {errorMessage}
                    </div>
                  )}
                  <input
                    id="fileInput"
                    type="file"
                    className="hidden"
                    accept=".tt"
                    onChange={handleFileChange}
                  />
                </div>
                {errorMessage && (
                  <div className="mt-4 flex flex-col items-center">
                    <Link
                        href="https://www.tradetrust.io/common-error-faqs/"
                        className="mb-2"
                    >
                    <Button 
                    className="mb-2">What should I do?</Button>
                    </Link>
                    <a
                      onClick={handleFileClick}
                      className="underline hover:text-blue-700 cursor-pointer"
                    >
                      Try another document
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
            <div className="lg:flex hidden w-full">
              <Image
                src="/upload.svg"
                alt="upload"
                width={300}
                height={300}
                className="mx-auto"
              />
            </div>
          </section>
        </div>
      </main>

      <footer className="py-6 border-t border-border/40">
        <div className="container flex flex-col items-center justify-center gap-4">
          <p className="text-center text-sm leading-loose text-muted-foreground">
            &copy; 2024 XDC Network. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CreateDocsPage;
