"use client";

import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { writeEntryToFireStore } from "../firebase/firebase";
import { Entry } from "../shared_objects/Entry";
import { Track } from "../shared_objects/Track";
import { useEntryStore } from "../store/entryStore";
import { useTrackStore } from "../store/trackStore";
import { createCalendarEvents, generateMasterSongList } from "../utils/spotify";
import QuerySnackbar from "./QuerySnackbar";
import TrackCardJournal from "./TrackCardJournal";
import Trix from "./Trix";

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
  const [allowChange, setAllowChange] = useState(true);

  const addedTracks = useTrackStore((state) => state.addedTracks);
  const setAddedTracks = useTrackStore((state) => state.setAddedTracks);
  const listenedTracks = useTrackStore((state) => state.listenedTracks);
  const setListenedTracks = useTrackStore((state) => state.setListenedTracks);

  const entries = useEntryStore((state) => state.entries);
  const setEntries = useEntryStore((state) => state.setEntries);

  const [track_list, setTrackList] = useState([]);

  const [entry, setEntry] = useState(newEntry);
  const [title, setTitle] = useState(entry.title);
  const [date, setDate] = useState(entry.date);
  const [track, setTrack] = useState(entry.track);
  const [content, setContent] = useState(entry.content);
  const setUpdateFunc = useEntryStore((state) => state.setUpdateFunc);

  // code to fetch data
  const { status, data } = useQuery({
    queryKey: ["tracks"],
    queryFn: () => generateMasterSongList(user.spotify_access_token, user.name),
    notifyOnChangeProps: ["data", "status"],
    refetchOnWindowFocus: false,
    enabled: !isKeyExists("tracks"),
  });

  useEffect(() => {
    setUpdateFunc(updateEntry);
    //this may not need to be here
    const editor = document.querySelector("trix-editor");
    if (editor) {
      editor.editor.loadHTML("");
    }

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
    }
  }, [data, status]);

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  const updateTrackList = (selectedDate) => {
    onDateChange(selectedDate);
    selectedDate = selectedDate.format("YYYY-MM-DD").toString();

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

    var filteredTracksByDay = [];

    if (filteredAddedTracksByDay !== undefined) {
      filteredAddedTracksByDay.forEach((value) => {
        let duplicate = false;

        if (value !== undefined) {
          filteredTracksByDay.forEach((track) => {
            if (track.spotify_uri === value.spotify_uri) {
              duplicate = true;
            }
          });

          if (!duplicate) {
            filteredTracksByDay.push(value);
          }
        }
      });
    }

    if (filteredListenedTracksByDay !== undefined) {
      filteredListenedTracksByDay.forEach((value) => {
        let duplicate = false;

        if (value !== undefined) {
          filteredTracksByDay.forEach((track) => {
            if (track.spotify_uri === value.spotify_uri) {
              duplicate = true;
            }
          });

          if (!duplicate) {
            filteredTracksByDay.push(value);
          }
        }
      });
    }

    // var filteredTracksByDay = new Map([filteredAddedTracksByDay, filteredListenedTracksByDay]);

    // filteredListenedTracksByDay.forEach((value, key) => {
    //   filteredAddedTracksByDay.set(key, value);
    // });

    // let filteredTracksByDay = new Map(function*() { yield* filteredAddedTracksByDay; yield* filteredListenedTracksByDay; }());

    //update select list to show tracks from currently selected day
    setTrackList([].concat(filteredTracksByDay).filter(Boolean));
  };

  const onTitleChange = (updatedTitle) => {
    setTitle(updatedTitle.target.value);
  };

  const onTrackChange = (updatedTrack) => {
    setTrack(updatedTrack.target.value);
  };

  const onDateChange = (updatedDate) => {
    setDate(updatedDate);
  };

  const onEditorChange = (updatedContent) => {
    setContent(updatedContent.target.value);
  };

  const saveEntry = async () => {
    const updatedEntry = new Entry(title, track, date, content);

    // check if entry has same date as other entries
    const newEntries = [];
    let added = false;
    for (let i = 0; i < entries.length; i++) {
      if (
        entries[i].date.format("YYYY-MM-DD").toString() ===
        updatedEntry.date.format("YYYY-MM-DD").toString()
      ) {
        newEntries.unshift(updatedEntry);
        added = true;
      } else {
        newEntries.unshift(entries[i]);
      }
    }
    if (!added) {
      newEntries.unshift(updatedEntry);
    }
    setEntries(newEntries);

    //save entry to firebase
    await writeEntryToFireStore(user.name, updatedEntry);

    setQueryMessage("Saved!");
    setShowSnackbar(true);
  };

  const updateEntry = (updatedEntry) => {
    //setActiveEntry(updatedEntry);
    setTitle(updatedEntry.title);
    setDate(updatedEntry.date);

    updateTrackList(updatedEntry.date);
    //setTrackList([updatedEntry.track]);
    // setTrackList(track_list.concat(updatedEntry.track));
    setTrack(updatedEntry.track);
    //make select component display selected track

    //potential fix: on update entry, remove select and disable date picker and add fixed entry card
    //make visible "CHANGE" button
    //on press, change button dissappears, date picker enables, entry card replaced with select list
    setAllowChange(false);

    const editor = document.querySelector("trix-editor");
    if (editor) {
      editor.editor.loadHTML(updatedEntry.content);
    }
  };

  //all the content is just slapped in here, needs to be reorganized at some point
  return (
    <div className="col-span-5 mr-32 flex flex-col rounded-lg bg-light_blue-100 p-2 text-black shadow-lg">
      {/* HEADER */}
      <div className="flex flex-col gap-y-2">
        <div className="my-4 flex gap-x-12 align-middle">
          <FormControl style={{ justifyContent: "center" }}>
            <TextField
              value={title}
              onChange={(NewValue) => onTitleChange(NewValue)}
              style={{ justifyContent: "center" }}
              label="Entry Title"
            />
          </FormControl>
          <FormControl style={{ justifyContent: "center" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {
                <DatePicker
                  value={date}
                  onChange={(NewValue) => updateTrackList(NewValue)}
                  disabled={!allowChange}
                  style={{}}
                  label="Date Picker"
                />
              }
            </LocalizationProvider>
          </FormControl>

          {allowChange && (
            <>
              <FormControl style={{ minWidth: "18rem" }}>
                <InputLabel id="track-select-label">Tracks</InputLabel>
                <Select
                  labelId="track-select-label"
                  label="Associated Tracks"
                  value={track}
                  isactive={allowChange}
                  onChange={(NewValue) => onTrackChange(NewValue)}
                >
                  {track_list.length > 0 ? (
                    track_list.map((track) => (
                      <MenuItem value={track}>
                        {<TrackCardJournal track={track} />}
                      </MenuItem>
                    ))
                  ) : (
                    <p className=" px-1">No Track Activity</p>
                  )}
                </Select>
              </FormControl>

              <Button
                onClick={() => {
                  saveEntry();
                }}
                variant="contained"
                color="success"
                style={{ marginLeft: "auto" }}
              >
                {" "}
                {/* Added padding style to the Button */}
                Save
              </Button>
            </>
          )}
          {!allowChange && (
            <>
              {track && <TrackCardJournal track={track} />}
              <Button
                onClick={() => {
                  setAllowChange(true);
                  updateTrackList(date);
                }}
                variant="contained"
                color="success"
                style={{ marginLeft: "auto" }}
              >
                {" "}
                {/* Added padding style to the Button */}
                Change
              </Button>
            </>
          )}
        </div>
      </div>

      <hr className="bg-black"></hr>

      {/* EDITOR */}
      <div className="flex flex-grow flex-col rounded-md  p-3">
        <input
          id="x"
          value="<div>Editor content goes here</div>"
          type="hidden"
          name="content"
          className=""
        ></input>

        <Trix
          input="x"
          defaultValue=""
          onChange={(NewValue) => onEditorChange(NewValue)}
        />
      </div>

      <QuerySnackbar
        open={showSnackbar}
        message={queryMessage}
        handleClose={handleCloseSnackbar}
      />
    </div>
  );
}
