// --- SONG DATA ---
const songs = [
    { id: 1, title: "Butta Bomma", artist: "Armaan Malik", img: "WhatsApp Image 2026-04-14 at 12.11.30 PM.jpeg", url: "ButtaBomma Video Song (4K) (Telugu) AlaVaikunthapurramuloo Allu Arjun Thaman S Armaan Malik.mp3.mpeg" },
    { id: 2, title: "Samajavaragamana", artist: "Sid Sriram", img: "WhatsApp Image 2026-04-14 at 2.49.17 PM.jpeg", url: "Samajavaragamana - SenSongsMp3.Co.mp3.mpeg" },
    { id: 3, title: "Naatu Naatu", artist: "Rahul Sipligunj", img: "WhatsApp Image 2026-04-14 at 2.49.20 PM.jpeg", url: "Naattu Koothu.mp3.mpeg" },
    { id: 4, title: "Oo Antava", artist: "Indravathi Chauhan", img: "WhatsApp Image 2026-04-14 at 1.59.23 P.jpeg", url: "Oo Antava Oo Oo Antava.mp3.mpeg" },
    { id: 5, title: "Saranga Dariya", artist: "Mangli", img: "WhatsApp Image 2026-04-14 at 2.49.18 PM.jpeg", url:"Saranga Dariya - SenSongsMp3.Com.mp3.mpeg" },
    { id: 6, title: "Kalaavathi", artist: "Sid Sriram", img: "WhatsApp Image 2026-04-14 at 2.49.21 PM.jpeg", url: "Kalaavathi.mp3.mpeg" },
    { id: 7, title: "Eyy Bidda", artist: "Nakash Aziz", img: "WhatsApp Image 2026-04-14 at 1.59.22 P.jpeg", url: "Eyy Bidda Idhi Naa Adda.mp3.mpeg" },
    { id: 8, title: "Inkem Inkem", artist: "Sid Sriram", img: "WhatsApp Image 2026-04-14 at 1.59.23 .jpeg", url: "Inkem Inkem Inkem Kaavaale - SenSongsMp3.Co.mp3.mpeg" },
    { id: 9, title: "Nee Kannulu", artist: "Sid Sriram", img: "WhatsApp Image 2026-04-14 at 1.59.22 PM.jpeg", url: "Nee Kannulu - SenSongsMp3.Co.mp3.mpeg" },
    { id: 10, title: "Dakko Dakko meka", artist: "Sid Sriram", img: "WhatsApp Image 2026-04-14 at 1.59.21 PM.jpeg", url: "Dakko Dakko Meka.mp3.mpeg" },
    { id: 11, title: "Undipova nuvvu ela ", artist: "Sid Sriram", img: "WhatsApp Image 2026-04-14 at 1.59.23 PM.jpeg", url: "Undipova - SenSongsMp3.Co.mp3.mpeg" },

];

let favorites = JSON.parse(localStorage.getItem('favs')) || [];
let playlist = JSON.parse(localStorage.getItem('myPlaylist')) || [];
let currentSongIndex = 0;

// --- AUDIO PLAYER CORE ---
const audio = document.getElementById('main-audio');
const playBtn = document.getElementById('play-btn-footer');
const progressBar = document.getElementById('progress-bar');
const volControl = document.getElementById('volume-control');

function togglePlay() {
    if (!audio.src) return alert("Select a song first!");
    if (audio.paused) {
        audio.play();
        playBtn.innerHTML = '<i class="fa fa-pause"></i>';
    } else {
        audio.pause();
        playBtn.innerHTML = '<i class="fa fa-play ml-1"></i>';
    }
}

function loadSong(index) {
    const song = songs[index];
    currentSongIndex = index;
    audio.src = song.url;
    document.getElementById('p-title').innerText = song.title;
    document.getElementById('p-artist').innerText = song.artist;
    document.getElementById('p-img').src = song.img;
    
    // Update active UI
    document.querySelectorAll('.song-card').forEach(c => c.classList.remove('active-song'));
    const cards = document.querySelectorAll('.song-card');
    if(cards[index]) cards[index].classList.add('active-song');

    updateFavIcon();
    audio.play();
    playBtn.innerHTML = '<i class="fa fa-pause"></i>';
}

function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
}

function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
}

// Audio Progress
audio.ontimeupdate = () => {
    const per = (audio.currentTime / audio.duration) * 100;
    progressBar.value = per || 0;
    document.getElementById('curr-time').innerText = formatTime(audio.currentTime);
    document.getElementById('total-time').innerText = formatTime(audio.duration || 0);
};

progressBar.oninput = () => {
    audio.currentTime = (progressBar.value / 100) * audio.duration;
};

volControl.oninput = () => { audio.volume = volControl.value / 100; };

function formatTime(s) {
    let min = Math.floor(s / 60);
    let sec = Math.floor(s % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// --- FAVORITES & PLAYLIST ---
function toggleFavoriteCurrent() {
    const song = songs[currentSongIndex];
    const index = favorites.findIndex(f => f.id === song.id);
    if(index > -1) favorites.splice(index, 1);
    else favorites.push(song);
    localStorage.setItem('favs', JSON.stringify(favorites));
    updateFavIcon();
}

function togglePlaylistCurrent() {
    const song = songs[currentSongIndex];
    if(!playlist.find(p => p.id === song.id)) {
        playlist.push(song);
        localStorage.setItem('myPlaylist', JSON.stringify(playlist));
        alert("Added to Playlist!");
    } else {
        alert("Already in Playlist");
    }
}

function updateFavIcon() {
    const isFav = favorites.find(f => f.id === songs[currentSongIndex].id);
    document.getElementById('fav-btn').className = isFav ? 'fa-solid fa-heart text-red-500 cursor-pointer' : 'fa-regular fa-heart cursor-pointer';
}

// --- SETTINGS ACTIONS ---
function showFavorites() {
    renderSongs(favorites, "My Favorites");
    closeModal('settings-modal');
}

function showPlaylist() {
    renderSongs(playlist, "My Playlist");
    closeModal('settings-modal');
}

// --- UI RENDERING ---
function renderSongs(data, title = "Music Library") {
    document.querySelector('#view-title h2').innerText = title;
    const grid = document.getElementById('song-grid');
    if(data.length === 0) {
        grid.innerHTML = `<div class="col-span-full text-center py-20 text-gray-500">Nothing here yet...</div>`;
        return;
    }
    grid.innerHTML = data.map((song, i) => `
        <div class="song-card glass p-4 rounded-2xl group hover:bg-white/10 transition cursor-pointer" onclick="loadSong(${songs.indexOf(song)})">
            <div class="relative overflow-hidden rounded-xl mb-4">
                <img src="${song.img}" class="w-full aspect-square object-cover transition group-hover:scale-110">
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                    <i class="fa fa-play text-3xl"></i>
                </div>
            </div>
            <h3 class="font-bold truncate text-sm">${song.title}</h3>
            <p class="text-[10px] text-gray-400">${song.artist}</p>
        </div>
    `).join('');
}

// --- AUTH & PROFILE (PERSISTENT) ---
function toggleAuth() {
    document.getElementById('login-view').classList.toggle('hidden');
    document.getElementById('register-view').classList.toggle('hidden');
}

function handleRegister() {
    const user = {
        name: document.getElementById('reg-user').value,
        email: document.getElementById('reg-email').value,
        mobile: document.getElementById('reg-mobile').value,
        age: document.getElementById('reg-age').value,
        pass: document.getElementById('reg-pass').value,
        pic: `https://ui-avatars.com/api/?name=${document.getElementById('reg-user').value}&background=a855f7&color=fff`
    };
    localStorage.setItem('vibe_user', JSON.stringify(user));
    alert("Welcome! Now Login.");
    toggleAuth();
}

function handleLogin() {
    const user = JSON.parse(localStorage.getItem('vibe_user'));
    const inputName = document.getElementById('login-user').value;
    const inputPass = document.getElementById('login-pass').value;

    if(user && user.name === inputName && user.pass === inputPass) {
        sessionStorage.setItem('vibe_session', 'active');
        initApp();
    } else {
        alert("Invalid credentials");
    }
}

function handleLogout() {
    sessionStorage.clear();
    location.reload();
}

function initApp() {
    const user = JSON.parse(localStorage.getItem('vibe_user'));
    document.getElementById('auth-container').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    document.getElementById('display-name').innerText = user.name;
    document.getElementById('header-avatar').src = user.pic;
    renderSongs(songs);
}

// Profile Modal Functions
function openModal(id) { 
    document.getElementById(id).classList.remove('hidden'); 
    if(id === 'profile-modal') {
        const user = JSON.parse(localStorage.getItem('vibe_user'));
        document.getElementById('edit-user').value = user.name;
        document.getElementById('edit-email').value = user.email;
        document.getElementById('edit-mobile').value = user.mobile;
        document.getElementById('edit-age').value = user.age;
        document.getElementById('edit-avatar').src = user.pic;
    }
}

function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

function previewImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => document.getElementById('edit-avatar').src = e.target.result;
        reader.readAsDataURL(input.files[0]);
    }
}

function saveProfile() {
    const user = JSON.parse(localStorage.getItem('vibe_user'));
    user.name = document.getElementById('edit-user').value;
    user.email = document.getElementById('edit-email').value;
    user.mobile = document.getElementById('edit-mobile').value;
    user.age = document.getElementById('edit-age').value;
    user.pic = document.getElementById('edit-avatar').src;
    localStorage.setItem('vibe_user', JSON.stringify(user));
    initApp();
    closeModal('profile-modal');
}

function filterSongs(query) {
    const filtered = songs.filter(s => s.title.toLowerCase().includes(query.toLowerCase()) || s.artist.toLowerCase().includes(query.toLowerCase()));
    renderSongs(filtered);
}

window.onload = () => { if(sessionStorage.getItem('vibe_session')) initApp(); };