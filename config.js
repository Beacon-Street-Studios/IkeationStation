var config = {}

// total seconds
config.duration = 4.0;
config.defaultPlaybackRate = 1.2;

// seconds as min/max bounds, min default 0, max default config.duration
config.voices = [
    {image: 'melody.png', file: 'bss_ikea_ikeation_melody_', count:10, time: 1.45, velocity: 0.8, y: 40}, 
    {image: 'music.png', file: 'bss_ikea_ikeation_music_', count:10, time: 1.45, velocity: 0.8, y: 326},  
    {image: 'drum.png', file: 'bss_ikea_ikeation_drum_', count:10, time: 1.45, velocity: 0.8, y: 559},
    {image: 'voice.png', file: 'bss_ikea_ikeation_voice_', count:10, time: 1.45, velocity: 0.8, y: 825},
    {image: 'jaha.png', file: 'bss_ikea_ikeation_jaha_', count:10, min:[0.0,2.3], max:[0.6,3.2]}
];

config.voiceCount = config.voices.length;

// Order of precedence: image, color, default gray (if undefined)
// config.backgroundColor = '#D7062E';
config.backgroundImage = 'background.png';
config.sliderColor = '#D7062E';
config.sliderTrack = '#4C1C1C';
config.tapDelay = 150;
