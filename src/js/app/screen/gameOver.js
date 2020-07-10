app.screen.gameOver = (() => {
  let restart,
    root

  function onEnter() {
    app.utility.focus.set(root)
    engine.loop.on('frame', onFrame)

    updateScores()
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

  function updateScores() {
    // XXX: Lazy

    // TODO: Get real score from game
    const highscore = app.storage.getHighscore(),
      score = engine.utility.random.integer(highscore / 2, highscore * 2)

    const isHighscore = score > highscore

    if (isHighscore) {
      app.storage.setHighscore(score)
    }

    root.querySelector('.a-gameOver--highscore').hidden = isHighscore
    root.querySelector('.a-gameOver--success').hidden = !isHighscore

    root.querySelector('.a-gameOver--scoreValue').innerHTML = app.utility.number.format(score)

    root.querySelector('.a-gameOver--highscoreValue').innerHTML = app.utility.number.format(
      app.storage.getHighscore()
    )
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
