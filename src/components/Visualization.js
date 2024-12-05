import React, { useRef, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

const Visualization = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Clean up previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const validData = data.filter(
      (d) =>
        d.courseCode && 
        typeof d.courseCode === 'string' && 
        !isNaN(d.predictedEnrollment)
    );

    if (validData.length === 0) return; // Skip rendering if no valid data

    const labels = validData.map((d) => d.courseCode);
    const values = validData.map((d) => d.predictedEnrollment);

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Predicted Enrollment',
            data: values,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => `Enrollment: ${tooltipItem.raw}`,
            },
          },
        },
        scales: {
          x: { title: { display: true, text: 'Course Codes' } },
          y: { beginAtZero: true, title: { display: true, text: 'Enrollment' } },
        },
      },
    });

    return () => chartInstance.current.destroy();
  }, [data]); // Update chart when 'data' changes

  return <canvas ref={chartRef}></canvas>;
};

export default Visualization;
