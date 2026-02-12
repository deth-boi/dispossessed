let currentRoom = "entrance";
let inventory = [];

const rooms = {
  entrance: {
    background: "https://raw.githubusercontent.com/deth-boi/dispossessed/main/assets/images/rooms/entrance.png",
    hotspots: [
      { id: "frontdoor", x: 555, y: 482, w: 468, h: 619, action: () => changeRoom("mainhall") },
      { id: "parkinglot", x: 3, y: 553, w: 266, h: 733, action: () => changeRoom("parkinglot") },
      { id: "smokerspit", x: 1023, y: 985, w: 912, h: 737, action: () => changeRoom("smokerspit") }
    ]
  },
  mainhall: {
    background: "https://raw.githubusercontent.com/deth-boi/dispossessed/main/assets/images/rooms/mainhall.png",
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
  const img = document.getElementById("room-image");
  const container = document.getElementById("game-container");

  if (!img || !container) {
    console.error("Missing img or container");
    return;
  }

  const room = rooms[currentRoom];
  if (!room) {
    console.error("Room not found:", currentRoom);
    img.src = "https://picsum.photos/1024/1024"; // fallback
    return;
  }

  // Set aspect ratio to match the current room's image
  let aspect = "1 / 1"; // default square
  if (currentRoom === "entrance") {
    aspect = "1024 / 1024"; // square
  } else if (currentRoom === "mainhall") {
    aspect = "1344 / 896"; // wider
  }

  container.style.aspectRatio = aspect;

  img.src = room.background;
  console.log("Set src to:", img.src);

  // Clear old hotspots
  container.querySelectorAll('.hotspot').forEach(el => el.remove());

  // Add hotspots
  room.hotspots.forEach(h => {
    const div = document.createElement("div");
    div.className = "hotspot";
    div.style.left = h.x + "px";
    div.style.top = h.y + "px";
    div.style.width = h.w + "px";
    div.style.height = h.h + "px";
    div.title = h.id;
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
  } else {
    console.error("Dialog elements missing");
  }
}

function closeDialog() {
  document.getElementById("dialog-modal").classList.add("hidden");
}

function renderInventory() {
  const bar = document.getElementById("inventory-bar");
  if (!bar) {
    console.error("inventory-bar not found");
    return;
  }

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
