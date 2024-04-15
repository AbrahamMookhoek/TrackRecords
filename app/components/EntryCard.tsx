"use client";
import TrackCardJournal from "./TrackCardJournal";

export default function ({ entry }) {
  return (
    <div className="w-full">
      <div className="flex flex-row justify-between">
        <h1 className="text-lg">
          <b>{entry.title}</b>
        </h1>
        <i>{entry.date.format("MM/DD/YY").toString()}</i>
      </div>

      {entry.track && <TrackCardJournal track={entry.track} />}
    </div>
  );
}
