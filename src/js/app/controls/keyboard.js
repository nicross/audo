app.controls.keyboard = {
  game: () => {
    const keys = engine.input.keyboard.get()

    const left = keys.ArrowLeft || keys.KeyA || keys.Numpad4,
      right = keys.ArrowRight || keys.KeyD || keys.Numpad6

    let x = 0

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
  ui: () => {
    const keys = engine.input.keyboard.get(),
      state = {}

    if (keys.Enter || keys.NumpadEnter) {
      state.enter = true
    }

    if (keys.Space) {
      state.space = true
    }

    return state
  },
}
