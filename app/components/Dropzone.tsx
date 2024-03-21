import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const Dropzone = ({ onDrop }) => {
  const handleDrop = useCallback(
    (acceptedFiles) => {
      // Call the parent component's onDrop function with the accepted files
      onDrop(acceptedFiles);
    },
    [onDrop],
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop: handleDrop });

  return (
    <div
      {...getRootProps()}
      style={{
        border: "2px dashed #ddd",
        padding: "20px",
        textAlign: "center",
        cursor: "pointer",
      }}
    >
      <input {...getInputProps()} />
      <p>Drag 'n' drop some files here, or click to select files</p>
    </div>
  );
};

export default Dropzone;
