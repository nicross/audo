content.sfx = {}

content.sfx.bus = engine.audio.mixer.createBus()
content.sfx.bus.gain.value = engine.utility.fromDb(-6)

content.sfx.gameOver = () => {
  // TODO
}

content.sfx.lap = () => {
  const now = engine.audio.time()

  const synth = engine.audio.synth.createSimple({
    frequency: engine.utility.midiToFrequency(60),
  }).connect(content.sfx.bus)

  synth.param.detune.setValueAtTime(1200, now)
  synth.param.detune.linearRampToValueAtTime(engine.const.zero, now + 1/16)
  synth.param.detune.linearRampToValueAtTime(1200, now + 1/4)

  synth.param.gain.setValueAtTime(engine.const.zeroGain, now)
  synth.param.gain.exponentialRampToValueAtTime(0.25, now + 1/32)
  synth.param.gain.exponentialRampToValueAtTime(engine.const.zeroGain, now + 3)

  synth.stop(now + 3)
}
