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
    <div className="col-span-2 ml-32 flex flex-col overflow-auto outline">
      <div className="flex w-full justify-center py-2">
        <h2 className="text-2xl">Listening History</h2>
      </div>
      <div className="flex max-h-min flex-col overflow-auto ">
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
      </div>
      <div className="flex w-full justify-center py-2">
        <Button variant="contained" startIcon={<Add />} color="success">
          New Journal Entry
        </Button>
      </div>
    </div>
  );
}
