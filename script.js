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
    const nameInput = document.getElementById('newPlayerName');
    const name = nameInput.value.trim();

    const nameExists = allPlayers.some(player => player.toLowerCase() === name.toLowerCase());

    if (!name) {
        showMessage('Lütfen bir isim girin.', 'error');
        return;
    }

    if (nameExists) {
        showMessage('Bu oyuncu zaten eklenmiş!', 'error');
        return;
    }

    allPlayers.push(name);
    loadPlayers();

    nameInput.value = '';
    showMessage('Oyuncu başarıyla eklendi!', 'success');
}

function showMessage(message, type) {
    let messageBox = document.getElementById('messageBox');
    if (!messageBox) {
        messageBox = document.createElement('div');
        messageBox.id = 'messageBox';
        document.body.insertBefore(messageBox, document.body.firstChild);
    }

    messageBox.innerText = message;
    messageBox.style.color = (type === 'error') ? 'red' : 'green';
    messageBox.style.fontWeight = 'bold';
    messageBox.style.marginBottom = '10px';
    messageBox.style.fontSize = '18px';

    setTimeout(() => {
        messageBox.innerText = '';
    }, 3000);
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

    // Sahada zaten var mı kontrol
    const allOnFieldPlayers = document.querySelectorAll('#field .player-item');
    const alreadyExists = Array.from(allOnFieldPlayers).some(p => p.innerText.replace('×', '').trim() === playerName);

    if (alreadyExists) {
        showMessage('Bu oyuncu sahada zaten var!', 'error');
        return;
    }

    // Eğer sahadaysa sadece konum değiştir
    if (draggedElement.classList.contains('onfield')) {
        draggedElement.style.left = (x - 40) + "px";
        draggedElement.style.top = (y - 20) + "px";
    } else {
        // İlk defa sahaya bırakılıyorsa yeni kopya oluştur
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

        // Çarpı butonu ekle
        const deleteBtn = document.createElement('span');
        deleteBtn.innerHTML = "×";
        deleteBtn.className = 'delete-btn';
        deleteBtn.onclick = function () {
            playerClone.remove();

            // Silindiğinde liste rengi tekrar eski haline dönsün
            const originalCard = Array.from(document.querySelectorAll('.player-item')).find(p => p.innerText === playerName && !p.classList.contains('onfield'));
            if (originalCard) {
                originalCard.style.backgroundColor = ''; // eski haline getiriyoruz
                originalCard.style.color = ''; // yazı rengi de eski hale gelsin
            }
        };

        playerClone.appendChild(deleteBtn);

        ev.currentTarget.appendChild(playerClone);

        // --- İsim kartını koyu gri yap ---
        const originalCard = Array.from(document.querySelectorAll('.player-item')).find(p => p.innerText === playerName && !p.classList.contains('onfield'));
        if (originalCard) {
            originalCard.style.backgroundColor = '#aaa'; // koyu gri yapıyoruz
            originalCard.style.color = 'white'; // yazı rengini beyaz yapıyoruz
        }
    }
}
