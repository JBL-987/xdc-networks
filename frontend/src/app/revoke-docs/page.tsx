"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Upload } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import NavbarComponents from "@/components/layouts/NavbarComponents";
import Swal from "sweetalert2";

const RevokeDocsPage = () => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelection(files);
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files);
    }
  };

  const handleFileSelection = (files: FileList) => {
    const selectedFile = files[0];
    if (selectedFile) {
      setFileName(selectedFile.name);
      Swal.fire({
        title: "File Selected",
        text: `You have selected ${selectedFile.name}`,
        icon: "success",
        confirmButtonText: "OK",
      });
    }
  };

  const handleRevokeClick = () => {
    if (fileName) {
      // Simulate the revoke action
      Swal.fire({
        title: "Are you sure?",
        text: `Do you want to revoke the document: ${fileName}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, revoke it!",
        cancelButtonText: "No, cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          // Simulate successful revoke
          Swal.fire({
            title: "Revoked!",
            text: `${fileName} has been successfully revoked.`,
            icon: "success",
            confirmButtonText: "OK",
          });
          setFileName(null); // Reset after revocation
        }
      });
    } else {
      Swal.fire({
        title: "No file selected",
        text: "Please select a file to revoke.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavbarComponents />
      <main className="flex-1 container mx-auto px-4 py-6">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Revoke Document</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-center">Revoke Document</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors duration-300 ${
                  dragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleFileClick}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 mb-4">
                  Drag and drop your files here to revoke it or{" "}
                  <span className="text-white-500 hover:underline">
                    click to browse
                  </span>
                </p>
                {fileName && (
                  <p className="text-sm text-gray-600 mb-4">Selected file: {fileName}</p>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".tt"
                  onChange={handleFileChange}
                />
              </div>
              <div className="text-center mt-6">
                <Button
                  onClick={handleRevokeClick}
                >
                  Revoke Document
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="hidden md:flex justify-center">
            <Image
              src="/upload.svg"
              alt="Upload illustration"
              width={300}
              height={300}
              className="max-w-full"
            />
          </div>
        </div>
      </main>

      <footer className="border-t border-border/40 py-6">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} XDC Network. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default RevokeDocsPage;
