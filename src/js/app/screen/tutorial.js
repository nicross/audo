app.screen.tutorial = (() => {
  let root,
    start

  function onEnter() {
    app.utility.focus.set(root)
    engine.loop.on('frame', onFrame)
  }

  function onExit() {
    engine.loop.off('frame', onFrame)
  }

  function onFrame() {
    const controls = app.controls.ui()

    if (controls.enter && app.utility.focus.is(start)) {
      // Native button click
      return
    }

    if (controls.confirm || controls.enter || controls.space) {
      onStartClick()
    }
  }

  function onStartClick() {
    app.state.screen.dispatch('start')
  }

  return {
    activate: function () {
      root = document.querySelector('.a-tutorial')

      start = root.querySelector('.a-tutorial--start')
      start.addEventListener('click', onStartClick)

      app.utility.focus.trap(root)

      app.state.screen.on('enter-tutorial', onEnter)
      app.state.screen.on('exit-tutorial', onExit)

      return this
    },
  }
})()

app.once('activate', () => app.screen.tutorial.activate())
