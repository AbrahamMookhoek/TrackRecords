"use client";
import TrackCardJournal from "./TrackCardJournal";

export default function ({ entry }) {
  return (
    <div>
      <h1>{entry.title}</h1>
      <h1>{entry.date.format("MM/DD/YY").toString()}</h1>
      <div>
        {entry.track && (
          <TrackCardJournal
            track={entry.track}
          />
        )}
      </div>
    </div>
  );
}
