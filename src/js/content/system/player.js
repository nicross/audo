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

    return 1 - (ratio ** 4)
  }

  function calculateVelocityRatio() {
    return engine.utility.clamp(Math.log2(velocity) / Math.log2(content.const.maxVelocity), 0, 1)
  }

  return engine.utility.pubsub.decorate({
    acceleration: () => acceleration,
    addVelocity: function (value = 0) {
      const previous = velocity

      velocity += value
      relativeVelocity += (velocity / previous) - 1

      return this
    },
    distance: () => distance,
    inspect: () => ({
      acceleration,
      distance,
      lapDistance,
      laps,
      lapTimer,
      relativeVelocity,
      time,
      velocity,
      velocityRatio,
    }),
    lapDistance: () => lapDistance,
    laps: () => laps,
    relativeVelocity: () => relativeVelocity,
    reset: function () {
      acceleration = 0
      distance = 0
      laps = 0
      lapDistance = content.const.lapTime * content.const.minRelativeVelocity
      lapTimer = lapDistance
      time = 0
      velocity = content.const.initialVelocity

      velocityRatio = calculateVelocityRatio()
      relativeVelocity = content.const.minRelativeVelocity

      // XXX: Hack for distancePowerHorizon
      engine.const.streamerRadius = lapDistance / 2

      return this
    },
    time: () => time,
    update: function (delta = 0) {
      acceleration = calculateAcceleration()

      time += delta
      velocity += delta * Math.log(time) * acceleration

      velocityRatio = calculateVelocityRatio()
      if (relativeVelocity < content.const.maxRelativeVelocity) {
        relativeVelocity += accelerationDelta / content.const.lapTime
      }


      distance += velocity * delta
      lapTimer -= relativeVelocity * delta

      if (lapTimer < 0) {
        laps += 1
        lapDistance = relativeVelocity * content.const.lapTime
        lapTimer = lapDistance

        // XXX: Hack for distancePowerHorizon
        engine.const.streamerRadius = lapDistance / 2

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
