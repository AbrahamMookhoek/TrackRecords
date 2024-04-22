"use client";

import { Add } from "@mui/icons-material";
import { Button, Divider, ListItemButton } from "@mui/material";
import List from "@mui/material/List";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Entry } from "../shared_objects/Entry";
import { useEntryStore } from "../store/entryStore";
import { useTrackStore } from "../store/trackStore";
import EntryCard from "./EntryCard";

export default function JournalEntryList({ firebase_entries }) {
  const { callUpdateFunc, entries, setEntries } = useEntryStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    setFilteredData(entries);
  }, [entries]);

  const handleSearchChange = (event) => {
    const userInput = event.target.value.toLowerCase();
    setSearchTerm(userInput);

    const filteredEntries = entries.filter(
      (entry) =>
        entry?.title.toLowerCase().includes(userInput) ||
        entry?.track?.artist_names[0].toLowerCase().includes(userInput) ||
        entry?.track?.track_name.toLowerCase().includes(userInput) ||
        (entry?.date.format("MM/DD/YY").toString() &&
          entry.date
            .format("MM/DD/YY")
            .toString()
            .toLowerCase()
            .includes(userInput)), // Including date search,
    );

    filteredEntries.sort((a, b) => {
      var textA = a.title.toUpperCase();
      var textB = b.title.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });

    setFilteredData(filteredEntries);
  };

  const handleListItemClick = (entry) => {
    callUpdateFunc(entry);
  };

  const newEntry = () => {
    const newEntry = new Entry("New Entry", null, dayjs(), "");
    callUpdateFunc(newEntry);
  };

  const addedTracks = useTrackStore((state) => state.addedTracks);
  const listenedTracks = useTrackStore((state) => state.listenedTracks);

  var entries_array = [];

  firebase_entries.forEach((value, key) => {
    var track_obj = null;

    addedTracks.forEach((date_value, date_key) => {
      date_value.forEach((track) => {
        if (track.spotify_uri === value.track && !track_obj) {
          track_obj = track;
        }
      });
    });
    listenedTracks.forEach((date_value, date_key) => {
      date_value.forEach((track) => {
        if (track.spotify_uri === value.track && !track_obj) {
          track_obj = track;
        }
      });
    });

    var customParseFormat = require("dayjs/plugin/customParseFormat");
    dayjs.extend(customParseFormat);

    // console.log("added from firebase: ", track_obj);

    entries_array.push(
      new Entry(
        value.title,
        track_obj,
        dayjs(value.date, "YYYY-MM-DD"),
        value.content,
      ),
    );
  });

  useEffect(() => {
    setEntries(entries_array);
  }, [addedTracks, listenedTracks]);

  return (
    <div className="col-span-2 ml-32 mr-1 flex flex-col overflow-auto rounded-lg bg-light_blue-100 text-black shadow-lg">
      <div className="flex w-full justify-center py-2">
        <h2 className="text-2xl">Journal Entries</h2>
      </div>
      <div className="mx-4 flex justify-between gap-x-4">
        <TextField
          label="Search"
          variant="filled"
          value={searchTerm}
          onChange={handleSearchChange}
          margin="normal"
        />
      </div>
      <div className="flex max-h-min flex-col overflow-auto">
        {
          <List>
            {filteredData.map((entry) => {
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
          onClick={() => {
            newEntry();
          }}
        >
          {" "}
          {/* Added padding style to the Button */}
          New Journal Entry
        </Button>
      </div>
    </div>
  );
}
