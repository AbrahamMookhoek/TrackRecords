"use client";

import React from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import List from "@mui/material/List";
import { ListItemButton } from "@mui/material";
import { Divider } from "@mui/material";
import EntryCard from "./EntryCard";
import { useEntryStore } from "../store/entryStore";

export default function () {
  const { entries, callUpdateFunc } = useEntryStore();

  const handleListItemClick = (entry) => {
    //update editor with selected entry content
    console.log("setting active entry");
    console.log(entry);
    callUpdateFunc(entry);
  };

  return (
    <div className="col-span-2 ml-32 mr-1 flex flex-col overflow-auto rounded-lg bg-light_blue-100 text-black shadow-lg">
      <div className="flex w-full justify-center py-2">
        <h2 className="text-2xl">Journal Entries</h2>
      </div>
      <div className="flex max-h-min flex-col overflow-auto">
        {
          <List>
            {entries.map((entry) => {
              return (
                //change key here if entry is given an actual id
                <ListItemButton
                  key={entry.date}
                  onClick={() => handleListItemClick(entry)}
                >
                  <h1 className="text-2xl" defaultValue={entry.title} />
                  <EntryCard entry={entry} />
                  <Divider />
                </ListItemButton>
              );
            })}
          </List>
        }
      </div>
      <div className="flex w-full justify-center py-2">
        <Button
          variant="contained"
          startIcon={<Add />}
          color="success"
          style={{ margin: "10px" }}
        >
          {" "}
          {/* Added padding style to the Button */}
          New Journal Entry
        </Button>
      </div>
    </div>
  );
}
