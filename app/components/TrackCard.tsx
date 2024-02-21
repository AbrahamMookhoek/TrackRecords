"use client";

export default function (track) {
  return (
    <div className="flex w-full flex-col">
      <a
        href="#"
        className="flex flex-col items-center rounded-lg border border-gray-200 bg-white shadow hover:bg-gray-100 md:max-w-xl md:flex-row dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        <img
          className="h-14 w-14 rounded-t-lg object-cover"
          src={track.track.album_image}
          alt="XYZ"
        />
        <div className="flex flex-col justify-between p-1 leading-normal">
          <p className="text-md pl-1 font-bold tracking-tight text-gray-900 dark:text-white">
            {track.track.track_name}
          </p>
          <p className="pl-1 font-normal text-gray-700 dark:text-gray-400">
            {track.track.artist_names[0]}
          </p>
        </div>
      </a>
    </div>
  );
}
