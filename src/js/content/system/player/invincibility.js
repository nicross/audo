content.system.player.invincibility = (() => {
  let timer = 0

  return {
    add: function (time) {
      timer += time
      return this
    },
    has: () => timer > 0,
    reset: function () {
      timer = 0
      return this
    },
    update: function ({delta}) {
      if (timer > 0) {
        timer -= delta

        if (timer < 0) {
          timer = 0
        }
      }

      return this
    },
  }
})()

engine.state.on('reset', () => content.system.player.invincibility.reset())

engine.loop.on('frame', (e) => {
  if (e.paused) {
    return
  }

  content.system.player.invincibility.update(e)
})
