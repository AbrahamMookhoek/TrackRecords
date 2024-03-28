"use client";

import React, { useState } from "react";
import Trix from "../components/Trix";
import JournalEntryTitle from "./JournalEntryTitle";
import TrackCard from "./TrackCard";
import dayjs from "dayjs";
import { Select, SelectChangeEvent } from "@mui/material";
import { MenuItem } from "@mui/material";
import { InputLabel } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Track } from "../shared_objects/Track";
import { Entry } from "../shared_objects/Entry";

//once entries are added to db, text editor should be updated to show content when a specific entry is selected
export default function TextEditor({ user }) {
  const [value, setValue] = useState("");

  //sample track, in future track will already be part of entry object by this point
  const sample_track = new Track();
  sample_track.track_name = "Sample Track Name";
  sample_track.artist_names = ["Sample Track Artist"];

  //sample entry, for use until can be passed in as func parameter
  const entry = new Entry();
  entry.title = "Sample Title";
  entry.track = sample_track;
  entry.content = "Sample editor content";

  //get current day to set as default for date picker
  const date = dayjs();

  //just a test to show input in the select list, replace with actual tracks from current day
  const tracks = ["track 1", "track 2", "track 3"];

  const handleSelectChange = (event: SelectChangeEvent) => {
    //update track card to show current selected track
    console.log(event.target.value);
  };

  const updateTrackList = (selectedDate) => {
    console.log(selectedDate);
    //update select list to show tracks from currently selected day
  };

  //all the content is just slapped in here, needs to be reorganized at some point
  return (
    <div className="col-span-5 mr-32 rounded-lg bg-light_blue-100 p-2 text-black shadow-lg">
      <JournalEntryTitle title={entry.title} />
      <InputLabel id="track-select-label">Track</InputLabel>
      <Select
        labelId="track-select-label"
        label="Track"
        onChange={handleSelectChange}
      >
        {tracks.map((track) => (
          <MenuItem key={track} value={track}>
            {track}
          </MenuItem>
        ))}
      </Select>
      <TrackCard track={entry.track} />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {
          <DatePicker
            defaultValue={date}
            onChange={(NewValue) => updateTrackList(NewValue)}
          />
        }
      </LocalizationProvider>
      <Trix
        defaultValue={entry.content}
        onChange={(e, newValue) => setValue(newValue)}
      />
    </div>
  );
}
