"use client"
import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useCalendarStore } from "../store/calendarStore";
import { useTrackStore } from "../store/trackStore";
import { useQuery } from "@tanstack/react-query";
import { createCalendarEvents, generateMasterSongList } from "../utils/spotify";
import PlaylistFilter from "./PlaylistFilter";
import QuerySnackbar from "./QuerySnackbar";

const myCustomButton = {
  text: "custom!",
  click: function () {
    alert("clicked the custom button!");
  },
};

// Check if key exists in localStorage
const isKeyExists = (key) => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key) !== null;
  }
  return false;
};

export default function Calendar({ user }) {
  const calendarRef = useRef(null);

  const { events, setEvents } = useCalendarStore();
  const { isEventSelected, setEventSelected } = useCalendarStore();
  const { setDateSelected } = useCalendarStore();
  const { setAddedTracksOnDate } = useCalendarStore();
  const { setListenedTracksOnDate } = useCalendarStore();
  const addedTracks = useTrackStore((state) => state.addedTracks);
  const setAddedTracks = useTrackStore((state) => state.setAddedTracks);
  const listenedTracks = useTrackStore((state) => state.listenedTracks);
  const setListenedTracks = useTrackStore((state) => state.setListenedTracks);

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [queryMessage, setQueryMessage] = useState("");
  const [dataLoaded, setDataLoaded] = useState(false); // State to track if data loading is complete

  const dayClicked = (info) => {
    // If the user clicked on an Event, then we know events are in that day
    // So just set isEventSelected
    if (info?.event?.startStr) {
      setDateSelected(info?.event?.startStr);
      setEventSelected(true);
      const filteredAddedTracksByDay = new Map(
        [...addedTracks].filter(([k, v]) => k === info.event.startStr),
      )
        .values()
        .next().value;

      const filteredListenedTracksByDay = new Map(
        [...listenedTracks].filter(([k, v]) => k === info.event.startStr),
      )
        .values()
        .next().value;

      setAddedTracksOnDate(filteredAddedTracksByDay);
      setListenedTracksOnDate(filteredListenedTracksByDay);
    }
    // This means the user clicked on a day
    else {
      setDateSelected(info.dateStr);

      const filteredEvents = events.filter(
        (event) => event.start === info.dateStr,
      );

      // Check if the clicked day is even a day they added or listned to tracks
      // If they have, "select" that day
      if (filteredEvents.length > 0) {
        setEventSelected(true);

        const filteredAddedTracksByDay = new Map(
          [...addedTracks].filter(([k, v]) => k === info.dateStr),
        )
          .values()
          .next().value;

        const filteredListenedTracksByDay = new Map(
          [...listenedTracks].filter(([k, v]) => k === info.dateStr),
        )
          .values()
          .next().value;

        setAddedTracksOnDate(filteredAddedTracksByDay);
        setListenedTracksOnDate(filteredListenedTracksByDay);
      } else {
        setEventSelected(false);
      }
    }
  };

  // code to fetch data
  const { status, data } = useQuery({
    queryKey: ["tracks"],
    queryFn: () => generateMasterSongList(user.spotify_access_token, user.name),
    notifyOnChangeProps: ["data", "status"],
    refetchOnWindowFocus: false,
    enabled: !isKeyExists("tracks")
  });

  useEffect(() => {
    // Check if key "tracks" doesn't exist in localStorage
    if (!isKeyExists("tracks") && status === "success") {
      // Run this block only if the key doesn't exist in localStorage
      let temp = createCalendarEvents(data);
      setAddedTracks(temp[0]);
      setListenedTracks(temp[1]);
      setEvents(temp[2]);

      // Serialize the map to JSON
      const serializedMap = JSON.stringify([...data]);

      // Store the serialized map in localStorage
      localStorage.setItem('tracks', serializedMap);
      setQueryMessage("Tracks queried...");
      setShowSnackbar(true);
      setDataLoaded(true); // Mark data loading as complete
    }
    
    // Check to see if key "tracks" exists in localStorage, if so then retrieve from localStorage
    if(isKeyExists("tracks")){
      setQueryMessage("Tracks already retrieved, pulling from storage...");
      setShowSnackbar(true);
      // Retrieve the serialized map from localStorage
      const storedMap = localStorage.getItem('tracks');

      // Deserialize the stored map
      const deserializedMap = new Map(JSON.parse(storedMap));

      console.log(deserializedMap.get("2dgrYdgguVZKeCsrVb9XEs"))

      let temp = createCalendarEvents(deserializedMap);
      setAddedTracks(temp[0]);
      setListenedTracks(temp[1]);
      setEvents(temp[2]);
      setDataLoaded(true); // Mark data loading as complete
    }
  }, [data, status]);

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  // Render the calendar only when data loading is complete
  return (
    <>
      {dataLoaded && (
        <div className="col-span-5 mr-32 rounded-lg bg-light_blue-100 p-2 text-black shadow-lg">
          <FullCalendar
            ref={calendarRef}
            eventDidMount={() => {console.log("Events Mounted")}}
            eventWillUnmount={() => {console.log("Events UNMOUNTED")}}
            events={events}
            eventClick={dayClicked}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            showNonCurrentDates={false}
            height={"100%"}
            dateClick={dayClicked}
            customButtons={{ myCustomButton }}
            headerToolbar={{ left: "title", center: "myCustomButton", right: "prev,next" }}
          />
          {/* Render the Snackbar */}
          <QuerySnackbar
            open={showSnackbar}
            message={queryMessage}
            handleClose={handleCloseSnackbar}
          />
        </div>
      )}
    </>
  );
}