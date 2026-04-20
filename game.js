// ====================== GAME DATA ======================
const scenes = {
    "start": {
        image: "assets/images/entrance.png",
        dialogue: "You've come back from school after your dentist appointment. The air smells like smoke.",
        hotspots: [
            // Example: change these numbers to your real door coordinates
            { x: 691, y: 795, w: 934, h: 679, target: "hallway", name: "Enter" }
        ]
    },
    "hallway": {
        image: "assets/images/hallway.png",
        dialogue: "A long corridor stretches before you. It's eerily quiet and empty...",
        hotspots: [
            { x: 1100, y: 420, w: 220, h: 480, target: "start", name: "Back to Entrance" },
            { x: 80, y: 380, w: 240, h: 520, target: "lab", name: "Lab Door" }
        ]
    },
    "classroom": {
        image: "assets/images/classroom.png",
        dialogue: "The lab is filled with broken equipment. A faint red glow pulses ahead.",
        hotspots: [
            { x: 1350, y: 500, w: 200, h: 400, target: "hallway", name: "Return to Hallway" }
        ]
    }
    // Add as many rooms as you want here
};

let currentSceneKey = "start";
let inventory = [];           // max 3 items for now
let devMode = false;

// ====================== HELPER FUNCTIONS ======================
function showDialogue(text) {
    const el = document.getElementById("dialogue");
    el.textContent = text;
}

function updateInventory() {
    for (let i = 1; i <= 3; i++) {
        const slot = document.getElementById(`slot-${i}`);
        slot.textContent = inventory[i-1] || "";
    }
}

function changeScene(newKey) {
    if (!scenes[newKey]) return;
    
    currentSceneKey = newKey;
    const scene = scenes[newKey];

    // Change the room image
    document.getElementById("room-image").src = scene.image;

    // Clear old hotspots
    const layer = document.getElementById("hotspots-layer");
    layer.innerHTML = "";

    // Create new hotspots
    scene.hotspots.forEach(h => {
        const div = document.createElement("div");
        div.className = "hotspot";
        div.style.left = h.x + "px";
        div.style.top = h.y + "px";
        div.style.width = h.w + "px";
        div.style.height = h.h + "px";
        div.title = h.name;                    // tooltip on hover

        div.addEventListener("click", () => {
            showDialogue(`→ ${h.name}`);
            setTimeout(() => changeScene(h.target), 600);
        });

        layer.appendChild(div);
    });

    // Update dialogue
    showDialogue(scene.dialogue);

    // Update inventory (in case you pick something up later)
    updateInventory();
}

// ====================== DEV MODE (super useful for mapping coords) ======================
function initDevMode() {
    const checkbox = document.getElementById("dev-mode");
    const image = document.getElementById("room-image");

    checkbox.addEventListener("change", () => {
        devMode = checkbox.checked;
        image.style.cursor = devMode ? "crosshair" : "default";
    });

    image.addEventListener("click", (e) => {
        if (!devMode) return;
        
        const rect = image.getBoundingClientRect();
        const x = Math.round(e.clientX - rect.left);
        const y = Math.round(e.clientY - rect.top);
        
        console.log(`%c📍 Clicked at → x: ${x}, y: ${y}`, "background:#f00;color:#fff;font-size:15px");
        showDialogue(`Logged: x:${x} y:${y} (check console)`);
    });
}

// ====================== START THE GAME ======================
window.onload = () => {
    changeScene(currentSceneKey);
    updateInventory();
    initDevMode();
    
    console.log("%c✅ DOOM-style adventure ready! Use DEV MODE to map your doors.", "color:#0f0;font-size:18px");
};
