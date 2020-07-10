app.screen.game = (() => {
  let root

  function onEnter() {
    app.utility.focus.set(root)
    engine.loop.on('frame', onFrame)

    // TODO: Update score
    // TODO: Update highscore
  }

  function onExit() {
    engine.loop.off('frame', onFrame)
  }

  function onFrame() {
    // TODO: Handle loss?

    const controls = app.controls.game()

    // TODO: Handle controls
  }

  return {
    activate: function () {
      root = document.querySelector('.a-game')
      app.utility.focus.trap(root)

      app.state.screen.on('enter-game', onEnter)
      app.state.screen.on('exit-game', onExit)

      return this
    },
  }
})()

app.once('activate', () => app.screen.game.activate())
