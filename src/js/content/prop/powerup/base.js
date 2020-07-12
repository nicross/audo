content.prop.powerup.base = engine.prop.base.invent({
  name: 'powerup/base',
  applyBoost: function () {
    const velocity = content.system.player.getVelocity()
    content.system.player.addVelocity(velocity * 0.5)
    content.sfx.boost()
    return this
  },
  applyEffect: function () {
    if (content.system.player.shield.has()) {
      this.applyBoost()
    } else {
      this.applyShield()
    }

    return this
  },
  applyShield: function () {
    content.system.player.shield.grant()
    content.sfx.shieldUp()
    return this
  },
})
