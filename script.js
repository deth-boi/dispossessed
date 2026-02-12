let currentRoom = "entrance";
let inventory = [];

const rooms = {
  entrance: {
    background: "/assets/images/rooms/entrance.png",
    hotspots: [
      { id: "frontdoor", x: 555, y: 482, w: 468, h: 619, action: () => changeRoom("mainhall") },
      { id: "parkinglot", x: 3, y: 553, w: 266, h: 733, action: () => changeRoom("parkinglot") },
      { id: "smokerspit", x: 1023, y: 985, w: 912, h: 737, action: () => changeRoom("smokerspit") }
    ]
  },
  mainhall: {
    background: "/assets/images/rooms/mainhall.png",
    hotspots: [
      { id: "gym", x: 100, y: 250, w: 150, h: 280, action: () => changeRoom("gym") },
      { id: "cafeteria", x: 657, y: 648, w: 696, h: 322, action: () => changeRoom("cafeteria") },
      { id: "hallway", x: 367, y: 286, w: 532, h: 573, action: () => changeRoom("hallway") },
      { id: "janitorscloset", x: 1030, y: 853, w: 1158, h: 103, action: () => changeRoom("janitorscloset") }
    ]
  }
  // Add more rooms here later, e.g. "gym": { ... }
};

function renderRoom() {
  console.log("renderRoom called for room:", currentRoom); // keep for debugging

  const container = document.getElementById("game-container");
  if (!container) {
    console.error("game-container not found");
    return;
  }

  const room = rooms[currentRoom];
  if (!room) {
    console.error("Room not found:", currentRoom);
    container.innerHTML = `<div style="color:red; font-size:2rem; text-align:center; padding:100px;">
      Room "${currentRoom}" does not exist yet
    </div>`;
    return;
  }

  // Set background — try /assets/... first (root-relative works best on GitHub Pages)
  container.style.backgroundImage = `url('/assets/images/rooms/${currentRoom}.png')`;

  // Clear old content
  container.innerHTML = "";

  // Add hotspots
  room.hotspots.forEach(h => {
    const div = document.createElement("div");
    div.className = "hotspot";
    div.style.left = h.x + "px";
    div.style.top = h.y + "px";
    div.style.width = h.w + "px";
    div.style.height = h.h + "px";
    div.title = h.id.replace(/([A-Z])/g, ' $1'); // better tooltip spacing
    div.onclick = h.action;
    container.appendChild(div);
  });
}

function changeRoom(newRoom) {
  if (rooms[newRoom]) {
    currentRoom = newRoom;
    renderRoom();
  } else {
    showDialog("Error", `Room "${newRoom}" doesn't exist yet... still under construction!`);
  }
}

function examine(item) {
  showDialog("Examine", `Whoa... this ${item} is totally tubular.\n\nIt looks important... maybe?`);
}

function pickup(itemId) {
  if (inventory.length >= 5) {
    showDialog("Inventory Full", "Your pockets are stuffed, dude! Can't carry more.");
    return;
  }
  if (!inventory.includes(itemId)) {
    inventory.push(itemId);
    renderInventory();
    showDialog("Picked Up", `You grab the ${itemId}. It's now in your inventory.`);
  }
}

function showDialog(title, message) {
  const titleEl = document.querySelector(".title-bar span");
  const textEl = document.getElementById("dialog-text");
  if (titleEl && textEl) {
    titleEl.textContent = title;
    textEl.textContent = message;
    document.getElementById("dialog-modal").classList.remove("hidden");
  }
}

function closeDialog() {
  document.getElementById("dialog-modal").classList.add("hidden");
}

function renderInventory() {
  const bar = document.getElementById("inventory-bar");
  if (!bar) return;

  bar.innerHTML = "";
  for (let i = 0; i < 5; i++) {
    const slot = document.createElement("img");
    slot.className = "inv-slot";
    if (inventory[i]) {
      slot.src = `assets/images/inventory/${inventory[i]}.png`;
      slot.alt = inventory[i];
      slot.title = inventory[i];
    } else {
      slot.src = `assets/images/inventory/empty-slot.png`;
      slot.alt = "Empty";
    }
    bar.appendChild(slot);
  }
}

// Start everything
window.addEventListener("load", () => {
  console.log("Page loaded — initializing game");
  renderRoom();
  renderInventory();
});
