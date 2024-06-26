// const player = new Tone.Player("https://tonejs.github.io/audio/berklee/gong_1.mp3").toDestination();
// Tone.loaded().then(() => {
// 	player.start();
// });

//const synth = new Tone.Synth().toDestination();

// let noteRanges = {
//     0 : ['C1', 'C#1'],
//     1 : ['C2', 'C#2'],
//     2 : ['C3', 'C#4'],
//     3 : ['C4', 'C#4'],
// }

const range = (start, stop, step=1) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);


let sampleUrls = {}
let noteRanges = {}

let midiNumber = 0;
let midiStart = midiNumber;

let part;
let playbackRate = config.defaultPlaybackRate;
let nextPlaybackRate = config.defaultPlaybackRate;

config.voices.forEach( (voice, index) => {
    midiStart = midiNumber;
    for (var i = 1; i <= voice.count; i++) {
        let key = Tone.Frequency(midiNumber, "midi").toNote()
        sampleUrls[key] = `${voice.file}${i}.wav`;
        midiNumber++; 
    }
    noteRanges[index] = range(midiStart, midiNumber - 1);
});

const sampler = new Tone.Sampler({
	urls: sampleUrls,
	release: 1,
	baseUrl: "./audio/",
}).toDestination();

function progress() {
    // return Tone.Transport.seconds / config.duration;
    return Tone.Transport.seconds / (config.duration / playbackRate) ;
}

function createPart(values) {
    if (typeof part !== "undefined") { 
        part.dispose()
    }
    part = new Tone.Part(((time, value) => {
        if (value.muted == false) {
            sampler.triggerAttackRelease(value.note, 4.0, time, value.velocity)
            value.noteImg.bounce();
        }
    }), values);
    
    part.playbackRate = playbackRate;
    part.start(0);
}

function playPart() {
    Tone.start();
    Tone.Transport.seconds = 0;
    Tone.Transport.start();
    let duration = config.duration / playbackRate;
    Tone.Transport.stop("+" + duration);
}

function stop() {
    Tone.Transport.seconds = 0;
    Tone.Transport.stop();
}

function randomNotes(length = config.voiceCount) {
    // return Array.from([0,1,2,3], (i) => randomNote(i));
    // return Array.from({length: length}, (_, i) => randomNote(i));
    let notes = fixedSet(config.voiceCount - 1);
    notes.push(randomNote(config.voiceCount - 1));
    return notes;
}

function fixedSet(length, startIndex=0) {
    let noteSet = [];
    let fixed = true;

    let noteIndex = Math.floor(Math.random() * noteRanges[startIndex].length);

    for(var i = startIndex; i < startIndex+length; i++) {
        let time = config.voices[i].time;
        let velocity = config.voices[i].velocity;
        let muted = config.voices[i].velocity ?? i > 0 ? Math.random() > 0.5 : false;
        let note = new NoteValue(time, velocity, i, noteIndex, fixed, muted);
        noteSet.push(note);
    }

    return noteSet;
}
  
function randomNote(voiceIndex) {
    let fixed = false;

    let time;
    if (Object.hasOwn(config.voices[voiceIndex], 'time')) {
        time = config.voices[voiceIndex].time;
        fixed = true;
    } else {
        let min = config.voices[voiceIndex].min ?? 0.0;
        let max = config.voices[voiceIndex].max ?? (config.duration * 0.9);

        if ( Array.isArray(min) && Array.isArray(max) ) {
            let index = Math.floor(Math.random() * min.length);
            min = min[index];
            max = max[index];
        }
    
        time = min + Math.random() * (max - min);
    }

    let velocity;
    if (Object.hasOwn(config.voices[voiceIndex], 'velocity')) {
        fixed = true;
        velocity = config.voices[voiceIndex].velocity;
    } else {
        velocity = Math.random() * 0.4 + 0.5;
    }
    
    let noteIndex = Math.floor(Math.random() * noteRanges[voiceIndex].length);
    let note = new NoteValue(time, velocity, voiceIndex, noteIndex, fixed);
    return note;
}

function randomTimeinMeasures() {
    let sixteenths = Math.floor(Math.random() * partDuration);
    let inSixteenths = sixteenths;
    let measures = Math.floor(sixteenths / 16);
    sixteenths %= 16;
    let quarters = Math.floor(sixteenths / 4);
    sixteenths %= 4;
    let time = measures + ":" + quarters + ":" + sixteenths;

    return {time, inSixteenths}
}

class NoteValue {
    constructor(time, velocity, voiceIndex, noteIndex, fixed=false, muted=false) {
        this.time = time;
        this.velocity = velocity;
        this.voiceIndex = voiceIndex;
        this.noteIndex = noteIndex;
        this.fixed = fixed;
        this.muted = muted;
        this.noteImg = undefined;
    }

    get note() {
        let midiNumber = parseInt(noteRanges[this.voiceIndex][this.noteIndex]);
        return Tone.Frequency(midiNumber, "midi").toNote()
    }

    nextNoteIndex() {
        this.noteIndex += 1;
        this.noteIndex %= noteRanges[this.voiceIndex].length;
        if (this.muted == false) {
            this.previewSound();
        }
    }

    previousNoteIndex() {
        this.noteIndex += noteRanges[this.voiceIndex].length - 1;
        this.noteIndex %= noteRanges[this.voiceIndex].length;
        this.previewSound();
    }

    previewSound() {
        sampler.triggerAttackRelease(this.note, 4.0, undefined, this.velocity);
    }

}