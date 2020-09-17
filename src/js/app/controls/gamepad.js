app.controls.gamepad = {
  game: function () {
    const {digital: buttons} = engine.input.gamepad.get()

    let x = 0

    x += engine.input.gamepad.getAxis(0)
    x += engine.input.gamepad.getAxis(2)

    x -= engine.input.gamepad.getAnalog(6)
    x += engine.input.gamepad.getAnalog(7)

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
      x: engine.utility.clamp(x, -1, 1),
    }
  },
  ui: function () {
    const {digital: buttons} = engine.input.gamepad.get()
    const state = {}

    if (buttons[0] || buttons[8] || buttons[9]) {
      state.confirm = true
    }

    return state
  },
}
