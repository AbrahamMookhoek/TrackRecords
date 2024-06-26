"use client";

import React, { useEffect } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import TrackCard from "./TrackCard";
import { useCalendarStore } from "../store/calendarStore";

export default function () {
  const { isEventSelected, setEventSelected } = useCalendarStore();
  const { addedTracksOnDate } = useCalendarStore();
  const { listenedTracksOnDate } = useCalendarStore();
  const { dateSelected } = useCalendarStore();

  return (
    <div className="col-span-2 ml-32 mr-1 flex flex-col overflow-auto rounded-lg bg-light_blue-100 text-black shadow-lg">
      <div className="flex w-full justify-center py-2">
        <h2 className="text-2xl">Today's Tracks</h2>
      </div>
      <div className="flex max-h-min flex-col overflow-auto">
        {isEventSelected ? (
          <List>
            {addedTracksOnDate?.map((track) => {
              return (
                track.playlists_added_to.added_at === dateSelected && (
                  <ListItem key={track.spotify_id}>
                    <TrackCard track={track} added={true} />
                  </ListItem>
                )
              );
            })}
            {listenedTracksOnDate?.map((track) => {
              return (
                track.played_at.substring(0, 10) === dateSelected && (
                  <ListItem key={track.spotify_id}>
                    <TrackCard track={track} added={false} />
                  </ListItem>
                )
              );
            })}
          </List>
        ) : (
          <h4 className="ml-4 flex max-h-min flex-col items-stretch overflow-auto text-center">
            No Date Selected
          </h4>
        )}
      </div>
      {/* <div className="flex w-full justify-center py-2">
        <Button
          variant="contained"
          startIcon={<Add />}
          color="success"
          style={{ margin: "10px" }}
        >
          {" "}
          New Journal Entry
        </Button>
      </div> */}
    </div>
  );
}
