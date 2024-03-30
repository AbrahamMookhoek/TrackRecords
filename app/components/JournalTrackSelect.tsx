"use client";
import TrackCard from "./TrackCard";
import { Track } from "../shared_objects/Track";
import { Select, SelectChangeEvent } from "@mui/material";
import { MenuItem } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { InputLabel } from "@mui/material";
import dayjs from "dayjs";

//this originally held the functionality of the date picker, dropdown list, and track card for the text editor in the journal
//it may end up being empty in which case this can be deleted

export default function () {
  return <h1 />;
}
