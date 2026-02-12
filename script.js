let currentRoom = "room1";
let inventory = [];

const rooms = {
  room1: {
    background: "assets/images/rooms/room1.jpg",  // ← CHANGE TO YOUR ACTUAL FILE NAMES
    hotspots: [
      { id: "door", x: 500, y: 200, w: 180, h: 300, action: () => changeRoom("room2") },
      { id: "mysterious-object", x: 700, y: 350, w: 120, h: 140, action: () => examine("mysterious object") }
    ]
  },
  room2: {
    background: "assets/images/rooms/room2.jpg",
    hotspots: [
      { id: "door-back", x: 100, y: 250, w: 150, h: 280, action: () => changeRoom("room1") },
      { id: "item-to-pick", x: 800, y: 400, w: 90, h: 90, action: () => pickup("floppy") }
    ]
  }
};

function renderRoom() {
  const container = document.getElementById("game-container");
  container.style.backgroundImage = `url('${rooms[currentRoom].background}')`;
  container.innerHTML = "";

  rooms[currentRoom].hotspots.forEach(h => {
    const div = document.createElement("div");
    div.className = "hotspot";
    div.style.left = h.x + "px";
    div.style.top = h.y + "px";
    div.style.width = h.w + "px";
    div.style.height = h.h + "px";
    div.title = h.id.replace(/-/g, " ");
    div.onclick = h.action;
    container.appendChild(div);
  });
}

function changeRoom(newRoom) {
  if (rooms[newRoom]) {
    currentRoom = newRoom;
    renderRoom();
  } else {
    showDialog("Error", "That room doesn't exist yet... still under construction!");
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
  document.querySelector(".title-bar span").textContent = title;
  document.getElementById("dialog-text").textContent = message;
  document.getElementById("dialog-modal").classList.remove("hidden");
}

function closeDialog() {
  document.getElementById("dialog-modal").classList.add("hidden");
}

function renderInventory() {
  const bar = document.getElementById("inventory-bar");
  bar.innerHTML = "";
  for (let i = 0; i < 5; i++) {
    const slot = document.createElement("img");
    slot.className = "inv-slot";
    if (inventory[i]) {
      slot.src = `assets/images/inventory/${inventory[i]}.png`;
      slot.alt = inventory[i];
      slot.title = inventory[i];
    } else {
      slot.src = `assets/images/inventory/empty-slot.png`; // add this placeholder image
      slot.alt = "Empty";
    }
    bar.appendChild(slot);
  }
}

// Start the game
window.addEventListener("load", () => {
  renderRoom();
  renderInventory();
});
