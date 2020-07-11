content.system.laps = (() => {
  const pubsub = engine.utility.pubsub.create()

  let count = 0,
    distance = 0,
    timer = 0

  function calculateDistance() {
    // TODO: Some math, e.g. divide timer by max relative velocity
    return 100
  }

  function calculateTimer() {
    return engine.utility.scale(Math.min(count, content.const.lapsMaxCount), 0, content.const.lapsMaxCount, content.const.lapsMaxTimer, content.const.lapsMinTimer)
  }

  return engine.utility.pubsub.decorate({
    count: () => count,
    distance: () => distance,
    reset: function () {
      count = 0
      timer = calculateTimer()
      distance = calculateDistance()
      return this
    },
    timer: () => timer,
    update: function (delta) {
      timer -= delta

      if (timer <= 0) {
        count += 1
        timer = calculateTimer()
        distance = calculateDistance()

        pubsub.emit('lap')
        content.sfx.lap()
      }

      return this
    },
  }, pubsub)
})()

engine.loop.on('frame', () => content.system.laps.update())
engine.state.on('reset', () => content.system.laps.reset())
