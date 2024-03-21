"use client";
import React from "react";
import Dropzone from "../../components/Dropzone";

export default function SettingsPage() {
  const handleDrop = async (acceptedFiles) => {
    const formData = new FormData();
    acceptedFiles.forEach((file) => {
      formData.append("files", file);
    });

    var requestOptions = {
      method: "POST",
      body: formData,
      redirect: "follow",
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
    <div className="">
      <h1>Upload Files</h1>
      <Dropzone onDrop={handleDrop} />
    </div>
  );
}
