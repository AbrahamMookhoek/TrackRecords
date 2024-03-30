"use client";

import React, { useState, useEffect } from "react";
import Trix from "./Trix";
import JournalEntryTitle from "./JournalEntryTitle";
import JournalTrackSelect from "./JournalTrackSelect";
import { Track } from "../shared_objects/Track";
import { Entry } from "../shared_objects/Entry";
import QuerySnackbar from "./QuerySnackbar";
import { useQuery } from "@tanstack/react-query";
import { createCalendarEvents, generateMasterSongList } from "../utils/spotify";
import { Select, SelectChangeEvent } from "@mui/material";
import { MenuItem } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { InputLabel } from "@mui/material";
import dayjs from "dayjs";
import TrackCard from "./TrackCard";
import { useTrackStore } from "../store/trackStore";

// Check if key exists in localStorage
const isKeyExists = (key) => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key) !== null;
  }
  return false;
};

//once entries are added to db, text editor should be updated to show content when a specific entry is selected
export default function TextEditor({ user }) {
  const [value, setValue] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [queryMessage, setQueryMessage] = useState("");
  const [dataLoaded, setDataLoaded] = useState(false); // State to track if data loading is complete
  const [tracks, setTracks] = useState([]);

  const addedTracks = useTrackStore((state) => state.addedTracks);
  const setAddedTracks = useTrackStore((state) => state.setAddedTracks);
  const listenedTracks = useTrackStore((state) => state.listenedTracks);
  const setListenedTracks = useTrackStore((state) => state.setListenedTracks);

  // code to fetch data
  const { status, data } = useQuery({
    queryKey: ["tracks"],
    queryFn: () => generateMasterSongList(user.spotify_access_token, user.name),
    notifyOnChangeProps: ["data", "status"],
    refetchOnWindowFocus: false,
    enabled: !isKeyExists("tracks"),
  });

  useEffect(() => {
    // Check if key "tracks" doesn't exist in localStorage
    if (!isKeyExists("tracks") && status === "success") {
      // Run this block only if the key doesn't exist in localStorage
      let temp = createCalendarEvents(data);
      setAddedTracks(temp[0]);
      setListenedTracks(temp[1]);

      // Serialize the map to JSON
      const serializedMap = JSON.stringify([...data]);

      // Store the serialized map in localStorage
      localStorage.setItem("tracks", serializedMap);

      setQueryMessage("Tracks queried...");
      setShowSnackbar(true);
    }

    // Check to see if key "tracks" exists in localStorage, if so then retrieve from localStorage
    if (isKeyExists("tracks")) {
      // Retrieve the serialized map from localStorage
      const storedMap = localStorage.getItem("tracks");

      // Deserialize the stored map
      const deserializedMap = new Map(JSON.parse(storedMap));
      const tracksArray = Array.from(deserializedMap.values());
      setTracks(tracksArray);
      setQueryMessage("Tracks already retrieved, pulling from storage...");
      setShowSnackbar(true);

      console.log(tracksArray);
    }
  }, [data, status]);

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  //sample track, in future track will already be part of entry object by this point
  const sample_track = new Track();
  sample_track.track_name = "Sample Track Name";
  sample_track.artist_names = ["Sample Track Artist"];

  //sample entry, for use until can be passed in as func parameter
  const entry = new Entry();
  entry.title = "Sample Title";
  entry.track = sample_track;
  entry.content = "Sample editor content";

  const handleSelectChange = (event) => {
    //update track card to show current selected track
    console.log(event.target.value);
  };

  const updateTrackList = (selectedDate) => {
    console.log(selectedDate);
    // console.log("added tracks: " + addedTracks);
    // console.log("listened tracks: " + listenedTracks);
    const filteredAddedTracksByDay = new Map(
      [...addedTracks].filter(([k, v]) => k === selectedDate),
    )
      .values()
      .next().value;

    const filteredListenedTracksByDay = new Map(
      [...listenedTracks].filter(([k, v]) => k === selectedDate),
    )
      .values()
      .next().value;
    console.log("filtered added tracks: " + filteredAddedTracksByDay);
    console.log("filtered listened tracks: " + filteredListenedTracksByDay);
    //update select list to show tracks from currently selected day
  };

  //get current day to set as default for date picker
  const date = dayjs();

  //just a test to show input in the select list, replace with actual tracks from current day
  const sample_tracks = ["track 1", "track 2", "track 3"];

  //all the content is just slapped in here, needs to be reorganized at some point
  return (
    <div className="col-span-5 mr-32 rounded-lg bg-light_blue-100 p-2 text-black shadow-lg">
      <JournalEntryTitle title={entry.title} />
      <div className="flex items-start md:flex-row">
        <TrackCard track={entry.track} added={false} />
        <div>
          <InputLabel id="track-select-label">Track</InputLabel>
          <Select
            labelId="track-select-label"
            label="Track"
            onChange={handleSelectChange}
          >
            {sample_tracks.map((track) => (
              <MenuItem key={track} value={track}>
                {track}
              </MenuItem>
            ))}
          </Select>
        </div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {
            <DatePicker
              defaultValue={date}
              onChange={(NewValue) =>
                updateTrackList(NewValue.format("YYYY-MM-DD").toString())
              }
            />
          }
        </LocalizationProvider>
      </div>
      <Trix
        defaultValue={entry.content}
        onChange={(e, newValue) => setValue(newValue)}
      />
      <QuerySnackbar
        open={showSnackbar}
        message={queryMessage}
        handleClose={handleCloseSnackbar}
      />
    </div>
  );
}
