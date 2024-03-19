import React from "react";

import { EditText, EditTextarea } from "react-edit-text";
import "react-edit-text/dist/index.css";

export default function JournalEntryTitle() {
  return (
    <div>
      <EditText defaultValue="Editable Journal Entry Title" showEditButton />
    </div>
  );
}
