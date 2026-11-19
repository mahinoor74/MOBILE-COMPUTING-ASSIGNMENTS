
// ==========================================
// NAVIGATION
// ==========================================

document.querySelectorAll(".nav-btn").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".nav-btn").forEach(btn => {
      btn.classList.remove("active");
    });

    document.querySelectorAll(".page").forEach(page => {
      page.classList.remove("active");
    });

    button.classList.add("active");

    const page = document.getElementById(button.dataset.page);
    if (page) page.classList.add("active");

    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});


// ==========================================
// PART A TASK NAVIGATION
// ==========================================

document.querySelectorAll(".task-btn").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".task-btn").forEach(btn => {
      btn.classList.remove("active");
    });

    document.querySelectorAll(".task-content").forEach(panel => {
      panel.classList.remove("active");
    });

    button.classList.add("active");

    const panel = document.getElementById(button.dataset.task);
    if (panel) panel.classList.add("active");
  });
});


// ==========================================
// PART B LAB NAVIGATION
// ==========================================

document.querySelectorAll(".lab-btn").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".lab-btn").forEach(btn => {
      btn.classList.remove("active");
    });

    document.querySelectorAll(".lab-content").forEach(panel => {
      panel.classList.remove("active");
    });

    button.classList.add("active");

    const panel = document.getElementById(button.dataset.lab);
    if (panel) panel.classList.add("active");
  });
});


// ==========================================
// COMMON HELPER FUNCTIONS
// ==========================================

function getElement(id) {
  return document.getElementById(id);
}

function setText(id, value) {
  const element = getElement(id);
  if (element) element.textContent = value;
}

function addLog(id, message) {
  const element = getElement(id);
  if (!element) return;

  const line = document.createElement("p");
  line.textContent = message;
  element.prepend(line);
}


// ==========================================
// B1 - BACKGROUND TASK SCHEDULER
// ==========================================

let schedulerMode = "FIFO";
let schedulerJobs = [];

const battery = getElement("battery");
const batteryValue = getElement("batteryValue");

if (battery && batteryValue) {
  battery.addEventListener("input", () => {
    batteryValue.textContent = battery.value + "%";
  });
}

function updateSchedulerMetrics() {
  const total = schedulerJobs.length;
  const completed = schedulerJobs.filter(job => job.status === "Completed").length;
  const pending = total - completed;

  const metrics = getElement("schedulerMetrics");

  if (metrics) {
    metrics.innerHTML = `
      <div><strong>${total}</strong>Total Tasks</div>
      <div><strong>${completed}</strong>Completed</div>
      <div><strong>${pending}</strong>Pending</div>
      <div><strong>${schedulerMode}</strong>Scheduling Mode</div>
    `;
  }

  const table = getElement("schedulerTable");

  if (table) {
    table.innerHTML = `
      <tr>
        <th>Task</th>
        <th>Priority</th>
        <th>Status</th>
      </tr>
      ${schedulerJobs.map(job => `
        <tr>
          <td>${job.name}</td>
          <td>${job.priority}</td>
          <td>${job.status}</td>
        </tr>
      `).join("")}
    `;
  }
}

function runScheduler() {
  const batteryLevel = Number(battery?.value ?? 100);
  const network = getElement("network")?.value ?? "Wi-Fi";
  const doze = getElement("doze")?.checked ?? false;
  const permission = getElement("permission")?.checked ?? true;

  addLog("schedulerLog", "Scheduler started.");

  if (!permission) {
    addLog("schedulerLog", "Permission denied. Tasks cannot run.");
    return;
  }

  if (batteryLevel < 15) {
    addLog("schedulerLog", "Low battery. Background work postponed.");
    return;
  }

  if (doze) {
    addLog("schedulerLog", "Doze mode active. Tasks are delayed.");
    return;
  }

  if (network === "Offline") {
    addLog("schedulerLog", "No network. Network-dependent tasks are waiting.");
    return;
  }

  let pendingJobs = schedulerJobs.filter(job => job.status === "Pending");

  if (schedulerMode === "Priority") {
    pendingJobs.sort((a, b) => b.priority - a.priority);
  }

  if (schedulerMode === "FIFO") {
    pendingJobs.sort((a, b) => a.order - b.order);
  }

  pendingJobs.forEach(job => {
    job.status = "Completed";
    addLog("schedulerLog", job.name + " completed successfully.");
  });

  updateSchedulerMetrics();
}

function addSchedulerJob(name, priority) {
  schedulerJobs.push({
    name,
    priority,
    order: schedulerJobs.length + 1,
    status: "Pending"
  });
}

addSchedulerJob("Data Synchronization", 3);
addSchedulerJob("Image Upload", 2);
addSchedulerJob("Database Backup", 1);

updateSchedulerMetrics();

getElement("fifoBtn")?.addEventListener("click", () => {
  schedulerMode = "FIFO";
  addLog("schedulerLog", "FIFO scheduling selected.");
  updateSchedulerMetrics();
  runScheduler();
});

getElement("priorityBtn")?.addEventListener("click", () => {
  schedulerMode = "Priority";
  addLog("schedulerLog", "Priority scheduling selected.");
  updateSchedulerMetrics();
  runScheduler();
});

getElement("resetBtn")?.addEventListener("click", () => {
  schedulerJobs.forEach(job => job.status = "Pending");
  setText("schedulerLog", "");
  addLog("schedulerLog", "Scheduler reset. All tasks are pending.");
  updateSchedulerMetrics();
});


// ==========================================
// B2 - FRIENDLY AND ADVERSARIAL WORKLOADS
// ==========================================

function runWorkload(type) {
  const log = getElement("workloadLog");
  if (log) log.innerHTML = "";

  let completed = 0;
  let delayed = 0;
  let failed = 0;

  if (type === "friendly") {
    completed = 5;
    addLog("workloadLog", "Friendly workload started.");
    addLog("workloadLog", "Network is available and battery is sufficient.");
    addLog("workloadLog", "Background tasks completed successfully.");
  } else {
    completed = 2;
    delayed = 2;
    failed = 1;
    addLog("workloadLog", "Adversarial workload started.");
    addLog("workloadLog", "Battery is low and network is unstable.");
    addLog("workloadLog", "Some tasks were postponed.");
    addLog("workloadLog", "One task failed and requires retry.");
  }

  const metrics = getElement("workloadMetrics");

  if (metrics) {
    metrics.innerHTML = `
      <div><strong>${completed}</strong>Completed</div>
      <div><strong>${delayed}</strong>Delayed</div>
      <div><strong>${failed}</strong>Failed</div>
    `;
  }
}

getElement("workABtn")?.addEventListener("click", () => {
  runWorkload("friendly");
});

getElement("workBBtn")?.addEventListener("click", () => {
  runWorkload("adversarial");
});


// ==========================================
// B3 - EXACT VS APPROXIMATE FEED
// ==========================================

const feedBattery = getElement("feedBattery");
const feedBatteryValue = getElement("feedBatteryValue");

if (feedBattery && feedBatteryValue) {
  feedBattery.addEventListener("input", () => {
    feedBatteryValue.textContent = feedBattery.value + "%";
  });
}

function compareFeed() {
  const itemCount = Number(getElement("feedItems")?.value ?? 20);
  const quality = getElement("qualityLevels")?.value ?? "High";
  const batteryLevel = Number(feedBattery?.value ?? 100);

  const exactTime = itemCount * 0.8;
  let approximateTime = itemCount * 0.35;

  if (quality === "Low") {
    approximateTime *= 0.6;
  } else if (quality === "Medium") {
    approximateTime *= 0.8;
  }

  if (batteryLevel < 20) {
    approximateTime *= 0.8;
  }

  const metrics = getElement("feedMetrics");

  if (metrics) {
    metrics.innerHTML = `
      <div><strong>${exactTime.toFixed(1)}</strong>Exact Processing Units</div>
      <div><strong>${approximateTime.toFixed(1)}</strong>Approximate Processing Units</div>
      <div><strong>${Math.round((1 - approximateTime / exactTime) * 100)}%</strong>Estimated Saving</div>
    `;
  }

  const log = getElement("feedLog");
  if (log) log.innerHTML = "";

  addLog("feedLog", "Feed comparison completed.");
  addLog("feedLog", "Items: " + itemCount);
  addLog("feedLog", "Quality: " + quality);
  addLog("feedLog", "Exact processing: " + exactTime.toFixed(1));
  addLog("feedLog", "Approximate processing: " + approximateTime.toFixed(1));
}

getElement("compareBtn")?.addEventListener("click", compareFeed);

getElement("counterBtn")?.addEventListener("click", () => {
  addLog("feedLog", "Counter-example: Approximation may reduce image or content accuracy.");
  addLog("feedLog", "For banking, medical, or security-critical data, exact results are important.");
});


// ==========================================
// B4 - MULTIMEDIA ENCODING SELECTION
// ==========================================

const videoBattery = getElement("videoBattery");
const videoBatteryValue = getElement("videoBatteryValue");

if (videoBattery && videoBatteryValue) {
  videoBattery.addEventListener("input", () => {
    videoBatteryValue.textContent = videoBattery.value + "%";
  });
}

getElement("videoBtn")?.addEventListener("click", () => {
  const device = getElement("device")?.value ?? "Standard";
  const batteryLevel = Number(videoBattery?.value ?? 100);
  const network = getElement("videoNetwork")?.value ?? "Wi-Fi";

  let encoding = "";
  let explanation = "";

  if (batteryLevel < 20 || network === "Slow") {
    encoding = "Low resolution / power-efficient encoding";
    explanation = "Reduces processing and data usage.";
  } else if (device === "High-end" && network === "Wi-Fi" && batteryLevel > 60) {
    encoding = "High-quality encoding";
    explanation = "The device and network can support better multimedia quality.";
  } else {
    encoding = "Balanced encoding";
    explanation = "Provides a balance between quality, performance, and battery usage.";
  }

  const result = getElement("videoResult");

  if (result) {
    result.innerHTML = `
      <h3>Recommended Encoding</h3>
      <p><strong>${encoding}</strong></p>
      <p>${explanation}</p>
      <p>Device: ${device}</p>
      <p>Battery: ${batteryLevel}%</p>
      <p>Network: ${network}</p>
    `;
  }
});


// ==========================================
// EVIDENCE LOG
// ==========================================

let evidenceEntries = [];

getElement("addEvidenceBtn")?.addEventListener("click", () => {
  const name = getElement("experimentName")?.value.trim() ?? "";
  const conditions = getElement("experimentConditions")?.value.trim() ?? "";
  const result = getElement("experimentResult")?.value.trim() ?? "";

  if (!name || !conditions || !result) {
    alert("Please fill in all three evidence fields.");
    return;
  }

  evidenceEntries.push({
    experiment: name,
    conditions,
    result
  });

  const list = getElement("evidenceList");

  if (list) {
    const item = document.createElement("div");
    item.className = "content-box";
    item.innerHTML = `
      <h3></h3>
      <p></p>
      <p></p>
    `;

    item.children[0].textContent = name;
    item.children[1].textContent = "Conditions: " + conditions;
    item.children[2].textContent = "Result: " + result;

    list.appendChild(item);
  }

  getElement("experimentName").value = "";
  getElement("experimentConditions").value = "";
  getElement("experimentResult").value = "";

  alert("Evidence added successfully!");
});

getElement("exportBtn")?.addEventListener("click", () => {
  if (evidenceEntries.length === 0) {
    alert("Please add at least one evidence entry before exporting.");
    return;
  }

  const headers = ["Experiment", "Conditions", "Result"];

  const rows = evidenceEntries.map(entry => [
    entry.experiment,
    entry.conditions,
    entry.result
  ]);

  const csv = [headers, ...rows]
    .map(row => row.map(value =>
      '"' + String(value).replace(/"/g, '""') + '"'
    ).join(","))
    .join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "CO5_Evidence_Log.csv";
  link.click();

  URL.revokeObjectURL(url);
});


// ==========================================
// INITIAL PAGE SETUP
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  updateSchedulerMetrics();
  console.log("CO5 Android Application Features and Performance Engineering loaded.");
});
