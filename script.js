// Variables
let totalIntake = 0;
const dailyGoal = 2000;
const plantStages = ["Seed", "Sprout", "Sapling", "Tree"];
const plantImages = ["seed.png", "sprout.png", "sapling.png", "tree.png"];

// DOM Elements
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");
const totalIntakeDisplay = document.getElementById("total-intake");
const plantImage = document.getElementById("plant-image");
const plantStageText = document.getElementById("plant-stage");

// Log Water Intake
function logWater(amount) {
  totalIntake += amount;
  updateProgress();
  updatePlant();
}

// Update Progress Bar
function updateProgress() {
  const progress = (totalIntake / dailyGoal) * 100;
  progressBar.style.width = `${progress}%`;
  progressText.textContent = `${progress.toFixed(1)}%`;
  totalIntakeDisplay.textContent = totalIntake;
}

// Update Plant Growth
function updatePlant() {
  const stage = Math.floor((totalIntake / dailyGoal) * (plantStages.length - 1));
  plantImage.src = `images/${plantImages[stage]}`;
  plantStageText.textContent = plantStages[stage];
}

// Chart.js for Stats
const ctx = document.getElementById("hydration-chart").getContext("2d");
const chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{
      label: "Water Intake (ml)",
      data: [1000, 1500, 1200, 1800, 2000, 1700, 2200],
      borderColor: "#00b4d8",
      fill: false,
    }],
  },
});

// Save Settings
function saveSettings() {
  const newGoal = document.getElementById("daily-goal").value;
  const notificationsEnabled = document.getElementById("notifications").checked;
  alert(`Settings Saved!\nDaily Goal: ${newGoal}ml\nNotifications: ${notificationsEnabled ? "On" : "Off"}`);
}
