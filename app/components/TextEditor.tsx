"use client";

import React, { useState } from "react";
import Trix from "../components/Trix";

export default function TextEditor() {
  const [value, setValue] = useState("");

  return (
    <div className="col-span-5 mr-32 rounded-lg bg-light_blue-100 p-2 text-black shadow-lg">
      <h1>TODO: MAKE THIS AN EDITABLE TITLE</h1>
      <h1>TODO: MAKE THIS A SELECTABLE SPOTIFY TRACK</h1>
      <Trix
        defaultValue={value}
        onChange={(e, newValue) => setValue(newValue)}
      />
    </div>
  );
}
