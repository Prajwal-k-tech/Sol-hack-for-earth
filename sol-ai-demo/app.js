// Solar Farm Management Dashboard JavaScript

// Application data
const farmData = {
    name: "Bangalore Solar Park",
    totalPanels: 50000,
    cleanPanels: 35000,
    moderateSoiling: 10000,
    needsCleaning: 5000,
    currentEfficiency: 87,
    location: "Bangalore, India"
};

const weather = {
    temperature: 32,
    humidity: 45,
    windSpeed: 12,
    pm25: 68,
    condition: "Partly Cloudy",
    alert: "Dust storm expected tomorrow"
};

const soilingForecast = [
    { day: "Today", score: 0.1, date: "Aug 23" },
    { day: "Tomorrow", score: 0.15, date: "Aug 24" },
    { day: "Day 3", score: 0.3, date: "Aug 25" },
    { day: "Day 4", score: 0.6, date: "Aug 26" },
    { day: "Day 5", score: 0.4, date: "Aug 27" },
    { day: "Day 6", score: 0.2, date: "Aug 28" },
    { day: "Day 7", score: 0.1, date: "Aug 29" }
];

const optimizationResults = {
    timeReduction: "47%",
    batterySavings: "52%",
    panelsCleaned: "150",
    estimatedTime: "87 minutes",
    previousTime: "164 minutes"
};

// Global variables
let solarPanels = [];
let selectedPanels = [];
let isOptimizing = false;
let soilingChart = null;
let currentZoom = 1;
let tooltip = null;

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing sol Dashboard...');
    initializeSolarGrid();
    initializeSoilingChart();
    createTooltip();
    setupEventListeners();
});

// Setup all event listeners
function setupEventListeners() {
    // Panel click events
    const solarGrid = document.getElementById('solarGrid');
    if (solarGrid) {
        solarGrid.addEventListener('click', handlePanelClick);
        solarGrid.addEventListener('mouseover', showPanelTooltip);
        solarGrid.addEventListener('mouseout', hideTooltip);
        solarGrid.addEventListener('mousemove', updateTooltipPosition);
    }
    
    // Modal close events
    const panelModal = document.getElementById('panelModal');
    const optimizationModal = document.getElementById('optimizationModal');
    
    if (panelModal) {
        panelModal.addEventListener('click', function(e) {
            if (e.target === this) closeModal();
        });
    }
    
    if (optimizationModal) {
        optimizationModal.addEventListener('click', function(e) {
            if (e.target === this) closeOptimizationModal();
        });
    }
    
    // Farm selector
    const farmSelector = document.getElementById('farmSelector');
    if (farmSelector) {
        farmSelector.addEventListener('change', function(e) {
            const selectedFarm = e.target.value;
            showSuccessNotification(`Switched to ${e.target.options[e.target.selectedIndex].text}`);
            addActivity(`Switched to ${e.target.options[e.target.selectedIndex].text}`, 'now');
            
            setTimeout(() => {
                initializeSolarGrid();
            }, 500);
        });
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
            closeOptimizationModal();
        }
        
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            runPrediction();
        }
        
        if (e.ctrlKey && e.key === 'o') {
            e.preventDefault();
            optimizeRoutes();
        }
    });
}

// Initialize solar panel grid
function initializeSolarGrid() {
    const grid = document.getElementById('solarGrid');
    if (!grid) return;
    
    const totalPanels = 300; // Display grid (not all 50k panels)
    
    // Clear existing panels
    grid.innerHTML = '';
    solarPanels = [];
    
    // Generate panels with status distribution
    for (let i = 0; i < totalPanels; i++) {
        const panel = document.createElement('div');
        panel.className = 'solar-panel';
        panel.dataset.id = `P${String(i + 1).padStart(4, '0')}`;
        
        // Distribute panel statuses: 70% clean, 20% moderate, 10% dirty
        const random = Math.random();
        let status, lastCleaned, soilingLevel, energyOutput;
        
        if (random < 0.7) {
            status = 'clean';
            lastCleaned = getRandomDate(1, 7);
            soilingLevel = (Math.random() * 0.3).toFixed(2);
            energyOutput = (380 + Math.random() * 20).toFixed(1);
        } else if (random < 0.9) {
            status = 'moderate';
            lastCleaned = getRandomDate(8, 21);
            soilingLevel = (0.3 + Math.random() * 0.4).toFixed(2);
            energyOutput = (320 + Math.random() * 40).toFixed(1);
        } else {
            status = 'dirty';
            lastCleaned = getRandomDate(22, 45);
            soilingLevel = (0.7 + Math.random() * 0.3).toFixed(2);
            energyOutput = (200 + Math.random() * 80).toFixed(1);
        }
        
        panel.classList.add(status);
        panel.dataset.status = status;
        panel.dataset.lastCleaned = lastCleaned;
        panel.dataset.soilingLevel = soilingLevel;
        panel.dataset.energyOutput = energyOutput;
        
        // Add click cursor
        panel.style.cursor = 'pointer';
        
        solarPanels.push({
            id: panel.dataset.id,
            element: panel,
            status: status,
            x: i % 20,
            y: Math.floor(i / 20)
        });
        
        grid.appendChild(panel);
    }
    
    console.log(`Generated ${totalPanels} solar panels`);
}

// Initialize soiling forecast chart
function initializeSoilingChart() {
    const canvas = document.getElementById('soilingChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    soilingChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: soilingForecast.map(item => item.day),
            datasets: [{
                label: 'Soiling Score',
                data: soilingForecast.map(item => item.score),
                backgroundColor: 'rgba(31, 184, 205, 0.1)',
                borderColor: '#1FB8CD',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#1FB8CD',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#1FB8CD',
                    borderWidth: 1,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const score = context.raw;
                            const risk = score > 0.5 ? 'High Risk' : score > 0.3 ? 'Moderate Risk' : 'Low Risk';
                            return `Soiling Score: ${score} (${risk})`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#666'
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 1,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#666',
                        callback: function(value) {
                            return (value * 100) + '%';
                        }
                    }
                }
            }
        }
    });
    
    console.log('Soiling chart initialized');
}

// Handle panel clicks
function handlePanelClick(e) {
    if (e.target.classList.contains('solar-panel')) {
        console.log('Panel clicked:', e.target.dataset.id);
        const panel = e.target;
        
        // Toggle selection
        if (panel.classList.contains('selected')) {
            panel.classList.remove('selected');
            selectedPanels = selectedPanels.filter(p => p !== panel);
        } else {
            panel.classList.add('selected');
            selectedPanels.push(panel);
        }
        
        // Show panel details modal
        showPanelDetails(panel);
    }
}

// Show panel details modal
function showPanelDetails(panel) {
    console.log('Showing panel details for:', panel.dataset.id);
    
    // Update modal content
    const panelIdElement = document.getElementById('panelId');
    const panelStatusElement = document.getElementById('panelStatus');
    const lastCleanedElement = document.getElementById('lastCleaned');
    const soilingLevelElement = document.getElementById('soilingLevel');
    const energyOutputElement = document.getElementById('energyOutput');
    
    if (panelIdElement) panelIdElement.textContent = panel.dataset.id;
    if (panelStatusElement) panelStatusElement.textContent = panel.dataset.status.charAt(0).toUpperCase() + panel.dataset.status.slice(1);
    if (lastCleanedElement) lastCleanedElement.textContent = panel.dataset.lastCleaned + ' days ago';
    if (soilingLevelElement) soilingLevelElement.textContent = (parseFloat(panel.dataset.soilingLevel) * 100).toFixed(0) + '%';
    if (energyOutputElement) energyOutputElement.textContent = panel.dataset.energyOutput + ' W';
    
    // Show modal
    const modal = document.getElementById('panelModal');
    if (modal) {
        modal.classList.remove('hidden');
        console.log('Panel modal opened');
    }
}

// Close panel modal
function closeModal() {
    const modal = document.getElementById('panelModal');
    if (modal) {
        modal.classList.add('hidden');
        console.log('Panel modal closed');
    }
}

// Run prediction
function runPrediction() {
    const btn = event.target;
    const originalText = btn.textContent;
    
    btn.classList.add('loading');
    btn.textContent = '🔄 Running...';
    btn.disabled = true;
    
    console.log('Running prediction...');
    
    setTimeout(() => {
        btn.classList.remove('loading');
        btn.textContent = originalText;
        btn.disabled = false;
        
        showSuccessNotification('Soiling prediction updated successfully! Check the forecast chart.');
        
        // Animate chart update
        if (soilingChart) {
            soilingChart.data.datasets[0].data = soilingForecast.map(item => item.score + (Math.random() - 0.5) * 0.1);
            soilingChart.update('active');
        }
        
        addActivity('Soiling prediction model executed', 'now');
        console.log('Prediction completed');
    }, 2000);
}

// Optimize routes
function optimizeRoutes() {
    if (isOptimizing) return;
    
    isOptimizing = true;
    const btn = document.getElementById('optimizeBtn');
    if (!btn) return;
    
    const originalText = btn.textContent;
    
    btn.classList.add('loading');
    btn.textContent = '🔄 Optimizing...';
    btn.disabled = true;
    
    console.log('Starting route optimization...');
    
    // Show loading state
    setTimeout(() => {
        // Generate optimized route path
        const dirtyPanels = solarPanels.filter(panel => panel.status === 'dirty');
        console.log('Found dirty panels:', dirtyPanels.length);
        
        if (dirtyPanels.length > 0) {
            const routePath = generateOptimizedPath(dirtyPanels);
            displayRoute(routePath);
        }
        
        // Show results modal after animation
        setTimeout(() => {
            btn.classList.remove('loading');
            btn.textContent = originalText;
            btn.disabled = false;
            isOptimizing = false;
            
            showOptimizationResults();
            addActivity('Route optimization completed', 'now');
            console.log('Route optimization completed');
        }, 1000);
        
    }, 2500);
}

// Show optimization results modal
function showOptimizationResults() {
    const modal = document.getElementById('optimizationModal');
    if (modal) {
        modal.classList.remove('hidden');
        console.log('Optimization results modal opened');
    }
}

// Generate optimized path for TSP
function generateOptimizedPath(panels) {
    const mapContainer = document.getElementById('mapContainer');
    if (!mapContainer) return '';
    
    const containerRect = mapContainer.getBoundingClientRect();
    let path = 'M ';
    
    // Sort panels for a simple optimized path (basic TSP approximation)
    const sortedPanels = [...panels].sort((a, b) => {
        const aScore = a.x + a.y * 20;
        const bScore = b.x + b.y * 20;
        return aScore - bScore;
    });
    
    sortedPanels.forEach((panel, index) => {
        const x = (panel.x * 20) + 100; // Adjust positioning
        const y = (panel.y * 20) + 100;
        
        if (index === 0) {
            path += `${x} ${y}`;
        } else {
            path += ` L ${x} ${y}`;
        }
    });
    
    console.log('Generated path:', path);
    return path;
}

// Display optimized route
function displayRoute(pathData) {
    const routePath = document.getElementById('optimizedPath');
    const drone = document.getElementById('drone');
    
    if (routePath && pathData) {
        routePath.setAttribute('d', pathData);
        
        // Animate path appearance
        setTimeout(() => {
            routePath.classList.add('active');
            if (drone) drone.classList.add('active');
            console.log('Route animation started');
        }, 100);
    }
}

// Close optimization modal
function closeOptimizationModal() {
    const modal = document.getElementById('optimizationModal');
    if (modal) {
        modal.classList.add('hidden');
        console.log('Optimization modal closed');
    }
}

// Deploy optimized route
function deployOptimizedRoute() {
    showSuccessNotification('Optimized route deployed to cleaning drones!');
    closeOptimizationModal();
    addActivity('Cleaning route deployed to drones', 'now');
}

// Generate report
function generateReport() {
    const btn = event.target;
    const originalText = btn.textContent;
    
    btn.classList.add('loading');
    btn.textContent = '📄 Generating...';
    btn.disabled = true;
    
    setTimeout(() => {
        btn.classList.remove('loading');
        btn.textContent = originalText;
        btn.disabled = false;
        
        showSuccessNotification('Efficiency report generated and sent to your email!');
        addActivity('Monthly efficiency report generated', 'now');
    }, 1500);
}

// Schedule cleaning for selected panel
function scheduleCleaningForPanel() {
    const panelId = document.getElementById('panelId');
    const panelIdText = panelId ? panelId.textContent : 'Unknown';
    showSuccessNotification(`Cleaning scheduled for panel ${panelIdText}`);
    closeModal();
    addActivity(`Cleaning scheduled for panel ${panelIdText}`, 'now');
}

// Show weather forecast - Fixed function
function showWeatherForecast() {
    console.log('Showing weather forecast...');
    
    // Highlight high-risk days on chart
    if (soilingChart) {
        const highRiskDays = soilingForecast.map(item => item.score > 0.5 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(31, 184, 205, 0.1)');
        
        soilingChart.data.datasets[0].backgroundColor = highRiskDays;
        soilingChart.update('active');
        
        // Add visual indicators for high risk days
        soilingChart.data.datasets[0].pointBackgroundColor = soilingForecast.map(item => 
            item.score > 0.5 ? '#ef4444' : '#1FB8CD'
        );
        soilingChart.update();
    }
    
    showSuccessNotification('Weather forecast integrated! High-risk days are highlighted in red.');
    addActivity('Weather forecast data synchronized', 'now');
    
    // Show detailed forecast in notification
    setTimeout(() => {
        const forecastText = soilingForecast
            .filter(item => item.score > 0.4)
            .map(item => `${item.day}: ${(item.score * 100).toFixed(0)}% risk`)
            .join(', ');
        
        if (forecastText) {
            showSuccessNotification(`High soiling risk days: ${forecastText}`);
        }
    }, 2000);
}

// Toggle overlays
function toggleWeatherOverlay() {
    const isChecked = document.getElementById('weatherOverlay').checked;
    if (isChecked) {
        showSuccessNotification('Weather overlay activated');
        addActivity('Weather overlay enabled', 'now');
    }
}

function toggleRouteOverlay() {
    const isChecked = document.getElementById('routeOverlay').checked;
    const routePath = document.getElementById('optimizedPath');
    const drone = document.getElementById('drone');
    
    if (routePath && drone) {
        if (isChecked) {
            routePath.style.opacity = '1';
            drone.style.opacity = '1';
        } else {
            routePath.style.opacity = '0';
            drone.style.opacity = '0';
        }
    }
}

function toggleStatusOverlay() {
    const isChecked = document.getElementById('statusOverlay').checked;
    const panels = document.querySelectorAll('.solar-panel');
    
    if (isChecked) {
        panels.forEach(panel => {
            panel.style.opacity = '1';
        });
    } else {
        panels.forEach(panel => {
            panel.style.opacity = '0.3';
        });
    }
}

// Zoom controls
function zoomIn() {
    currentZoom = Math.min(currentZoom * 1.2, 3);
    applyZoom();
}

function zoomOut() {
    currentZoom = Math.max(currentZoom * 0.8, 0.5);
    applyZoom();
}

function applyZoom() {
    const grid = document.getElementById('solarGrid');
    if (grid) {
        grid.style.transform = `scale(${currentZoom})`;
    }
}

// Tooltip functionality
function createTooltip() {
    tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    document.body.appendChild(tooltip);
}

function showPanelTooltip(e) {
    if (e.target.classList.contains('solar-panel')) {
        const panel = e.target;
        const status = panel.dataset.status;
        const energyOutput = panel.dataset.energyOutput;
        const soilingLevel = (parseFloat(panel.dataset.soilingLevel) * 100).toFixed(0);
        
        tooltip.innerHTML = `
            <strong>${panel.dataset.id}</strong><br>
            Status: ${status.charAt(0).toUpperCase() + status.slice(1)}<br>
            Output: ${energyOutput}W<br>
            Soiling: ${soilingLevel}%
        `;
        
        tooltip.classList.add('show');
    }
}

function updateTooltipPosition(e) {
    if (tooltip && tooltip.classList.contains('show')) {
        tooltip.style.left = e.pageX + 10 + 'px';
        tooltip.style.top = e.pageY - 10 + 'px';
    }
}

function hideTooltip() {
    if (tooltip) {
        tooltip.classList.remove('show');
    }
}

// Utility functions
function getRandomDate(minDays, maxDays) {
    return Math.floor(Math.random() * (maxDays - minDays + 1)) + minDays;
}

function showSuccessNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function addActivity(text, time) {
    const activityFeed = document.getElementById('activityFeed');
    if (!activityFeed) return;
    
    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';
    
    activityItem.innerHTML = `
        <span class="activity-time">${time}</span>
        <span class="activity-text">${text}</span>
    `;
    
    activityFeed.insertBefore(activityItem, activityFeed.firstChild);
    
    // Keep only the latest 5 activities
    while (activityFeed.children.length > 5) {
        activityFeed.removeChild(activityFeed.lastChild);
    }
    
    // Animate new activity
    activityItem.style.opacity = '0';
    activityItem.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
        activityItem.style.opacity = '1';
        activityItem.style.transform = 'translateY(0)';
        activityItem.style.transition = 'all 0.3s ease';
    }, 100);
}

function closeAlert() {
    const alertBanner = document.getElementById('alertBanner');
    if (alertBanner) {
        alertBanner.classList.add('hidden');
    }
}

// Auto-refresh data every 30 seconds
setInterval(function() {
    // Update weather data
    const pm25Element = document.querySelector('.pm25-high');
    if (pm25Element) {
        const currentPM25 = parseInt(pm25Element.textContent);
        const newPM25 = Math.max(50, currentPM25 + (Math.random() - 0.5) * 10);
        pm25Element.textContent = Math.round(newPM25) + ' μg/m³';
        
        // Update color based on PM2.5 level
        if (newPM25 > 100) {
            pm25Element.style.color = '#ef4444';
        } else if (newPM25 > 75) {
            pm25Element.style.color = '#f59e0b';
        } else {
            pm25Element.style.color = '#22c55e';
        }
    }
    
    // Add periodic activity
    const activities = [
        'System health check completed',
        'Drone battery levels checked',
        'Weather data synchronized',
        'Panel efficiency monitored',
        'Cleaning schedules updated'
    ];
    
    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    addActivity(randomActivity, 'just now');
    
}, 30000);

// Ensure functions are available globally
window.runPrediction = runPrediction;
window.optimizeRoutes = optimizeRoutes;
window.generateReport = generateReport;
window.showWeatherForecast = showWeatherForecast;
window.scheduleCleaningForPanel = scheduleCleaningForPanel;
window.deployOptimizedRoute = deployOptimizedRoute;
window.closeModal = closeModal;
window.closeOptimizationModal = closeOptimizationModal;
window.closeAlert = closeAlert;
window.toggleWeatherOverlay = toggleWeatherOverlay;
window.toggleRouteOverlay = toggleRouteOverlay;
window.toggleStatusOverlay = toggleStatusOverlay;
window.zoomIn = zoomIn;
window.zoomOut = zoomOut;

console.log('sol Dashboard JavaScript loaded successfully');