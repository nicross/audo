# Audo
A high-speed endless racing audio game submitted to [GMTK Game Jam 2020](https://itch.io/jam/gmtk-2020).
Developed with [syngen](https://github.com/nicross/syngen).

## Overview
In the lethal futuresport known as **Audo**, there is no such thing as slowing down.
Each racing pod is designed to gradually increase in speed as our contestants vie to be the fastest on the track.
But beware, as things heat up it gets harder to avoid crashing into your competitors!
Be sure to check your rear viewscreen as well, as someone even faster than you could blaze by in the blink of an eye - or smash right into you, obliterating any chance at victory.

### Features
- Fully synthesized dynamic audio
- High-speed drifting and collisions
- Screen reader accessibility

### Controls
Audo is an audio game best experienced with headphones.
Your racer is constantly accelerating.
Press <kbd>A</kbd> and <kbd>D</kbd> or the arrow keys to drift sideways and collect powerups as you avoid opponents.
Also supports standard gamepads.

## Getting started
To get started, please  use [npm](https://nodejs.org) to install the required dependencies:
```sh
npm install
```

### Common tasks
Common tasks have been automated with [Gulp](https://gulpjs.com):

#### Build once
```sh
gulp build
```

#### Build continuously
```sh
gulp watch
```

#### Create distributables
```sh
gulp dist
```

#### Open in Electron
```sh
gulp electron
```

#### Build and open in Electron
```sh
gulp electron-build
```

#### Command line flags
| Flag | Description |
| - | - |
| `--debug` | Suppresses minification. |
