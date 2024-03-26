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

export default function Statistics({ user }) {
  const [value, setValue] = React.useState(0);
  const [dataLoaded, setDataLoaded] = useState(false); // State to track if data loading is complete
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [queryMessage, setQueryMessage] = useState("");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // code to fetch data
  const { status, data } = useQuery({
    queryKey: ["tracks"],
    queryFn: () => generateMasterSongList(user.spotify_access_token, user.name),
    notifyOnChangeProps: ["data", "status"],
    refetchOnWindowFocus: false,
    enabled: !isKeyExists("tracks")
  });

  useEffect(() => {
    // Check if key "tracks" doesn't exist in localStorage
    if (!isKeyExists("tracks") && status === "success") {


      // Serialize the map to JSON
      const serializedMap = JSON.stringify([...data]);

      // Store the serialized map in localStorage
      localStorage.setItem('tracks', serializedMap);

      setQueryMessage("Tracks queried...");
      setShowSnackbar(true);
      setDataLoaded(true); // Mark data loading as complete
    }
    
    // Check to see if key "tracks" exists in localStorage, if so then retrieve from localStorage
    if(isKeyExists("tracks")){
      // Retrieve the serialized map from localStorage
      const storedMap = localStorage.getItem('tracks');

      // Deserialize the stored map
      const deserializedMap = new Map(JSON.parse(storedMap));
      console.log(deserializedMap)

      setQueryMessage("Tracks already retrieved, pulling from storage...");
      setShowSnackbar(true);
      setDataLoaded(true); // Mark data loading as complete
    }
  }, [data, status]);

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
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
        Overview
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
