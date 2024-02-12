"use client";

import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useCalendarStore } from "../store/calendarStore";
import { IconButton } from "@mui/material";
import PowerOffIcon from "@mui/icons-material/PowerOff";
// import { createEvents } from "../utils/trackParser";

export default function () {
  const calendarRef = useRef(null);

  const { events, setEvents } = useCalendarStore();
  const { tracks, setTracks } = useCalendarStore();
  const { isEventSelected, setEventSelected } = useCalendarStore();

  // const createEvents = () => {
  //   let tempEvents = [];
  //   let trackMap = new Map();

  //   tracks.forEach((track) => {
  //     if(trackMap.get(track.dateListened) < 1) {
  //       trackMap.set(track.dateListened, 1)
  //     }
  //     else {

  //     }

  //     tempEvents.push({title: "XYZ Added", start: track.dateListened, color: "green", id: "newTrack"});
  //   });
  // };

  const dayClicked = (info) => {
    // createEvents();

    // If the user clicked on an Event, then we know events are in that day
    // So just set isEventSelected
    if (info?.event?.startStr) {
      setEventSelected(!isEventSelected);
    }
    // This means the user clicked on a day
    else {
      //
      const filteredEvents = events.filter(
        (event) => event.start === info.dateStr,
      );

      // Check if the clicked day is even a day they added or listned to tracks
      // If they have, "select" that day
      if (filteredEvents.length > 0) {
        setEventSelected(!isEventSelected);
      } else {
        setEventSelected(false);
      }
    }
  };

  return (
    <div className="col-span-5 mr-32 rounded-lg p-2 shadow-lg">
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
        // eventDidMount={addIconToEvent}
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
