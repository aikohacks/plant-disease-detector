"use client";
import React from 'react';

const PieChart = ({ percentage }) => {
  const numPercentage = parseFloat(percentage);
  const style = {
    background: `conic-gradient(#4ade80 ${numPercentage}%, #3f3f46 0)`,
  };

  return (
    <div className="pie-chart-container">
      <div className="pie-chart" style={style}>
        <div className="pie-chart-center">
          <span className="pie-chart-text">{percentage}</span>
        </div>
      </div>
    </div>
  );
};

export default PieChart;
