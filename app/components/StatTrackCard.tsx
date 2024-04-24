"use client";

import * as React from "react";
import Popover from "@mui/material/Popover";
import { Box } from "@mui/material";
import { getTracksFeatures } from "../utils/spotify";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export default function ({ track, user }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [trackFeat, setTrackFeat] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);

  const { status, data, refetch } = useQuery({
    queryKey: ["trackFeat"],
    queryFn: () =>
      getTracksFeatures(user.spotify_access_token, track.spotify_uri),
    notifyOnChangeProps: ["data", "status"],
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (status === "success" && data) {
      setTrackFeat(data);
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [data, status]);

  function onTrackClick(event) {
    setAnchorEl(event.currentTarget);
    refetch(); // This will refetch the track features
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  function convertTimestamp(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  }

  function truncateString(str, maxLength) {
    if (str.length > maxLength) {
      return str.substring(0, maxLength) + "...";
    } else {
      return str;
    }
  }

  function normalize(val, min, max) {
    // Shift to positive to avoid issues when crossing the 0 line
    if (min < 0) {
      max += 0 - min;
      val += 0 - min;
      min = 0;
    }
    // Shift values from 0 - max
    val = val - min;
    max = max - min;
    return Math.max(0, Math.min(1, val / max));
  }

  // create the track analysis graph
  const trackOptions = {
    chart: {
      backgroundColor: "rgba(60,60,60,1)",
      type: "column",
    },

    title: {
      text: '"' + track.track_name + '"' + " Features",
      style: {
        color: "#FFFFFF", // Title text color
      },
    },

    xAxis: {
      categories: [
        "Acousticness",
        "Danceability",
        "Energy",
        "Instrumentalness",
        "Liveness",
        "Loudness",
        "tempo (BPM)",
        "Valence",
      ],
      tickmarkPlacement: "on",
      lineWidth: 0,
      labels: {
        style: {
          color: "#FFFFFF", // X-axis label text color
        },
      },
    },

    yAxis: {
      gridLineInterpolation: "polygon",
      lineWidth: 0,
      min: 0,
      labels: {
        style: {
          color: "#FFFFFF", // Y-axis label text color
        },
      },
    },

    legend: {
      itemStyle: {
        color: "#FFFFFF", // Legend item text color
      },
    },

    series: [
      {
        name: track.track_name,
        colors: [
          "#9b20d9",
          "#9215ac",
          "#861ec9",
          "#7a17e6",
          "#7010f9",
          "#691af3",
          "#6225ed",
          "#5b30e7",
          "#533be1",
          "#4c46db",
          "#4551d5",
          "#3e5ccf",
          "#3667c9",
          "#2f72c3",
          "#277dbd",
          "#1f88b7",
          "#1693b1",
          "#0a9eaa",
          "#03c69b",
          "#00f194",
        ],
        colorByPoint: true,
        groupPadding: 0,
        data: [
          normalize(trackFeat["acousticness"], 0, 1),
          normalize(trackFeat["danceability"], 0, 1),
          normalize(trackFeat["energy"], 0, 1),
          normalize(trackFeat["instrumentalness"], 0, 1),
          normalize(trackFeat["liveness"], 0, 1),
          normalize(trackFeat["loudness"], 0, 1),
          normalize(trackFeat["tempo"], 0, 1),
          normalize(trackFeat["valence"], 0, 1),
        ],
        dataLabels: {
          enabled: true,
          rotation: -90,
          color: "#FFFFFF", // Data label text color
          inside: true,
          verticalAlign: "top",
          format: "{point.y:.1f}", // one decimal
          y: 10, // 10 pixels down from the top
          style: {
            fontSize: "13px",
            fontFamily: "Verdana, sans-serif",
          },
        },
      },
    ],
  };

  return (
    <div className="flex  w-full flex-col">
      <a
        target="_blank"
        onClick={onTrackClick}
        className="flex flex-col items-center rounded-lg border border-gray-200 bg-white shadow hover:bg-gray-100 md:max-w-xl md:flex-row dark:border-gray-700 dark:bg-blue-700 dark:hover:bg-gray-700"
      >
        <img
          className="h-14 w-14 rounded-lg object-cover"
          src={track?.album_image}
          alt="XYZ"
        />
        <div className="flex flex-col justify-between p-1 leading-normal">
          <div className="flex flex-row justify-between leading-normal">
            <p className="text-md pl-1 font-bold tracking-tight text-gray-900 dark:text-white">
              <a href={track?.track_link}>
                {truncateString(track?.track_name, 40)}
              </a>
            </p>
          </div>

          <p className="pl-1 font-normal text-gray-700 dark:text-gray-400">
            {track?.artist_names[0]}
          </p>
        </div>
      </a>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box width={"30rem"} height={"25rem"}>
          {!isLoading && (
            <HighchartsReact highcharts={Highcharts} options={trackOptions} />
          )}
        </Box>
      </Popover>
    </div>
  );
}
