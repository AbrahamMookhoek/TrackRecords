"use client";

import React, { useRef, useState } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

export default function () {
  return (
    <div className="padding-container relative z-30 flex h-full w-1/5 flex-col justify-between outline">
      <div className="flex w-full justify-center py-2">
        <h2 className="text-2xl">Listening History</h2>
      </div>
      <div className="flex flex-col">
        <List>
          <ListItem>
            <ListItemText primary="Track 1 2 3 4" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Track 1 2 3 4" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Track 1 2 3 4" />
          </ListItem>
        </List>
      </div>
      <div className="flex w-full justify-center py-2">
        <Button variant="contained" startIcon={<Add />} color="success">
          New Journal Entry
        </Button>
      </div>
    </div>
  );
}
