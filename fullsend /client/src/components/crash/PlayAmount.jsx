
import React, { useState, useEffect } from "react";
import { getCrashSchema } from "../../services/api.service";
import { crashSocket } from "../../services/websocket.service";
import parseCommasToThousands from "../../utils/parseCommasToThousands";
import coin from "../../assets/icons/coin.png";import Box from "@material-ui/core/Box";

export const PlayAmount = () => {
  const [playAmount, setPlayAmount] = useState(0);

  // Fetch crash schema from API
  const fetchData = async () => {
    try {
      const schema = await getCrashSchema();

      // Update state
      setPlayAmount(schema.current.players.reduce((a, b) => a + b.betAmount, 0));
    } catch (error) {
      console.log("There was an error while loading crash schema:", error);
    }
  };

  useEffect(() => {
    fetchData();

    crashSocket.on("game-starting", fetchData);
    crashSocket.on("game-start", fetchData);
    crashSocket.on("game-end", fetchData);
    crashSocket.on("game-bets", fetchData);

    // componentDidUnmount
    return () => {
      // Remove listeners
      crashSocket.off("game-starting", fetchData);
      crashSocket.off("game-start", fetchData);
      crashSocket.off("game-end", fetchData);
      crashSocket.off("game-bets", fetchData);
    };
  });

  return (
    <div style={{ color: "#9E9FBD", fontSize: "10px", margin: "auto", marginLeft: "0px", display: "flex", alignItems: "center", gap: "0.25rem" }}>
      <img src={coin} style={{ height: 10, width: 10}} /> {parseCommasToThousands(parseFloat(playAmount.toFixed(0)))}
    </div>
  );
};
