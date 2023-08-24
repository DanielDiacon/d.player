const wrapper = document.querySelector('.wrapper');
musicImg = wrapper.querySelector('.player__img img');
musicName = wrapper.querySelector('.player__song-detalies .player__name');
musicArtist = wrapper.querySelector('.player__song-detalies .player__artist');
mainAudio = wrapper.querySelector('#mainAudio');
playPauseBtn = wrapper.querySelector('.player__play-pause');
prevBtn = wrapper.querySelector('#prevBtn');
nextBtn = wrapper.querySelector('#nextBtn');
progressArea = wrapper.querySelector('.player__progress');
progressBar = wrapper.querySelector('.player__progress-bar');
showMusicList = wrapper.querySelector('#musicListCnt');
showMusicBtn = wrapper.querySelector('#moreMusic');
closeMusicBtn = wrapper.querySelector('#closeMusic');
bgMusicColor = wrapper.querySelector('.bgColor');

let musicIndex = 2;

window.addEventListener('load', () => {
   loadMusic(musicIndex);
   playingNow();
});
function loadMusic() {
   const currentTrack = musicList[musicIndex - 1];

   musicName.innerText = currentTrack.name;
   musicArtist.innerText = currentTrack.artist;
   musicImg.src = `img/${currentTrack.img}.jpg`;
   mainAudio.src = `songs/${currentTrack.src}.mp3`;
   bgMusicColor.src = `img/${currentTrack.img}.jpg`;
   navigator.mediaSession.metadata = new MediaMetadata({
      title: currentTrack.name,
      artist: currentTrack.artist,
      artwork: [
         {
            src: `img/${currentTrack.img}.jpg`,
            sizes: '512x512',
            type: 'image/jpeg',
         },
      ],
   });
}

function playMusic() {
   wrapper.classList.add('paused');
   mainAudio.play();
}
function pauseMusic() {
   wrapper.classList.remove('paused');
   mainAudio.pause();
}
function nextMusic() {
   musicIndex++;
   if (musicIndex > musicList.length) {
      musicIndex = 1;
      loadMusic(musicIndex);
      playMusic();
   }
   loadMusic(musicIndex);
   playMusic();
   playingNow();
}
function prevMusic() {
   musicIndex--;
   if (musicIndex < 1) {
      musicIndex = musicList.length;
      loadMusic(musicIndex);
      playMusic();
      return;
   }
   loadMusic(musicIndex);
   playMusic();
   playingNow();
}
navigator.mediaSession.setActionHandler('previoustrack', () => {
   prevMusic();
});
navigator.mediaSession.setActionHandler('nexttrack', () => {
   nextMusic();
});
playPauseBtn.addEventListener('click', () => {
   const isMusicPaused = wrapper.classList.contains('paused');
   isMusicPaused ? pauseMusic() : playMusic();
   playingNow();
});
nextBtn.addEventListener('click', () => {
   nextMusic();
});
prevBtn.addEventListener('click', () => {
   prevMusic();
});
mainAudio.addEventListener('timeupdate', (e) => {
   const currentTime = e.target.currentTime;
   const duration = e.target.duration;
   let progressWidth = (currentTime / duration) * 100;
   progressBar.style.width = `${progressWidth}%`;

   mainAudio.addEventListener('loadeddata', () => {
      let musicDuration = wrapper.querySelector('.duration');

      //tota time
      let audioDuration = mainAudio.duration;
      let totalMin = Math.floor(audioDuration / 60);
      let totalSec = Math.floor(audioDuration % 60);
      if (totalSec < 10) {
         totalSec = `0${totalSec}`;
      }
      musicDuration.innerHTML = `${totalMin}:${totalSec}`;
   });
   // palyng time
   let musicCurrentTime = wrapper.querySelector('.current');
   let nowMin = Math.floor(currentTime / 60);
   let nowSec = Math.floor(currentTime % 60);
   if (nowSec < 10) {
      nowSec = `0${nowSec}`;
   }
   musicCurrentTime.innerHTML = `${nowMin}:${nowSec}`;
});
progressArea.addEventListener('click', (e) => {
   let progressWidthVal = progressArea.clientWidth;
   let clickedOffSetX = e.offsetX;
   let songDuratin = mainAudio.duration;
   mainAudio.currentTime = (clickedOffSetX / progressWidthVal) * songDuratin;
});
const repeatBtn = wrapper.querySelector('#repeatBtn');
let text = 'repeat';
repeatBtn.classList.add(text);
repeatBtn.addEventListener('click', function () {
   switch (text) {
      case 'repeat':
         repeatBtn.classList.remove(text);
         text = 'repeatOne';
         repeatBtn.classList.add(text);

         break;
      case 'repeatOne':
         repeatBtn.classList.remove(text);
         text = 'shuffle';
         repeatBtn.classList.add(text);

         break;
      case 'shuffle':
         repeatBtn.classList.remove(text);
         text = 'repeat';
         repeatBtn.classList.add(text);

         break;
   }
});
mainAudio.addEventListener('ended', () => {
   switch (text) {
      case 'repeat':
         nextMusic();
         break;
      case 'repeatOne':
         mainAudio.currentTime = 0;
         loadMusic(musicIndex);
         playMusic();
         break;
      case 'shuffle':
         let randomIndex = Math.floor(Math.random() * musicList.length + 1);
         do {
            randomIndex = Math.floor(Math.random() * musicList.length + 1);
         } while (musicIndex === randomIndex);
         musicIndex = randomIndex;
         loadMusic(musicIndex);
         playMusic();
         playingNow();
         break;
   }
});
showMusicBtn.addEventListener('click', () => {
   showMusicList.classList.toggle('show');
});
closeMusicBtn.addEventListener('click', () => {
   showMusicList.classList.remove('show');
});
const ulTag = wrapper.querySelector('.music-list__list');
for (let i = 0; i < musicList.length; i++) {
   //const durationMusic = musicList[i].target.duration;

   let liTag = `<li class="music-list__line" liIndex="${i + 1}">
   <div class="music-list__item">
     <span>${musicList[i].name}</span>
     <p>${musicList[i].artist}</p>
   </div>
   <audio class="${musicList[i].src}"  src="songs/${
      musicList[i].src
   }.mp3"></audio>
   <div id="${musicList[i].src}" class="music-list__audio-duration">0:00</div>
 </li>`;
   ulTag.insertAdjacentHTML('beforeend', liTag);
   let liAudioDuration = ulTag.querySelector(`#${musicList[i].src}`);
   let liAudioTag = ulTag.querySelector(`.${musicList[i].src}`);
   liAudioTag.addEventListener('loadeddata', () => {
      let audioDuration = liAudioTag.duration;
      let totalMin = Math.floor(audioDuration / 60);
      let totalSec = Math.floor(audioDuration % 60);
      if (totalSec < 10) {
         totalSec = `0${totalSec}`;
      }
      liAudioDuration.innerHTML = `${totalMin}:${totalSec}`;
      liAudioDuration.setAttribute('t-duration', `${totalMin}:${totalSec}`);
   });
}
const allLisTags = ulTag.querySelectorAll('li');
function playingNow() {
   for (let j = 0; j < allLisTags.length; j++) {
      let audioTag = allLisTags[j].querySelector('.music-list__audio-duration');
      if (allLisTags[j].classList.contains('playing')) {
         allLisTags[j].classList.remove('playing');
         let adDuration = audioTag.getAttribute('t-duration');
         audioTag.innerHTML = adDuration;
      }
      if (allLisTags[j].getAttribute('liIndex') == musicIndex) {
         allLisTags[j].classList.add('playing');
         audioTag.innerHTML = 'Playing';
      }
      allLisTags[j].setAttribute('onclick', 'clicked(this)');
   }
}
function clicked(element) {
   let getLiIndex = element.getAttribute('liIndex');
   musicIndex = getLiIndex;
   loadMusic(musicIndex);
   playMusic();
   playingNow();
}

// loading page <=>
const loader = document.getElementById('loader');
window.addEventListener('load', function () {
   loader.style.visibility = 'hidden';
   loader.style.opacity = '0';
   loader.style.transition = '0.7s';
});
// dark mode <=========>

// check for saved 'darkMode' in localStorage
let darkMode = localStorage.getItem('darkMode');
const darkModeToggle = document.querySelector('#dark-mode-toggle');
const enableDarkMode = () => {
   // 1. Add the class to the body
   document.body.classList.add('darkmode');
   // 2. Update darkMode in localStorage
   localStorage.setItem('darkMode', 'enabled');
};
const disableDarkMode = () => {
   // 1. Remove the class from the body
   document.body.classList.remove('darkmode');
   // 2. Update darkMode in localStorage
   localStorage.setItem('darkMode', null);
};
// If the user already visited and enabled darkMode
// start things off with it on
if (darkMode === 'enabled') {
   enableDarkMode();
}
// When someone clicks the button
darkModeToggle.addEventListener('click', () => {
   // get their darkMode setting
   darkMode = localStorage.getItem('darkMode');

   // if it not current enabled, enable it
   if (darkMode !== 'enabled') {
      enableDarkMode();
      // if it has been enabled, turn it off
   } else {
      disableDarkMode();
   }
});
