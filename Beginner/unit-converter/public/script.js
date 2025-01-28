// public/script.js
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
    temperature: {
        Celsius: { convert: (value, to) => {
            if (to === 'Fahrenheit') return (value * 9/5) + 32;
            if (to === 'Kelvin') return value + 273.15;
            return value;
        }},
        Fahrenheit: { convert: (value, to) => {
            if (to === 'Celsius') return (value - 32) * 5/9;
            if (to === 'Kelvin') return (value - 32) * 5/9 + 273.15;
            return value;
        }},
        Kelvin: { convert: (value, to) => {
            if (to === 'Celsius') return value - 273.15;
            if (to === 'Fahrenheit') return (value - 273.15) * 9/5 + 32;
            return value;
        }}
    }
};

let currentUnitType = 'length';

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
}

function convert() {
    const inputValue = parseFloat(document.getElementById('input-value').value);
    const fromUnit = document.getElementById('from-unit').value;
    const toUnit = document.getElementById('to-unit').value;
    
    if (isNaN(inputValue)) {
        document.getElementById('result').textContent = 'Please enter a valid number';
        return;
    }
    
    let result;
    if (currentUnitType === 'temperature') {
        result = unitData.temperature[fromUnit].convert(inputValue, toUnit);
    } else {
        const baseValue = inputValue * unitData[currentUnitType][fromUnit].factor;
        result = baseValue / unitData[currentUnitType][toUnit].factor;
    }
    
    document.getElementById('result').textContent = 
        `${inputValue} ${fromUnit} = ${result.toFixed(4)} ${toUnit}`;
}

// Event Listeners
document.querySelectorAll('.unit-type-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelector('.unit-type-btn.active').classList.remove('active');
        e.target.classList.add('active');
        currentUnitType = e.target.dataset.type;
        populateUnitSelects();
        document.getElementById('result').textContent = '';
    });
});

document.querySelector('.swap-btn').addEventListener('click', () => {
    const fromSelect = document.getElementById('from-unit');
    const toSelect = document.getElementById('to-unit');
    [fromSelect.value, toSelect.value] = [toSelect.value, fromSelect.value];
    convert();
});

document.getElementById('convert-btn').addEventListener('click', convert);
document.getElementById('input-value').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') convert();
});

// Initialize the app
populateUnitSelects();