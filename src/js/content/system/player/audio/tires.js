content.system.player.audio.tires = (() => {
  const binaural = engine.audio.binaural.create()

  const synth = engine.audio.synth.createFm({
    carrierFrequency: engine.utility.midiToFrequency(60),
    carrierType: 'sawtooth',
    modDepth: engine.utility.midiToFrequency(43),
    modFrequency: 0,
    modType: 'sawtooth',
  }).shaped(
    engine.audio.shape.hot()
  ).filtered({
    frequency: engine.utility.midiToFrequency(72),
  })

  binaural.from(synth).to(content.system.player.audio.bus())

  return {
    reset: function () {
      binaural.update({
        delta: engine.const.zeroTime,
        x: 0,
        y: 0,
      })

      synth.param.mod.frequency.value = 0
      synth.param.gain.value = 0

      return this
    },
    update: function ({delta}) {
      const movement = engine.movement.get(),
        strength = movement.velocity / engine.const.movementMaxVelocity

      binaural.update({
        delta,
        x: 0,
        y: (strength ** 2) * -movement.angle * engine.const.binauralHeadWidth,
      })

      engine.audio.ramp.linear(synth.param.gain, engine.utility.fromDb(engine.utility.lerpExp(-36, -21, strength, 1/4)), delta)
      engine.audio.ramp.linear(synth.param.mod.frequency, engine.utility.lerp(10, 60, strength), delta)

      return this
    },
  }
})()
