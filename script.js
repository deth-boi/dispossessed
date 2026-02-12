// script.js - Jordan's 90s Point & Click Adventure

let currentRoom = "room1";
let inventory = []; // We'll add items here later (max 5 slots)

const rooms = {
  room1: {
    background: "assets/images/rooms/room1-livingroom.jpg",  // ← change to your actual filename
    hotspots: [
      {
        id: "door-to-basement",
        x: 400, y: 200, w: 150, h: 250,  // pixel coords on your image — tweak these!
        action: () => changeRoom("room2")
      },
      {
        id: "weird-statue",
        x: 700, y: 400, w: 100, h: 180,
        action: () => examine("weird-statue")
      }
    ]
  },
  room2: {
    background: "assets/images/rooms/room2-basement.jpg",
    hotspots: [
      {
        id: "door-back-upstairs",
        x: 100, y: 300, w: 120, h: 200,
        action: () => changeRoom("room1")
      },
      {
        id: "floppy-disk",
        x: 850, y: 500, w: 80, h: 80,
        action: () => {
          examine("floppy disk");
          // Later: add to inventory if not already there
          if (!inventory.includes("floppy")) {
            inventory.push("floppy");
            renderInventory(); // We'll add this function soon
            alert("You picked up the floppy disk! It's got mysterious data...");
          }
        }
      }
    ]
  }
  // Add more rooms as you create them, e.g. "room3": { ... }
};

function renderRoom() {
  const container = document.getElementById("game-container");
  if (!container) return; // safety check

  // Set background
  container.style.backgroundImage = `url('${rooms[currentRoom].background}')`;

  // Clear old hotspots
  container.innerHTML = "";

  // Add new hotspots
  rooms[currentRoom].hotspots.forEach(hotspot => {
    const div = document.createElement("div");
    div.className = "hotspot";
    div.style.left = hotspot.x + "px";
    div.style.top = hotspot.y + "px";
    div.style.width = hotspot.w + "px";
    div.style.height = hotspot.h + "px";
    div.title = hotspot.id.replace(/-/g, " "); // tooltip on hover
    div.onclick = hotspot.action;
    container.appendChild(div);
  });
}

function changeRoom(newRoom) {
  if (rooms[newRoom]) {
    currentRoom = newRoom;
    renderRoom();
    // Optional: add a quick fade or sound later
  } else {
    alert("404: Room not found, dude! This page is still under construction.");
  }
}

function examine(item) {
  // Temporary retro alert — we'll replace this with a modal
  alert("Whoa dude... this " + item + " is totally tubular.\n\n(press OK to continue)");
  // Future: show a Windows 95 dialog with description, maybe play a beep sound
}

// Inventory render (placeholder — add this HTML to index.html next)
function renderInventory() {
  const invDiv = document.getElementById("inventory-bar");
  if (!invDiv) return;

  invDiv.innerHTML = "";
  for (let i = 0; i < 5; i++) {
    const slot = document.createElement("img");
    slot.className = "inv-slot";
    if (inventory[i]) {
      slot.src = `assets/images/inventory/${inventory[i]}.png`;
      slot.alt = inventory[i];
      slot.title = inventory[i];
    } else {
      slot.src = `assets/images/inventory/empty-slot.png`;
      slot.alt = "Empty slot";
    }
    invDiv.appendChild(slot);
  }
}

// Kick off the game
window.addEventListener("load", () => {
  renderRoom();
  renderInventory(); // empty at start
});
