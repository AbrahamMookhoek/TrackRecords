"use client";

import React, { useEffect } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import List from "@mui/material/List";
import { ListItemButton } from "@mui/material";
import { Divider } from "@mui/material";
import EntryCard from "./EntryCard";
import { useEntryStore } from "../store/entryStore";
import { Entry } from "../shared_objects/Entry";
import dayjs from "dayjs";
import { useTrackStore } from "../store/trackStore";

export default function JournalEntryList({ firebase_entries }) {
  console.log("outside func:",firebase_entries);
  const addedTracks = useTrackStore((state) => state.addedTracks);
  const listenedTracks = useTrackStore((state) => state.listenedTracks);

  var entries_array = [];

  firebase_entries.forEach((value, key) => {
    var track_obj;

    addedTracks.forEach((date_value, date_key) => {
      date_value.forEach((track) => {
        if (track.spotify_uri === value.track) {
          track_obj = track;
        }
      })
    });
    listenedTracks.forEach((date_value, date_key) => {
      date_value.forEach((track) => {
        if (track.spotify_uri === value.track) {
          track_obj = track;
        }
      });
    });

    var customParseFormat = require("dayjs/plugin/customParseFormat");
    dayjs.extend(customParseFormat);
    console.log("!!!HERE!!!",track_obj);

    entries_array.push(new Entry(value.title, track_obj, dayjs(value.date, "YYYY-MM-DD"), value.content));
  });

  const { callUpdateFunc, entries, setEntries } = useEntryStore();

  useEffect(() => {
    setEntries(entries_array);
  }, []);

  const handleListItemClick = (entry) => {
    console.log("setting active entry");
    console.log(entry);
    callUpdateFunc(entry);
  };

  const newEntry = () => {
    const newEntry = new Entry("New Entry", null, dayjs().format("YYYY-MM-DD").toString(), "");
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
