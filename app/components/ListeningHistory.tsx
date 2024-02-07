"use client";

import React, { useRef, useState } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import TrackCard from "./TrackCard";

export default function () {
  return (
    <div className="padding-container relative z-30 flex w-1/5 flex-col outline">
      <div className="flex w-full justify-center py-2">
        <h2 className="text-2xl">Listening History</h2>
      </div>
      <div
        style={{ height: "85%" }}
        className=" flex flex-col overflow-auto outline"
      >
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
          {/* <ListItem>
              <TrackCard />
            </ListItem> */}
        </List>
      </div>
      <div className="flex-end flex w-full justify-center py-2">
        <Button variant="contained" startIcon={<Add />} color="success">
          New Journal Entry
        </Button>
      </div>
    </div>
  );
}
