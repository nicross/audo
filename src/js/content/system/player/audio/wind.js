content.system.player.audio.wind = (() => {
  const context = engine.audio.context(),
    filter = context.createBiquadFilter(),
    merger = context.createChannelMerger(2),
    mix = context.createGain()

  engine.audio.synth.createBuffer({
    buffer: engine.audio.buffer.noise.brown(),
    gain: 0.5,
  }).connect(merger, 0, 0)

  engine.audio.synth.createBuffer({
    buffer: engine.audio.buffer.noise.brown(),
    gain: 0.5,
  }).connect(merger, 0, 1)

  merger.connect(filter)
  filter.connect(mix)
  mix.connect(content.system.player.audio.bus())

  return {
    reset: function () {
      filter.frequency.value = engine.const.maxFrequency
      mix.gain.value = engine.const.zeroGain

      return this
    },
    update: function () {
      const strength = content.system.player.velocityRatio()

      filter.frequency.value = engine.utility.lerpExp(engine.const.minFrequency, engine.const.maxFrequency, strength, 2)
      mix.gain.value = engine.utility.fromDb(engine.utility.lerp(-30, -18, strength))

      return this
    },
  }
})()
