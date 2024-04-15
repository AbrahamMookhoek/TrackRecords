"use client";
import TrackCardJournal from "./TrackCardJournal";

export default function ({ entry }) {
  return (
    <div>
      <div className="flex flex-row justify-between">
        <h1>
          <b>{entry.title}</b>
        </h1>
        <p>{entry.date.format("MM/DD/YY").toString()}</p>
      </div>

      <div>{entry.track && <TrackCardJournal track={entry.track} />}</div>
    </div>
  );
}
