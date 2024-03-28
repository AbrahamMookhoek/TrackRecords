"use client";

import React, { useEffect } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import EntryCard from "./EntryCard";
import { useCalendarStore } from "../store/calendarStore";

import { Track } from "../shared_objects/Track";
import { Entry } from "../shared_objects/Entry";
import dayjs from "dayjs";

//example data for entry list
const track1 = new Track();
const track2 = new Track();
track1.track_name = "track 1";
track2.track_name = "track 2";
track1.artist_names = "artist 1";
track2.artist_names = "artist 2";

const entry1 = new Entry("title 1", track1, dayjs("2024-03-27"), "entry 1");
const entry2 = new Entry("title 2", track2, dayjs("2024-03-26"), "entry 2");

const entryList = [entry1, entry2];

export default function () {
  const { isEventSelected, setEventSelected } = useCalendarStore();
  const { addedTracksOnDate } = useCalendarStore();
  const { listenedTracksOnDate } = useCalendarStore();
  const { dateSelected } = useCalendarStore();

  return (
    <div className="col-span-2 ml-32 mr-1 flex flex-col overflow-auto rounded-lg bg-light_blue-100 text-black shadow-lg">
      <div className="flex w-full justify-center py-2">
        <h2 className="text-2xl">Journal Entries</h2>
      </div>
      <div className="flex max-h-min flex-col overflow-auto">
        {
          <List>
            {entryList.map((entry) => {
              return (
                //change key here if entry is given an actual id
                <ListItem key={entry.date}>
                  <h1 className="text-2xl" defaultValue={entry.title} />
                  <EntryCard entry={entry} />
                </ListItem>
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
