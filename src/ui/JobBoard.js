import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseDb } from './hooks/useSupabaseDb';
import { supabase } from '../config/supabaseClient';
import './JobBoard.css';
import logo from '../assets/icon.png';

const JobBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(10);
  const navigate = useNavigate();
  const supabaseDb = useSupabaseDb();
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'ascending' });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const fetchedJobs = await supabaseDb.getJobs();
        setJobs(fetchedJobs);
      } catch (error) {
        console.error('Error fetching jobs:', error.message);
      }
    };
    fetchJobs();
  }, []);

  // Sorting function
  const sortedJobs = [...jobs].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  // Pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = sortedJobs.slice(indexOfFirstJob, indexOfLastJob);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortArrow = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? '↑' : '↓';
    }
    return '';
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
    } else {
      navigate('/jobboard-private');
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="job-board">
      {/* Top Menu */}
      <div className="top-menu">
        <div className="logo">
          <img src={logo} alt="Site Logo" className="logo-image" />
        </div>
        <div className="menu-links">
          <a href="/home" className="menu-link">Home</a>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </div>

      <h1>DevAccelerator's Private Job Board</h1>

      <div className="responsive-table-container">
        <table className="responsive-table">
          <thead>
            <tr>
              <th onClick={() => requestSort('title')}>Job Title {getSortArrow('title')}</th>
              <th onClick={() => requestSort('company_name')}>Company {getSortArrow('company_name')}</th>
              <th onClick={() => requestSort('location')}>Location {getSortArrow('location')}</th>
              <th onClick={() => requestSort('seniority')}>Seniority {getSortArrow('seniority')}</th>
              <th onClick={() => requestSort('salaryRange')}>Salary Range {getSortArrow('salaryRange')}</th>
              <th onClick={() => requestSort('country')}>Country {getSortArrow('country')}</th>
              <th onClick={() => requestSort('workplace_type')}>Workplace Type {getSortArrow('workplace_type')}</th>
              <th onClick={() => requestSort('createdAt')}>Date Added {getSortArrow('createdAt')}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentJobs.map((job) => (
              <tr key={job.id}>
                <td data-label="Job Title">{job.title}</td>
                <td data-label="Company">{job.company_name}</td>
                <td data-label="Location">{job.location}</td>
                <td data-label="Seniority">{job.seniority}</td>
                <td data-label="Salary Range">{job.salaryRange}</td>
                <td data-label="Country">{job.country}</td>
                <td data-label="Workplace Type">{job.workplace_type}</td>
                <td data-label="Date Added">{job.getFormattedCreatedAt()}</td>
                <td data-label="Actions">
                  <a href={job.url} target="_blank" rel="noopener noreferrer" className="view-job-btn">
                    Apply
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        {Array.from({ length: Math.ceil(jobs.length / jobsPerPage) }, (_, i) => (
          <button key={i} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? 'active' : ''}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default JobBoard;
