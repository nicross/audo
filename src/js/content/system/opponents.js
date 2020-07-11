content.system.opponents = (() => {
  const opponents = []

  let isCollision = false

  function getOpponentType() {
    return content.prop.opponent.base
  }

  function spawnInitial() {
    const lapDistance = content.system.player.lapDistance(),
      relativeVelocity = content.system.player.relativeVelocity()

    for (let i = 0; i < content.const.minOpponents; i += 1) {
      const opponent = engine.props.create(getOpponentType(), {
        radius: content.const.opponentRadius,
        x: lapDistance / (i + 1),
        y: engine.utility.random.float(-content.const.roadRadius, content.const.roadRadius),
      })

      opponent.velocity = -relativeVelocity
      opponents.push(opponent)
    }
  }

  function spawnNew() {
    const opponent = engine.props.create(getOpponentType(), {
      radius: content.const.opponentRadius,
      x: -content.system.player.lapDistance(),
      y: engine.utility.random.float(-content.const.roadRadius, content.const.roadRadius),
    })

    opponent.isFresh = true
    opponent.velocity = content.system.player.relativeVelocity()

    opponents.push(opponent)
  }

  function update() {
    const lapDistance = content.system.player.lapDistance(),
      relativeVelocity = content.system.player.relativeVelocity()

    for (const opponent of opponents) {
      if (!opponent.distance) {
        isCollision = true
        return
      }

      if (opponent.distance > lapDistance) {
        if (opponent.isFresh) {
          // Mark as unfresh so it enters the race
          opponent.isFresh = false
        } else {
          // Reposition ahead
          opponent.x = lapDistance
          opponent.y = engine.utility.random.float(-content.const.roadRadius, content.const.roadRadius)
        }
      }

      opponent.velocity = opponent.isFresh
        ? relativeVelocity
        : -relativeVelocity
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
      spawnInitial()
      return this
    },
    update: function () {
      update()
      return this
    },
  }
})()

engine.loop.on('frame', ({paused}) => {
  if (paused) {
    return
  }

  content.system.opponents.update()
})

engine.state.on('reset', () => content.system.opponents.reset())
content.system.player.on('lap', () => content.system.opponents.onLap())
