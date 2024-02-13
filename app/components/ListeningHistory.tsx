"use client";

import React, { useRef, useState } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import TrackCard from "./TrackCard";
import { useCalendarStore } from "../store/calendarStore";

export default function () {
  const { isEventSelected, setEventSelected } = useCalendarStore();

  return (
    <div className="bg-light_blue-100 col-span-2 ml-32 mr-1 flex flex-col overflow-auto rounded-lg text-black shadow-lg">
      <div className="flex w-full justify-center py-2">
        <h2 className="text-2xl">Today's Tracks</h2>
      </div>
      <div className="flex max-h-min flex-col overflow-auto">
        {isEventSelected ? (
          <List>
            <ListItem>
              <TrackCard />
            </ListItem>
            <ListItem>
              <TrackCard />
            </ListItem>
            <ListItem>
              <TrackCard />
            </ListItem>
            <ListItem>
              <TrackCard />
            </ListItem>
            <ListItem>
              <TrackCard />
            </ListItem>
            <ListItem>
              <TrackCard />
            </ListItem>
            <ListItem>
              <TrackCard />
            </ListItem>
            <ListItem>
              <TrackCard />
            </ListItem>
            <ListItem>
              <TrackCard />
            </ListItem>
            <ListItem>
              <TrackCard />
            </ListItem>
            <ListItem>
              <TrackCard />
            </ListItem>
            <ListItem>
              <TrackCard />
            </ListItem>
            <ListItem>
              <TrackCard />
            </ListItem>
            <ListItem>
              <TrackCard />
            </ListItem>
          </List>
        ) : (
          <h4 className="ml-4 flex max-h-min flex-col items-stretch overflow-auto">
            No Date Selected
          </h4>
        )}
      </div>
      <div className="flex w-full justify-center py-2">
        <Button variant="contained" startIcon={<Add />} color="success">
          New Journal Entry
        </Button>
      </div>
    </div>
  );
}
