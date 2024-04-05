"use client";
import TrackCard from "./TrackCard";

export default function ({ entry }) {
  return (
    <div>
      <h1>{entry.title}</h1>
      <h1>{entry.date.format("MM/DD/YY").toString()}</h1>
      <div>
        {entry.track && (
          <TrackCard
            track={entry.track}
            added={entry.track.playlists_added_to !== undefined}
            allowLink={false}
          />
        )}
      </div>
    </div>
  );
}
