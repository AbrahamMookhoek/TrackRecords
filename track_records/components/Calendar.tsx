'use client';

import React, { useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
// import AddEventModal from './AddEventModal';
// import axios from 'axios';
// import moment from 'moment';

export default function () {
    // const [modalOpen, setModalOpen] = useState(false);
    const [events, setEvents] = useState([])
    const calendarRef = useRef(null);
    
    return ( 
        <section>

            <div style={{position: 'relative', zIndex: 0}}>
                <FullCalendar
                    ref={calendarRef}
                    events={events}
                    plugins={[ dayGridPlugin ]}
                    initialView='dayGridMonth'
                />
            </div>

        </section>
    )
}