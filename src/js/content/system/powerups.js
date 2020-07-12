content.system.powerups = (() => {
  let powerup

  function getPowerupType() {
    return content.prop.powerup.base
  }

  return {
    get: () => powerup,
    onLap: function () {
      powerup.setCooldown(false)
      powerup.x = content.system.player.lapDistance() * engine.utility.random.float(1/3, 2/3)
      return this
    },
    reset: function () {
      powerup = null
      return this
    },
    start: function () {
      powerup = engine.props.create(getPowerupType(), {
        radius: content.const.powerupRadius,
        x: content.system.player.lapDistance() * engine.utility.random.float(1/3, 2/3),
        y: 0,
      })

      powerup.velocity = -content.system.player.relativeVelocity()

      return this
    },
    update: function () {
      if (!powerup.distance && !powerup.isCooldown) {
        powerup.applyEffect().setCooldown(true)
      }

      powerup.velocity = -content.system.player.relativeVelocity()

      return this
    },
  }
})()

engine.loop.on('frame', ({paused}) => {
  if (paused) {
    return
  }

  content.system.powerups.update()
})

engine.state.on('import', () => content.system.powerups.start())
engine.state.on('reset', () => content.system.powerups.reset())

content.system.player.on('lap', () => content.system.powerups.onLap())
