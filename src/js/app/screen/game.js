app.screen.game = (() => {
  let root

  function onEnter() {
    app.utility.focus.set(root)
    engine.loop.on('frame', onFrame)

    engine.state.import({
      position: {
        x: 0,
        y: 0,
      },
    })

    engine.loop.resume()

    // XXX: Short circuit to test gameOver screen
    setTimeout(() => app.state.screen.dispatch('gameOver'), 2000)
  }

  function onExit() {
    engine.loop.off('frame', onFrame)
    engine.loop.pause()
  }

  function onFrame() {
    // TODO: Check collisions?

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
