import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EmployeeTable = ({ onDelete }) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const pageSize = 5;

  const sortData = (unsortedData) => {
    if (!sortColumn) return unsortedData;

    return [...unsortedData].sort((a, b) => {
      const valA = a[sortColumn];
      const valB = b[sortColumn];

      if (typeof valA === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }

      return sortDirection === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  };

  const load = () => {
    axios.get('/Employee/AllEmployees')
      .then(res => {
        const filtered = res.data.filter(e =>
          e.name.toLowerCase().includes(search.toLowerCase())
        );
        const sorted = sortData(filtered);
        setData(sorted);
      })
      .catch(err => console.error("Error loading data:", err));
  };

  useEffect(() => {
    load();
  }, [search, sortColumn, sortDirection]);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingEmployee(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!editingEmployee) return;
    axios.put(`/Employee/UpdateEmployee?id=${editingEmployee.id}`, editingEmployee)
      .then(() => {
        load();
        setEditingEmployee(null);
        setShowEditModal(false);
      })
      .catch(err => console.error('Update failed:', err));
      window.location.reload();
  };

  const handleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      const ids = pagedData.map(emp => emp.id);
      setSelectedIds(ids);
    }
    setSelectAll(!selectAll);
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;

    axios.post('/Employee/DeleteMultipleEmpoyees', selectedIds)
      .then(() => {
        load();
        setSelectedIds([]);
        setSelectAll(false);
      })
      .catch(err => console.error("Error deleting selected:", err));
  };

  const handleDeleteClick = (id) => {
    setDeleteTargetId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    axios.delete(`/Employee/DeleteEmpoyeeById/?id=${deleteTargetId}`)
      .then(() => {
        load();
        setShowDeleteModal(false);
        setDeleteTargetId(null);
      })
      .catch(err => console.error('Delete failed:', err));
      window.location.reload();
  };

  const handleEditClick = (emp) => {
    setEditingEmployee(emp);
    setShowEditModal(true);
  };

  const pagedData = data.slice(page * pageSize, (page + 1) * pageSize);

  useEffect(() => {
    setSelectedIds([]);
    setSelectAll(false);
  }, [data, page]);

  const renderSortIcon = (column) => {
    if (sortColumn !== column) return null;
    return sortDirection === 'asc' ? ' 🔼' : ' 🔽';
  };

  const handleExportPDF = () => {
    axios.get('/Employee/GeneratePdf')
      .then((response) => {
        const base64String = response.data.base64String || response.data; // adjust based on response format
  
        // Decode base64 string
        const byteCharacters = atob(base64String);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
  
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
  
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'EmployeeReport.pdf');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(err => console.error('PDF Export failed:', err));
  };
  

  return (
    <div className="container mt-4">
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          padding: '24px'
        }}
      >
        <h3 className="mb-3">Employee Table</h3>

        <input
          className="form-control mb-3"
          placeholder="Search by name"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <table className="table table-bordered">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
              <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                Name {renderSortIcon('name')}
              </th>
              <th onClick={() => handleSort('designation')} style={{ cursor: 'pointer' }}>
                Designation {renderSortIcon('designation')}
              </th>
              <th onClick={() => handleSort('gender')} style={{ cursor: 'pointer' }}>
                Gender {renderSortIcon('gender')}
              </th>
              <th onClick={() => handleSort('salary')} style={{ cursor: 'pointer' }}>
                Salary {renderSortIcon('salary')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pagedData.map(emp => (
              <tr key={emp.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(emp.id)}
                    onChange={() => handleSelect(emp.id)}
                  />
                </td>
                <td
                  style={{ cursor: 'pointer', color: '#007bff' }}
                  onClick={() => handleEditClick(emp)}
                >
                  {emp.name}
                </td>
                <td>{emp.designation}</td>
                <td>{emp.gender}</td>
                <td>{emp.salary}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteClick(emp.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {pagedData.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center">No employees found.</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="d-flex justify-content-between mt-3">
          <div>
            <button
              className="btn btn-danger"
              disabled={selectedIds.length === 0}
              onClick={handleDeleteSelected}
            >
              Delete Selected
            </button>
            <button
              className="btn btn-success ms-2"
              onClick={handleExportPDF}
            >
              Export to PDF
            </button>
          </div>
          <div>
            <button
              className="btn btn-outline-primary me-2"
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
            >
              Previous
            </button>
            <button
              className="btn btn-outline-primary"
              disabled={(page + 1) * pageSize >= data.length}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingEmployee && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Employee</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-2">
                  <label>Name:</label>
                  <input
                    name="name"
                    className="form-control"
                    value={editingEmployee.name || ''}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="mb-2">
                  <label>Designation:</label>
                  <input
                    name="designation"
                    className="form-control"
                    value={editingEmployee.designation || ''}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="mb-2">
                  <label>Gender:</label>
                  <select
                    name="gender"
                    className="form-control"
                    value={editingEmployee.gender || ''}
                    onChange={handleEditChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="mb-2">
                  <label>Salary:</label>
                  <input
                    name="salary"
                    className="form-control"
                    value={editingEmployee.salary || ''}
                    onChange={handleEditChange}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-success" onClick={handleSave}>Save</button>
                <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this employee?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-danger" onClick={confirmDelete}>Yes, Delete</button>
                <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>No</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeTable;
