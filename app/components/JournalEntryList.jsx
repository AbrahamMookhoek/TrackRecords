"use client";

import React from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import List from "@mui/material/List";
import { ListItemButton } from "@mui/material";
import { Divider } from "@mui/material";
import EntryCard from "./EntryCard";
import { useEntryStore } from "../store/entryStore";
import { Entry } from "../shared_objects/Entry";
import dayjs from "dayjs";

export default function () {
  const { callUpdateFunc, entries } = useEntryStore();

  const handleListItemClick = (entry) => {
    console.log("setting active entry");
    console.log(entry);
    callUpdateFunc(entry);
  };

  const newEntry = () => {
    const newEntry = new Entry("New Entry", null, dayjs(), "");
    callUpdateFunc(newEntry);
  };

  return (
    <div className="col-span-2 ml-32 mr-1 flex flex-col overflow-auto rounded-lg bg-light_blue-100 text-black shadow-lg">
      <div className="flex w-full justify-center py-2">
        <h2 className="text-2xl">Journal Entries</h2>
      </div>
      <div className="flex w-full justify-center py-2">
        <Button
          variant="contained"
          startIcon={<Add />}
          color="success"
          style={{ margin: "10px" }}
          onClick={() => {
            newEntry();
          }}
        >
          {" "}
          {/* Added padding style to the Button */}
          New Journal Entry
        </Button>
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
    </div>
  );
}
