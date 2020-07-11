app.screen.game = (() => {
  let root

  function handleCollision() {
    engine.loop.pause()
    content.sfx.gameOver()

    // Cut the sounds
    engine.props.reset()

    // TODO: Duration should be length of gameOver sfx (i.e. screen reader accessibility)
    setTimeout(() => app.state.screen.dispatch('gameOver'), 2000)
  }

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
  }

  function onExit() {
    engine.loop.off('frame', onFrame)
    engine.loop.pause()
  }

  function onFrame({paused}) {
    if (paused) {
      return
    }

    if (content.system.opponents.isCollision()) {
      return handleCollision()
    }

    content.system.player.movement.update(
      app.controls.game()
    )
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
