"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import DashboardStats from "@/components/demo/dashboard/DashboardStats";
import DocumentUpload from "@/components/demo/dashboard/DocumentUpload";
import { columns } from "@/components/demo/dashboard/columns";
import DataTable from "@/components/demo/dashboard/data-table";
import { useSidebar } from "@/hooks/use-sidebar";
import { useStore } from "@/hooks/use-store";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

// Define the interface for document details
interface DocumentDetails {
  id: string;
  fileName: string;
  description: string;
  owner: string;
  status: "verified" | "pending" | "rejected";
  document_hash: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function DashboardPage() {
  const [documents, setDocuments] = useState<DocumentDetails[]>([]);

  // Fetch documents from the backend
  const fetchDocuments = async () => {
    try {
      const response = await axios.get("http://localhost:5001/verificator/getalldoc");
      const fetchedDocuments: DocumentDetails[] = response.data.allDocuments.map((doc: any) => ({
        id: doc.hash,
        fileName: doc.metadataURI?.filename || "Unknown",
        description: doc.metadataURI?.description || "No description provided",
        owner: doc.owner,
        status: doc.isVerified ? "verified" : "pending", // Assuming "rejected" status needs additional logic
        document_hash: doc.hash,
        createdAt: new Date(parseInt(doc.timestamp) * 1000),
        updatedAt: new Date(parseInt(doc.lastVerificationTimestamp || doc.timestamp) * 1000),
      }));
      setDocuments(fetchedDocuments);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  // Calculate statistics
  const calculateStats = () => {
    const stats = {
      verified: 0,
      pending: 0,
      rejected: 0,
    };

    documents.forEach((doc) => {
      if (doc.status === "verified") stats.verified++;
      else if (doc.status === "pending") stats.pending++;
      else if (doc.status === "rejected") stats.rejected++;
    });

    return stats;
  };

  const stats = calculateStats();

  // Handle upload success
  const handleUploadSuccess = (newDocument: DocumentDetails) => {
    setDocuments((prev) => [
      ...prev,
      {
        id: newDocument.id,
        fileName: newDocument.fileName,
        description: newDocument.description,
        owner: newDocument.owner,
        status: newDocument.status || "pending",
        document_hash: newDocument.document_hash,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const sidebar = useStore(useSidebar, (x) => x);

  if (!sidebar) return null;

  return (
    <ContentLayout title="Dashboard">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <section className="mt-4">
        {/* Status card section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <DashboardStats
            status="Verified"
            count={stats.verified}
            icon={CheckCircle2}
            variant="green"
          />
          <DashboardStats
            status="Pending"
            count={stats.pending}
            icon={Clock}
            variant="yellow"
          />
          <DashboardStats
            status="Rejected"
            count={stats.rejected}
            icon={XCircle}
            variant="red"
          />
        </div>
        {/* End Status Card Section */}

        {/* Document Upload */}
        <div className="block">
          <div className="w-full">
            <DocumentUpload onUploadSuccess={handleUploadSuccess} />
          </div>
        </div>
        {/* End Document Upload */}

        <div className="mt-4">
        <DataTable data={documents} columns={columns} />
        </div>
        {/* Data Table */}
      </section>
    </ContentLayout>
  );
}