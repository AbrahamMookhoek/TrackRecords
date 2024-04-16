"use client";

import * as React from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export default function ({ track }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  function onTrackClick(event) {
    setAnchorEl(event.currentTarget);
    console.log("clicked track:", track);
  }
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  function convertTimestamp(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  }

  function truncateString(str, maxLength) {
    if (str.length > maxLength) {
      return str.substring(0, maxLength) + "...";
    } else {
      return str;
    }
  }

  return (
    <div className="flex  w-full flex-col">
      <a
        target="_blank"
        onClick={onTrackClick}
        className="flex flex-col items-center rounded-lg border border-gray-200 bg-white shadow hover:bg-gray-100 md:max-w-xl md:flex-row dark:border-gray-700 dark:bg-blue-700 dark:hover:bg-gray-700"
      >
        <img
          className="h-14 w-14 rounded-lg object-cover"
          src={track?.album_image}
          alt="XYZ"
        />
        <div className="flex flex-col justify-between p-1 leading-normal">
          <div className="flex flex-row justify-between leading-normal">
            <p className="text-md pl-1 font-bold tracking-tight text-gray-900 dark:text-white">
              <a href={track?.track_link}>
                {truncateString(track?.track_name, 40)}
              </a>
            </p>
            {/* <p className="pl-1 font-normal text-gray-700 dark:text-gray-400">
                to
              </p>
              <p className="text-md pl-1 font-bold tracking-tight text-gray-900 dark:text-white">
                {track.playlists_added_to.name}
              </p> */}
          </div>

          <p className="pl-1 font-normal text-gray-700 dark:text-gray-400">
            {track?.artist_names[0]}
          </p>
        </div>
      </a>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Typography sx={{ p: 2 }}>{track?.track_name}</Typography>
        <Typography sx={{ p: 2 }}>{track?.artist_names[0]}</Typography>
      </Popover>
    </div>
  );
}
