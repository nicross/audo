app.controls.gamepad = {
  deadzone: (input, threshold = 0.1875) => {
    const ratio = (Math.abs(input) - threshold) / (1 - threshold),
      sign = input > 0 ? 1 : -1

    return ratio > 0 ? sign * ratio : 0
  },
  game: function () {
    const gamepads = navigator.getGamepads()

    if (!gamepads.length) {
      return {}
    }

    const buttons = {}

    let x = 0

    for (let i = 0; i < gamepads.length; i += 1) {
      const gamepad = gamepads[i]

      if (!gamepad) {
        continue
      }

      if (0 in gamepad.axes && 1 in gamepad.axes) {
        x += this.deadzone(gamepad.axes[0])
      }

      gamepad.buttons.forEach((button, i) => {
        buttons[i] |= button.pressed
      })
    }

    const left = buttons[2] || buttons[4] || buttons[14],
      right = buttons[1] || buttons[5] || buttons[15]

    if (left && !right) {
      x = -1
    } else if (right && !left) {
      x = 1
    }

    if (!x) {
      return {}
    }

    return {
      x,
    }
  },
  ui: function () {
    const gamepads = navigator.getGamepads()

    if (!gamepads.length) {
      return {}
    }

    const buttons = {},
      state = {}

    for (let i = 0; i < gamepads.length; i += 1) {
      const gamepad = gamepads[i]

      if (!gamepad) {
        continue
      }

      gamepad.buttons.forEach((button, i) => {
        buttons[i] |= button.pressed
      })
    }

    if (buttons[0] || buttons[8] || buttons[9]) {
      state.confirm = true
    }

    return state
  },
}
