"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Upload } from "lucide-react";
import NavbarComponents from "@/components/layouts/NavbarComponents";

const DOCUMENT_TYPES = [
  {
    name: "XDC Verify Network Bill of Lading v2 (Carrier)",
    fields: [
      { label: "Bill Number", type: "text", required: true, placeholder: "Enter Bill Number", validation: /^[A-Z0-9]{10}$/ },
      { label: "Carrier Name", type: "text", required: true, placeholder: "Enter Carrier Name" },
      { label: "Vessel Name", type: "text", required: true, placeholder: "Enter Vessel Name" },
      { label: "Port of Loading", type: "text", required: true, placeholder: "Enter Port of Loading" },
      { label: "Port of Discharge", type: "text", required: true, placeholder: "Enter Port of Discharge" },
      { label: "Container Numbers", type: "text", required: true, placeholder: "Enter Container Numbers (comma-separated)" },
      { label: "Issue Date", type: "date", required: true },
      { label: "Expiry Date", type: "date", required: true },
    ],
  },
  {
    name: "XDC Verify Network ChAFTA Certificate of Origin v2",
    fields: [
      { label: "Certificate Number", type: "text", required: true, placeholder: "Enter Certificate Number", validation: /^COO-[A-Z0-9]{8}$/ },
      { label: "Country of Origin", type: "text", required: true, placeholder: "Enter Country of Origin" },
      { label: "Exporter Details", type: "textarea", required: true, placeholder: "Enter Exporter Details" },
      { label: "Importer Details", type: "textarea", required: true, placeholder: "Enter Importer Details" },
      { label: "HS Code", type: "text", required: true, placeholder: "Enter HS Code" },
      { label: "Product Description", type: "textarea", required: true, placeholder: "Enter Product Description" },
      { label: "Issue Date", type: "date", required: true },
    ],
  },
  {
    name: "XDC Verify Network Invoice v2 (DNS-DID)",
    fields: [
      { label: "Invoice Number", type: "text", required: true, placeholder: "Enter Invoice Number", validation: /^INV-[0-9]{6}$/ },
      { label: "Amount", type: "number", required: true, placeholder: "Enter Amount" },
      { label: "Currency", type: "select", required: true, options: ["USD", "EUR", "GBP", "JPY", "CNY"] },
      { label: "Buyer Details", type: "textarea", required: true, placeholder: "Enter Buyer Details" },
      { label: "Seller Details", type: "textarea", required: true, placeholder: "Enter Seller Details" },
      { label: "Payment Terms", type: "select", required: true, options: ["Net 30", "Net 60", "Net 90", "Immediate"] },
      { label: "Issue Date", type: "date", required: true },
      { label: "Due Date", type: "date", required: true },
    ],
  },
];

const LoadconfigPage = () => {
  const [selectedDocType, setSelectedDocType] = useState(null);
  const [formData, setFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const getProgressWidth = () => selectedDocType ? "50%" : "20%";

  const handleDocTypeSelect = (docType) => {
    setSelectedDocType(docType);
    setFormData({});
  };

  const handleFieldChange = (fieldLabel, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldLabel]: value,
    }));
  };

  const handleSubmit = () => {
    // Validate required fields
    const missingFields = selectedDocType.fields
      .filter(field => field.required && !formData[field.label])
      .map(field => field.label);

    if (missingFields.length > 0) {
      alert(`Please fill in required fields: ${missingFields.join(", ")}`);
      return;
    }

    // Process form submission
    alert("Form submitted: " + JSON.stringify(formData, null, 2));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavbarComponents />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <Card className="w-full">
            <CardHeader className="text-center">
              <Navigation />
              <DocumentSearch onSearch={setSearchTerm} />
            </CardHeader>
            <CardContent>
              <ProgressBar progress={getProgressWidth()} />
              <div className="space-y-6">
                <FileUpload />
                <div className="divider text-center">
                  <span className="text-sm text-muted-foreground">or</span>
                </div>
                <DocumentTypeSelector
                  selectedDocType={selectedDocType}
                  onSelectDocType={handleDocTypeSelect}
                />
                {selectedDocType && (
                  <DocumentForm
                    selectedDocType={selectedDocType}
                    formData={formData}
                    onFieldChange={handleFieldChange}
                    onSubmit={handleSubmit}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          <div className="hidden lg:block text-center">
            <Image
              src="/upload.svg"
              alt="Upload illustration"
              width={300}
              height={300}
              className="mx-auto"
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

// Navigation component (preserved from original)
const Navigation = () => (
  <div className="flex justify-center space-x-4 mb-4">
    <Link
      href="/create-docs"
      className="underline text-primary hover:text-primary/80 transition-colors"
    >
      Create Document
    </Link>
    <Link
      href="/revoke-docs"
      className="underline text-primary hover:text-primary/80 transition-colors"
    >
      Revoke Document
    </Link>
  </div>
);

// Progress Bar component (preserved from original)
const ProgressBar = ({ progress }) => (
  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
    <div
      className="bg-primary h-2.5 rounded-full"
      style={{ width: progress }}
    />
  </div>
);

// Document Type Selector (preserved and enhanced)
const DocumentTypeSelector = ({ selectedDocType, onSelectDocType }) => (
  <>
    <h3 className="text-center text-lg font-medium mb-4">
      Choose Document Type to Issue
    </h3>
    <div className="flex flex-col space-y-3">
      {DOCUMENT_TYPES.map((docType, index) => (
        <Button
          key={index}
          variant={selectedDocType === docType ? "primary" : "outline"}
          size="sm"
          onClick={() => onSelectDocType(docType)}
          className="whitespace-normal h-auto py-2 gap-2"
        >
          <span className="text-xs">{docType.name}</span>
        </Button>
      ))}
    </div>
  </>
);

// Document Form (enhanced with validation)
const DocumentForm = ({ selectedDocType, formData, onFieldChange, onSubmit }) => (
  <div className="space-y-4">
    <h4 className="text-md font-semibold text-center mb-4">
      Fill form for: {selectedDocType.name}
    </h4>
    {selectedDocType.fields.map((field, index) => (
      <div key={index} className="flex flex-col gap-2">
        <label className="text-sm font-medium">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
          type={field.type}
          placeholder={field.placeholder}
          value={formData[field.label] || ""}
          onChange={(e) => onFieldChange(field.label, e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full"
          required={field.required}
        />
      </div>
    ))}
    <div className="text-center mt-6">
      <Button
        variant="primary"
        size="md"
        onClick={onSubmit}
      >
        Submit
      </Button>
    </div>
  </div>
);

// Recent Documents component (new)
const RecentDocuments = () => (
  <div className="mt-6">
    <h3 className="text-lg font-medium mb-4">Recent Documents</h3>
    <div className="space-y-2">
      {[
        { id: 1, type: "Bill of Lading", number: "BOL123456", status: "Active" },
        { id: 2, type: "Certificate", number: "COO-12345678", status: "Pending" },
      ].map((doc) => (
        <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
          <div>
            <p className="font-medium">{doc.type}</p>
            <p className="text-sm text-muted-foreground">{doc.number}</p>
          </div>
          <Badge variant={doc.status === "Active" ? "success" : "warning"}>
            {doc.status}
          </Badge>
        </div>
      ))}
    </div>
  </div>
);

// Document Search component (new)
const DocumentSearch = ({ onSearch }) => (
  <div className="relative mb-4">
    <Input
      type="text"
      placeholder="Search documents..."
      className="pl-10"
      onChange={(e) => onSearch(e.target.value)}
    />
    <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
  </div>
);

// File Upload component (new)
const FileUpload = () => (
  <div className="border-2 border-dashed rounded-lg p-6 text-center">
    <Upload className="w-8 h-8 mx-auto mb-2 text-primary" />
    <p className="text-sm text-muted-foreground">
      Drag and drop files here or
      <Button variant="link" className="px-1">browse</Button>
    </p>
    <p className="text-xs text-muted-foreground mt-1">
      Supported formats: PDF, DOCX, XML (max 10MB)
    </p>
  </div>
);

// Footer component (preserved from original)
const Footer = () => (
  <footer className="border-t border-border/40 py-6">
    <div className="container text-center">
      <p className="text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} XDC Network. All rights reserved.
      </p>
    </div>
  </footer>
);

export default LoadconfigPage;