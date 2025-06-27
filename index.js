const apiKey = "YOUR_API_KEY"; // Replace with your OpenWeatherMap API key
const apiUrl = "https://api.openweathermap.org/data/2.5/forecast";

// DOM Elements
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const sunnyTemp = document.getElementById("sunnyTemp");
const sunnyDetails = document.getElementById("sunnyDetails");
const rainyTemp = document.getElementById("rainyTemp");
const rainyDetails = document.getElementById("rainyDetails");
const nightTemp = document.getElementById("nightTemp");
const nightDetails = document.getElementById("nightDetails");
const cityTableBody = document.getElementById("cityTableBody");
const quickCityLinks = document.querySelectorAll(".dropdown-item[data-city]");

// Mock data for hourly forecast (12 hours from 6:00 PM IST, June 27, 2025)
const hourlyData = [
  { hour: "6:00 PM", temp: 84, precip: 60, windDeg: 84, condition: "cloud" }, // Example: 84°F, 60% precip
  { hour: "7:00 PM", temp: 83, precip: 40, windDeg: 90, condition: "rain" }, // Example: 83°F, 40% precip
  { hour: "8:00 PM", temp: 82, precip: 30, windDeg: 95, condition: "cloud" },
  { hour: "9:00 PM", temp: 81, precip: 20, windDeg: 100, condition: "night" },
  { hour: "10:00 PM", temp: 80, precip: 10, windDeg: 105, condition: "night" },
  { hour: "11:00 PM", temp: 79, precip: 5, windDeg: 110, condition: "night" },
  { hour: "12:00 AM", temp: 78, precip: 0, windDeg: 120, condition: "night" },
  { hour: "1:00 AM", temp: 77, precip: 0, windDeg: 130, condition: "night" },
  { hour: "2:00 AM", temp: 76, precip: 10, windDeg: 140, condition: "cloud" },
  { hour: "3:00 AM", temp: 75, precip: 20, windDeg: 150, condition: "cloud" },
  { hour: "4:00 AM", temp: 74, precip: 30, windDeg: 160, condition: "rain" },
  { hour: "5:00 AM", temp: 73, precip: 40, windDeg: 170, condition: "rain" },
];

// Mock data for 7-day forecast (Monday to Sunday, June 30 to July 6, 2025)
const dailyData = [
  { day: "Mon, Jun 30", temp: 30, condition: "sun" },
  { day: "Tue, Jul 1", temp: 29, condition: "moon" },
  { day: "Wed, Jul 2", temp: 28, condition: "sun" },
  { day: "Thu, Jul 3", temp: 27, condition: "moon" },
  { day: "Fri, Jul 4", temp: 26, condition: "sun" },
  { day: "Sat, Jul 5", temp: 25, condition: "moon" },
  { day: "Sun, Jul 6", temp: 24, condition: "sun" },
];

// Fetch weather data (for search and quick city links)
async function fetchWeather(city) {
  try {
    const response = await fetch(`${apiUrl}?q=${city}&appid=${apiKey}&units=imperial`);
    if (!response.ok) throw new Error("City not found");
    return await response.json();
  } catch (error) {
    console.error("Error fetching weather:", error);
    return null;
  }
}

// Update weather cards for Delhi
async function updateDelhiWeather() {
  // Using mock data for demonstration
  sunnyTemp.textContent = `${hourlyData[0].temp}°F`;
  sunnyDetails.innerHTML = `
    <li>Humidity: 45%</li>
    <li>Wind: 12 km/h</li>
    <li>Precipitation: ${hourlyData[0].precip}%</li>
  `;
  rainyTemp.textContent = `${hourlyData[1].temp}°F`;
  rainyDetails.innerHTML = `
    <li>Humidity: 88%</li>
    <li>Wind: 15 km/h</li>
    <li>Precipitation: ${hourlyData[1].precip}%</li>
  `;
  nightTemp.textContent = `${hourlyData[3].temp}°F`;
  nightDetails.innerHTML = `
    <li>Humidity: 65%</li>
    <li>Wind: 5 km/h</li>
    <li>Precipitation: ${hourlyData[3].precip}%</li>
  `;
}

// Update city table with original data
function updateCityTable() {
  const citiesData = [
    { city: "Shanghai", cloud: 9, feelsLike: 20, humidity: 22, maxTemp: 2, minTemp: 12, sunrise: "06:04", sunset: "18:26", temp: 8, windDeg: 2, windSpeed: 3 },
    { city: "Boston", cloud: 9, feelsLike: 12, humidity: 2, maxTemp: 21, minTemp: 12, sunrise: "05:44", sunset: "20:26", temp: 9, windDeg: 2, windSpeed: 4 },
    { city: "Kashmir", cloud: 8, feelsLike: 0, humidity: 22, maxTemp: 34, minTemp: 12, sunrise: "05:09", sunset: "19:21", temp: 4, windDeg: 7, windSpeed: 1 },
    { city: "Japan", cloud: 9, feelsLike: 20, humidity: 2, maxTemp: 21, minTemp: 12, sunrise: "04:57", sunset: "18:06", temp: 18, windDeg: 12, windSpeed: 13 },
    { city: "Australia", cloud: 5, feelsLike: 10, humidity: 2, maxTemp: 32, minTemp: 24, sunrise: "06:14", sunset: "17:46", temp: 25, windDeg: 34, windSpeed: 13 },
    { city: "China", cloud: 9, feelsLike: 20, humidity: 22, maxTemp: 2, minTemp: 12, sunrise: "06:04", sunset: "18:26", temp: 8, windDeg: 2, windSpeed: 3 },
  ];
  cityTableBody.innerHTML = "";
  citiesData.forEach(data => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <th scope="row" class="text-start">${data.city}</th>
      <td>${data.cloud}</td>
      <td>${data.feelsLike}</td>
      <td>${data.humidity}</td>
      <td>${data.maxTemp}</td>
      <td>${data.minTemp}</td>
      <td>${data.sunrise}</td>
      <td>${data.sunset}</td>
      <td>${data.temp}</td>
      <td>${data.windDeg}</td>
      <td>${data.windSpeed}</td>
    `;
    cityTableBody.appendChild(row);
  });
}

// Chart.js plugin for weather icons
const weatherIconPlugin = {
  id: 'weatherIconPlugin',
  afterDatasetDraw(chart) {
    const { ctx, chartArea: { top }, scales: { x } } = chart;
    const dataset = chart.data.datasets[0];
    ctx.font = '14px FontAwesome';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    dataset.data.forEach((value, index) => {
      const xPos = x.getPixelForValue(index);
      const yPos = top - 10;
      const condition = chart.data.labels[index].condition;
      let icon;
      if (chart.canvas.id === 'dailyChart') {
        // 7-day forecast: only sun or moon
        icon = condition === 'sun' ? '\uf185' : '\uf186';
      } else {
        // Hourly forecast: sun, cloud, rain, moon
        if (condition === 'sun') icon = '\uf185'; // Sun
        else if (condition === 'cloud') icon = '\uf0c2'; // Cloud
        else if (condition === 'rain') icon = '\uf73d'; // Rain
        else if (condition === 'night') icon = '\uf186'; // Moon
      }
      ctx.fillText(icon, xPos, yPos);
    });
  }
};

// Render hourly forecast chart
function renderHourlyChart() {
  const ctx = document.getElementById("hourlyChart").getContext("2d");
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: hourlyData.map(d => ({ label: d.hour, condition: d.condition, precip: d.precip, windDeg: d.windDeg })),
      datasets: [{
        label: 'Temperature (°F)',
        data: hourlyData.map(d => d.temp),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: context => context[0].label.label,
            label: context => [
              `Temp: ${context.parsed.y}°F`,
              `Precipitation: ${context.label.precip}%`,
              `Wind Direction: ${context.label.windDeg}°`
            ]
          }
        },
        datalabels: {
          anchor: 'end',
          align: 'top',
          formatter: (value, context) => `${context.dataset.data[context.dataIndex]}°F\n${context.chart.data.labels[context.dataIndex].precip}%`,
          color: '#fff',
          font: { size: 12 }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Temperature (°F)', color: '#fff' },
          ticks: { color: '#fff' },
          grid: { color: 'rgba(255, 255, 255, 0.2)' }
        },
        x: {
          ticks: { color: '#fff' },
          grid: { display: false }
        }
      }
    },
    plugins: [weatherIconPlugin, ChartDataLabels]
  });
}

// Render 7-day forecast chart (dark theme)
function renderDailyChart() {
  const ctx = document.getElementById("dailyChart").getContext("2d");
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: dailyData.map(d => ({ label: d.day, condition: d.condition })),
      datasets: [{
        label: 'Temperature (°C)',
        data: dailyData.map(d => d.temp),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }]
    },
    options: {
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: context => context[0].label.label,
            label: context => `Temp: ${context.parsed.y}°C`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Temperature (°C)', color: '#fff' },
          ticks: { color: '#fff' },
          grid: { color: 'rgba(255, 255, 255, 0.2)' }
        },
        x: {
          ticks: { color: '#fff' },
          grid: { display: false }
        }
      }
    },
    plugins: [weatherIconPlugin]
  });
}

// Handle search form submission
searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const city = searchInput.value.trim();
  if (!city) return;
  const data = await fetchWeather(city);
  if (data) {
    alert(`Weather for ${city}: ${Math.round(data.list[0].main.temp)}°F, ${data.list[0].weather[0].description}`);
  } else {
    alert("City not found. Please try again.");
  }
  searchInput.value = "";
});

// Handle quick city links
quickCityLinks.forEach(link => {
  link.addEventListener("click", async (e) => {
    e.preventDefault();
    const city = e.target.getAttribute("data-city");
    const data = await fetchWeather(city);
    if (data) {
      alert(`Weather for ${city}: ${Math.round(data.list[0].main.temp)}°F, ${data.list[0].weather[0].description}`);
    }
  });
});

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  updateDelhiWeather();
  updateCityTable();
  renderHourlyChart();
  renderDailyChart();
});