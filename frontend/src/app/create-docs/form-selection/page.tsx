'use client';
import React from "react";
import NavbarComponents from "@/components/layouts/NavbarComponents";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const manuChoose = [
  {
    title: "Create a new document",
    link: "/create-docs/form-selection"
  },
  {
    title: "Revoke a document",
    link: "/create-docs/revoke"
  }
];

const menuForm = [
  "Tradetrust Bill of Lading v2 (Carrier)",
  "TradeTrust ChaAFTA Certification of Origin v2",
  "TradeTrust Invoice v2 (DNS-DID)"
];

const FormSelectionPage = () => {
  const currentPath =
    typeof window !== "undefined"
      ? window.location.pathname
      : "/create-docs/form-selection";
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
        <div className="flex">
          {manuChoose.map((item, index) => {
            const isActive = currentPath === item.link;
            return (
              <a
                href={isActive ? undefined : item.link}
                key={index}
                className={`block p-4 ${
                  isActive
                    ? "text-gray-500 cursor-not-allowed"
                    : "hover:underline hover:text-blue-800"
                }`}
              >
                <h2 className="text-xs">{item.title}</h2>
              </a>
            );
          })}
        </div>
        <section className="justify-between mx-auto flex items-center">
          <Card className="w-3/4">
            <CardHeader>
              <CardTitle>Choose Document Type to Issue</CardTitle>
              <CardContent>
                <div className="flex gap-4 pt-4">
                  {menuForm.map((item, index) => (
                    <div className="text-xs text-center items-center">
                      <div className="border border-spacing-2 p-2 h-full cursor-pointer hover:text-blue-800 hover:border-blue-800">
                        <a href="/create-docs/form" key={index}>
                          {item}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </CardHeader>
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

export default FormSelectionPage;
