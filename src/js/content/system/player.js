content.system.player = (() => {
  const pubsub = engine.utility.pubsub.create()

  let acceleration = 0,
    distance = 0,
    lapDistance = 0,
    laps = 0,
    lapTimer = 0,
    relativeVelocity = 0,
    time = 0,
    velocity = content.const.initialVelocity,
    velocityRatio = 0

  function calculateAcceleration() {
    // Accelerates most when in center of road
    const position = engine.position.get(),
      ratio = engine.utility.clamp(Math.abs(position.y) / content.const.roadRadius, 0, 1)

    return 1 - (ratio ** 20)
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

  function calculateVelocityRatio() {
    return engine.utility.clamp(Math.log2(velocity) / Math.log2(content.const.maxVelocity), 0, 1)
  }

  return engine.utility.pubsub.decorate({
    acceleration: () => acceleration,
    addVelocity: function (value = 0) {
      velocity += value
      return this
    },
    distance: () => distance,
    lapDistance: () => lapDistance,
    laps: () => laps,
    relativeVelocity: () => relativeVelocity,
    reset: function () {
      acceleration = 0
      distance = 0
      laps = 0
      time = 0
      velocity = content.const.initialVelocity

      relativeVelocity = calculateRelativeVelocity()
      velocityRatio = calculateVelocityRatio()

      lapDistance = calculateLapDistance()
      lapTimer = calculateLapTimer()

      return this
    },
    time: () => time,
    update: function (delta = 0) {
      acceleration = calculateAcceleration()

      time += delta
      velocity += delta * Math.log(time) * acceleration

      relativeVelocity = calculateRelativeVelocity()
      velocityRatio = calculateVelocityRatio()

      const velocityDelta = velocity * delta

      distance += velocityDelta
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
    velocityRatio: () => velocityRatio,
  }, pubsub)
})()

engine.loop.on('frame', ({delta, paused}) => {
  if (!paused) {
    content.system.player.update(delta)
  }
})

engine.state.on('reset', () => content.system.player.reset())
