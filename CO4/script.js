
function showSection(sectionId) {
    const sections = document.querySelectorAll(".section");

    sections.forEach(section => {
        section.classList.remove("active");
    });

    document.getElementById(sectionId).classList.add("active");
}

// 1. Operating System Lifecycle
function showLifecycle() {
    const os = document.getElementById("osType").value;
    let output = "";

    if (os === "Android") {
        output = `
            <h3>Android Application Lifecycle</h3>
            <p>1. onCreate() - Application is created.</p>
            <p>2. onStart() - Application becomes visible.</p>
            <p>3. onResume() - Application becomes interactive.</p>
            <p>4. onPause() - Application loses focus.</p>
            <p>5. onStop() - Application is no longer visible.</p>
            <p>6. onDestroy() - Activity is destroyed.</p>
        `;
    } else {
        output = `
            <h3>iOS Application Lifecycle</h3>
            <p>1. Not Running - Application is not active.</p>
            <p>2. Inactive - Application is temporarily inactive.</p>
            <p>3. Active - Application is running in foreground.</p>
            <p>4. Background - Application executes permitted background work.</p>
            <p>5. Suspended - Application is suspended.</p>
        `;
    }

    document.getElementById("lifecycleResult").innerHTML = output;
}

// 2. Performance Simulation
function runPerformance() {
    const tasks = Number(document.getElementById("taskCount").value);

    if (!Number.isFinite(tasks) || tasks < 1000) {
        alert("Enter at least 1000 tasks.");
        return;
    }

    let start = performance.now();
    let singleResult = 0;

    for (let i = 0; i < tasks; i++) {
        singleResult += Math.sqrt(i);
    }

    let singleTime = performance.now() - start;

    start = performance.now();

    const chunkSize = Math.ceil(tasks / 4);
    const chunks = [];

    for (let i = 0; i < 4; i++) {
        let chunkResult = 0;
        const from = i * chunkSize;
        const to = Math.min(tasks, from + chunkSize);

        for (let j = from; j < to; j++) {
            chunkResult += Math.sqrt(j);
        }

        chunks.push(chunkResult);
    }

    const multiResult = chunks.reduce((a, b) => a + b, 0);
    const multiTime = performance.now() - start;

    document.getElementById("performanceResult").innerHTML = `
        <h3>Performance Simulation Results</h3>
        <p>Number of tasks: ${tasks}</p>
        <p>Single-thread time: ${singleTime.toFixed(3)} ms</p>
        <p>Four sequential chunks time: ${multiTime.toFixed(3)} ms</p>
        <p>Single-thread result: ${singleResult.toFixed(2)}</p>
        <p>Chunked result: ${multiResult.toFixed(2)}</p>
        <p><strong>Note:</strong> The chunks run sequentially in JavaScript.
        This is not a real multithread benchmark.</p>
    `;
}

// 3. Runtime and Memory Simulation
function runRuntime() {
    const count = Number(document.getElementById("objectCount").value);

    if (!Number.isFinite(count) || count < 100) {
        alert("Enter at least 100 objects.");
        return;
    }

    const startMemory = performance.now();
    const objects = [];

    for (let i = 0; i < count; i++) {
        objects.push({
            id: i,
            name: "Object " + i,
            active: true
        });
    }

    const allocationTime = performance.now() - startMemory;

    const processingStart = performance.now();

    const activeObjects = objects.filter(obj => obj.active);

    const processingTime = performance.now() - processingStart;

    document.getElementById("runtimeResult").innerHTML = `
        <h3>Runtime Results</h3>
        <p>Objects created: ${objects.length}</p>
        <p>Active objects: ${activeObjects.length}</p>
        <p>Allocation time: ${allocationTime.toFixed(3)} ms</p>
        <p>Processing time: ${processingTime.toFixed(3)} ms</p>
        <p>Estimated object count: ${count}</p>
        <p><strong>Note:</strong> This browser test does not directly measure
        Android ART, Java heap usage, or garbage collection.</p>
    `;
}

// 4. Security Audit
function runSecurityAudit() {
    const checks = [
        {
            name: "HTTPS Enabled",
            safe: document.getElementById("https").checked
        },
        {
            name: "Secure Data Storage",
            safe: document.getElementById("secureStorage").checked
        },
        {
            name: "Signed Application Updates",
            safe: document.getElementById("signedUpdates").checked
        },
        {
            name: "Exported Components Protected",
            safe: !document.getElementById("exportedComponents").checked
        },
        {
            name: "Cleartext Traffic Disabled",
            safe: !document.getElementById("cleartext").checked
        }
    ];

    let score = 0;
    let output = "<h3>Security Audit Report</h3>";

    checks.forEach(check => {
        if (check.safe) {
            score++;
            output += `<p class="success">PASS: ${check.name}</p>`;
        } else {
            output += `<p class="warning">FAIL: ${check.name}</p>`;
        }
    });

    output += `
        <h3>Security Score: ${score}/5</h3>
        <p>${score === 5
            ? "All selected security checks passed."
            : "Security improvements are required."}</p>
        <p><strong>Note:</strong> This is a configuration checklist,
        not a real penetration test or application security scan.</p>
    `;

    document.getElementById("securityResult").innerHTML = output;
}

// 5. Power Management
function updateBattery() {
    const battery = document.getElementById("battery").value;
    document.getElementById("batteryValue").innerText =
        "Battery: " + battery + "%";
}

function calculatePower() {
    const battery = Number(document.getElementById("battery").value);
    const doze = document.getElementById("doze").checked;
    const batching = document.getElementById("batching").checked;
    const wakelock = document.getElementById("wakelock").checked;

    let usage = 10;

    if (doze) usage -= 3;
    if (batching) usage -= 2;
    if (wakelock) usage += 5;

    usage = Math.max(1, usage);

    let status = battery < 20
        ? "Low battery: activate power-saving measures."
        : "Battery level is sufficient.";

    document.getElementById("powerResult").innerHTML = `
        <h3>Power Management Report</h3>
        <p>Battery level: ${battery}%</p>
        <p>Estimated relative power usage: ${usage} units</p>
        <p>Doze Mode: ${doze ? "Enabled" : "Disabled"}</p>
        <p>Location Batching: ${batching ? "Enabled" : "Disabled"}</p>
        <p>Wake Lock: ${wakelock ? "Enabled" : "Disabled"}</p>
        <p><strong>${status}</strong></p>
        <p><strong>Note:</strong> These are illustrative model units,
        not measured battery consumption.</p>
    `;
}

// 6. Field Tracking Simulator
function runTracking() {
    const battery = Number(
        document.getElementById("trackingBattery").value
    );

    const network = document.getElementById("network").value;
    const movement = document.getElementById("movement").value;
    const emergency = document.getElementById("emergency").checked;

    if (!Number.isFinite(battery) || battery < 0 || battery > 100) {
        alert("Enter a battery level between 0 and 100.");
        return;
    }

    let interval;
    let accuracy;
    let transmission;
    let policy;

    if (emergency) {
        interval = 5;
        accuracy = "High";
        transmission = "Immediate";
        policy = "Emergency tracking";
    } else if (battery < 20) {
        interval = 30;
        accuracy = "Low";
        transmission = "Batched";
        policy = "Critical battery saving";
    } else if (movement === "stationary") {
        interval = 60;
        accuracy = "Low";
        transmission = "Batched";
        policy = "Stationary mode";
    } else if (movement === "vehicle") {
        interval = 10;
        accuracy = "High";
        transmission = network === "offline"
            ? "Store securely until online"
            : "Periodic";
        policy = "Vehicle tracking";
    } else {
        interval = 20;
        accuracy = "Medium";
        transmission = network === "offline"
            ? "Store securely until online"
            : "Periodic";
        policy = "Walking mode";
    }

    if (network === "poor" && !emergency) {
        transmission = "Batch and retry when network improves";
    }

    document.getElementById("trackingResult").innerHTML = `
        <h3>Tracking Simulation Report</h3>
        <p>Battery Level: ${battery}%</p>
        <p>Network: ${network}</p>
        <p>Movement: ${movement}</p>
        <p>Emergency Mode: ${emergency ? "Enabled" : "Disabled"}</p>
        <p>Selected Policy: ${policy}</p>
        <p>Location Update Interval: ${interval} seconds</p>
        <p>Location Accuracy: ${accuracy}</p>
        <p>Data Transmission: ${transmission}</p>
        <p class="success">Tracking policy selected successfully.</p>
    `;
}
