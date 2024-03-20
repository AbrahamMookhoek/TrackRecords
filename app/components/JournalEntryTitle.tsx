import React from "react";

import { EditText, EditTextarea } from "react-edit-text";
import "react-edit-text/dist/index.css";

export default function JournalEntryTitle({ title }: { title: string }) {
  return (
    <div>
      <EditText defaultValue={title} showEditButton />
    </div>
  );
}
