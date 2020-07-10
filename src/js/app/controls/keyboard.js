'use strict'

app.controls.keyboard = (() => {
  const controls = {
    ArrowLeft: false,
    ArrowRight: false,
    Enter: false,
    KeyD: false,
    KeyW: false,
    Numpad4: false,
    Numpad6: false,
    NumpadEnter: false,
    Space: false,
  }

  window.addEventListener('keydown', (e) => {
    if (e.repeat) {
      return
    }

    if (e.code in controls) {
      controls[e.code] = true
    }
  })

  window.addEventListener('keyup', (e) => {
    if (e.code in controls) {
      controls[e.code] = false
    }
  })

  return {
    game: () => {
      const left = controls.LeftArrow || controls.KeyA || controls.Numpad4,
        right = controls.RightArrow || controls.KeyD || controls.Numpad6

      let x = 0

      if (left && !right) {
        x = -1
      } else if (right && !left) {
        x = 1
      }

      return {
        x,
      }
    },
    reset: function () {
      Object.keys(controls)
        .forEach((key) => controls[key] = false)

      return this
    },
    ui: () => {
      const state = {}

      if (controls.Enter || controls.NumpadEnter) {
        state.enter = true
      }

      if (controls.Space) {
        state.space = true
      }

      return state
    },
  }
})()