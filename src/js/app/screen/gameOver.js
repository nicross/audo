app.screen.gameOver = (() => {
  let restart,
    root

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
    const controls = app.controls.ui()

    if (controls.enter && app.utility.focus.is(restart)) {
      // Native button click
      return
    }

    if (controls.confirm || controls.enter || controls.space) {
      onRestartClick()
    }
  }

  function onRestartClick() {
    app.state.screen.dispatch('restart')
  }

  return {
    activate: function () {
      root = document.querySelector('.a-gameOver')

      restart = document.querySelector('.a-gameOver--restart')
      restart.addEventListener('click', onRestartClick)

      app.utility.focus.trap(root)

      app.state.screen.on('enter-gameOver', onEnter)
      app.state.screen.on('exit-gameOver', onExit)

      return this
    },
  }
})()

app.once('activate', () => app.screen.gameOver.activate())
