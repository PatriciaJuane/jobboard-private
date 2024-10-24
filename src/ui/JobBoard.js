import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseDb } from './hooks/useSupabaseDb';
import { supabase } from '../config/supabaseClient';
import './JobBoard.css';

const JobBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(10);
  const navigate = useNavigate();
  const supabaseDb = useSupabaseDb();

  useEffect(() => {
    const fetchJobs = async () => {
      const fetchedJobs = await supabaseDb.getJobs();
      setJobs(fetchedJobs);
      setFilteredJobs(fetchedJobs);
    };
    fetchJobs();
  }, [supabaseDb]); // Added supabaseDb to the dependency array

  useEffect(() => {
    const results = jobs.filter(job => {
      const matches = Object.keys(job).some(key =>
        job[key].toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
      return matches;
    });

    // Only update state if results have changed
    if (results.length !== filteredJobs.length || !results.every((job, index) => JSON.stringify(job) === JSON.stringify(filteredJobs[index]))) {
      setFilteredJobs(results);
      setCurrentPage(1);
      console.log(`Filtered Jobs: ${JSON.stringify(results)}`); // Debugging line
    }
  }, [searchTerm, jobs, filteredJobs]); // Added filteredJobs to the dependency array

  useEffect(() => {
    const results = jobs.filter(job =>
      Object.entries(filters).every(([key, value]) =>
        job[key].toString().toLowerCase().includes(value.toLowerCase())
      )
    );

    // Only update state if results have changed
    if (results.length !== filteredJobs.length || !results.every((job, index) => JSON.stringify(job) === JSON.stringify(filteredJobs[index]))) {
      setFilteredJobs(results);
      setCurrentPage(1);
    }
  }, [filters, jobs, filteredJobs]); // Added filteredJobs to the dependency array

  const handleSearch = (e) => {
    setSearchTerm(e.target.value); // This updates the search term
    // No need to call setFilteredJobs here, as it's handled in the useEffect
  };

  const handleFilter = (attribute, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [attribute]: value
    }));
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
    } else {
      navigate('/jobboard-private');
    }
  };

  // Pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Add this object to map attribute names to user-friendly labels
  const attributeLabels = {
    title: 'Job Title',
    company_name: 'Company',
    location: 'Location',
    seniority: 'Seniority Level',
    workplace_type: 'Workplace Type' // todo desplegable
  };

  return (
    <div className="job-board">
      {/* Top Menu */}
      <div className="top-menu">
        <div className="logo">
          <img src="../assets/icon.png" alt="Site Logo" className="logo-image" /> {/* Adjusted path to assets */}
        </div>
        <div className="menu-links">
          <a href="/home" className="menu-link">Home</a>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </div>

      <h1>The Tech Scene - Job Board</h1>

      <input
        type="text"
        placeholder="Search jobs..."
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
      />

      <div className="filters">
        {Object.entries(attributeLabels).map(([attribute, label]) => (
          <input
            key={attribute}
            type="text"
            placeholder={`Filter by ${label}...`}
            value={filters[attribute] || ''}
            onChange={(e) => handleFilter(attribute, e.target.value)}
            className="filter-input"
          />
        ))}
      </div>

      <div className="responsive-table-container">
        <table className="responsive-table">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Company</th>
              <th>Location</th>
              <th>Seniority</th>
              <th>Saving Rate (Frugal)</th>
              <th>Saving Rate (Comfortable)</th>
              <th>Country</th>
              <th>Workplace Type</th>
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
                <td data-label="Saving Rate (Frugal)">{job.savingRateFrugal}</td>
                <td data-label="Saving Rate (Comfortable)">{job.savingRateComfortable}</td>
                <td data-label="Country">{job.country}</td>
                <td data-label="Workplace Type">{job.workplace_type}</td>
                <td data-label="Actions">
                  <a href={job.url} target="_blank" rel="noopener noreferrer" className="view-job-btn">
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredJobs.length / jobsPerPage) }, (_, i) => (
          <button key={i} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? 'active' : ''}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default JobBoard;
