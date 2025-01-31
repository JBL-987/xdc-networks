"use client";
import { useRouter } from "next/navigation";
import NavbarComponents from "@/components/layouts/NavbarComponents";
import React, { useState, useEffect } from "react";
import { Upload, Wallet2, ExternalLink, AlertCircle, CircleCheckBig } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DocumentDetails {
  beneficiary: {
    name: string;
    address: string;
  };
  holder: {
    name: string;
    address: string;
  };
  isTransferable: boolean;
  isNegotiable: boolean;
  status: {
    isIssued: boolean;
    isVerified: boolean;
    isUntampered: boolean;
  };
}

interface WalletState {
  account: string;
  networkName: string;
  error: string;
  isConnecting: boolean;
}

const ViewerDocs = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    account: '',
    networkName: '',
    error: '',
    isConnecting: false
  });

  const [documentDetails, setDocumentDetails] = useState<DocumentDetails>({
    beneficiary: {
      name: "Connected Wallet",
      address: ""
    },
    holder: {
      name: "Connected Wallet",
      address: ""
    },
    isTransferable: true,
    isNegotiable: true,
    status: {
      isIssued: true,
      isVerified: true,
      isUntampered: true
    }
  });

  // Check if wallet is connected and update document details
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setWalletState(prev => ({
              ...prev,
              account: accounts[0],
              networkName: 'XDC Mainnet'
            }));

            // Update document details with connected wallet address
            setDocumentDetails(prev => ({
              ...prev,
              beneficiary: {
                name: "Connected Wallet",
                address: accounts[0]
              },
              holder: {
                name: "Connected Wallet",
                address: accounts[0]
              }
            }));
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };

    checkWalletConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setWalletState(prev => ({
            ...prev,
            account: accounts[0]
          }));

          // Update document details when account changes
          setDocumentDetails(prev => ({
            ...prev,
            beneficiary: {
              name: "Connected Wallet",
              address: accounts[0]
            },
            holder: {
              name: "Connected Wallet",
              address: accounts[0]
            }
          }));
        } else {
          // Handle disconnection
          setWalletState(prev => ({
            ...prev,
            account: '',
            networkName: ''
          }));
        }
      });

      return () => {
        window.ethereum.removeListener('accountsChanged', () => {});
      };
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleView = () => {
    console.log("Opening full view");
  };

  const formatAddress = (address: string) => {
    return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavbarComponents />
      <main className="min-h-[calc(100vh-57px-97px)] flex-1">
        <div className="container relative max-w-[1280px] pt-2">
          <div className="flex justify-between items-center">
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

            {/* Wallet Connection Status */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  {walletState.account ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Wallet2 className="w-4 h-4" />
                      {formatAddress(walletState.account)}
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Wallet2 className="w-4 h-4" />
                      Not Connected
                    </Button>
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  {walletState.account ? 'Connected to MetaMask' : 'Please connect your wallet'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Status Indicators */}
          <div className="flex w-fit space-x-6 mt-2">
            {documentDetails.status.isIssued && (
              <div className="flex items-center space-x-2">
                <CircleCheckBig size={20} className="text-green-500 mx-auto" />
                <div className="text-xs text-gray-800">
                  Document has been issued
                </div>
              </div>
            )}
            {documentDetails.status.isVerified && (
              <div className="flex items-center space-x-2">
                <CircleCheckBig size={20} className="text-green-500 mx-auto" />
                <div className="text-xs text-gray-800">
                  Document issuer has been identified
                </div>
              </div>
            )}
            {documentDetails.status.isUntampered && (
              <div className="flex items-center space-x-2">
                <CircleCheckBig size={20} className="text-green-500 mx-auto" />
                <div className="text-xs text-gray-800">
                  Document has not been tampered with
                </div>
              </div>
            )}
          </div>

          {/* Document Properties */}
          <div className="flex space-x-4">
            {documentDetails.isTransferable && (
              <Button variant="default" className="mt-4">
                Transferable
              </Button>
            )}
            {documentDetails.isNegotiable && (
              <Button variant="default" className="mt-4">
                Negotiable
              </Button>
            )}
          </div>

          {/* Document Information */}
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
              <p className="font-bold">{documentDetails.beneficiary.name}</p>
              <a
                href={`/#${documentDetails.beneficiary.address}`}
                className="text-xs italic text-blue-500"
              >
                {documentDetails.beneficiary.address || "No wallet connected"}
              </a>
            </div>
            <div className="w-full flex flex-col space-y-2">
              <p className="text-gray-600 text-md">Holder :</p>
              <p className="font-bold">{documentDetails.holder.name}</p>
              <a
                href={`/#${documentDetails.holder.address}`}
                className="text-xs italic text-blue-500"
              >
                {documentDetails.holder.address || "No wallet connected"}
              </a>
            </div>
          </div>

          {/* Document Preview */}
          <section className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Document Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  <div className="flex items-center space-x-4 justify-end w-full">
                    <Button variant="secondary" onClick={handlePrint}>Print</Button>
                    <Button variant="secondary" onClick={handleView}>View</Button>
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