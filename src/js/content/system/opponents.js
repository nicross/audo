content.system.opponents = (() => {
  const opponents = []

  let isCollision = false

  function checkCollision(opponent) {
    if (opponent.distance) {
      return false
    }

    // Lenient: only register if moving toward player
    return engine.utility.sign(opponent.x) != engine.utility.sign(opponent.velocity)
  }

  function getOpponentType() {
    return content.prop.opponent.base
  }

  function spawnInitial() {
    const lapDistance = content.system.player.lapDistance() / 2,
      relativeVelocity = content.system.player.relativeVelocity()

    for (let i = 0; i < content.const.minOpponents; i += 1) {
      const opponent = engine.props.create(getOpponentType(), {
        index: i,
        radius: content.const.opponentRadius,
        x: lapDistance / (i + 1),
        y: engine.utility.random.float(-content.const.roadRadius, content.const.roadRadius),
      })

      opponent.velocity.set({
        x: -relativeVelocity,
      })

      opponents.push(opponent)
    }
  }

  function spawnNew() {
    const opponent = engine.props.create(getOpponentType(), {
      index: opponents.length,
      radius: content.const.opponentRadius,
      x: -content.system.player.lapDistance() / 2,
      y: 0,
    })

    opponent.isFresh = true

    opponent.velocity.set({
      x: content.system.player.relativeVelocity(),
    })

    opponents.push(opponent)
  }

  function update() {
    const hasShield = content.system.player.shield.has(),
      isInvincible = content.system.player.invincibility.has(),
      lapDistance = content.system.player.lapDistance() / 2,
      position = engine.position.getVector(),
      relativeVelocity = content.system.player.relativeVelocity()

    let shieldBroken = false

    for (let i = 0; i < opponents.length; i += 1) {
      const opponent = opponents[i]

      if (!isInvincible && !opponent.isShielded && checkCollision(opponent)) {
        if (hasShield) {
          opponent.isShielded = true
          shieldBroken = true
        } else {
          isCollision = true
        }

        opponent.duck()
      }

      if (opponent.distance > lapDistance) {
        if (opponent.isFresh) {
          // Mark as unfresh so it enters the race
          opponent.isFresh = false
          opponent.y = position.y // Force player to move
        } else {
          // Reposition ahead
          opponent.x = lapDistance
          opponent.y = i % 2
            ? engine.utility.random.float(-content.const.roadRadius, content.const.roadRadius)
            : position.y // Force player to move
        }

        opponent.isShielded = false
      }

      opponent.velocity.set({
        x: opponent.isFresh ? relativeVelocity : -relativeVelocity,
      })
    }

    if (shieldBroken) {
      content.system.player.shield.remove()
    }
  }

  return {
    get: () => [...opponents],
    isCollision: () => isCollision,
    onLap: function() {
      if (opponents.length < content.const.maxOpponents) {
        spawnNew()
      }

      return this
    },
    reset: function() {
      isCollision = false
      opponents.length = 0
      return this
    },
    start: function() {
      spawnInitial()
      return this
    },
    update: function() {
      update()
      return this
    },
  }
})()

engine.loop.on('frame', ({ paused }) => {
  if (paused) {
    return
  }

  content.system.opponents.update()
})

engine.state.on('import', () => content.system.opponents.start())
engine.state.on('reset', () => content.system.opponents.reset())

content.system.player.on('lap', () => content.system.opponents.onLap())
