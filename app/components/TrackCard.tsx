"use client";

export default function ({ track, added = true, allowLink = true }) {
  if (track === undefined) {
    return;
  }
  function convertTimestamp(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  }

  if (added === true) {
    return (
      <div className="flex w-full flex-col">
        <a
          {...(allowLink ? { href: track.track_link } : {})}
          target="_blank"
          className="flex flex-col items-center rounded-lg border border-gray-200 bg-white shadow hover:bg-gray-100 md:max-w-xl md:flex-row dark:border-gray-700 dark:bg-green-700 dark:hover:bg-gray-700"
        >
          <img
            className="h-14 w-14 rounded-lg object-cover"
            src={track.album_image}
            alt="XYZ"
          />
          <div className="flex flex-col justify-between p-1 leading-normal">
            <div className="flex flex-row justify-between leading-normal">
              <p className="text-md pl-1 font-bold tracking-tight text-gray-900 dark:text-white">
                {track.track_name}
              </p>
              <p className="pl-1 font-normal text-gray-700 dark:text-gray-400">
                to
              </p>
              <p className="text-md pl-1 font-bold tracking-tight text-gray-900 dark:text-white">
                {track.playlists_added_to.name}
              </p>
            </div>

            <p className="pl-1 font-normal text-gray-700 dark:text-gray-400">
              {track.artist_names[0]}
            </p>
          </div>
        </a>
      </div>
    );
  } else {
    return (
      <div className="flex w-full flex-col">
        <a
          {...(allowLink ? { href: track.track_link } : {})}
          target="_blank"
          className="flex flex-col items-center rounded-lg border border-gray-200 bg-white shadow hover:bg-gray-100 md:max-w-xl md:flex-row dark:border-gray-700 dark:bg-purple-700 dark:hover:bg-gray-700"
        >
          <img
            className="h-14 w-14 rounded-lg object-cover"
            src={track.album_image}
            alt="XYZ"
          />
          <div className="flex flex-col justify-between p-1 leading-normal">
            <div className="justify-betweenc flex flex-row leading-normal">
              <p className="text-md pl-1 font-bold tracking-tight text-gray-900 dark:text-white">
                {track.track_name}
              </p>
              <p className="pl-1 font-normal text-gray-700 dark:text-gray-400">
                at
              </p>
              <p className="text-md pl-1 font-bold tracking-tight text-gray-900 dark:text-white">
                {convertTimestamp(track.played_at)}
              </p>
            </div>

            <p className="pl-1 font-normal text-gray-700 dark:text-gray-400">
              {track.artist_names[0]}
            </p>
          </div>
        </a>
      </div>
    );
  }
}
