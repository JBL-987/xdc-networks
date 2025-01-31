"use client";
import { useRouter } from "next/navigation";
import NavbarComponents from "@/components/layouts/NavbarComponents";
import React, { useState, useEffect } from "react";
import { Upload, Wallet2, ExternalLink, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
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

// Types
interface WalletState {
  account: string;
  networkName: string;
  error: string;
  isConnecting: boolean;
}

interface FileState {
  isDragActive: boolean;
  error: string | null;
  isValidating: boolean;
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: any) => Promise<any>;
      on: (event: string, callback: any) => void;
      removeListener: (event: string, callback: any) => void;
    };
  }
}

// Constants
const XDC_NETWORK_CONFIG = {
  chainId: '0x32',
  chainName: 'XDC Mainnet',
  nativeCurrency: {
    name: 'XDC',
    symbol: 'XDC',
    decimals: 18
  },
  rpcUrls: ['https://rpc.xinfin.network'],
  blockExplorerUrls: ['https://explorer.xinfin.network']
} as const;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Custom Hooks
const useWalletConnection = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    account: '',
    networkName: '',
    error: '',
    isConnecting: false
  });

  const checkNetwork = async (): Promise<boolean> => {
    if (!window.ethereum) return false;
    
    try {
      const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
      const isXDC = currentChainId === XDC_NETWORK_CONFIG.chainId;
      setWalletState(prev => ({ ...prev, networkName: isXDC ? 'XDC Mainnet' : 'Wrong Network' }));
      return isXDC;
    } catch (error : any) {
      console.error('Failed to check network:', error);
      return false;
    }
  };

  const switchToXDCNetwork = async (): Promise<boolean> => {
    if (!window.ethereum) return false;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: XDC_NETWORK_CONFIG.chainId }],
      });
      return true;
    } catch (error: any) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [XDC_NETWORK_CONFIG],
          });
          return true;
        } catch (error) {
          setWalletState(prev => ({
            ...prev,
            error: 'Failed to add XDC network. Please add it manually to MetaMask.'
          }));
          return false;
        }
      }
      setWalletState(prev => ({
        ...prev,
        error: 'Failed to switch to XDC network. Please try again.'
      }));
      return false;
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      setWalletState(prev => ({
        ...prev,
        error: 'MetaMask not detected! Please install MetaMask to continue.'
      }));
      return;
    }

    setWalletState(prev => ({ ...prev, isConnecting: true, error: '' }));

    try {
      const isCorrectNetwork = await checkNetwork();
      if (!isCorrectNetwork) {
        const switched = await switchToXDCNetwork();
        if (!switched) return;
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts[0]) {
        setWalletState(prev => ({ ...prev, account: accounts[0] }));
        await checkNetwork();
      }
    } catch (error: any) {
      setWalletState(prev => ({
        ...prev,
        error: error.message || 'Failed to connect wallet. Please try again.'
      }));
    } finally {
      setWalletState(prev => ({ ...prev, isConnecting: false }));
    }
  };

  const disconnectWallet = () => {
    setWalletState({
      account: '',
      networkName: '',
      error: '',
      isConnecting: false
    });
  };

  useEffect(() => {
    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        setWalletState(prev => ({ ...prev, account: accounts[0] }));
        await checkNetwork();
      }
    };

    const handleChainChanged = async () => {
      const isCorrectNetwork = await checkNetwork();
      setWalletState(prev => ({
        ...prev,
        error: isCorrectNetwork ? '' : 'Please switch to XDC Mainnet'
      }));
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      // Check if already connected
      window.ethereum.request({ method: 'eth_accounts' })
        .then(handleAccountsChanged)
        .catch(console.error);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  return { walletState, connectWallet, disconnectWallet };
};

const useFileHandler = (account: string) => {
  const router = useRouter();
  const [fileState, setFileState] = useState<FileState>({
    isDragActive: false,
    error: null,
    isValidating: false
  });

  const validateFile = async (file: File) => {
    if (!account) {
      setFileState(prev => ({
        ...prev,
        error: "Please connect your wallet first before uploading documents."
      }));
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setFileState(prev => ({
        ...prev,
        error: "File size exceeds 10MB limit. Please upload a smaller file."
      }));
      return;
    }

    const allowedExtensions = /\.tt$/i;
    if (!allowedExtensions.test(file.name)) {
      setFileState(prev => ({
        ...prev,
        error: "Document is invalid\nThis document is not valid. Please upload a valid document."
      }));
      return;
    }

    setFileState(prev => ({ ...prev, isValidating: true, error: null }));

    try {
      // Here you would typically process the file
      // For example, hash it or prepare it for blockchain verification
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated processing
      
      router.push('/verify-docs/viewer');
    } catch (error) {
      setFileState(prev => ({
        ...prev,
        error: "Failed to process file. Please try again."
      }));
    } finally {
      setFileState(prev => ({ ...prev, isValidating: false }));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setFileState(prev => ({ ...prev, isDragActive: true }));
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setFileState(prev => ({ ...prev, isDragActive: false }));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setFileState(prev => ({ ...prev, isDragActive: false }));
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      validateFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validateFile(files[0]);
    }
  };

  return {
    fileState,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileChange
  };
};

// Main Component
const VerifyDocsPage: React.FC = () => {
  const { walletState, connectWallet, disconnectWallet } = useWalletConnection();
  const {
    fileState,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileChange
  } = useFileHandler(walletState.account);

  const handleFileClick = () => {
    const fileInput = document.querySelector<HTMLInputElement>("#fileInput");
    fileInput?.click();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavbarComponents />
      <main className="min-h-[calc(100vh-57px-97px)] flex-1 py-6">
        <div className="container relative max-w-[1280px]">
          <div className="flex justify-between items-center mb-6">
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

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  {walletState.account ? (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <span className={`w-2 h-2 rounded-full mr-2 ${
                          walletState.networkName === 'XDC Mainnet' ? 'bg-green-500' : 'bg-red-500'
                        }`}></span>
                        {walletState.networkName}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={disconnectWallet}
                        className="flex items-center gap-2"
                      >
                        <Wallet2 className="w-4 h-4" />
                        {`${walletState.account.slice(0, 6)}...${walletState.account.slice(-4)}`}
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={connectWallet}
                      disabled={walletState.isConnecting}
                      className="flex items-center gap-2"
                    >
                      <Wallet2 className="w-4 h-4" />
                      {walletState.isConnecting ? 'Connecting...' : 'Connect MetaMask'}
                    </Button>
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  {walletState.account ? 'Connected to MetaMask' : 'Connect to MetaMask'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {walletState.error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription className="flex items-center gap-2">
                {walletState.error}
                {!window.ethereum && (
                  <Link 
                    href="https://metamask.io/download/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 underline"
                  >
                    Install MetaMask <ExternalLink className="h-4 w-4" />
                  </Link>
                )}
              </AlertDescription>
            </Alert>
          )}

          <section className="justify-between mx-auto flex flex-col md:flex-row items-start gap-6">
            <Card className="w-full md:w-2/3 shadow-lg">
              <CardHeader>
                <CardTitle>Verify Documents</CardTitle>
                <CardDescription>
                  Upload your document to verify its authenticity on the XDC Network
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  role="button"
                  aria-label="File upload area"
                  tabIndex={0}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-300 py-32 ${
                    fileState.isDragActive 
                      ? "border-blue-500 bg-blue-50" 
                      : fileState.error 
                        ? "border-red-500 bg-red-50" 
                        : "border-gray-300"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={handleFileClick}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleFileClick();
                    }
                  }}
                >
                  <Upload
                    className={`mx-auto h-12 w-12 ${fileState.error ? "text-red-500" : "text-gray-400"}`}
                  />
                  <p className="mt-2 text-sm text-gray-600">
                    {fileState.isValidating 
                      ? "Processing file..." 
                      : <>
                          Drag and drop your files here, or{" "}
                          <span className="text-white-500 hover:text-white-600 underline cursor-pointer">
                            click to browse
                          </span>
                        </>
                    }
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Supported format: .tt (Text Token) documents. Maximum size: 10MB.
                  </p>
                </div>
                <input
                  id="fileInput"
                  type="file"
                  accept=".tt"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {fileState.error && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{fileState.error}</AlertDescription>
                  </Alert>
                )}
                 <Button className="mt-4">
                  <BreadcrumbLink asChild>
                    <Link href="/revoke-docs">Revoke Document</Link>
                  </BreadcrumbLink>
                  </Button>
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
          </section>
        </div>
      </main>
    </div>
  );
};

export default VerifyDocsPage;