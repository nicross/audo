content.system.player.audio.wind = (() => {
  const synth = engine.audio.synth.createBuffer({
    buffer: engine.audio.buffer.noise.brown(),
  }).filtered({
    frequency: engine.const.maxFrequency,
  }).connect(content.system.player.audio.bus())

  return {
    reset: function () {
      synth.filter.frequency.value = engine.const.maxFrequency
      synth.param.gain.value = engine.const.zeroGain

      return this
    },
    update: function () {
      const strength = content.system.player.velocityRatio()

      synth.filter.frequency.value = engine.utility.lerpExp(engine.const.minFrequency, engine.const.maxFrequency, strength, 2)
      synth.param.gain.value = engine.utility.fromDb(engine.utility.lerp(-36, -18, strength))

      return this
    },
  }
})()
