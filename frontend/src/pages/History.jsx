import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import GeneralNavbar from "../components/navbar/GeneralNavbar";
import HistoryTable from "../components/history/HistoryTable";
import "../styles/History.css";

const History = () => {
  //const navigate = useNavigate();
  
  return (<>
      <GeneralNavbar />
      <div className="history-container">
        <h1>History</h1>
        <p className="description">
          View your attempted questions and solutions.
          Click on the value at the <b>Status</b> column to see your code.
        </p>
        <HistoryTable/>
      </div>
  </>);
};

export default History;