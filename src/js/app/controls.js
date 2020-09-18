app.controls = (() => {
  let uiCache = {},
    uiDelta = {}

  let gameCache = {
    x: 0,
  }

  return {
    game: () => ({...gameCache}),
    ui: () => ({...uiDelta}),
    update: function () {
      return this.updateGame().updateUi()
    },
    updateGame: function () {
      gameCache = {
        x: 0,
        ...this.gamepad.game(),
        ...this.keyboard.game(),
        ...this.touch.game(),
      }

      return this
    },
    updateUi: function () {
      const values = {
        ...this.gamepad.ui(),
        ...this.keyboard.ui(),
      }

      uiDelta = {}

      for (const key in values) {
        if (!uiCache[key]) {
          uiDelta[key] = values[key]
        }
      }

      uiCache = values

      return this
    },
  }
})()

engine.loop.on('frame', () => app.controls.update())
