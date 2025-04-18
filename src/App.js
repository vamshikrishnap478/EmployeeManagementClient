import React, { useState, useEffect } from 'react';
import './App.css';
import EmployeeForm from './components/EmployeeForm';
import EmployeeTable from './components/EmployeeTable';
import ChartPopup from './components/ChartPopup';

function App() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showChart, setShowChart] = useState(false);

  const fetchEmployees = async () => {
    try {
      const res = await fetch('https://localhost:44333/Employee/AllEmployees');
      const data = await res.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSave = async (employee) => {
    debugger
    const method = employee.id ? 'PUT' : 'POST';
    const url = employee.id
      ? `https://localhost:44333/Employee/UpdateEmployee?id=${employee.id}` // ✅ id as query param
      : 'https://localhost:44333/Employee/AddEmployee';
  
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employee),
      });
  
      if (res.ok) {
        fetchEmployees();
        setSelectedEmployee(null);
        window.location.reload();
      } else {
        const errorText = await res.text();
        console.error('API error:', errorText);
      }
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };
  
  const handleEdit = (emp) => setSelectedEmployee(emp);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`https://localhost:44333/Employee/DeleteEmpoyeeById/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  return (
    <div className="App">
      <h1>Employee Management</h1>
      <EmployeeForm onSave={handleSave} selectedEmployee={selectedEmployee} />
      <EmployeeTable
        employees={employees}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <button onClick={() => setShowChart(true)}>Show Chart</button>
      {showChart && employees && employees.length > 0 && (
  <ChartPopup show={showChart} onClose={() => setShowChart(false)} data={employees} />
)}
    </div>
  );
}

export default App;
