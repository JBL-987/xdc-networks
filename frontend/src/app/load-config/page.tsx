"use client";
import React, { useCallback, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { FileText, Download, CheckCircle, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import NavbarComponents from "@/components/layouts/NavbarComponents";

const DOCUMENT_TYPES = [
  {
    name: "XDC Verify Network Bill of Lading v2 (Carrier)",
    icon: <FileText className= "w-6 h-6" />,
    fields: [
      {
        label: "Document Name",
        type: "text",
        required: true,
        placeholder: "Enter document name",
        validation: /^[A-Z0-9]{10}$/
      },
      {
        label: "Owner",
        type: "text",
        required: true,
        placeholder: "Enter carrier company name"
      },
      {
        label: "Holder",
        type: "text",
        required: true,
        placeholder: "Enter holder name"
      },
      {
        label: "B/L Number",
        type: "text",
        required: true,
        placeholder: "Enter bill of lading number",
        validation: /^[A-Z0-9-]{6,20}$/
      },
      {
        label: "Standard Carrier Alpha Code (SCAC)",
        type: "text",
        required: true,
        placeholder: "Enter 4-character SCAC code",
        validation: /^[A-Z]{4}$/
      },
      {
        label: "Signed for the Carrier",
        type: "text",
        required: true,
        placeholder: "Enter signatory name"
      },
      {
        label: "Name",
        type: "text",
        required: true,
        placeholder: "Enter full name"
      },
      {
        label: "Street",
        type: "text",
        required: true,
        placeholder: "Enter street address"
      },
      {
        label: "Country",
        type: "text",
        required: true,
        placeholder: "Enter country name"
      },
      {
        label: "Onward Inland Routing",
        type: "text",
        required: true,
        placeholder: "Enter routing details"
      },
      {
        label: "Consignee Details",
        type: "text",
        required: true,
        placeholder: "Enter consignee information (e.g. TO ORDER OF, TO ORDER)"
      },
      {
        label: "Vessel",
        type: "text",
        required: true,
        placeholder: "Enter vessel name"
      },
      {
        label: "Voyage No.",
        type: "text",
        required: true,
        placeholder: "Enter voyage number"
      },
      {
        label: "Port of Loading",
        type: "text",
        required: true,
        placeholder: "Enter port of loading"
      },
      {
        label: "Port of Discharge",
        type: "text",
        required: true,
        placeholder: "Enter port of discharge"
      },
      {
        label: "Place of Receipt",
        type: "text",
        required: true,
        placeholder: "Enter place of receipt"
      },
      {
        label: "Place of Delivery",
        type: "text",
        required: true,
        placeholder: "Enter place of delivery"
      },
      {
        label: "Carrier's Receipt",
        type: "text",
        required: true,
        placeholder: "Enter carrier's receipt details"
      },
      {
        label: "Place of Issue of B/L",
        type: "text",
        required: true,
        placeholder: "Enter place where B/L was issued"
      },
      {
        label: "Number of Original B/L",
        type: "number",
        required: true,
        placeholder: "Enter number of original B/L copies",
        validation: /^[1-9][0-9]?$/
      },
      {
        label: "Date of Issue of B/L",
        type: "date",
        required: true
      },
      {
        label: "Shipped on Board Date",
        type: "date",
        required: true
      },
      {
        label: "Signed for Terms and Conditions",
        type: "textarea",
        required: true,
        placeholder: "Enter carrier signature text"
      },
      {
        label: "Text for Signed for Carrier",
        type: "text",
        required: true,
        placeholder: "Enter carrier signature text"
      },
      {
        label: "Carrier Signature",
        type: "file",
        required: true,
        accept: "image/*"
      },
      {
        label: "Terms of Carriage",
        type: "textarea",
        required: true,
        placeholder: "Enter terms of carriage"
      },
      {
        label: "Attachments",
        type: "file",
        required: true,
        multiple: true,
        accept: ".pdf,.doc,.docx,image/*"
      }
    ]
  },
  {
    name: "XDC Verify ChAFTA Certificate of Origin v2",
    icon: <FileText className="w-6 h-6" />,
    fields: [
      {
        label: "Document Name",
        type: "text",
        required: true,
        placeholder: "Enter document name",
        validation: /^[A-Z0-9]{10}$/
      },
      {
        label: "COO ID",
        type: "text",
        required: true,
        placeholder: "Enter COO ID"
      },
      {
        label: "Issued Date & Time",
        type: "datetime-local",
        required: true,
        placeholder: "Enter issue date and time"
      },
      {
        label: "First Signatory",
        type: "text",
        required: true,
        placeholder: "Enter first signatory"
      },
      {
        label: "Consignment Information",
        type: "text",
        required: true,
        placeholder: "Enter consignment information"
      },
      {
        label: "Country Code",
        type: "text",
        required: true,
        placeholder: "Enter country code"
      },
      {
        label: "Name",
        type: "text",
        required: true,
        placeholder: "Enter name"
      },
      {
        label: "Address Line 1",
        type: "text",
        required: true,
        placeholder: "Enter address line 1"
      },
      {
        label: "Address Line 2",
        type: "text",
        required: true,
        placeholder: "Enter address line 2"
      },
      {
        label: "City",
        type: "text",
        required: true,
        placeholder: "Enter city"
      },
      {
        label: "Postal Code",
        type: "text",
        required: true,
        placeholder: "Enter postal code"
      },
      {
        label: "Country Sub Division Name",
        type: "text",
        required: true,
        placeholder: "Enter country subdivision"
      },
      {
        label: "Importer ID",
        type: "text",
        required: true,
        placeholder: "Enter importer ID"
      },
      {
        label: "Add Item",
        type: "file",
        required: true,
        accept: "image/*"
      },
      {
        label: "ID",
        type: "textarea",
        required: true,
        placeholder: "Enter ID details"
      },
      {
        label: "Name",
        type: "file",
        required: true,
        multiple: true,
        accept: ".pdf,.doc,.docx,image/*"
      },
      {
        label: "Attachments",
        type: "file",
        required: true,
        multiple: true,
        accept: ".pdf,.doc,.docx,image/*"
      }
    ]
  },
  {
    name: "XDC Verify Network Invoice v2(DNS-DID)",
    icon: <FileText className="w-6 h-6" />,
    fields: [
      {
        label: "Document Name",
        type: "text",
        required: true,
        placeholder: "Enter document name",
        validation: /^[A-Z0-9]{10}$/
      },
      {
        label: "Invoice ID",
        type: "text",
        required: true,
        placeholder: "Enter invoice ID"
      },
      {
        label: "Date",
        type: "date",
        required: true,
        placeholder: "Enter date"
      },
      {
        label: "Customer ID",
        type: "text",
        required: true,
        placeholder: "Enter customer ID"
      },
      {
        label: "Terms",
        type: "text",
        required: true,
        placeholder: "Enter terms"
      },
      {
        label: "Street Address",
        type: "text",
        required: true,
        placeholder: "Enter street address"
      },
      {
        label: "City",
        type: "text",
        required: true,
        placeholder: "Enter city"
      },
      {
        label: "Postal Code",
        type: "text",
        required: true,
        placeholder: "Enter postal code"
      },
      {
        label: "Phone Number",
        type: "text",
        required: true,
        placeholder: "Enter phone number"
      },
      {
        label: "Email",
        type: "email",
        required: true,
        placeholder: "Enter email"
      },
      {
        label: "Add Item",
        type: "text",
        required: true,
        placeholder: "Enter item details"
      },
      {
        label: "Subtotal",
        type: "text",
        required: true,
        placeholder: "Enter subtotal"
      },
      {
        label: "Tax (%)",
        type: "number",
        required: true,
        placeholder: "Enter tax percentage",
        validation: /^[1-9][0-9]?$/
      },
      {
        label: "Tax Total",
        type: "number",
        required: true,
        placeholder: "Enter tax total"
      },
      {
        label: "Total",
        type: "number",
        required: true,
        placeholder: "Enter total amount"
      }
    ]
  }
];

const LoadconfigPage = () => {
  const [selectedDocType, setSelectedDocType] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const getProgressWidth = () => selectedDocType ? '100%' : '50%';

  const validateField = (field, value) => {
    if (field.required && !value) {
      return `${field.label} is required`;
    }
    if (field.validation && !field.validation.test(value)) {
      return `Invalid ${field.label} format`;
    }
    return null;
  };

  const handleDocTypeSelect = useCallback((docType) => {
    setSelectedDocType(docType);
    setFormData({});
    setErrors({});
  }, []);

  const handleFieldChange = useCallback((field, value) => {
    const error = validateField(field, value);
    setFormData(prev => ({
      ...prev,
      [field.label]: value
    }));
    setErrors(prev => ({
      ...prev,
      [field.label]: error
    }));
  }, []);

  const clearForm = () => {
    Swal.fire({
      title: "Are you sure to clear this form?",
      text: "You won't be able to reverse this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, clear it!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({ title: "Cleared!", icon: "success" });
        setFormData({});
        setSelectedDocType(null);
        setErrors({});
      }
    });
  };

  const exportData = (format) => {
    try {
      const jsonData = {
        documentType: selectedDocType?.name,
        data: { ...formData },
        timestamp: new Date().toISOString()
      };

      const content = format === 'json' 
        ? JSON.stringify(jsonData, null, 2)
        : Object.entries(formData).map(([key, value]) => `${key},${value}`).join('\n');

      const blob = new Blob(
        [content], 
        { type: format === 'json' ? 'application/json' : 'text/csv' }
      );

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `document_${Date.now()}.${format}`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Export Failed",
        text: "Failed to export data"
      });
    }
  };

  const renderField = (field) => {
    const value = formData[field.label] || '';
    const error = errors[field.label];

    switch (field.type) {
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            className={`w-full border rounded-md p-2 ${error ? 'border-red-500' : ''}`}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      case 'textarea':
        return (
          <textarea
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            rows={3}
            className={`w-full border rounded-md p-2 ${error ? 'border-red-500' : ''}`}
          />
        );
      default:
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            className={error ? 'border-red-500' : ''}
          />
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavbarComponents />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <Card className="w-full">
            <CardHeader className="text-center">
              <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
                <Link href="/create-docs" className="text-primary hover:text-primary/80">
                  Create Document
                </Link>
                <Link href="/revoke-docs" className="text-primary hover:text-primary/80">
                  Revoke Document
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-grey rounded-full h-2.5 mb-4">
                <div
                  className="bg-primary h-2.5 rounded-full transition-all duration-300"
                  style={{ width: getProgressWidth() }}
                />
              </div>

              <div className="space-y-6">
                <div className="divider text-center">
                  <span className="text-sm text-muted-foreground">or</span>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-center">Choose Document Type</h3>
                  <div className="space-y-2">
                    {DOCUMENT_TYPES.map((docType, index) => (
                      <Button
                        key={index}
                        variant={selectedDocType === docType ? 'default' : 'outline'}
                        className="w-full justify-start text-left"
                        onClick={() => handleDocTypeSelect(docType)}
                      >
                        <span className="mr-2">{docType.icon}</span>
                        <span className="text-sm">{docType.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {selectedDocType && (
                  <div className="space-y-4">
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearForm}
                        className="flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Clear Form
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-md font-medium">Fill the form</h4>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {selectedDocType.fields.map((field, index) => (
                          <div key={index} className="space-y-2">
                            <label className="text-sm font-medium">
                              {field.label}
                              {field.required && (
                                <span className="text-red-500 ml-1">*</span>
                              )}
                            </label>
                            {renderField(field)}
                            {errors[field.label] && (
                              <p className="text-red-500 text-sm">{errors[field.label]}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 mt-4">
                      <Button
                        variant="outline"
                        onClick={() => exportData('json')}
                        className="flex items-center gap-2 w-full sm:w-auto"
                      >
                        <Download className="w-4 h-4" />
                        Download JSON
                      </Button>
                    </div>
                  </div>
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
              priority
            />
          </div>
        </div>
      </main>
      
      <footer className="border-t py-6">
        <div className="container text-center">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} XDC Network. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LoadconfigPage;