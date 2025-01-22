let waterIntake = 0;
let dailyGoal = 2000; // 2000ml or 2 liters
let plants = [
    { id: 1, type: '🌻', growthPoints: 0 },
    { id: 2, type: '🌵', growthPoints: 15 },
    { id: 3, type: '🌹', growthPoints: 30 },
    { id: 4, type: '🌴', growthPoints: 60 },
];
let stats = [];

function addWater(amount) {
    waterIntake += amount;
    updateProgress();
    updatePlants();
    updateStats();
    saveData();
}

function addCustomWater() {
    const amount = parseFloat(document.getElementById('custom-amount').value);
    const unit = document.getElementById('custom-unit').value;
    if (amount && !isNaN(amount)) {
        const convertedAmount = convertToFlOz(amount, unit);
        addWater(convertedAmount);
    }
}

function subtractWater() {
    const amount = parseFloat(prompt("Enter amount to subtract (in " + currentUnit + "):"));
    if (amount && !isNaN(amount)) {
        const convertedAmount = convertToFlOz(amount, currentUnit);
        waterIntake = Math.max(0, waterIntake - convertedAmount);
        updateProgress();
        updatePlants();
        updateStats();
        saveData();
    }
}

function updateProgress() {
    const progress = (waterIntake / dailyGoal) * 100;
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const tree = document.getElementById('tree');
    const celebration = document.getElementById('celebration');

    progressBar.style.width = `${Math.min(progress, 100)}%`;
    progressText.textContent = `${Math.round(progress)}% hydrated`;

    if (progress <= 25) tree.textContent = '🌱';
    else if (progress <= 50) tree.textContent = '🌿';
    else if (progress <= 75) tree.textContent = '🌳';
    else tree.textContent = '🌳🌸';

    tree.style.transform = `scale(${0.5 + progress / 200})`;

    if (progress >= 100) {
        celebration.classList.remove('hidden');
    } else {
        celebration.classList.add('hidden');
    }
}


function updatePlants() {
    const plantGrid = document.getElementById('plant-grid');
    plantGrid.innerHTML = '';

    plants.forEach(plant => {
        const plantElement = document.createElement('div');
        plantElement.className = 'plant';
        plantElement.textContent = plant.type;

        const growthStage = Math.min(3, Math.floor(plant.growthPoints / 20));
        plantElement.style.transform = `scale(${0.7 + growthStage * 0.1})`;

        plantGrid.appendChild(plantElement);
    });

    // Simulate plant growth
    plants = plants.map(plant => ({
        ...plant,
        growthPoints: Math.min(100, plant.growthPoints + 5)
    }));
}

function getPlantEmoji(stage) {
    const stages = ['🌱', '🌿', '🌳', '🌳🌸'];
    return stages[stage];
}

function saveDailyGoal() {
    const goalInput = document.getElementById('daily-goal');
    const goalUnit = document.getElementById('goal-unit').value;
    if (goalInput.value && !isNaN(goalInput.value)) {
        dailyGoal = convertToFlOz(parseFloat(goalInput.value), goalUnit);
        saveData();
        updateProgress();
    }
}

function addCustomAmount() {
    const amount = document.getElementById('new-custom-amount').value;
    const name = document.getElementById('new-custom-name').value;
    if (amount && name) {
        customAmounts.push({ amount: parseFloat(amount), name });
        saveData();
        updateCustomAmounts();
    }
}

function updateCustomAmounts() {
    const container = document.getElementById('custom-amounts-container');
    container.innerHTML = '';
    customAmounts.forEach((item, index) => {
        const button = document.createElement('button');
        button.textContent = `${item.name} (${item.amount} ${currentUnit})`;
        button.onclick = () => addWater(convertToFlOz(item.amount, currentUnit));
        container.appendChild(button);
    });
}

function convertToFlOz(amount, fromUnit) {
    switch (fromUnit) {
        case 'ml':
            return amount / 29.5735;
        case 'cups':
            return amount * 8;
        default:
            return amount;
    }
}

function formatAmount(amount) {
    switch (currentUnit) {
        case 'ml':
            return `${Math.round(amount * 29.5735)} ml`;
        case 'cups':
            return `${(amount / 8).toFixed(2)} cups`;
        default:
            return `${amount.toFixed(1)} fl oz`;
    }
}

function toggleUnit() {
    const units = ['fl oz', 'ml', 'cups'];
    currentUnit = units[(units.indexOf(currentUnit) + 1) % units.length];
    document.getElementById('toggle-unit').textContent = `Switch to ${units[(units.indexOf(currentUnit) + 1) % units.length]}`;
    updateProgress();
    updateCustomAmounts();
}

function saveData() {
    localStorage.setItem('hydrationData', JSON.stringify({
        waterIntake,
        dailyGoal,
        plants,
        customAmounts
    }));
}

function loadData() {
    const data = JSON.parse(localStorage.getItem('hydrationData'));
    if (data) {
        waterIntake = data.waterIntake;
        dailyGoal = data.dailyGoal;
        plants = data.plants;
        customAmounts = data.customAmounts || [];
        updateProgress();
        updatePlants();
        updateCustomAmounts();
    }
}

function updateStats() {
    const today = new Date().toISOString().split('T')[0];
    const existingStatIndex = stats.findIndex(stat => stat.date === today);

    if (existingStatIndex !== -1) {
        stats[existingStatIndex].percentage = (waterIntake / dailyGoal) * 100;
    } else {
        stats.push({ date: today, percentage: (waterIntake / dailyGoal) * 100 });
    }

    renderCalendar();
}

function renderCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';

    stats.slice(-30).forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'day';

        const dateElement = document.createElement('div');
        dateElement.className = 'date';
        dateElement.textContent = day.date;

        const treeElement = document.createElement('div');
        treeElement.className = 'day-tree';
        if (day.percentage <= 25) treeElement.textContent = '🌱';
        else if (day.percentage <= 50) treeElement.textContent = '🌿';
        else if (day.percentage <= 75) treeElement.textContent = '🌳';
        else treeElement.textContent = '🌳🌸';

        const percentageElement = document.createElement('div');
        percentageElement.className = 'percentage';
        percentageElement.textContent = `${Math.round(day.percentage)}%`;

        dayElement.appendChild(dateElement);
        dayElement.appendChild(treeElement);
        dayElement.appendChild(percentageElement);

        calendar.appendChild(dayElement);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    document.getElementById('toggle-unit').addEventListener('click', toggleUnit);
    const addWaterButton = document.getElementById('add-water');
    addWaterButton.addEventListener('click', addWater);

    const navLinks = document.querySelectorAll('nav a');
    const pages = document.querySelectorAll('.page');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPage = link.getAttribute('data-page');
            pages.forEach(page => {
                if (page.id === targetPage) {
                    page.classList.add('active');
                } else {
                    page.classList.remove('active');
                }
            });
        });
    });

    updateProgress();
    updatePlants();
    updateStats();
});
