import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import './styles/index.scss';

export const TrafficLight = () => {
  const [currentLight, setCurrentLight] = useState(null);

  const lightColors = {
    red: "red",
    yellow: "yellow",
    green: "green",
  };

  const [red, setRed] = useState(lightColors.red);
  const [yellow, setYellow] = useState(lightColors.yellow);
  const [green, setGreen] = useState(lightColors.green);

  const setColorsBasedOnLight = useCallback((newCurrentLight) => {
    switch (newCurrentLight) {
      case "red":
        setRed("red r-color");
        setYellow(lightColors.yellow);
        setGreen(lightColors.green);
        setCurrentLight("red");
        break;
      case "yellow":
        setYellow("yellow y-color");
        setGreen(lightColors.green);
        setRed(lightColors.red);
        setCurrentLight("yellow");
        break;
      case "green":
        setGreen("green g-color");
        setRed(lightColors.red);
        setYellow(lightColors.yellow);
        setCurrentLight("green");
        break;
      default:
        // Handle unknown currentLight values
        break;
    }
  }, [lightColors.red, lightColors.yellow, lightColors.green]);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/current-light");
      const newCurrentLight = response.data.currentLight;
      if (newCurrentLight !== undefined) {
        setCurrentLight(newCurrentLight);
        setColorsBasedOnLight(newCurrentLight);
      } else {
        console.error("Invalid response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching current light data:", error.message);
    }
  };

  const handleColorChange = async (color) => {
    try {
      await axios.post(`http://127.0.0.1:5000/api/change-sequence-${color}`);
      // Optionally handle success response
    } catch (error) {
      console.error("Error changing sequence:", error.message);
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(fetchData, 1000);

    return () => clearInterval(intervalId);
  }, [setColorsBasedOnLight]);

  return (
    <div className="content">
      <div className="square">
        <div className={red} onClick={() => handleColorChange("red")}></div>
      </div>
      <div className="square">
        <div className={yellow} onClick={() => handleColorChange("yellow")}></div>
      </div>
      <div className="square">
        <div className={green} onClick={() => handleColorChange("green")}></div>
      </div>
      {currentLight !== null ? (
        <p>Current Light: {currentLight}</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};
