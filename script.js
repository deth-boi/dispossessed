// script.js
let currentRoom = 'campus';
let inventory = [];
let collected = new Set(); // tracks which world items have been picked up

const rooms = {
    campus: {
        image: 'https://github.com/deth-boi/dispossessed/blob/main/assets/images/backgrounds/campus.png',
        hotspots: [
            {
                id: 'entrance',
                x: 704,
                y: 383,
                w: 807,
                h: 420,
                label: 'Entrance',
                action: () => changeRoom('lockers')
            },

{
                 id: 'parkinglot',
                x: 569,
                y: 581,
                w: 956,
                h: 716,
                label: 'Parking Lot',
                action: () => changeRoom('parkinglot')
            },

            {
                 id: 'smokerspit',
                x: 2,
                y: 451,
                w: 133,
                h: 539,
                label: 'Smoker's Pit',
                action: () => changeRoom('smokerspit')
            },
            
        ]
    },
    parkinglot: {
        image: 'https://github.com/deth-boi/dispossessed/blob/main/assets/images/backgrounds/parkinglot.png',
        hotspots: [
            {
                id: 'back',
                x: 9,
                y: 334,
                w: 292,
                h: 414,
                label: 'Back to School',
                action: () => changeRoom('campus')
            },
            {
                id: 'whitetruck',
                x: 861,
                y: 410,
                w: 896,
                h: 432,
                label: 'White Truck',
                action: () => changeRoom('whitetruck')
                })
            }
        ]
    },
    smokerspit: {
        image: 'https://github.com/deth-boi/dispossessed/blob/main/assets/images/backgrounds/smokerspit.png',
        hotspots: [
            {
                id: 'campus',
                x: 285,
                y: 419,
                w: 766,
                h: 532,
                label: 'Back to School',
                action: () => () => changeRoom('campus')
            },
        ]
    }
};

const itemData = {
    key: { emoji: '🗝️' },
    cross: { emoji: '✝️' }
};

function changeRoom(roomId) {
    currentRoom = roomId;
    document.getElementById('background').src = rooms[roomId].image;
    renderHotspots();
    updateStatus(`You are now in the ${roomId}.`);
}

function renderHotspots() {
    const container = document.getElementById('hotspots');
    container.innerHTML = '';

    rooms[currentRoom].hotspots.forEach(hotspot => {
        // Don't render collected items
        if (collected.has(hotspot.id)) return;

        const el = document.createElement('div');
        el.className = 'hotspot';
        el.style.left = `${hotspot.x}px`;
        el.style.top = `${hotspot.y}px`;
        el.style.width = `${hotspot.w}px`;
        el.style.height = `${hotspot.h}px`;
        el.title = hotspot.label;
        
        el.addEventListener('click', (e) => {
            e.stopImmediatePropagation();
            hotspot.action();
        });

        container.appendChild(el);
    });
}

function pickupItem(item) {
    if (inventory.some(i => i.id === item.id)) {
        showMessage("You already have that.");
        return;
    }

    inventory.push(item);
    collected.add(item.id); // mark as collected so hotspot disappears
    updateInventory();
    showMessage(`You picked up the ${item.name}.`);
    
    // Refresh hotspots so the item disappears
    renderHotspots();
}

function updateInventory() {
    for (let i = 1; i <= 5; i++) {
        const slot = document.getElementById(`slot-${i}`);
        slot.innerHTML = '';
        
        if (inventory[i-1]) {
            slot.innerHTML = `<span>${inventory[i-1].emoji}</span>`;
            slot.title = inventory[i-1].name;
        }
    }
}

function showMessage(text) {
    document.getElementById('message-text').innerHTML = text.replace(/\n/g, '<br>');
    document.getElementById('message-box').classList.remove('hidden');
}

function hideMessage() {
    document.getElementById('message-box').classList.add('hidden');
}

function updateStatus(text) {
    document.getElementById('status-text').textContent = text;
}

// Fake window controls
function minimizeWindow() {
    showMessage("You can't minimize the horror.");
}

function maximizeWindow() {
    showMessage("The house is already too big.");
}

function closeWindow() {
    if (confirm("Are you sure you want to quit DISPOSSESSED?")) {
        document.body.innerHTML = '<div style="background:#000;color:#0f0;padding:40px;font-family:monospace;text-align:center;margin-top:200px;">GAME TERMINATED.<br><br>The spirit wins.</div>';
    }
}

// CLOCK (for that authentic Windows feel)
function updateClock() {
    const timeEl = document.getElementById('time');
    setInterval(() => {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        timeEl.textContent = `${hours}:${minutes} ${ampm}`;
    }, 1000);
}

// INIT
window.onload = () => {
    updateClock();
    changeRoom('foyer'); // starts the game
    updateInventory();
    
    // Easter egg: click the title bar text 7 times for a secret
    let titleClicks = 0;
    document.getElementById('title-bar').addEventListener('click', () => {
        titleClicks++;
        if (titleClicks === 7) {
            showMessage("You found the secret.<br><br>The house was never haunted.<br><br>You were.");
            titleClicks = 0;
        }
    });
};
