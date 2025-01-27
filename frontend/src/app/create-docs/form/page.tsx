"use client";
import React from "react";
import { useState } from "react";
import Link from "next/link";
import NavbarComponents from "@/components/layouts/NavbarComponents";
import Image from "next/image";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const docTypes = [
  {
    name: "TradeTrust Bill of Lading v2 (Carrier)",
    value: "billoflading"
  },
  {
    name: "TradeTrust ChaFTA Certification of Origin v2",
    value: "co"
  },
  {
    name: "TradeTrust Invoice v2 (DNS-DID)",
    value: "invoice"
  }
];


const FormPage = () => {
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
    <div className="container flex flex-col min-h-screen">
      <NavbarComponents />
      <main className="min-h-[calc(100vh-57px-97px)] flex-1">
        <div className="relative max-w-[1280px] pt-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/create-docs">Upload Document</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Create Document</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <section className="justify-between mx-auto flex items-center pt-8">
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Fiil The Form</CardTitle>
                <CardContent>
                  <div className="flex gap-48 pt-8">
                    <Select>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="TradeTrust Bill of Lading v2 (Carrier)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Select Form</SelectLabel>
                          {docTypes.map((docType) => (
                            <SelectItem
                              key={docType.value}
                              value={docType.value}
                            >
                              {docType.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Add New
                      </Button>
                      <Button variant="default" size="sm">
                        Issue Document(s)
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
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
                      You can either upload data file (.JSON or .CSV) to
                      pre-fill field on this form or enter the fields
                      manually&nbsp;
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
                  <div className="flex justify-between mt-2">
                    <span
                      className="text-blue-500 cursor-pointer underline text-xs"
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = "/sample-data.json";
                        link.download = "sample-data.json";
                        link.click();
                      }}
                    >
                      Download JSON Data Schema Sample
                    </span>

                    <span
                      className="text-blue-500 cursor-pointer underline text-xs"
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = "/sample-data.csv";
                        link.download = "sample-data.csv";
                        link.click();
                      }}
                    >
                      Download CSV Data Schema Sample
                    </span>
                  </div>
                  <div className="mt-8">
                    {/* document name */}
                    <Label htmlFor="document-name">Document Name</Label>
                    <Input
                      id="document-name"
                      type="text"
                      placeholder="Enter Document Name"
                    />
                  </div>

                  <div className="mt-8 space-y-4">
                    {/* Transferable Record Owner */}
                    <CardTitle>Transferable Record Owner</CardTitle>
                    <div className="flex flex-col space-y-2">
                      {/* owner */}
                      <Label htmlFor="owner">Owner</Label>
                      <Input id="owner" type="text" placeholder="Enter Owner" />

                      {/* holder */}
                      <Label htmlFor="holder" className="mt-4">Holder</Label>
                      <Input
                        id="holder"
                        type="text"
                        placeholder="Enter Holder"
                      />
                    </div>
                  </div>
                  <Separator className="my-4" />
                </CardContent>
              </CardHeader>
            </Card>
          </div>
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

export default FormPage;
