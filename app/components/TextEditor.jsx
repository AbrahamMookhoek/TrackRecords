"use client";

import React, { useState, useEffect } from "react";
import Trix from "./Trix";
import { Entry } from "../shared_objects/Entry";
import QuerySnackbar from "./QuerySnackbar";
import { useQuery } from "@tanstack/react-query";
import { createCalendarEvents, generateMasterSongList } from "../utils/spotify";
import { Select, SelectChangeEvent } from "@mui/material";
import { MenuItem } from "@mui/material";
import { TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { Button } from "@mui/material";
import { InputLabel } from "@mui/material";
import dayjs from "dayjs";
import TrackCard from "./TrackCard";
import { useTrackStore } from "../store/trackStore";
import {} from "../utils/spotify";

// Check if key exists in localStorage
const isKeyExists = (key) => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key) !== null;
  }
  return false;
};

const newEntry = new Entry();
newEntry.title = "New Entry";
newEntry.content = "";
newEntry.date = dayjs();

//once entries are added to db, text editor should be updated to show content when a specific entry is selected
export default function TextEditor({ user }) {
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [queryMessage, setQueryMessage] = useState("");
  const [dataLoaded, setDataLoaded] = useState(false); // State to track if data loading is complete
  const [tracks, setTracks] = useState([]);

  const addedTracks = useTrackStore((state) => state.addedTracks);
  const setAddedTracks = useTrackStore((state) => state.setAddedTracks);
  const listenedTracks = useTrackStore((state) => state.listenedTracks);
  const setListenedTracks = useTrackStore((state) => state.setListenedTracks);

  const [track_list, setTrackList] = useState([]);

  const [entry, setEntry] = useState(newEntry);
  const [title, setTitle] = useState(entry.title);
  const [date, setDate] = useState(entry.date);
  const [track, setTrack] = useState(entry.track);
  const [content, setContent] = useState(entry.content);

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
      setDataLoaded(true); // Mark data loading as complete
    }

    // Check to see if key "tracks" exists in localStorage, if so then retrieve from localStorage
    if (isKeyExists("tracks")) {
      setQueryMessage("Tracks already retrieved, pulling from storage...");
      setShowSnackbar(true);
      // Retrieve the serialized map from localStorage
      const storedMap = localStorage.getItem("tracks");

      // Deserialize the stored map
      const deserializedMap = new Map(JSON.parse(storedMap));

      let temp = createCalendarEvents(deserializedMap);
      setAddedTracks(temp[0]);
      setListenedTracks(temp[1]);
      setDataLoaded(true); // Mark data loading as complete

      console.log(temp);
    }
  }, [data, status]);

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  const updateTrackList = (selectedDate) => {
    console.log(selectedDate);
    console.log("added tracks: " + addedTracks);
    console.log("listened tracks: " + listenedTracks);
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
    setTrackList(
      []
        .concat(filteredAddedTracksByDay)
        .concat(filteredListenedTracksByDay)
        .filter(Boolean),
    );
    console.log(track_list);
  };

  const onTitleChange = (updatedTitle) => {
    setTitle(updatedTitle);
  };

  const onTrackChange = (updatedTrack) => {
    //update track for current entry
    console.log(updatedTrack.target.value);
    setTrack(updatedTrack.target.value);
  };

  const onDateChange = (updatedDate) => {
    setDate(updatedDate);
  };

  const onEditorChange = (updatedContent) => {
    //setContent(updatedContent);
  };

  const saveEntry = () => {
    const updatedEntry = new Entry(title, track, date, content);
    setEntry(updatedEntry);

    //send entry to side list

    setQueryMessage("Saved!");
    setShowSnackbar(true);
  };

  const updateEntry = (updatedEntry) => {
    setEntry(updatedEntry);
  };

  //all the content is just slapped in here, needs to be reorganized at some point
  return (
    <div className="col-span-5 mr-32 rounded-lg bg-light_blue-100 p-2 text-black shadow-lg">
      <div className="flex items-start md:flex-row">
        <TextField defaultValue={entry.title} />
        <Button
          onClick={() => {
            saveEntry();
          }}
          variant="contained"
          color="success"
          style={{ margin: "10px" }}
        >
          {" "}
          {/* Added padding style to the Button */}
          Save
        </Button>
      </div>
      <div className="flex items-start md:flex-row">
        <div>
          <InputLabel id="track-select-label">Track</InputLabel>
          <Select
            labelId="track-select-label"
            label="Track"
            onChange={onTrackChange}
          >
            {track_list.length > 0 &&
              track_list.map((track) => (
                <MenuItem key={track.id} value={track.track_name}>
                  {
                    <TrackCard
                      track={track}
                      added={track.playlists_added_to !== undefined}
                      allowLink={false}
                    />
                  }
                </MenuItem>
              ))}
          </Select>
        </div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {
            <DatePicker
              defaultValue={entry.date}
              onChange={(NewValue) =>
                updateTrackList(NewValue.format("YYYY-MM-DD").toString())
              }
            />
          }
        </LocalizationProvider>
      </div>
      <Trix defaultValue={entry.content} onChange={onEditorChange()} />
      <QuerySnackbar
        open={showSnackbar}
        message={queryMessage}
        handleClose={handleCloseSnackbar}
      />
    </div>
  );
}
