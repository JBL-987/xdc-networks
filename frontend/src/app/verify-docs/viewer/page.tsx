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
import { CircleCheckBig } from "lucide-react";
const ViewerDocs = () => {
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
                <BreadcrumbLink asChild>
                  <Link href="/verify-docs">Verify Document</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>View</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex w-fit space-x-6 mt-2">
            <div className="flex items-center space-x-2">
              <CircleCheckBig size={20} className="text-green-500 mx-auto" />
              <div className="text-xs text-gray-800">
                Document has been issued
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <CircleCheckBig size={20} className="text-green-500 mx-auto" />
              <div className="text-xs text-gray-800">
                Document issuer has been identified
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <CircleCheckBig size={20} className="text-green-500 mx-auto" />
              <div className="text-xs text-gray-800">
                Document has not been tampered with
              </div>
            </div>
          </div>
          <div className="flex space-x-4">
            <Link href="/#" className="flex items-center justify-center mt-4">
              <Button variant="default" className="mt-4">
                Transferable
              </Button>
            </Link>
            <Link href="/#" className="flex items-center justify-center mt-4">
              <Button variant="default" className="mt-4">
                Negotiable
              </Button>
            </Link>
          </div>
          <div className="flex justify-between w-full space-x-16 mt-4">
            <div className="w-full flex flex-col space-y-4">
              <p className="text-gray-600 text-md">Bl Information :</p>
              <a
                href="/#"
                className="text-xs underline italic hover:text-blue-500"
              >
                View Bl Registry
              </a>
              <a
                href="/#"
                className="text-xs underline italic hover:text-blue-500"
              >
                View Endorsement Chain
              </a>
            </div>
            <div className="w-full flex flex-col space-y-2">
              <p className="text-gray-600 text-md">Beneficiary :</p>
              <p className="font-bold">
                Seller ABC
              </p>
              <a
                href="/#"
                className="text-xs italic text-blue-500"
              >
                0x43ASJHD9349DF9345013034532ADSFG
              </a>
            </div>
            <div className="w-full flex flex-col space-y-2">
              <p className="text-gray-600 text-md">Holder :</p>
              <p className="font-bold">
                Seller ABC
              </p>
              <a
                href="/#"
                className="text-xs italic text-blue-500"
              >
                0x43ASJHD9349DF9345013034532ADSFG
              </a>
            </div>
          </div>
          <section className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Document Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  <div className="flex items-center space-x-4 justify-end w-full">
                    <Button variant="secondary">Print</Button>
                    <Button variant="secondary">View</Button>
                  </div>
                  <div className="items-center w-full m-16">
                    <div className="text-sm text-center text-gray-500">
                      Document Preview here...
                    </div>
                  </div>
                </CardDescription>
              </CardContent>
            </Card>
          </section>
          <section className="justify-between mx-auto flex items-center gap-2 py-4"></section>
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

export default ViewerDocs;
