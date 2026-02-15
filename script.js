// script.js
let currentRoom = 'foyer';
let inventory = [];
let collected = new Set(); // tracks which world items have been picked up

const rooms = {
    foyer: {
        image: 'https://picsum.photos/id/1015/800/500',
        hotspots: [
            {
                id: 'door-living',
                x: 520,
                y: 140,
                w: 140,
                h: 260,
                label: 'Living Room',
                action: () => changeRoom('living')
            },
            {
                id: 'door-basement',
                x: 280,
                y: 160,
                w: 90,
                h: 240,
                label: 'Basement Door',
                action: () => {
                    if (inventory.some(item => item.id === 'key')) {
                        showMessage("The rusty key slides into the lock with a satisfying click...\n\nYou descend into the darkness.");
                        changeRoom('basement');
                    } else {
                        showMessage("The door is locked. You hear faint scratching from the other side.");
                    }
                }
            },
            {
                id: 'key',
                x: 140,
                y: 380,
                w: 70,
                h: 50,
                label: 'Rusty Key',
                action: () => pickupItem({
                    id: 'key',
                    emoji: '🗝️',
                    name: 'Rusty Key'
                })
            }
        ]
    },
    living: {
        image: 'https://picsum.photos/id/133/800/500',
        hotspots: [
            {
                id: 'door-foyer',
                x: 40,
                y: 180,
                w: 110,
                h: 240,
                label: 'Back to Foyer',
                action: () => changeRoom('foyer')
            },
            {
                id: 'cross',
                x: 480,
                y: 220,
                w: 60,
                h: 120,
                label: 'Silver Cross',
                action: () => pickupItem({
                    id: 'cross',
                    emoji: '✝️',
                    name: 'Silver Cross'
                })
            }
        ]
    },
    basement: {
        image: 'https://picsum.photos/id/201/800/500',
        hotspots: [
            {
                id: 'spirit',
                x: 320,
                y: 120,
                w: 160,
                h: 280,
                label: 'The Spirit',
                action: () => {
                    if (inventory.some(item => item.id === 'cross')) {
                        showMessage("You hold the silver cross high.\n\nThe spirit screams and dissolves into smoke.\n\nYou are no longer... DISPOSSESSED.\n\n\nTHE END");
                    } else {
                        showMessage("The spirit lunges at you...\n\nGAME OVER.");
                    }
                }
            },
            {
                id: 'exit',
                x: 680,
                y: 380,
                w: 80,
                h: 80,
                label: 'Stairs',
                action: () => changeRoom('foyer')
            }
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
