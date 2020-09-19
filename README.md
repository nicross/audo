# Audo
A high-speed endless racing audio game submitted to [GMTK Game Jam 2020](https://itch.io/jam/gmtk-2020).
Developed with [syngen](https://github.com/nicross/syngen).

## How to Play
Welcome to the lethal futuresport known as Audo.

Your racer accelerates fastest in the center lane and is destroyed when it collides with an opponent.
After each lap an opponent enters the fray and a power-up is spawned in the center lane.
Collecting the power-up grants a shield which absorbs your next collision.
Subsequent power-ups while shielded grant a 50% speed boost.

Stay close to the center, collect speed boosts, and drift sideways to avoid opponents. Will you become the fastest in the galaxy?

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
