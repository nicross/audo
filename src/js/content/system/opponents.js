content.system.opponents = (() => {
  const maxDistance = 100 // TODO: Get from lap system?

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
    for (let i = 0; i < content.const.minOpponents; i += 1) {
      opponents.push(
        engine.props.create(getOpponentType(), {
          fresh: false,
          radius: content.const.positionRadius,
          velocity: relativeVelocity,
          x: maxDistance / i,
          y: engine.utility.random.float(-content.const.roadRadius, content.const.roadRadius),
        })
      )
    }
  }

  function update() {
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
    isCollision: () => isCollision,
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
