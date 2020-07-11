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
      const position = engine.position.get(),
        relativeVelocity = content.system.player.relativeVelocity(),
        y = engine.utility.scale(position.y, -content.const.roadRadius, content.const.roadRadius, -1, 1),
        yExp = Math.abs(y) ** 10

      binaural.update({
        delta,
        x: 0,
        y: engine.utility.sign(y) * yExp * engine.const.binauralHeadWidth,
      })

      synth.filter.frequency.value = engine.utility.lerp(20, 400, yExp)
      synth.param.gain.value = Math.abs(y) * engine.utility.fromDb(engine.utility.lerp(-3, -9, yExp))

      synth.param.carrierGain.value = 1 - ((1 - yExp) / 2)
      synth.param.mod.depth.value = (1 - yExp) / 2
      synth.param.mod.frequency.value = relativeVelocity

      return this
    },
  }
})()
