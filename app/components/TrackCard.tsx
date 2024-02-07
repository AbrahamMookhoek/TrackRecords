"use client";

import React, { useRef, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  Box,
  IconButton,
} from "@mui/material";
import Image from "next/image";

export default function () {
  return (
    <div className="flex w-full flex-col">
      <a
        href="#"
        className="flex flex-col items-center rounded-lg border border-gray-200 bg-white shadow hover:bg-gray-100 md:max-w-xl md:flex-row dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        <img
          className="h-14 w-14 rounded-t-lg object-cover"
          src="https://cdn.discordapp.com/attachments/1202397182821408909/1202397277998551150/tom_stud.jpg?ex=65cd4eba&is=65bad9ba&hm=cabe5c046cf84d485f9a44131308ebe196374caa3c5478c6dafed46252e65417&"
          alt="XYZ"
        />
        <div className="flex flex-col justify-between p-1 leading-normal">
          <p className="text-md pl-1 font-bold tracking-tight text-gray-900 dark:text-white">
            Track Title
          </p>
          <p className="pl-1 font-normal text-gray-700 dark:text-gray-400">
            Artist Name
          </p>
        </div>
      </a>
    </div>
  );
}
