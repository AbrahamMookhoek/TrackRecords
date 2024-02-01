"use client";

import React, { useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
// import AddEventModal from './AddEventModal';
// import axios from 'axios';
// import moment from 'moment';

export default function () {
  // const [modalOpen, setModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const calendarRef = useRef(null);

  return (
    <div className="relative z-30 w-4/5 p-2 outline">
      <FullCalendar
        ref={calendarRef}
        events={events}
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        showNonCurrentDates={false}
        height={"100%"}
      />
    </div>
  );
}
