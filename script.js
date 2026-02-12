let currentRoom = "room1";
let inventory = [];

const rooms = {
  entrance: {
    background: "assets/images/rooms/entrance.png",
    hotspots: [
      { id: "front-door", x: 555, y: 482, w: 468, h: 619, action: () => changeRoom("main-hall") },
      { id: "parkinglot", x: 3, y: 553, w: 266, h: 733, action: () => changeRoom("parking lot") },
      { id: "smokers-pit", x: 1023, y: 985, w: 912, h: 737, action: () => changeRoom("smokers-pit") }
      
    ]
  },
  mainhall: {
    background: "assets/images/rooms/main-hall.png",
    hotspots: [
      { id: "gym", x: 100, y: 250, w: 150, h: 280, action: () => changeRoom("gym") },
      { id: "cafeteria", x: 657, y: 648, w: 696, h: 322, action: () => changeRoom("cafeteria") },
      { id: "hallway", x: 367, y: 286, w: 532, h: 573, action: () => changeRoom("hallway") },
      { id: "janitors-closet", x: 1030, y: 853, w: 1158, h: 103, action: () => changeRoom("janitors-closet") }
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
