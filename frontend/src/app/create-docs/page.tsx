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
    if (files.length > 0) {
      console.log("Files dropped:", files);
    }
  };

  const handleFileClick = () => {
    const fileInput = document.querySelector<HTMLInputElement>("#fileInput");
    fileInput?.click();
  };

  const handleFileChange = (e: any) => {
    const files = e.target.files;
    if (files.length > 0) {
      console.log("Files selected:", files);
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
                <BreadcrumbPage>Upload Docuemnt</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <section className="justify-between mx-auto flex items-center gap-2 py-4">
            <Card className="w-1/2">
              <CardHeader>
                <CardTitle>Create and Revoke Document</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-300 ${
                    dragActive
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={handleFileClick}
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Drag and drop your files here, or{" "}
                    <span className="hover:text-blue-500 underline cursor-pointer">
                      click to browse
                    </span>
                  </p>
                  <input
                    id="fileInput"
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                  />
                </div>
              </CardContent>
                  <div className="mb-8 space-y-5 ">
                    <p className="text-xs text-center">don't have config file?</p>
                    <div className="flex space-x-4 mx-auto text-center justify-center">
                      <Link href="https://docs.tradetrust.io/docs/reference/document-creator/config-file/">
                        <Button variant="outline" size="sm">
                          <span className="text-xs">
                            Learn How to Create One
                          </span>
                        </Button>
                      </Link>
                      <Link href="/create-docs/form-selection">
                        <Button variant="default" size="sm">
                          <span className="text-xs">Load Demo Config</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
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
