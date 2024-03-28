"use client";

import React, { useState } from "react";
import Trix from "../components/Trix";
import JournalEntryTitle from "./JournalEntryTitle";
import JournalTrackSelect from "./JournalTrackSelect";
import { Track } from "../shared_objects/Track";
import { Entry } from "../shared_objects/Entry";

//once entries are added to db, text editor should be updated to show content when a specific entry is selected
export default function TextEditor({ user }) {
  const [value, setValue] = useState("");

  //sample track, in future track will already be part of entry object by this point
  const sample_track = new Track();
  sample_track.track_name = "Sample Track Name";
  sample_track.artist_names = ["Sample Track Artist"];

  //sample entry, for use until can be passed in as func parameter
  const entry = new Entry();
  entry.title = "Sample Title";
  entry.track = sample_track;
  entry.content = "Sample editor content";

  //all the content is just slapped in here, needs to be reorganized at some point
  return (
    <div className="col-span-5 mr-32 rounded-lg bg-light_blue-100 p-2 text-black shadow-lg">
      <JournalEntryTitle title={entry.title} />
      <JournalTrackSelect />
      <Trix
        defaultValue={entry.content}
        onChange={(e, newValue) => setValue(newValue)}
      />
    </div>
  );
}
