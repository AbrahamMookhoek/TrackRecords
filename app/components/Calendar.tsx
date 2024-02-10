"use client";

import React, { useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

export default function () {
  // const [modalOpen, setModalOpen] = useState(false);

  const [events, setEvents] = useState([
    {
      title: "XYZ Added",
      start: "2024-02-08",
      color: "green",
      id: "0",
    },
    {
      title: "XYZ Listened",
      start: "2024-02-08",
      color: "gray",
      id: "1",
    },
  ]);

  const calendarRef = useRef(null);

  return (
    <div className="col-span-5 mr-32 p-2 outline">
      <FullCalendar
        ref={calendarRef}
        events={events}
        // eventDisplay="background"
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        showNonCurrentDates={false}
        height={"100%"}
        eventDidMount={addIconToEvent}
      />
    </div>
  );
}

const addIconToEvent = (info) => {
  const eventElement = info.el;
  const contentElement = eventElement.querySelector(".fc-event-title");

  // const icon = document.createElement("i");
  // icon.className = "fa-solid fa-power-off"; // Replace with the desired icon class
  // eventElement.querySelector(".fc-event-title").appendChild(icon);

  if (contentElement) {
    const image = document.createElement("img") as HTMLImageElement; // Type assertion
    image.src =
      "https://cdn.discordapp.com/attachments/1202397182821408909/1202397277998551150/tom_stud.jpg?ex=65cd4eba&is=65bad9ba&hm=cabe5c046cf84d485f9a44131308ebe196374caa3c5478c6dafed46252e65417&"; // Replace with the path to your image
    image.alt = "Image Alt Text"; // Replace with appropriate alt text
    image.className = "event-image"; // Add a class for styling if needed

    contentElement.insertBefore(image, contentElement.firstChild);
  }
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
