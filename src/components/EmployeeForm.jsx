import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeForm = ({ onSave, selectedEmployee, onClear }) => {
  const [employee, setEmployee] = useState({
    name: '',
    designation: '',
    dateOfJoin: '',
    salary: '',
    gender: '',
    state: '',
    dateOfBirth: '',
    age: ''
  });

  const [states, setStates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    axios.get('https://localhost:44333/State/AllStatesList')
      .then(res => setStates(res.data))
      .catch(error => {
        console.error('State fetch error:', error);
      });
  }, []);

  useEffect(() => {
    if (employee.dateOfBirth) {
      const birthDate = new Date(employee.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setEmployee(e => ({ ...e, age }));
    }
  }, [employee.dateOfBirth]);

  const validate = () => {
    if (!employee.name || !employee.salary || !employee.gender) {
      alert('Required fields are missing!');
      return false;
    }
    return true;
  };

  const handleSubmit = e => {
    debugger
    e.preventDefault();
    if (!validate()) return;
    onSave(employee);
    console.log('Employee saved:', employee);

    // Reset form and close modal
    setEmployee({
      id: null,
      name: '',
      designation: '',
      dateOfJoin: '',
      salary: '',
      gender: '',
      state: '',
      dateOfBirth: '',
      age: ''
    });
    setIsModalOpen(false);
  };

  const getMaxDOB = () => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Styles
  const styles = {
    openBtn: {
      padding: '10px 20px',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px'
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 999
    },
    modalContent: {
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 0 15px rgba(0, 0, 0, 0.3)',
      position: 'relative',
      width: '80%',
      maxWidth: '600px',
      overflow: 'auto'
    },
    closeBtn: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      backgroundColor: 'transparent',
      border: 'none',
      fontSize: '18px',
      cursor: 'pointer'
    },
    form: {
      maxWidth: '400px',
      margin: '0 auto',
      padding: '20px',
      borderRadius: '10px',
      backgroundColor: '#f9f9f9',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)'
    },
    formLine: {
      marginBottom: '15px',
      display: 'flex',
      flexDirection: 'column'
    },
    label: {
      marginBottom: '5px',
      fontWeight: 'bold'
    },
    input: {
      padding: '8px',
      fontSize: '14px'
    },
    radioGroup: {
      display: 'flex',
      gap: '10px'
    },
    buttonGroup: {
      display: 'flex',
      gap: '10px',
      marginTop: '15px'
    },
    button: {
      padding: '8px 16px',
      fontSize: '14px',
      borderRadius: '5px',
      cursor: 'pointer'
    },
    saveBtn: {
      backgroundColor: '#28a745',
      color: '#fff',
      border: 'none'
    },
    cancelBtn: {
      backgroundColor: '#ffc107',
      color: '#000',
      border: 'none'
    }
  };

  return (
    <div>
      <button onClick={openModal} style={styles.openBtn}>Add Employee</button>

      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <button onClick={closeModal} style={styles.closeBtn}>X</button>

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formLine}>
                <label style={styles.label}>Name:</label>
                <input
                  type="text"
                  value={employee.name}
                  onChange={e => setEmployee({ ...employee, name: e.target.value })}
                  style={styles.input}
                />
              </div>

              <div style={styles.formLine}>
                <label style={styles.label}>Designation:</label>
                <input
                  type="text"
                  value={employee.designation}
                  onChange={e => setEmployee({ ...employee, designation: e.target.value })}
                  style={styles.input}
                />
              </div>

              <div style={styles.formLine}>
                <label style={styles.label}>Date of Join:</label>
                <input
                  type="date"
                  value={employee.dateOfJoin}
                  onChange={e => setEmployee({ ...employee, dateOfJoin: e.target.value })}
                  style={styles.input}
                />
              </div>

              <div style={styles.formLine}>
                <label style={styles.label}>Salary:</label>
                <input
                  type="number"
                  value={employee.salary}
                  onChange={e => setEmployee({ ...employee, salary: e.target.value })}
                  style={styles.input}
                />
              </div>

              <div style={styles.formLine}>
                <label style={styles.label}>Gender:</label>
                <div style={styles.radioGroup}>
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={employee.gender === 'Male'}
                      onChange={e => setEmployee({ ...employee, gender: e.target.value })}
                    />
                    Male
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={employee.gender === 'Female'}
                      onChange={e => setEmployee({ ...employee, gender: e.target.value })}
                    />
                    Female
                  </label>
                </div>
              </div>

              <div style={styles.formLine}>
                <label style={styles.label}>State:</label>
                <select
                  value={employee.state}
                  onChange={e => setEmployee({ ...employee, state: e.target.value })}
                  style={styles.input}
                >
                  <option value="">Select State</option>
                  {states.map(state => (
                    <option key={state.id} value={state.id}>
                      {state.stateName}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.formLine}>
                <label style={styles.label}>Date of Birth:</label>
                <input
                  type="date"
                  max={getMaxDOB()}
                  value={employee.dateOfBirth}
                  onChange={e => setEmployee({ ...employee, dateOfBirth: e.target.value })}
                  style={styles.input}
                />
              </div>

              <div style={styles.formLine}>
                <label style={styles.label}>Age:</label>
                <input
                  type="text"
                  value={employee.age}
                  readOnly
                  style={styles.input}
                  placeholder="Age"
                />
              </div>

              <div style={styles.buttonGroup}>
                <button type="submit" style={{ ...styles.button, ...styles.saveBtn }}>
                  Save
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{ ...styles.button, ...styles.cancelBtn }}
                >
                  Cancel
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeForm;
