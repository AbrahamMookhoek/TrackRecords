"use-client";
import TrackCard from "./TrackCard";
import { Track } from "../shared_objects/Track";
import { Select, SelectChangeEvent } from "@mui/material";
import { MenuItem } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { InputLabel } from "@mui/material";
import dayjs from "dayjs";

export default function () {
  const handleSelectChange = (event: SelectChangeEvent) => {
    //update track card to show current selected track
    console.log(event.target.value);
  };

  const updateTrackList = (selectedDate) => {
    console.log(selectedDate);
    //update select list to show tracks from currently selected day
  };

  //get current day to set as default for date picker
  const date = dayjs();

  //just a test to show input in the select list, replace with actual tracks from current day
  const tracks = ["track 1", "track 2", "track 3"];

  const sample_track = new Track();
  sample_track.track_name = "Sample Track Name";
  sample_track.artist_names = ["Sample Track Artist"];

  return (
    <div>
      <InputLabel id="track-select-label">Track</InputLabel>
      <Select
        labelId="track-select-label"
        label="Track"
        onChange={handleSelectChange}
      >
        {tracks.map((track) => (
          <MenuItem key={track} value={track}>
            {track}
          </MenuItem>
        ))}
      </Select>
      <TrackCard track={sample_track} added={false} />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {
          <DatePicker
            defaultValue={date}
            onChange={(NewValue) =>
              updateTrackList(NewValue.format("YYYY-MM-DD").toString())
            }
          />
        }
      </LocalizationProvider>
    </div>
  );
}
