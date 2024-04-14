"use client";

export default function ({ track }) {
  if (track === undefined) {
    return;
  }

  if(track.artist_names[0] === undefined)
    console.log(track)
  return (
    <div className="flex w-full flex-col">
      <div className="flex flex-col items-center rounded-lg border border-gray-200 bg-white shadow hover:bg-gray-100 md:max-w-xl md:flex-row dark:border-gray-700 dark:bg-blue-600 dark:hover:bg-gray-700">
        <img
          className="h-14 w-14 rounded-lg object-cover"
          src={track.album_image}
          alt={track.track_name}
        />
        <div className="flex flex-col justify-between p-1 leading-normal">
          <div className="flex flex-row justify-between leading-normal">
            <p className="text-md pl-1 font-bold tracking-tight text-gray-900 dark:text-white">
              {track.track_name}
            </p>
          </div>
          <p className="pl-1 font-normal text-gray-700 dark:text-gray-400">
            {track.artist_names[0]}
          </p>
        </div>
      </div>
    </div>
  );
}
