const allPlayers = [
    "Şenol", "Ahmet Ç.", "İzzet", "Ahmet Onur", "Uğur", "Hakan",
    "Şahin", "Ali", "Armağan", "Atilla", "Furkan Berk", "Muhammed Topal",
    "Gökhan", "Baykal", "Birol Çiftçi", "Deniz Yeyin", "Emre", "Enes Ersöz",
    "Hüseyin Mandı", "İrfan", "Mehmet", "Muammer Kartal", "Mustafa", "Osman",
    "Said", "Salih", "Volkan", "Yusuf", "Yavuz"
];

document.addEventListener('DOMContentLoaded', loadPlayers);

function loadPlayers() {
    const list = document.getElementById('playerList');
    list.innerHTML = '';

    allPlayers.forEach((name, index) => {
        const div = document.createElement('div');
        div.className = 'player-item';
        div.id = 'player-' + index;
        div.innerText = name;
        div.setAttribute('draggable', 'true');

        div.ondragstart = function (ev) {
            ev.dataTransfer.setData("text", ev.target.id);
        };

        div.ontouchstart = function (ev) {
            ev.preventDefault();
            const touch = ev.touches[0];
            const mouseEvent = new MouseEvent("mousedown", {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            div.dispatchEvent(mouseEvent);
        };

        list.appendChild(div);
    });
}

function addNewPlayer() {
    const nameInput = document.getElementById('newPlayerName');
    const name = nameInput.value.trim();

    const nameExists = allPlayers.some(player => player.toLowerCase() === name.toLowerCase());

    if (!name) {
        alert('İsim giriniz.');
        return;
    }

    if (nameExists) {
        alert('Bu oyuncu zaten eklenmiş!');
        return;
    }

    allPlayers.push(name);
    loadPlayers();

    nameInput.value = '';
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drop(ev) {
    ev.preventDefault();
    const id = ev.dataTransfer.getData("text");
    const draggedElement = document.getElementById(id);

    const rect = ev.currentTarget.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;

    const playerName = draggedElement.innerText.trim();
    const allOnFieldPlayers = document.querySelectorAll('#field .player-item');
    const alreadyExists = Array.from(allOnFieldPlayers).some(p => p.innerText.replace('×', '').trim() === playerName);

    if (alreadyExists) {
        alert('Bu oyuncu sahada zaten var!');
        return;
    }

    const playerClone = document.createElement('div');
    playerClone.className = 'player-item onfield';
    playerClone.style.position = "absolute";
    playerClone.style.left = (x - 40) + "px";
    playerClone.style.top = (y - 20) + "px";
    playerClone.id = 'clone-' + Math.random();
    playerClone.setAttribute('draggable', 'true');
    playerClone.innerText = playerName;

    playerClone.ondragstart = function (ev) {
        ev.dataTransfer.setData("text", ev.target.id);
    };

    const deleteBtn = document.createElement('span');
    deleteBtn.innerHTML = "×";
    deleteBtn.className = 'delete-btn';
    deleteBtn.onclick = function () {
        playerClone.remove();
        const originalCard = Array.from(document.querySelectorAll('.player-item')).find(p => p.innerText === playerName && !p.classList.contains('onfield'));
        if (originalCard) {
            originalCard.classList.remove('player-used');
        }
    };

    playerClone.appendChild(deleteBtn);

    ev.currentTarget.appendChild(playerClone);

    const originalCard = Array.from(document.querySelectorAll('.player-item')).find(p => p.innerText === playerName && !p.classList.contains('onfield'));
    if (originalCard) {
        originalCard.classList.add('player-used');
    }
}

function downloadFieldImage() {
    const field = document.getElementById('field');
    html2canvas(field).then(canvas => {
        const link = document.createElement('a');
        link.download = 'kadro.png';
        link.href = canvas.toDataURL();
        link.click();
    });
}
