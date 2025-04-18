import React from 'react';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const ChartPopup = ({ show, onClose, data }) => {
  if (!show || !Array.isArray(data)) return null;

  // Group and sum salaries by designation
  const salaryByDesignation = data.reduce((acc, emp) => {
    if (!emp.designation || isNaN(emp.salary)) return acc;
    acc[emp.designation] = (acc[emp.designation] || 0) + parseFloat(emp.salary);
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(salaryByDesignation),
    datasets: [
      {
        label: 'Total Salary by Designation',
        data: Object.values(salaryByDesignation),
        backgroundColor: '#2ecc71',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Salary Distribution by Designation',
        font: { size: 18 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: value => `₹${value.toLocaleString()}`,
        },
      },
    },
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: '#fff',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        zIndex: 1000,
        width: '600px',
        maxWidth: '90%',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '15px',
        }}
      >
        <h5 style={{ margin: 0 }}>Salary by Designation</h5>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
          }}
        >
          ✖
        </button>
      </div>
      <Bar data={chartData} options={options} />
    </div>
  );
};


export default ChartPopup;
