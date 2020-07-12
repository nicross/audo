content.system.player.audio.road = (() => {
  const binaural = engine.audio.binaural.create()

  const synth = engine.audio.synth.createAmBuffer({
    buffer: engine.audio.buffer.noise.white(),
    carrierGain: 1,
    modDepth: 0,
    modFrequency: 0,
    modType: 'triangle',
  }).filtered()

  binaural.from(synth).to(content.system.player.audio.bus())

  return {
    reset: function () {
      binaural.update({
        delta: engine.const.zeroTime,
        x: 0,
        y: 0,
      })

      synth.filter.frequency.value = 20
      synth.param.gain.value = engine.const.zeroGain

      return this
    },
    update: function ({delta}) {
      const acceleration = content.system.player.acceleration(),
        accelerationExp = (1 - acceleration) ** 2,
        position = engine.position.get(),
        velocityRatio = content.system.player.velocityRatio()

      binaural.update({
        delta,
        x: 0,
        y: engine.utility.sign(position.y) * accelerationExp * engine.const.binauralHeadWidth,
      })

      synth.filter.frequency.value = engine.utility.lerp(20, 400, accelerationExp)
      synth.param.gain.value = (1 - acceleration) * engine.utility.fromDb(engine.utility.lerp(-3, -9, accelerationExp))

      synth.param.carrierGain.value = 1 - ((1 - accelerationExp) / 2)
      synth.param.mod.depth.value = (1 - accelerationExp) / 2
      synth.param.mod.frequency.value = engine.utility.lerp(4, 20, velocityRatio)

      return this
    },
  }
})()
