// src/components/ui/AlertDocuments.tsx
import React, { useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, XCircleIcon } from "lucide-react";

interface AlertDocumentsProps {
  message: string;
  onClose: () => void;
}

const AlertDocuments: React.FC<AlertDocumentsProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000); 

    return () => clearTimeout(timer); 
  }, [onClose]);

  return (
    <Alert className="absolute w-fit">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Ops!!</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
      <button onClick={onClose} className="absolute top-0 right-0 ml-2 p-2 text-red-500">
        <XCircleIcon className="h-4 w-4" />
      </button>
    </Alert>
  );
};

export default AlertDocuments;