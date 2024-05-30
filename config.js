var config = {}

// total seconds
config.duration = 4.0;
config.defaultPlaybackRate = 1.2;

// seconds as min/max bounds, min default 0, max default config.duration
config.voices = [
    {image: 'BWTM.png', file: 'bss_marcos_maestro_voice_', count:30, time: 1.45, velocity: 0.8, y: 62},
    {image: 'Music.png', file: 'bss_marcos_maestro_music_', count:30, time: 1.45, velocity: 0.8, y: 413},  
    {image: 'Melody.png', file: 'bss_marcos_maestro_melody_', count:30, time: 1.45, velocity: 0.8, y: 722}, 
    {image: 'Spice.png', file: 'bss_marcos_maestro_sting_', count:30, min:[0.0,2.3], max:[0.6,3.2]}
];

config.voiceCount = config.voices.length;

// Order of precedence: image, color, default gray (if undefined)
config.backgroundColor = '#D7062E';
config.backgroundImage = 'background.png';
config.sliderColor = '#D7062E';
config.sliderTrack = '#4C1C1C';
config.tapDelay = 150;
