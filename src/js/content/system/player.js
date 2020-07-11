content.system.player = (() => {
  const pubsub = engine.utility.pubsub.create()

  let distance = 0,
    lapDistance = 0,
    laps = 0,
    lapTimer = 0,
    relativeVelocity = 0,
    time = 0,
    velocity = content.const.initialVelocity

  function calculateAccelerationCoefficient() {
    // Accelerates most when in center of road
    const position = engine.position.get(),
      ratio = Math.abs(position.y) / content.const.roadRadius

    return 1 - (ratio ** 10)
  }

  function calculateLapDistance() {
    return Math.abs(relativeVelocity) * content.const.lapTime
  }

  function calculateLapTimer() {
    return content.const.lapTime * velocity
  }

  function calculateRelativeVelocity() {
    return Math.log(velocity) / Math.log(1.5)
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
      const acceleration = calculateAccelerationCoefficient()

      time += delta
      velocity += delta * Math.log(time) * acceleration

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
