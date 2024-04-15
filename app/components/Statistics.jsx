"use client";

import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useQuery } from "@tanstack/react-query";
import { generateMasterSongList } from "../utils/spotify";
import QuerySnackbar from "./QuerySnackbar";

import Highcharts from 'highcharts';
import HighchartsMore from "highcharts/highcharts-more";
import HighchartsReact from "highcharts-react-official";
import HighchartsExporting from "highcharts/modules/exporting";

// module inits should be inside this if statement to avoid next.js issues
if (typeof Highcharts === "object") {
  HighchartsExporting(Highcharts);
  HighchartsMore(Highcharts);
}


CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

// Check if key exists in localStorage
const isKeyExists = (key) => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key) !== null;
  }
  return false;
};

function getArtistAddedMetrics(tracks) {

  const artistAddedMetrics = new Map();

  tracks.forEach((value, key) =>{
    value.artist_names.forEach((artist) => {
      if(!artistAddedMetrics.has(artist)) {
        artistAddedMetrics.set(artist, value.playlists_added_to.length);
      }
      else
      {
        artistAddedMetrics.set(artist, (artistAddedMetrics.get(artist)+(value.playlists_added_to.length)))
      }
    });
  });

  return artistAddedMetrics;
}

function getArtistPlayedMetrics(tracks) {
  const artistPlayedMetrics = new Map();

  tracks.forEach((value, key) => {
    value.artist_names.forEach((artist) => {
      if (!artistPlayedMetrics.has(artist)) {
        artistPlayedMetrics.set(artist, value.played_at.length);
      } else {
        artistPlayedMetrics.set(
          artist,
          artistPlayedMetrics.get(artist) + value.played_at.length,
        );
      }
    });
  });

  return artistPlayedMetrics;
}

export default function Statistics({ user }) {
  const [value, setValue] = React.useState(0);
  const [dataLoaded, setDataLoaded] = useState(false); // State to track if data loading is complete
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [queryMessage, setQueryMessage] = useState("");
  const [tracks, setTracks] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // code to fetch data
  const { status, data } = useQuery({
    queryKey: ["tracks"],
    queryFn: () => generateMasterSongList(user.spotify_access_token, user.name),
    notifyOnChangeProps: ["data", "status"],
    refetchOnWindowFocus: false,
    enabled: !isKeyExists("tracks"),
  });

  useEffect(() => {
    // Check if key "tracks" doesn't exist in localStorage
    if (!isKeyExists("tracks") && status === "success") {
      // Serialize the map to JSON
      const serializedMap = JSON.stringify([...data]);

      // Store the serialized map in localStorage
      localStorage.setItem("tracks", serializedMap);

      setTracks(data);
      console.log("serialized:", deserializedMap);

      setQueryMessage("Tracks queried...");
      setShowSnackbar(true);
      setDataLoaded(true); // Mark data loading as complete
    }

    // Check to see if key "tracks" exists in localStorage, if so then retrieve from localStorage
    if (isKeyExists("tracks")) {
      // Retrieve the serialized map from localStorage
      const storedMap = localStorage.getItem("tracks");

      // Deserialize the stored map
      const deserializedMap = new Map(JSON.parse(storedMap));
      console.log("deserialized:",deserializedMap);

      setTracks(deserializedMap);

      setQueryMessage("Tracks already retrieved, pulling from storage...");
      setShowSnackbar(true);
      setDataLoaded(true); // Mark data loading as complete
    }
  }, [data, status]);

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  console.log("tracks:",tracks);

  // calculate artist metrics
  const artistAddedMetrics = getArtistAddedMetrics(tracks);
  const artistPlayedMetrics = getArtistPlayedMetrics(tracks);

  var topAddedArtists = [];
  var topPlayedArtists = [];

  artistAddedMetrics.forEach((value, key) => {
    topAddedArtists.sort(function (a, b) {
      return a[0] - b[0];
    });

    if(topAddedArtists.length < 10) {
      topAddedArtists.push([value, key]);
    }
    else{
      let finished = false;

      topAddedArtists.forEach(function(pair, index) {
        if((value > pair[0]) && !finished) {
          this[index] = [value, key];
          finished = true;
        }
      }, topAddedArtists);
    }
  });

  artistPlayedMetrics.forEach((value, key) => {
    topPlayedArtists.sort(function (a, b) {
      return a[0] - b[0];
    });

    if (topPlayedArtists.length < 10) {
      topPlayedArtists.push([value, key]);
    } else {
      let finished = false;

      topPlayedArtists.forEach(function (pair, index) {
        if (value > pair[0] && !finished) {
          this[index] = [value, key];
          finished = true;
        }
      }, topPlayedArtists);
    }
  });

  console.log("added:",topAddedArtists)

  // create the most added artist bubble plot options
  const artistAddedOptions = {
    chart: {
      type: "packedbubble",
    },
    title: {
      text: "Most Added Artists",
    },

    plotOptions: {
      packedbubble: {
        minSize: "30%",
        maxSize: "120%",
        zMin: 0,
        zMax: 1000,
        layoutAlgorithm: {
          splitSeries: false,
          gravitationalConstant: 0.02,
        },

        dataLabels: {
          enabled: true,
          format: "{point.name}",
          filter: {
            property: "y",
            operator: ">",
            value: 250,
          },

          style: {
            color: "black",
            textOutline: "none",
            fontWeight: "normal",
          },
        },
      },
    },

    // series: [
    //   {
    //     name: topAddedArtists[0][1],
    //     data: [
    //       {
    //         name: topAddedArtists[0][1],
    //         value: topAddedArtists[0][0],
    //       },
    //     ],
    //   },
    //   {
    //     name: topAddedArtists[1][1],
    //     data: [
    //       {
    //         name: topAddedArtists[1][1],
    //         value: topAddedArtists[1][0],
    //       },
    //     ],
    //   },
    //   {
    //     name: topAddedArtists[2][1],
    //     data: [
    //       {
    //         name: topAddedArtists[2][1],
    //         value: topAddedArtists[2][0],
    //       },
    //     ],
    //   },
    //   {
    //     name: topAddedArtists[3][1],
    //     data: [
    //       {
    //         name: topAddedArtists[3][1],
    //         value: topAddedArtists[3][0],
    //       },
    //     ],
    //   },
    //   {
    //     name: topAddedArtists[4][1],
    //     data: [
    //       {
    //         name: topAddedArtists[4][1],
    //         value: topAddedArtists[4][0],
    //       },
    //     ],
    //   },
    //   {
    //     name: topAddedArtists[5][1],
    //     data: [
    //       {
    //         name: topAddedArtists[5][1],
    //         value: topAddedArtists[5][0],
    //       },
    //     ],
    //   },
    //   {
    //     name: topAddedArtists[6][1],
    //     data: [
    //       {
    //         name: topAddedArtists[6][1],
    //         value: topAddedArtists[6][0],
    //       },
    //     ],
    //   },
    //   {
    //     name: topAddedArtists[7][1],
    //     data: [
    //       {
    //         name: topAddedArtists[7][1],
    //         value: topAddedArtists[7][0],
    //       },
    //     ],
    //   },
    //   {
    //     name: topAddedArtists[8][1],
    //     data: [
    //       {
    //         name: topAddedArtists[8][1],
    //         value: topAddedArtists[8][0],
    //       },
    //     ],
    //   },
    //   {
    //     name: topAddedArtists[9][1],
    //     data: [
    //       {
    //         name: topAddedArtists[9][1],
    //         value: topAddedArtists[9][0],
    //       },
    //     ],
    //   },
    // ],
  };

  // create the most played artist bubble plot options
  const artistPlayedOptions = {
    chart: {
      backgroundColor: "rgba(0,0,0,0)",
      type: "packedbubble",
    },
    title: {
      text: "Most Played Artists",
    },

    plotOptions: {
      packedbubble: {
        minSize: "30%",
        maxSize: "120%",
        zMin: 0,
        zMax: 1000,
        layoutAlgorithm: {
          splitSeries: false,
          gravitationalConstant: 0.02,
        },

        dataLabels: {
          enabled: true,
          format: "{point.name}",
          filter: {
            property: "y",
            operator: ">",
            value: 250,
          },

          style: {
            color: "black",
            textOutline: "none",
            fontWeight: "normal",
          },
        },
      },
    },

    // series: [
    //   {
    //     name: topPlayedArtists[0][1],
    //     data: [
    //       {
    //         name: topPlayedArtists[0][1],
    //         value: topPlayedArtists[0][0],
    //       },
    //     ],
    //   },
    //   {
    //     name: topPlayedArtists[1][1],
    //     data: [
    //       {
    //         name: topPlayedArtists[1][1],
    //         value: topPlayedArtists[1][0],
    //       },
    //     ],
    //   },
    //   {
    //     name: topPlayedArtists[2][1],
    //     data: [
    //       {
    //         name: topPlayedArtists[2][1],
    //         value: topPlayedArtists[2][0],
    //       },
    //     ],
    //   },
    //   {
    //     name: topPlayedArtists[3][1],
    //     data: [
    //       {
    //         name: topPlayedArtists[3][1],
    //         value: topPlayedArtists[3][0],
    //       },
    //     ],
    //   },
    //   {
    //     name: topPlayedArtists[4][1],
    //     data: [
    //       {
    //         name: topPlayedArtists[4][1],
    //         value: topPlayedArtists[4][0],
    //       },
    //     ],
    //   },
    //   {
    //     name: topPlayedArtists[5][1],
    //     data: [
    //       {
    //         name: topPlayedArtists[5][1],
    //         value: topPlayedArtists[5][0],
    //       },
    //     ],
    //   },
    //   {
    //     name: topPlayedArtists[6][1],
    //     data: [
    //       {
    //         name: topPlayedArtists[6][1],
    //         value: topPlayedArtists[6][0],
    //       },
    //     ],
    //   },
    //   {
    //     name: topPlayedArtists[7][1],
    //     data: [
    //       {
    //         name: topPlayedArtists[7][1],
    //         value: topPlayedArtists[7][0],
    //       },
    //     ],
    //   },
    //   {
    //     name: topPlayedArtists[8][1],
    //     data: [
    //       {
    //         name: topPlayedArtists[8][1],
    //         value: topPlayedArtists[8][0],
    //       },
    //     ],
    //   },
    //   {
    //     name: topPlayedArtists[9][1],
    //     data: [
    //       {
    //         name: topPlayedArtists[9][1],
    //         value: topPlayedArtists[9][0],
    //       },
    //     ],
    //   },
    // ],
  };

  // create the...

  // create the...

  // create the track analysis graph
  const trackOptions = {
    chart: {
      backgroundColor: "rgba(0,0,0,0)",
      polar: true,
      type: "line",
    },

    title: {
      text: "Track Metrics",
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
    },

    yAxis: {
      gridLineInterpolation: "polygon",
      lineWidth: 0,
      min: 0,
    },

    series: [
      {
        name: "Track Name",
        data: [1, 2, 3, 4, 5, 6, 7, 8],
      },
    ],
  };

  return (
    <div className="relative col-span-full row-span-10 mx-32 rounded-lg bg-light_blue-100 p-2 text-black shadow-lg">
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Overview" {...a11yProps(0)} />
          <Tab label="Genre" {...a11yProps(1)} />
          <Tab label="Tracks" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <div class="... flex flex-col overflow-scroll"> 
        {dataLoaded && <div>  
            <div class="... flex flex-row">
              <div>
                <HighchartsReact highcharts={Highcharts} options={artistAddedOptions} />
              </div>
              <div>
                <HighchartsReact highcharts={Highcharts} options={artistPlayedOptions} />
              </div>
            </div>
            <div class="... flex flex-row">
              <div>
                <HighchartsReact highcharts={Highcharts} options={trackOptions} />
              </div>
              <div>
                <HighchartsReact highcharts={Highcharts} options={trackOptions} />
              </div>
            </div>
          </div>}
        </div>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Genre
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Tracks
      </CustomTabPanel>
      <QuerySnackbar
        open={showSnackbar}
        message={queryMessage}
        handleClose={handleCloseSnackbar}
      />
    </div>
  );
}

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
