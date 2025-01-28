// Unit conversion data
const unitData = {
    length: {
        millimeter: { to: 'meter', factor: 0.001 },
        centimeter: { to: 'meter', factor: 0.01 },
        meter: { to: 'meter', factor: 1 },
        kilometer: { to: 'meter', factor: 1000 },
        inch: { to: 'meter', factor: 0.0254 },
        foot: { to: 'meter', factor: 0.3048 },
        yard: { to: 'meter', factor: 0.9144 },
        mile: { to: 'meter', factor: 1609.344 }
    },
    weight: {
        milligram: { to: 'gram', factor: 0.001 },
        gram: { to: 'gram', factor: 1 },
        kilogram: { to: 'gram', factor: 1000 },
        ounce: { to: 'gram', factor: 28.3495 },
        pound: { to: 'gram', factor: 453.592 }
    },
    volume: {
        milliliter: { to: 'liter', factor: 0.001 },
        liter: { to: 'liter', factor: 1 },
        cubicMeter: { to: 'liter', factor: 1000 },
        gallon: { to: 'liter', factor: 3.78541 },
        quart: { to: 'liter', factor: 0.946353 },
        pint: { to: 'liter', factor: 0.473176 },
        fluidOunce: { to: 'liter', factor: 0.0295735 },
        cubicInch: { to: 'liter', factor: 0.0163871 }
    },
    area: {
        squareMeter: { to: 'squareMeter', factor: 1 },
        squareKilometer: { to: 'squareMeter', factor: 1000000 },
        squareFoot: { to: 'squareMeter', factor: 0.092903 },
        squareYard: { to: 'squareMeter', factor: 0.836127 },
        acre: { to: 'squareMeter', factor: 4046.86 },
        hectare: { to: 'squareMeter', factor: 10000 },
        squareInch: { to: 'squareMeter', factor: 0.00064516 },
        squareMile: { to: 'squareMeter', factor: 2589988.11 }
    },
    temperature: {
        Celsius: { 
            convert: (value, to) => {
                if (to === 'Fahrenheit') return (value * 9/5) + 32;
                if (to === 'Kelvin') return value + 273.15;
                return value;
            }
        },
        Fahrenheit: { 
            convert: (value, to) => {
                if (to === 'Celsius') return (value - 32) * 5/9;
                if (to === 'Kelvin') return (value - 32) * 5/9 + 273.15;
                return value;
            }
        },
        Kelvin: { 
            convert: (value, to) => {
                if (to === 'Celsius') return value - 273.15;
                if (to === 'Fahrenheit') return (value - 273.15) * 9/5 + 32;
                return value;
            }
        }
    },
    currency: {} // Will be populated with API data
};

// State management
let currentUnitType = 'length';
let conversionHistory = [];
let currencyRates = {};
let lastCurrencyUpdate = null;

// Initialize the application
function initializeApp() {
    loadSavedTheme();
    loadSavedHistory();
    setupEventListeners();
    loadCurrencyRates();
    populateUnitSelects();
}

// Theme management
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeButtonIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeButtonIcon(newTheme);
}

function updateThemeButtonIcon(theme) {
    document.getElementById('theme-btn').textContent = theme === 'light' ? '🌙' : '☀️';
}

// Currency rates management
async function loadCurrencyRates() {
    try {
        const response = await fetch('/api/currency-rates');
        const rates = await response.json();
        currencyRates = rates;
        lastCurrencyUpdate = new Date();
        
        // Update currency conversion factors
        unitData.currency = Object.keys(rates).reduce((acc, currency) => {
            acc[currency] = { to: 'USD', factor: 1/rates[currency] };
            return acc;
        }, {});

        if (currentUnitType === 'currency') {
            populateUnitSelects();
        }
    } catch (error) {
        console.error('Failed to load currency rates:', error);
        document.getElementById('result').textContent = 'Error loading currency rates';
    }
}

// Unit selection management
function populateUnitSelects() {
    const fromSelect = document.getElementById('from-unit');
    const toSelect = document.getElementById('to-unit');
    
    fromSelect.innerHTML = '';
    toSelect.innerHTML = '';
    
    const units = Object.keys(unitData[currentUnitType]);
    
    units.forEach(unit => {
        fromSelect.add(new Option(unit, unit));
        toSelect.add(new Option(unit, unit));
    });

    // Set default second option for to-unit if available
    if (units.length > 1) {
        toSelect.selectedIndex = 1;
    }
}

// Conversion logic
function convert() {
    const inputValue = parseFloat(document.getElementById('input-value').value);
    const fromUnit = document.getElementById('from-unit').value;
    const toUnit = document.getElementById('to-unit').value;
    
    if (isNaN(inputValue)) {
        document.getElementById('result').textContent = 'Please enter a valid number';
        return;
    }

    let result;
    try {
        if (currentUnitType === 'temperature') {
            result = unitData.temperature[fromUnit].convert(inputValue, toUnit);
        } else {
            const baseValue = inputValue * unitData[currentUnitType][fromUnit].factor;
            result = baseValue / unitData[currentUnitType][toUnit].factor;
        }

        const formattedResult = formatResult(result, currentUnitType);
        const resultText = `${inputValue} ${fromUnit} = ${formattedResult} ${toUnit}`;
        document.getElementById('result').textContent = resultText;
        addToHistory(resultText);
    } catch (error) {
        document.getElementById('result').textContent = 'Error performing conversion';
        console.error('Conversion error:', error);
    }
}

function formatResult(value, type) {
    if (type === 'currency') {
        return value.toFixed(2);
    } else if (type === 'temperature') {
        return value.toFixed(1);
    }
    return value.toFixed(4);
}

// History management
function addToHistory(conversion) {
    conversionHistory.unshift({
        conversion,
        timestamp: new Date().toLocaleString()
    });
    
    if (conversionHistory.length > 10) {
        conversionHistory.pop();
    }
    
    updateHistoryDisplay();
    saveHistory();
}

function updateHistoryDisplay() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = conversionHistory
        .map(item => `
            <div class="history-item">
                <span class="conversion">${item.conversion}</span>
                <span class="timestamp">${item.timestamp}</span>
            </div>
        `)
        .join('');
}

function loadSavedHistory() {
    const savedHistory = localStorage.getItem('conversionHistory');
    if (savedHistory) {
        try {
            conversionHistory = JSON.parse(savedHistory);
            updateHistoryDisplay();
        } catch (error) {
            console.error('Error loading history:', error);
            conversionHistory = [];
        }
    }
}

function saveHistory() {
    localStorage.setItem('conversionHistory', JSON.stringify(conversionHistory));
}

// Event listeners setup
function setupEventListeners() {
    // Theme toggle
    document.getElementById('theme-btn').addEventListener('click', toggleTheme);

    // Unit type selection
    document.querySelectorAll('.unit-type-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelector('.unit-type-btn.active').classList.remove('active');
            e.target.classList.add('active');
            currentUnitType = e.target.dataset.type;
            populateUnitSelects();
            document.getElementById('result').textContent = '';
        });
    });

    // Swap button
    document.querySelector('.swap-btn').addEventListener('click', () => {
        const fromSelect = document.getElementById('from-unit');
        const toSelect = document.getElementById('to-unit');
        [fromSelect.value, toSelect.value] = [toSelect.value, fromSelect.value];
        convert();
    });

    // Convert button and Enter key
    document.getElementById('convert-btn').addEventListener('click', convert);
    document.getElementById('input-value').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') convert();
    });
}

// Auto-update currency rates
setInterval(() => {
    if (currentUnitType === 'currency') {
        loadCurrencyRates();
    }
}, 3600000); // Update every hour

// Initialize the application
initializeApp();