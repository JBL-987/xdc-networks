import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import axios from "axios";

const DocumentDetail = () => {
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async () => {
    if (!description) {
      setStatus("Please enter a description.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5001/verificator/upload", {
        description,
      });
      setStatus("Description submitted successfully!");
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error submitting description:", error);
      setStatus("Failed to submit description.");
    }
  };

  // return (
  //   <Card className="mb-6 w-full">
  //     <CardHeader>
  //       <CardTitle>Document Detail</CardTitle>
  //       <CardDescription>Input your document description</CardDescription>
  //     </CardHeader>
  //     <CardContent>
  //       <Textarea
  //         className="h-full lg:h-36"
  //         placeholder="Your document description here."
  //         value={description}
  //         onChange={(e) => setDescription(e.target.value)}
  //       />
  //       <div className="flex justify-end mt-4">
  //         <Button onClick={handleSubmit}>Submit</Button>
  //       </div>
  //       {status && <p className="mt-2 text-sm text-gray-600">{status}</p>}
  //     </CardContent>
  //   </Card>
    
  // );
};

export default DocumentDetail;
