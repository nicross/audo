content.system.player = (() => {
  const pubsub = engine.utility.pubsub.create()

  let distance = 0,
    lapDistance = 0,
    laps = 0,
    lapTimer = 0,
    relativeVelocity = 0,
    time = 0,
    velocity = content.const.initialVelocity

  function calculateLapDistance() {
    const lapTime = Math.max(30, engine.utility.scale(laps, 0, 15, 60, 30))
    return Math.abs(relativeVelocity) * lapTime
  }

  function calculateLapTimer() {
    return lapDistance * velocity
  }

  function calculateRelativeVelocity() {
    return Math.log(velocity)
  }

  return engine.utility.pubsub.decorate({
    distance: () => distance,
    lapDistance: () => lapDistance,
    laps: () => laps,
    increment: function (value = 0) {
      velocity += value
      return this
    },
    relativeVelocity: () => relativeVelocity,
    reset: function () {
      distance = 0
      laps = 0
      time = 0
      velocity = content.const.initialVelocity

      relativeVelocity = calculateRelativeVelocity()
      lapDistance = calculateLapDistance()
      lapTimer = calculateLapTimer()

      return this
    },
    time: () => time,
    update: function (delta = 0) {
      time += delta
      velocity += delta * Math.log(time)

      const velocityDelta = velocity * delta

      distance += velocityDelta
      relativeVelocity = calculateRelativeVelocity()

      lapTimer -= velocityDelta

      if (lapTimer < 0) {
        laps += 1
        lapDistance = calculateLapDistance()
        lapTimer = calculateLapTimer()
        pubsub.emit('lap')
        content.sfx.lap()
      }

      return this
    },
    velocity: () => velocity,
  }, pubsub)
})()

engine.loop.on('frame', ({delta, paused}) => {
  if (!paused) {
    content.system.player.update(delta)
  }
})

engine.state.on('reset', () => content.system.player.reset())
