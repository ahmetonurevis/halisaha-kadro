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

        list.appendChild(div);
    });
}

function addNewPlayer() {
    const name = document.getElementById('newPlayerName').value.trim();
    if (!name) {
        alert('İsim giriniz.');
        return;
    }

    allPlayers.push(name);
    loadPlayers();

    document.getElementById('newPlayerName').value = '';
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

    // Eğer zaten sahadaysa (class'ı 'onfield' olan), sadece taşı
    if (draggedElement.classList.contains('onfield')) {
        draggedElement.style.left = (x - 40) + "px";
        draggedElement.style.top = (y - 20) + "px";
    } else {
        // İlk defa sahaya bırakılıyorsa, kopya oluştur ve ekle
        const playerClone = draggedElement.cloneNode(true);
        playerClone.classList.add('onfield');
        playerClone.style.position = "absolute";
        playerClone.style.left = (x - 40) + "px";
        playerClone.style.top = (y - 20) + "px";
        playerClone.id = playerClone.id + "-clone-" + Math.random(); // ID çakışmaması için
        playerClone.setAttribute('draggable', 'true');

        playerClone.ondragstart = function (ev) {
            ev.dataTransfer.setData("text", ev.target.id);
        };

        playerClone.ondblclick = function () {
            playerClone.remove();
        };

        ev.currentTarget.appendChild(playerClone);
    }
}
