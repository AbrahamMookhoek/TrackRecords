"use client";

import React from "react";
import Dropzone from "../components/Dropzone";

export default function SettingsPage() {
  const handleDrop = async (acceptedFiles) => {
    const formData = new FormData();
    acceptedFiles.forEach((file) => {
      formData.append("files", file);
    });

    var requestOptions = {
      method: "POST",
      body: formData,
      // You can remove the redirect property or set it to a valid value if needed
      // redirect: "follow",
    };

    try {
      const response = await fetch("/api/process", requestOptions);

      if (response.ok) {
        console.log("Files processed successfully");
        // Optionally, you can handle success message or redirect here
      } else {
        console.error("Failed to process files");
        // Optionally, you can handle error message here
      }
    } catch (error) {
      console.error("Error processing files:", error);
      // Optionally, you can handle error message here
    }
  };

  return (
    <div className="relative col-span-full row-span-10 mx-32 rounded-lg bg-light_blue-100 p-2 text-black shadow-lg">
      <h1>Upload Files</h1>
      <Dropzone onDrop={handleDrop} />
    </div>
  );
}
