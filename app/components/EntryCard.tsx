"use client";
import TrackCard from "./TrackCard";

export default function ({ entry }) {
  return (
    <div>
      <h1>{entry.title}</h1>
      <h1>{entry.date.format("YYYY-MM-DD").toString()}</h1>
      <TrackCard track={entry.track} added={false} />
    </div>
  );
}
