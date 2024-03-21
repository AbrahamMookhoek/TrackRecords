"use client";

import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useCalendarStore } from "../store/calendarStore";
import { useTrackStore } from "../store/trackStore";

import { useQuery } from "@tanstack/react-query";
import { createCalendarEvents, generateMasterSongList } from "../utils/spotify";
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
  const [queryMessage, setQueryMessage] = useState("")

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
      setQueryMessage("Tracks queried...")
      setShowSnackbar(true);
    }
    
    // Check to see if key "tracks" exists in localStorage, if so then retreive from localStorage
    if(isKeyExists("tracks")){
      setQueryMessage("Tracks already retreived, pulling from storage...")
      setShowSnackbar(true);
      // Retrieve the serialized map from localStorage
      const storedMap = localStorage.getItem('tracks');

      // Deserialize the stored map
      const deserializedMap = new Map(JSON.parse(storedMap));

      let temp = createCalendarEvents(deserializedMap)
      setAddedTracks(temp[0])
      setListenedTracks(temp[1])
      setEvents(temp[2])
    }
  }, [data]);

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  return (
    <div className="col-span-5 mr-32 rounded-lg bg-light_blue-100 p-2 text-black shadow-lg">
      <FullCalendar
        ref={calendarRef}
        events={events}
        eventClick={dayClicked}
        // eventDisplay="background"
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        showNonCurrentDates={false}
        height={"100%"}
        dateClick={dayClicked}
        customButtons={{
          myCustomButton,
        }}
        headerToolbar={{
          left: "title",
          center: "myCustomButton",
          right: "prev,next",
        }}
      />
      {/* Render the Snackbar */}
      <QuerySnackbar
        open={showSnackbar}
        message={queryMessage}
        handleClose={handleCloseSnackbar}
      />
    </div>
  );
}

// THIS IS THE MOST TILTING SHIT I'VE SEEN IN MY LIFE
const addIconToEvent = (info) => {
  const eventElement = info.el;
  const contentElement = eventElement.querySelector(".fc-event-title");

  // const icon = document.createElement("i");
  // icon.className = "fa-solid fa-power-off"; // Replace with the desired icon class
  // eventElement.querySelector(".fc-event-title").appendChild(icon);

  if (contentElement) {
    const image = document.createElement("img"); // Type assertion
    image.src =
      "https://cdn.discordapp.com/attachments/1202397182821408909/1202397277998551150/tom_stud.jpg?ex=65cd4eba&is=65bad9ba&hm=cabe5c046cf84d485f9a44131308ebe196374caa3c5478c6dafed46252e65417&"; // Replace with the path to your image
    image.alt = "Image Alt Text"; // Replace with appropriate alt text
    image.className = "event-image"; // Add a class for styling if needed

    contentElement.insertBefore(image, contentElement.firstChild);
  }

  // if (contentElement) {
  //   // Create a Material-UI IconButton element
  //   const iconButton = React.createElement(
  //     IconButton,
  //     { size: "small", color: "primary" },
  //     React.createElement(PowerOffIcon),
  //   );

  //   // Append the IconButton to the contentElement
  //   contentElement.insertBefore(iconButton, contentElement.firstChild);
  // }
};

function eventRender(info) {
  let eventEl = info.el.querySelector(".fc-content");

  // IF ID = 0 AKA IF ADDED TRACK TODO CHANGE THE CLASSLIST THING TO SOME OTHER ID
  if (info.el.classList.contains("bs-event")) {
    let eventID = "bs-event-" + info.event.id;
    addMenuIcons(eventEl, eventID, "fa-bars", "black");
    // IF ID = 1 AKA IF LISTENED TRACK
  } else if (info.el.classList.contains("gcal-event")) {
    let eventID = "gcal-event-" + info.event.id;
    addMenuIcons(eventEl, eventID, "fa-times", "red");
    if (info.el.classList.contains("bs-event")) {
    }
  } else {
    return false;
  }
}

function addMenuIcons(element, event_id, icon, color) {
  let link = document.createElement("a");
  let linkIcon = document.createElement("i");
  link.classList.add("float-right", "menu-link");
  link.id = event_id;
  linkIcon.classList.add("fa", icon);
  linkIcon.style.color = color;

  link.appendChild(linkIcon);
  element.appendChild(link);
}