"use client";

import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { useQuery } from "@tanstack/react-query";
import { generateMasterSongList } from "../utils/spotify";
import QuerySnackbar from "./QuerySnackbar";

import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import FilterListIcon from "@mui/icons-material/FilterList";

import Highcharts from "highcharts";
import HighchartsMore from "highcharts/highcharts-more";
import HighchartsReact from "highcharts-react-official";
import HighchartsExporting from "highcharts/modules/exporting";
import StatTrackCard from "./StatTrackCard";

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
  if (typeof window !== "undefined") {
    return localStorage.getItem(key) !== null;
  }
  return false;
};

function getArtistAddedMetrics(tracks) {
  const artistAddedMetrics = new Map();

  tracks.forEach((value, key) => {
    value.artist_names.forEach((artist) => {
      if (!artistAddedMetrics.has(artist)) {
        artistAddedMetrics.set(artist, value.playlists_added_to.length);
      } else {
        artistAddedMetrics.set(
          artist,
          artistAddedMetrics.get(artist) + value.playlists_added_to.length,
        );
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

function getArtistOverallMetrics(tracks) {
  const artistOverallMetrics = new Map();

  tracks.forEach((value, key) => {
    value.artist_names.forEach((artist) => {
      if (!artistOverallMetrics.has(artist)) {
        artistOverallMetrics.set(
          artist,
          value.played_at.length + value.playlists_added_to.length,
        );
      } else {
        artistOverallMetrics.set(
          artist,
          artistOverallMetrics.get(artist) +
            value.played_at.length +
            value.playlists_added_to.length,
        );
      }
    });
  });

  return artistOverallMetrics;
}

export default function Statistics({ user }) {
  const [value, setValue] = React.useState(0);
  const [dataLoaded, setDataLoaded] = useState(false); // State to track if data loading is complete
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [queryMessage, setQueryMessage] = useState("");
  const [tracks, setTracks] = useState([]);

  const [artistOverallOptions, setArtistOverallOptions] = useState(undefined);
  const [artistPlayedOptions, setArtistPlayedOptions] = useState(undefined);
  const [artistAddedOptions, setArtistAddedOptions] = useState(undefined);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const [anchorFilterEl, setAnchorFilterEl] = useState(null);
  const [filterSelection, setFilterSelection] = useState("");

  const handleFilterMenuOpen = (event) => {
    setAnchorFilterEl(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setAnchorFilterEl(null);
  };

  const handleFilterOptionClick = (filterOption) => {
    setFilterSelection(filterOption);
    var filteredTracks = [];
    if (filterOption == "name") {
      const temp = [...tracks.values()];

      filteredTracks = temp.filter((track) =>
        track?.track_name.toLowerCase().includes(searchTerm),
      );
    } else if (filterOption == "artist") {
      const temp = [...tracks.values()];

      filteredTracks = temp.filter((track) =>
        track?.artist_names.some((artist) =>
          artist.toLowerCase().includes(searchTerm),
        ),
      );
    }

    filteredTracks.sort((a, b) => {
      // console.log(a, b);
      var textA = a.track_name.toUpperCase();
      var textB = b.track_name.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
    setFilteredData(filteredTracks);
    handleFilterMenuClose();
  };

  const handleSearchChange = (event) => {
    //TODO based on search term, filter data down based on the artist name or track title!
    const userInput = event.target.value.toLowerCase();
    setSearchTerm(userInput);

    const temp = [...tracks.values()];

    const filteredTracks = temp.filter(
      (track) =>
        track?.track_name.toLowerCase().includes(userInput) ||
        track?.artist_names[0].toLowerCase().includes(userInput),
    );

    filteredTracks.sort((a, b) => {
      // console.log(a, b);
      var textA = a.track_name.toUpperCase();
      var textB = b.track_name.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });

    setFilteredData(filteredTracks);
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
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
      setFilteredData([...data.values()]);
      // console.log("serialized:", deserializedMap);

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

      setTracks(deserializedMap);
      setFilteredData([...deserializedMap.values()]);

      setQueryMessage("Tracks already retrieved, pulling from storage...");
      setShowSnackbar(true);

      // chart creation logic
      if (deserializedMap.size > 0) {
        // calculate artist metrics
        const artistAddedMetrics = getArtistAddedMetrics(deserializedMap);
        const artistPlayedMetrics = getArtistPlayedMetrics(deserializedMap);
        const artistOverallMetrics = getArtistOverallMetrics(deserializedMap);

        // console.log(
        //   artistAddedMetrics,
        //   artistPlayedMetrics,
        //   artistOverallMetrics,
        // );

        // create variables to store respective top 10 artist values
        var topAddedArtists = [];
        artistAddedMetrics.forEach((value, key) => {
          topAddedArtists.sort(function (a, b) {
            return a[0] - b[0];
          });

          if (topAddedArtists.length < 10) {
            topAddedArtists.push([value, key]);
          } else {
            let finished = false;

            topAddedArtists.forEach(function (pair, index) {
              if (value > pair[0] && !finished) {
                this[index] = [value, key];
                finished = true;
              }
            }, topAddedArtists);
          }
        });

        var topPlayedArtists = [];
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

        var topOverallArtists = [];
        artistOverallMetrics.forEach((value, key) => {
          topOverallArtists.sort(function (a, b) {
            return a[0] - b[0];
          });

          if (topOverallArtists.length < 10) {
            topOverallArtists.push([value, key]);
          } else {
            let finished = false;

            topOverallArtists.forEach(function (pair, index) {
              if (value > pair[0] && !finished) {
                this[index] = [value, key];
                finished = true;
              }
            }, topOverallArtists);
          }
        });

        // create the top 10 added artists bubble plot options
        setArtistAddedOptions({
          chart: {
            backgroundColor: "#3c3c3c",
            type: "packedbubble",
            borderRadius: 20,
          },
          title: {
            text: "Top 10 Added Artists",
            style: {
              color: "#ffffff", // White text color for x-axis labels
            },
          },
          xAxis: {
            labels: {
              style: {
                color: "#ffffff", // White text color for x-axis labels
              },
            },
          },
          yAxis: {
            labels: {
              style: {
                color: "#ffffff", // White text color for y-axis labels
              },
            },
          },
          legend: {
            itemStyle: {
              color: "#ffffff", // White text color for legend items
            },
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
                  color: "white",
                  textOutline: "none",
                  fontWeight: "normal",
                },
              },
            },
          },
          series: [
            {
              name: topAddedArtists[0][1],
              data: [
                {
                  name: topAddedArtists[0][1],
                  value: topAddedArtists[0][0],
                },
              ],
            },
            {
              name: topAddedArtists[1][1],
              data: [
                {
                  name: topAddedArtists[1][1],
                  value: topAddedArtists[1][0],
                },
              ],
            },
            {
              name: topAddedArtists[2][1],
              data: [
                {
                  name: topAddedArtists[2][1],
                  value: topAddedArtists[2][0],
                },
              ],
            },
            {
              name: topAddedArtists[3][1],
              data: [
                {
                  name: topAddedArtists[3][1],
                  value: topAddedArtists[3][0],
                },
              ],
            },
            {
              name: topAddedArtists[4][1],
              data: [
                {
                  name: topAddedArtists[4][1],
                  value: topAddedArtists[4][0],
                },
              ],
            },
            {
              name: topAddedArtists[5][1],
              data: [
                {
                  name: topAddedArtists[5][1],
                  value: topAddedArtists[5][0],
                },
              ],
            },
            {
              name: topAddedArtists[6][1],
              data: [
                {
                  name: topAddedArtists[6][1],
                  value: topAddedArtists[6][0],
                },
              ],
            },
            {
              name: topAddedArtists[7][1],
              data: [
                {
                  name: topAddedArtists[7][1],
                  value: topAddedArtists[7][0],
                },
              ],
            },
            {
              name: topAddedArtists[8][1],
              data: [
                {
                  name: topAddedArtists[8][1],
                  value: topAddedArtists[8][0],
                },
              ],
            },
            {
              name: topAddedArtists[9][1],
              data: [
                {
                  name: topAddedArtists[9][1],
                  value: topAddedArtists[9][0],
                },
              ],
            },
          ],
        });

        // create the top 10 played artists bubble plot options
        setArtistPlayedOptions({
          chart: {
            backgroundColor: "#3c3c3c",
            type: "packedbubble",
            borderRadius: 20,
          },
          title: {
            text: "Top 10 Played Artists",
            style: {
              color: "#ffffff", // White text color for the title
            },
          },
          xAxis: {
            labels: {
              style: {
                color: "#ffffff", // White text color for x-axis labels
              },
            },
          },
          yAxis: {
            labels: {
              style: {
                color: "#ffffff", // White text color for y-axis labels
              },
            },
          },
          legend: {
            itemStyle: {
              color: "#ffffff", // White text color for legend items
            },
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
                  color: "white",
                  textOutline: "none",
                  fontWeight: "normal",
                },
              },
            },
          },

          series: [
            {
              name: topPlayedArtists[0][1],
              data: [
                {
                  name: topPlayedArtists[0][1],
                  value: topPlayedArtists[0][0],
                },
              ],
            },
            {
              name: topPlayedArtists[1][1],
              data: [
                {
                  name: topPlayedArtists[1][1],
                  value: topPlayedArtists[1][0],
                },
              ],
            },
            {
              name: topPlayedArtists[2][1],
              data: [
                {
                  name: topPlayedArtists[2][1],
                  value: topPlayedArtists[2][0],
                },
              ],
            },
            {
              name: topPlayedArtists[3][1],
              data: [
                {
                  name: topPlayedArtists[3][1],
                  value: topPlayedArtists[3][0],
                },
              ],
            },
            {
              name: topPlayedArtists[4][1],
              data: [
                {
                  name: topPlayedArtists[4][1],
                  value: topPlayedArtists[4][0],
                },
              ],
            },
            {
              name: topPlayedArtists[5][1],
              data: [
                {
                  name: topPlayedArtists[5][1],
                  value: topPlayedArtists[5][0],
                },
              ],
            },
            {
              name: topPlayedArtists[6][1],
              data: [
                {
                  name: topPlayedArtists[6][1],
                  value: topPlayedArtists[6][0],
                },
              ],
            },
            {
              name: topPlayedArtists[7][1],
              data: [
                {
                  name: topPlayedArtists[7][1],
                  value: topPlayedArtists[7][0],
                },
              ],
            },
            {
              name: topPlayedArtists[8][1],
              data: [
                {
                  name: topPlayedArtists[8][1],
                  value: topPlayedArtists[8][0],
                },
              ],
            },
            {
              name: topPlayedArtists[9][1],
              data: [
                {
                  name: topPlayedArtists[9][1],
                  value: topPlayedArtists[9][0],
                },
              ],
            },
          ],
        });

        // create the top 10 overall artists bubble plot options
        setArtistOverallOptions({
          chart: {
            backgroundColor: "#3c3c3c",
            type: "packedbubble",
            borderRadius: 20,
          },
          title: {
            text: "Top 10 Overall Artists",
            style: {
              color: "#ffffff", // White text color for the title
            },
          },
          xAxis: {
            labels: {
              style: {
                color: "#ffffff", // White text color for x-axis labels
              },
            },
          },
          yAxis: {
            labels: {
              style: {
                color: "#ffffff", // White text color for y-axis labels
              },
            },
          },
          legend: {
            itemStyle: {
              color: "#ffffff", // White text color for legend items
            },
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
                  color: "white",
                  textOutline: "none",
                  fontWeight: "normal",
                },
              },
            },
          },

          series: [
            {
              name: topOverallArtists[0][1],
              data: [
                {
                  name: topOverallArtists[0][1],
                  value: topOverallArtists[0][0],
                },
              ],
            },
            {
              name: topOverallArtists[1][1],
              data: [
                {
                  name: topOverallArtists[1][1],
                  value: topOverallArtists[1][0],
                },
              ],
            },
            {
              name: topOverallArtists[2][1],
              data: [
                {
                  name: topOverallArtists[2][1],
                  value: topOverallArtists[2][0],
                },
              ],
            },
            {
              name: topOverallArtists[3][1],
              data: [
                {
                  name: topOverallArtists[3][1],
                  value: topOverallArtists[3][0],
                },
              ],
            },
            {
              name: topOverallArtists[4][1],
              data: [
                {
                  name: topOverallArtists[4][1],
                  value: topOverallArtists[4][0],
                },
              ],
            },
            {
              name: topOverallArtists[5][1],
              data: [
                {
                  name: topOverallArtists[5][1],
                  value: topOverallArtists[5][0],
                },
              ],
            },
            {
              name: topOverallArtists[6][1],
              data: [
                {
                  name: topOverallArtists[6][1],
                  value: topOverallArtists[6][0],
                },
              ],
            },
            {
              name: topOverallArtists[7][1],
              data: [
                {
                  name: topOverallArtists[7][1],
                  value: topOverallArtists[7][0],
                },
              ],
            },
            {
              name: topOverallArtists[8][1],
              data: [
                {
                  name: topOverallArtists[8][1],
                  value: topOverallArtists[8][0],
                },
              ],
            },
            {
              name: topOverallArtists[9][1],
              data: [
                {
                  name: topOverallArtists[9][1],
                  value: topOverallArtists[9][0],
                },
              ],
            },
          ],
        });

        setDataLoaded(true); // Mark data loading as complete
      }
    }
  }, [data, status]);

  return (
    <div className="relative col-span-full row-span-10 mx-32 flex flex-col rounded-lg bg-light_blue-100 p-2 text-black shadow-lg">
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleTabChange}
          aria-label="basic tabs example"
        >
          <Tab label="Overview" {...a11yProps(0)} />
          <Tab label="Tracks" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <div className="flex flex-grow flex-col items-center gap-4">
          {dataLoaded && (
            <>
              {/*Artist Overall*/}
              <div style={{ width: "77%" }}>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={artistOverallOptions}
                />
              </div>

              {/*Artists Added/Played*/}
              <div className="flex gap-4">
                <HighchartsReact
                  highcharts={Highcharts}
                  options={artistAddedOptions}
                  containerProps={{ className: "flex-grow chart-style" }}
                />

                <HighchartsReact
                  highcharts={Highcharts}
                  options={artistPlayedOptions}
                  containerProps={{ className: "flex-grow chart-style" }}
                />
              </div>
            </>
          )}
        </div>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <div className="flex justify-between gap-x-4">
          <TextField
            label="Search"
            variant="filled"
            value={searchTerm}
            onChange={handleSearchChange}
            margin="normal"
          />
          <Button onClick={handleFilterMenuOpen} startIcon={<FilterListIcon />}>
            Filter
          </Button>
          <Menu
            anchorEl={anchorFilterEl}
            open={Boolean(anchorFilterEl)}
            onClose={handleFilterMenuClose}
          >
            <MenuItem
              onClick={() => handleFilterOptionClick("name")}
              selected={filterSelection === "name"}
            >
              Filter by Name
            </MenuItem>
            <MenuItem
              onClick={() => handleFilterOptionClick("artist")}
              selected={filterSelection === "artist"}
            >
              Filter by Artist
            </MenuItem>
          </Menu>
        </div>
        <div className="mt-1 grid grid-cols-4 gap-4">
          {dataLoaded && (
            <>
              {filteredData.map((track) => {
                return (
                  <StatTrackCard
                    key={track.spotify_uri}
                    track={track}
                    user={user}
                  ></StatTrackCard>
                );
              })}
            </>
          )}
        </div>
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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}
