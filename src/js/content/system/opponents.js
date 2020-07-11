content.system.opponents = (() => {
  const opponents = []

  let isCollision = false,
    relativeVelocity = 0

  function calculateRelativeVelocity() {
    return -1
  }

  function getOpponentType() {
    return content.prop.opponent.base
  }

  function spawnInitial() {
    const maxDistance = content.system.laps.distance()

    for (let i = 0; i < content.const.minOpponents; i += 1) {
      opponents.push(
        engine.props.create(getOpponentType(), {
          fresh: false,
          radius: content.const.opponentRadius,
          velocity: relativeVelocity,
          x: maxDistance / i,
          y: engine.utility.random.float(-content.const.roadRadius, content.const.roadRadius),
        })
      )
    }
  }

  function spawnNew() {
    opponents.push(
      engine.props.create(getOpponentType(), {
        fresh: true,
        radius: content.const.opponentRadius,
        velocity: 10, // TODO: Tune, e.g. based on lap count
        x: -content.system.laps.distance(),
        y: engine.utility.random.float(-content.const.roadRadius, content.const.roadRadius),
      })
    )
  }

  function update() {
    const maxDistance = content.system.laps.distance()

    for (const opponent of opponents) {
      if (!opponent.distance) {
        isCollision = true
        return
      }

      if (opponent.distance > maxDistance) {
        if (opponent.fresh) {
          // Mark as unfresh so it enters the race
          opponent.fresh = false
        } else {
          // Reposition ahead
          opponent.x = maxDistance
          opponent.y = engine.utility.random.float(-roadWidth, roadWidth)
        }
      }

      if (!opponent.fresh) {
        // Update velocity
        opponent.velocity = relativeVelocity
      }
    }
  }

  return {
    get: () => [...opponents],
    isCollision: () => isCollision,
    onLap: function () {
      if (opponents.length < content.const.maxOpponents) {
        spawnNew()
      }

      return this
    },
    reset: function () {
      isCollision = false
      relativeVelocity = 0
      spawnInitial()
      return this
    },
    update: function () {
      relativeVelocity = calculateRelativeVelocity()
      update()
      return this
    },
  }
})()

engine.loop.on('frame', () => content.system.opponents.update())
engine.state.on('reset', () => content.system.opponents.reset())

content.system.laps.on('lap', () => content.system.opponents.onLap())
