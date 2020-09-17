content.prop.powerup.base = engine.prop.base.invent({
  name: 'powerup/base',
  onConstruct: function () {
    const frequency = engine.utility.midiToFrequency(72)
    const depth = frequency / 2

    this.synth = engine.audio.synth.createMod({
      amodDepth: 0.5,
      amodFrequency: 16,
      amodType: 'square',
      carrierGain: 0.5,
      carrierFrequency: frequency + (depth / 2),
      carrierType: 'triangle',
      fmodDepth: depth,
      fmodType: 'sawtooth',
      fmodFrequency: 4,
    }).connect(this.output)

    this.synth.param.gain.value = engine.utility.fromDb(-3)
  },
  onDestroy: function () {
    this.synth.stop()
  },
  applyBoost: function () {
    const velocity = content.system.player.velocity()
    content.system.player.addVelocity(velocity * 0.5)
    content.system.player.invincibility.add(3)
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
    content.system.player.invincibility.add(1)
    return this
  },
  setCooldown: function (state) {
    this.isCooldown = Boolean(state)

    if (state) {
      engine.audio.ramp.exponential(this.synth.param.gain, engine.const.zeroGain, 1)
    } else {
      engine.audio.ramp.linear(this.synth.param.gain, engine.utility.fromDb(-3), 1)
    }
  }
})
