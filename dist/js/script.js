// Init SpeechSynth API
const synth = window.speechSynthesis;

// DOM elements
const textForm = document.querySelector("form");
const textInput = document.querySelector("#text-input");
const voiceSelect = document.querySelector("#voice-select");
const rate = document.querySelector("#rate");
const rateValue = document.querySelector("#rate-value");
const pitch = document.querySelector("#pitch");
const pitchValue = document.querySelector("#pitch-value");
const body = document.querySelector("body");
const stopButton = document.querySelector("#stop-btn");

// init voices array
let voices = [];

function getVoices() {
  voices = synth.getVoices();

  // loop through voices and create and option in select input for each one
  voices.forEach((voice) => {
    // create option element
    const option = document.createElement("option");

    // fill the option element with voice and language
    option.textContent = voice.name + " (" + voice.lang + ")";

    // set needed option attributes
    option.setAttribute("data-lang", voice.lang);
    option.setAttribute("data-name", voice.name);

    // add each option element into voice select input
    voiceSelect.appendChild(option);
  });
}

getVoices();
// synth.getVoices() is async in nature, that is why it does not load voices immidiately
// so we use this conditonal block and use a callback to run our getVoices function
// when voices are available
if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = getVoices;
}

// Speak
function speak() {
  // if already speaking
  if (synth.speaking) {
    console.error("Already speaking...");
    return;
  }

  if (textInput.value !== "") {
    // Get speak text
    const speakText = new SpeechSynthesisUtterance(textInput.value);

    // Speak end
    speakText.onend = (e) => {
      console.log("Done speaking... ");
      body.style.background = "#141414";
    };

    // Speak error
    speakText.onerror = (e) => {
      console.error("Something went wrong!");
    };

    // Selected voice
    const SelectedVoice =
      voiceSelect.selectedOptions[0].getAttribute("data-name");

    // Loop through voices to get the currently selected voice
    voices.forEach((voice) => {
      if (voice.name === SelectedVoice) {
        speakText.voice = voice;
      }
    });

    // Setting the values of pitch and rate sliders
    speakText.rate = rate.value;
    speakText.pitch = pitch.value;

    // SPEAK
    synth.speak(speakText);

    // Add background img
    body.style.background = "#141414 url(img/wave.gif)";
    body.style.backgroundRepeat = "repeat-x";
    body.style.backgroundSize = "100% 100%";
  }
}

// EVENT LISTENERS

// text form submit
textForm.addEventListener("submit", (e) => {
  e.preventDefault();
  speak();
  // removes autofocus from the input
  textInput.blur();
});

// rate value change
rate.addEventListener("change", (e) => (rateValue.textContent = rate.value));

// pitch value change
pitch.addEventListener("change", (e) => (pitchValue.textContent = pitch.value));

// voice select change
voiceSelect.addEventListener("change", (e) => speak());

// STOP
stopButton.addEventListener("click", (e) => {
  if (synth.speaking) {
    synth.cancel();
    body.style.background = "#141414";
  }
});
