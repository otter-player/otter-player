import { otterStyles } from './otter-styles.js';const otterStylesElement = document.createElement('style');otterStylesElement.innerHTML = otterStyles;document.head.appendChild(otterStylesElement);

// import hls.js
import 'https://cdn.jsdelivr.net/npm/hls.js/dist/hls.min.js';

//import dash.js
import 'https://cdn.jsdelivr.net/npm/dashjs/dist/dash.all.min.js';

class OtterPlayer {
  constructor() {
    this.videoElement = null;
    this.hls = null;
    this.dash = null;
    this.sourceUrl = null;
    this.poster = null;
    this.tracks = [];
    this.isPlaying = false;
    this.isPaused = true;
    this.spinnerElement = null;
  }

  initialize(options) {
    this.icons();
    this.setupVideoElement(options);
    this.setupMediaSource(options);
    this.addOtterTracks(options.tracks);
    this.setupPlayPauseEvents();
    this.setupPlayPauseObserver();
    this.updatePlayPauseButton();
    this.setupKeyboardEvents();
    this.setupPoster(options.poster);
    this.createSpinner(); // Add spinner creation after setup
    this.setupVolumeControl(); // Add volume control setup
    this.setupSeekBar(); // Add seek bar setup
  }
  
  icons() {
    this.playIcon = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M320-273v-414q0-17 12-28.5t28-11.5q5 0 10.5 1.5T381-721l326 207q9 6 13.5 15t4.5 19q0 10-4.5 19T707-446L381-239q-5 3-10.5 4.5T360-233q-16 0-28-11.5T320-273Z"/></svg>';
    this.pauseIcon = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M640-200q-33 0-56.5-23.5T560-280v-400q0-33 23.5-56.5T640-760q33 0 56.5 23.5T720-680v400q0 33-23.5 56.5T640-200Zm-320 0q-33 0-56.5-23.5T240-280v-400q0-33 23.5-56.5T320-760q33 0 56.5 23.5T400-680v400q0 33-23.5 56.5T320-200Z"/></svg>';
    this.seekLeftIcon = '';
    this.seekRightIcon = '';
  }

  setupVideoElement(options) {
    this.videoElement = options.videoElement;
    this.sourceUrl = options.sourceUrl;
    this.poster = options.poster;
    
    this.videoElement.addEventListener('waiting', this.showLoadingSpinner.bind(this));
    this.videoElement.addEventListener('loading', this.showLoadingSpinner.bind(this));
    this.videoElement.addEventListener('playing', this.hideLoadingSpinner.bind(this));
  }
  
  setupPoster(poster) {
    if (this.poster) {
      this.videoElement.poster = this.poster;
    }
  }

  setupMediaSource(options) {
    if (this.sourceUrl.includes('.m3u8')) {
      this.setupHLS();
    } else if (this.sourceUrl.includes('.mpd')) {
      this.setupDASH();
    } else {
      this.videoElement.src = this.sourceUrl;
    }
  }

  setupHLS() {
    this.hls = new Hls();
    this.hls.loadSource(this.sourceUrl);
    this.hls.attachMedia(this.videoElement);
    
    this.hls.on(Hls.Events.LOADING, this.showLoadingSpinner.bind(this));
    this.hls.on(Hls.Events.STALLED, this.showLoadingSpinner.bind(this));
    this.hls.on(Hls.Events.LEVEL_LOADED, this.hideLoadingSpinner.bind(this));
  }

  setupDASH() {
    this.dash = dashjs.MediaPlayer().create();
    this.dash.initialize(this.videoElement, this.sourceUrl, false);
  }

  addOtterTracks(tracks) {
    this.tracks = tracks || [];
    this.tracks.forEach((track) => {
      const trackElement = document.createElement('track');
      trackElement.src = track.src;
      trackElement.kind = track.kind;
      trackElement.label = track.label;
      trackElement.srclang = track.srclang;
      this.videoElement.appendChild(trackElement);
    });
  }
  
  createSpinner() {
    const spinnerContainer = document.createElement('otter-spinner-container');
    this.spinnerElement = document.createElement('otter-spinner');
    spinnerContainer.appendChild(this.spinnerElement);

    // Position the spinner container appropriately (consider using CSS for styling)
    this.videoElement.parentNode.insertBefore(spinnerContainer, this.videoElement);
  }

  showLoadingSpinner() {
    if (this.spinnerElement) {
      this.spinnerElement.style.display = 'flex';
    }
  }

  hideLoadingSpinner() {
    if (this.spinnerElement) {
      this.spinnerElement.style.display = 'none';
    }
  }

  setupPlayPauseEvents() {
    this.videoElement.addEventListener('play', this.handlePlay.bind(this));
    this.videoElement.addEventListener('pause', this.handlePause.bind(this));
  }

  handlePlay() {
    this.isPlaying = true;
    this.isPaused = false;
    this.updatePlayPauseButton();
  }

  handlePause() {
    this.isPlaying = false;
    this.isPaused = true;
    this.updatePlayPauseButton();
  }
  
  setupVolumeControl() {
    const otterVolumeElement = document.querySelector('otter-volume');
    const volumeInput = document.createElement('input');
    volumeInput.type = 'range';
    volumeInput.min = '0';
    volumeInput.max = '1';
    volumeInput.step = '0.01'; // Adjust for finer control (optional)

    // Function to update the slider background size
    function updateSliderBackground(input) {
      const min = parseFloat(input.min);
      const max = parseFloat(input.max);
      const val = parseFloat(input.value);
      input.style.backgroundSize = ((val - min) * 100 / (max - min)) + '% 100%';
    }

    // Update volume on input change
    volumeInput.addEventListener('input', (event) => {
      this.videoElement.volume = event.target.value;
      updateSliderBackground(event.target);
    });

    // Update slider value on volume change
    this.videoElement.addEventListener('volumechange', () => {
      volumeInput.value = this.videoElement.volume;
      updateSliderBackground(volumeInput);
    });

    otterVolumeElement.appendChild(volumeInput);
  }
  
  setupSeekBar() {
    const seekBarContainer = document.querySelector('otter-seek-bar-container');
    const seekBarInput = document.createElement('input');
    seekBarInput.type = 'range';

    // Set default value to 0 (beginning of video)
    seekBarInput.value = '0';

    // Update slider value and video position on input change
    seekBarInput.addEventListener('input', (event) => {
      const newTime = parseFloat(event.target.value);
      this.videoElement.currentTime = newTime;
      updateSeekBarInput(newTime); // Call update function
      updateSliderBackground(seekBarInput);
    });

    // Update slider value on video position change
    this.videoElement.addEventListener('timeupdate', () => {
      const currentTime = this.videoElement.currentTime;
      const duration = this.videoElement.duration;
      updateSeekBarInput(currentTime, duration);
      updateSliderBackground(seekBarInput);
    });

    // Function to update the seek bar input value
    function updateSeekBarInput(currentTime, duration) {
      seekBarInput.value = currentTime.toFixed(2);
      seekBarInput.max = duration.toFixed(2);
    }

    // Function to update the slider background
    function updateSliderBackground(input) {
      const min = parseFloat(input.min);
      const max = parseFloat(input.max);
      const val = parseFloat(input.value);
      input.style.backgroundSize = ((val - min) * 100 / (max - min)) + '% 100%';
    }

    // Calculate dynamic step based on video duration (adjust for finer control)
    const videoDuration = this.videoElement.duration;
    const step = Math.max(0.1, Math.floor(videoDuration / 1000)); // Minimum step of 0.1 seconds

    seekBarInput.min = '0';
    seekBarInput.step = step.toString();

    seekBarContainer.appendChild(seekBarInput);
  }
  
  setupPlayPauseObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'paused') {
          this.isPaused = this.videoElement.paused;
          this.updatePlayPauseButton();
        }
      });
    });
    observer.observe(this.videoElement, { attributes: true, attributeFilter: ['paused'] });
  }

updatePlayPauseButton() {
    const playPauseButton = document.querySelector('otter-button[data-play-pause] button');
    
    if (this.isPaused) {
      playPauseButton.innerHTML = this.playIcon;
    } else {
      playPauseButton.innerHTML = this.pauseIcon;
    }
  }

  setupKeyboardEvents() {
    document.addEventListener('keydown', this.handleKeyboardEvent.bind(this));
  }

  handleKeyboardEvent(event) {
    const volumeChange = 0.01;
    switch (event.key) {
      case '0':
        this.seekToPercentage(0);
        break;
      case '1':
        this.seekToPercentage(10);
        break;
      case '2':
        this.seekToPercentage(20);
        break;
      case '3':
        this.seekToPercentage(30);
        break;
      case '4':
        this.seekToPercentage(40);
        break;
      case '5':
        this.seekToPercentage(50);
        break;
      case '6':
        this.seekToPercentage(60);
        break;
      case '7':
        this.seekToPercentage(70);
        break;
      case '8':
        this.seekToPercentage(80);
        break;
      case '9':
        this.seekToPercentage(90);
        break;
      case 'ArrowUp':
        this.videoElement.volume += volumeChange;
        if (this.videoElement.volume > 1) {
          this.videoElement.volume = 1;
        }
        break;
      case 'ArrowDown':
        this.videoElement.volume -= volumeChange;
        if (this.videoElement.volume < 0) {
          this.videoElement.volume = 0;
        }
        break;
      case 'j':
      case 'ArrowLeft':
        this.seekLeft(10);
        break;
      case 'l':
      case 'ArrowRight':
        this.seekRight(10);
        break;
      case ' ':
      case 'k':
      case 'p':
        this.togglePausePlay();
        break;
      default:
        break;
    }
  }

  play() {
    this.videoElement.play();
  }

  pause() {
    this.videoElement.pause();
  }

  seek(time) {
    this.videoElement.currentTime = time;
  }

  seekLeft(seconds) {
    this.seek(this.videoElement.currentTime - seconds);
  }

  seekRight(seconds) {
    this.seek(this.videoElement.currentTime + seconds);
  }

  seekToPercentage(percentage) {
    this.seek(this.videoElement.duration * (percentage / 100));
  }

  togglePausePlay() {
    if (this.isPaused) {
      this.play();
    } else {
      this.pause();
    }
  }
}


// Inject the player into the Otter layout
const otterElement = document.querySelector('otter');
if (otterElement) {
  const otterLayoutElement = document.querySelector('otter-layout');
  const otterPlayerElement = document.createElement('otter-player');
  const videoElement = document.createElement('video');
  otterPlayerElement.appendChild(videoElement);
  otterLayoutElement.appendChild(otterPlayerElement);

  const otterStructureElement = document.createElement('otter-structure');
  const otterTopElement = document.createElement('otter-top');

  const otterTitle = document.createElement('otter-title');
  otterTitle.innerText = otterElement.getAttribute('title');
  otterTopElement.appendChild(otterTitle);

  const otterCenterElement = document.createElement('otter-center');
  const otterBottomElement = document.createElement('otter-bottom');

  const otterVolumeElement = document.createElement('otter-volume');

  const otterControlsElement = document.createElement('otter-controls');
  
  const seekLeftButton = document.createElement('otter-button');
  const seekLeftButtonInner = document.createElement('button');
  seekLeftButtonInner.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentcolor"><path d="M420-320h-90q-13 0-21.5-8.5T300-350q0-13 8.5-21.5T330-380h70v-40h-40q-8 0-14-6t-6-14q0-8 6-14t14-6h40v-40h-70q-13 0-21.5-8.5T300-530q0-13 8.5-21.5T330-560h90q17 0 28.5 11.5T460-520v160q0 17-11.5 28.5T420-320Zm120 0q-17 0-28.5-11.5T500-360v-160q0-17 11.5-28.5T540-560h80q17 0 28.5 11.5T660-520v160q0 17-11.5 28.5T620-320h-80Zm20-60h40v-120h-40v120ZM480-80q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-440q0-17 11.5-28.5T160-480q17 0 28.5 11.5T200-440q0 117 81.5 198.5T480-160q117 0 198.5-81.5T760-440q0-117-81.5-198.5T480-720h-6l34 34q12 12 11.5 28T508-630q-12 12-28.5 12.5T451-629L348-732q-12-12-12-28t12-28l103-103q12-12 28.5-11.5T508-890q11 12 11.5 28T508-834l-34 34h6q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-440q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-80Z"/></svg>';
  seekLeftButton.appendChild(seekLeftButtonInner);
  seekLeftButton.setAttribute('data-seek-left', '');
  
  const togglePlayPauseButton = document.createElement('otter-button');
  togglePlayPauseButton.setAttribute('data-play-pause', '');
  const togglePlayPauseButtonInner = document.createElement('button');
  togglePlayPauseButton.appendChild(togglePlayPauseButtonInner);
  
  const seekRightButton = document.createElement('otter-button');
  const seekRightButtonInner = document.createElement('button');
  seekRightButtonInner.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentcolor"><path d="M480-80q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-440q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-800h6l-34-34q-12-12-11.5-28t11.5-28q12-12 28.5-12.5T509-891l103 103q12 12 12 28t-12 28L509-629q-12 12-28.5 11.5T452-630q-11-12-11.5-28t11.5-28l34-34h-6q-117 0-198.5 81.5T200-440q0 117 81.5 198.5T480-160q117 0 198.5-81.5T760-440q0-17 11.5-28.5T800-480q17 0 28.5 11.5T840-440q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-80Zm-60-240h-90q-13 0-21.5-8.5T300-350q0-13 8.5-21.5T330-380h70v-40h-40q-8 0-14-6t-6-14q0-8 6-14t14-6h40v-40h-70q-13 0-21.5-8.5T300-530q0-13 8.5-21.5T330-560h90q17 0 28.5 11.5T460-520v160q0 17-11.5 28.5T420-320Zm120 0q-17 0-28.5-11.5T500-360v-160q0-17 11.5-28.5T540-560h80q17 0 28.5 11.5T660-520v160q0 17-11.5 28.5T620-320h-80Zm20-60h40v-120h-40v120Z"/></svg>';
  seekRightButton.appendChild(seekRightButtonInner);
  seekRightButton.setAttribute('data-seek-right', '');

  const playPauseControls = document.createElement('otter-controls-play-pause');
  playPauseControls.appendChild(togglePlayPauseButton);

  otterControlsElement.appendChild(seekLeftButton);
  otterControlsElement.appendChild(playPauseControls);
  otterControlsElement.appendChild(seekRightButton);

  const otterBrightnessElement = document.createElement('otter-brightness');
  const brightnessInput = document.createElement('input');
  brightnessInput.type = 'range';
  brightnessInput.min = '0';
  brightnessInput.max = '1';
  brightnessInput.step = '0.1';
  brightnessInput.value = '1';
  otterBrightnessElement.appendChild(brightnessInput);

  otterCenterElement.appendChild(otterVolumeElement);
  otterCenterElement.appendChild(otterControlsElement);
  otterCenterElement.appendChild(otterBrightnessElement);

  otterStructureElement.appendChild(otterTopElement);
  otterStructureElement.appendChild(otterCenterElement);
  
  const seekBarContainer = document.createElement('otter-seek-bar-container');
  otterBottomElement.appendChild(seekBarContainer);
  
  otterStructureElement.appendChild(otterBottomElement);

  otterLayoutElement.appendChild(otterStructureElement);

  otterElement.appendChild(otterLayoutElement);

  const otterTracks = JSON.parse(otterElement.getAttribute('tracks') || '[]');

  const otterPlayer = new OtterPlayer();
  otterPlayer.initialize({
    videoElement: videoElement,
    sourceUrl: otterElement.getAttribute('src'),
    tracks: otterTracks,
    poster: otterElement.getAttribute('poster'),
  });

  seekLeftButton.addEventListener('click', () => otterPlayer.seekLeft(30));

  togglePlayPauseButton.addEventListener('click', () => {
    otterPlayer.togglePausePlay();
  });

  seekRightButton.addEventListener('click', () => otterPlayer.seekRight(30));
}

const rangeInputs = document.querySelectorAll('input[type="range"]')

function handleInputChange(e) {
  let target = e.target
  if (e.target.type !== 'range') {
    target = document.getElementById('range')
  } 
  const min = target.min
  const max = target.max
  const val = target.value
  
  target.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%'
}

rangeInputs.forEach(input => {
  input.addEventListener('input', handleInputChange)
})