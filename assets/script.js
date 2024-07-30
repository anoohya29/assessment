
async function fetchPatientData() {
    const username = 'coalition';
    const password = 'skills-test';
    const encodedCredentials = btoa(`${username}:${password}`);
  
    try {
      console.log('Fetching data...');
      const response = await fetch('https://fedskillstest.coalitiontechnologies.workers.dev', {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${encodedCredentials}`
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Data fetched:', data);
      
      const jessica = data.find(patient => patient.name === 'Jessica Taylor');
      console.log('Jessica Taylor data:', jessica);
  
      if (jessica) {
        displayGraph(jessica);
        displayStatus(jessica);
      } else {
        console.error('Jessica Taylor not found in the data');
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  }
  
  function displayGraph(patientData) {
  const ctx = document.getElementById('bloodPressureChart').getContext('2d');

  // Extracting blood pressure data for the last 12 months from the diagnosis history
  const last12MonthsData = patientData.diagnosis_history.slice(-12);
  console.log('Last 12 months data:', last12MonthsData);

  const labels = last12MonthsData.map(d => `${d.month.substring(0, 3)}, ${d.year}`);
  const systolicData = last12MonthsData.map(d => d.blood_pressure.systolic.value);
  const diastolicData = last12MonthsData.map(d => d.blood_pressure.diastolic.value);

  console.log('Labels:', labels);
  console.log('Systolic Data:', systolicData);
  console.log('Diastolic Data:', diastolicData);
  
    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Systolic',
          data: systolicData,
          borderColor: '#E66FD2',
          backgroundColor: 'rgba(230, 111, 210, 0.2)',
          pointBackgroundColor: '#E66FD2',
          pointBorderColor: '#FFFFFF',
          pointHoverBackgroundColor: '#E66FD2',
          pointHoverBorderColor: '#FFFFFF',
          tension: 0.1
        },
        {
          label: 'Diastolic',
          data: diastolicData,
          borderColor: '#8C6FE6',
          backgroundColor: 'rgba(140, 111, 230, 0.2)',
          pointBackgroundColor: '#8C6FE6',
          pointBorderColor: '#FFFFFF',
          pointHoverBackgroundColor: '#8C6FE6',
          pointHoverBorderColor: '#FFFFFF',
          tension: 0.1
        }
      ]
    };
  
    const config = {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              usePointStyle: true,
              boxWidth: 10
            }
          },
          title: {
            display: true,
            text: 'Blood Pressure (Last Year)'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 180,
            ticks: {
              stepSize: 20
            }
          },
          x: {
            ticks: {
              autoSkip: false
            }
          }
        }
      }
    };
  
    new Chart(ctx, config);
  }
  
  function displayStatus(patientData) {
    const latestRecord = patientData.diagnosis_history[patientData.diagnosis_history.length - 1];
    console.log('Latest Record:', latestRecord);
  
    const systolicStatus = document.getElementById('systolic-status');
    const diastolicStatus = document.getElementById('diastolic-status');
  
    systolicStatus.innerHTML = `
      <div class="status-box">
        <div class="status-label">
          <span style="color: #E66FD2;">● Systolic</span>
        </div>
        <div class="status-value">
          <strong>${latestRecord.blood_pressure.systolic.value}</strong>
        </div>
        <div class="status-level">
          <span>${latestRecord.blood_pressure.systolic.levels}</span>
        </div>
      </div>
    `;
  
    diastolicStatus.innerHTML = `
      <div class="status-box">
        <div class="status-label">
          <span style="color: #8C6FE6;">● Diastolic</span>
        </div>
        <div class="status-value">
          <strong>${latestRecord.blood_pressure.diastolic.value}</strong>
        </div>
        <div class="status-level">
          <span>${latestRecord.blood_pressure.diastolic.levels}</span>
        </div>
      </div>
    `;
  }
  
  document.addEventListener('DOMContentLoaded', fetchPatientData);
  