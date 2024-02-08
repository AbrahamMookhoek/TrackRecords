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
    <div className="col-span-5 mr-32 p-2 outline">
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
