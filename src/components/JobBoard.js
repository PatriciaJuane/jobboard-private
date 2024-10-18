import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import './JobBoard.css';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient'; // Ensure supabaseClient is properly set up


const JobBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  // eslint-disable-next-line
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fileURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSl5bM79xPah_zkS9_Wxh8DaR9QEbTx_JgczV1YVsAos09Up4w1rGkXPZ_qDeJAkkWDZP9_boCHyMbT/pub?gid=0&single=true&output=csv';

    axios
      .get(fileURL, { responseType: 'arraybuffer' })
      .then((response) => {
        const data = new Uint8Array(response.data);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        setJobs(jsonData);
      })
      .catch((error) => {
        console.error('Error fetching or parsing the Excel file:', error);
      });
  }, []);

  // Get unique locations and companies from jobs data for dropdown options
  const uniqueLocations = [...new Set(jobs.map((job) => job.Location))];
  const uniqueCompanies = [...new Set(jobs.map((job) => job['Company Name']))];

  // Filter jobs based on search, location, and company
  const filteredJobs = jobs.filter((job) => {
    return (
      job['Job Title'].toLowerCase().includes(searchTerm.toLowerCase()) &&
      (locationFilter === '' || job.Location === locationFilter) &&
      (companyFilter === '' || job['Company Name'] === companyFilter)
    );
  });

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
    } else {
      setSession(null);
      navigate('/'); // Redirect to home after logout
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <h1>The Tech Scene - Job Board</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search jobs by title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Location Filter */}
      <select onChange={(e) => setLocationFilter(e.target.value)} value={locationFilter}>
        <option value="">All Locations</option>
        {uniqueLocations.map((location, index) => (
          <option key={index} value={location}>
            {location}
          </option>
        ))}
      </select>

      {/* Company Filter */}
      <select onChange={(e) => setCompanyFilter(e.target.value)} value={companyFilter}>
        <option value="">All Companies</option>
        {uniqueCompanies.map((company, index) => (
          <option key={index} value={company}>
            {company}
          </option>
        ))}
      </select>

      {/* Job Table */}
      <table className="job-table">
        <thead>
          <tr>
            <th>Job Title</th>
            <th>Company Name</th>
            <th>Location</th>
            <th>Seniority</th>
            <th>Saving Rate (Frugal)</th>
            <th>Saving Rate (Comfortable)</th>
            <th>Job URL</th>
            <th>Country</th>
            <th>Workplace Type</th>
          </tr>
        </thead>
        <tbody>
          {filteredJobs.map((job, index) => (
            <tr key={index}>
              <td>{job['Job Title']}</td>
              <td>{job['Company Name']}</td>
              <td>{job.Location}</td>
              <td>{job.Seniority}</td>
              <td>{job['Saving rate (frugal)']}</td>
              <td>{job['Saving rate (comfortable)']}</td>
              <td>
                <a href={job['Job url']} target="_blank" rel="noopener noreferrer">
                  View Job
                </a>
              </td>
              <td>{job.Country}</td>
              <td>{job['Workplace type']}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobBoard;