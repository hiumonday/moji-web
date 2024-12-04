import React from 'react';
import styled from 'styled-components';
import { Button } from "@material-tailwind/react";

// Define a styled component for the chart container
const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #7F9CF5; // border-blue-300
  margin-left: 50px;
  padding: 20px;
  width: 50%; /* Set total width to take about half the screen */
  border-radius: 0.375rem; // equivalent to rounded-md in Tailwind
`;

const Title = styled.h2`
  color: #1F2937; // text-gray-800
  margin-bottom: 10px;
`;

const RowContainer = styled.div`
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0;
  padding-bottom: 10px;
  width: 100%; /* Set each row to take 100% width */
`;

const ProgressBarChart = ({ data }) => {
  const { labels, data: counts, links, dateTaken } = data;

  const createProgressBar = (label, count, link, date) => (
    <RowContainer key={label}>
      <p style={{ fontSize: '20px', color: 'blue', flex: 1, textAlign: 'center' }}>{`${count}%`}</p>
      <p style={{ marginLeft: '10px', fontSize: '12px', flex: 2 }}>{label}</p>
      <p style={{ marginLeft: '10px', fontSize: '12px', flex: 2 }}>{date}</p>
      <Button
        color="blue"
        buttonType="filled"
        size="small"
        rounded={false}
        block={false}
        iconOnly={false}
        ripple="light"
        onClick={() => window.location.href = link}
        style={{ flex: 1, marginLeft: '10px' }}
      >
        Details
      </Button>
    </RowContainer>
  );

  return (
    <ChartContainer>
      <h1>Kết quả gần đây</h1>
      {labels.map((label, index) => (
        createProgressBar(label, counts[index], links[index], dateTaken[index])
      ))}
    </ChartContainer>
  );
};

export default ProgressBarChart;
