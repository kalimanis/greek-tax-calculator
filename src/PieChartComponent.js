import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

// Define the custom plugin
const centerTextPlugin = {
  id: 'centerText',
  afterDraw(chart) {
    const { ctx, data, chartArea: { top, left, width, height } } = chart;
    ctx.save();

    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const total = data.datasets[0].data.reduce((a, b) => a + b, 0);

    data.datasets[0].data.forEach((value, index) => {
      const { startAngle, endAngle, outerRadius, innerRadius } = chart.getDatasetMeta(0).data[index];
      const angle = startAngle + (endAngle - startAngle) / 2;
      const radius = innerRadius + (outerRadius - innerRadius) / 2;
      const x = left + width / 2 + radius * Math.cos(angle);
      const y = top + height / 2 + radius * Math.sin(angle);
      const percent = ((value / total) * 100).toFixed(1) + '%';
      
      // Measure text and calculate rectangle dimensions
      const textWidth = ctx.measureText(percent).width;
      const textHeight = parseInt(ctx.font, 10); // Base 10
      const rectPadding = 5;
      const rectWidth = textWidth + rectPadding * 2;
      const rectHeight = textHeight + rectPadding * 2;
      
      // Draw rectangle background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'; // Light color fill with some transparency
      ctx.fillRect(x - rectWidth / 2, y - rectHeight / 2, rectWidth, rectHeight);
      
      // Draw text
      ctx.fillStyle = '#333'; // Dark text color for contrast
      ctx.fillText(percent, x, y);
    });

    ctx.restore();
  }
};

function PieChartComponent({ data }) {
    const chartData = {
        labels: data.labels,
        datasets: [{
            data: data.values,
            backgroundColor: ['#FF6384', '#36A2EB'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB'],
        }]
    };

    const options = {
        plugins: {
            tooltip: {
                enabled: false // Disable tooltips if you prefer
            },
            legend: {
                display: true,
                position: 'top'
            }
        }
    };

    return (
        <div style={{ width: '300px', height: '300px', margin: 'auto' }}>
            <Pie data={chartData} options={options} plugins={[centerTextPlugin]} />
        </div>
    );
}

export default PieChartComponent;
