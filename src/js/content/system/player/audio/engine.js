content.system.player.audio.engine = (() => {
  const context = engine.audio.context(),
    duration = 30000, // ms
    frequency = engine.utility.midiToFrequency(48),
    input = context.createGain(),
    lfo = engine.audio.synth.createLfo(),
    output = context.createGain(),
    synths = []

  input.connect(output)
  input.gain.value = engine.utility.fromDb(-9)

  lfo.param.depth.value = 0
  lfo.connect(output.gain)

  output.gain.value = 1
  output.connect(content.system.player.audio.bus())

  for (let i = 0; i < 4; i += 1) {
    const synth = engine.audio.synth.createSimple({
      type: 'triangle',
    }).filtered().connect(input)

    synths.push(synth)
  }

  function automate(synth) {
    const now = engine.audio.time()

    const color = 2

    const endTime = now + (duration / 1000),
      halfTime = now + (duration / 1000 / 2)

    synth.param.gain.cancelAndHoldAtTime(now)
    synth.param.gain.setValueAtTime(engine.const.zeroGain, now + engine.const.zeroTime)
    synth.param.gain.linearRampToValueAtTime(1 / synths.length, halfTime)
    synth.param.gain.linearRampToValueAtTime(engine.const.zeroGain, endTime)

    synth.param.frequency.cancelAndHoldAtTime(now)
    synth.param.frequency.setValueAtTime(frequency / 2, now + engine.const.zeroTime)
    synth.param.frequency.exponentialRampToValueAtTime(frequency, halfTime)
    synth.param.frequency.exponentialRampToValueAtTime(frequency * 2, endTime)

    synth.filter.frequency.cancelAndHoldAtTime(now)
    synth.filter.frequency.setValueAtTime(frequency / 2 * color, now + engine.const.zeroTime)
    synth.filter.frequency.exponentialRampToValueAtTime(frequency * color, halfTime)
    synth.filter.frequency.exponentialRampToValueAtTime(frequency * 2 * color, endTime)
  }

  function resetSynths() {
    for (let i = 0; i < synths.length; i += 1) {
      const synth = synths[i]

      synth.param.frequency.cancelScheduledValues(0)
      synth.param.gain.cancelScheduledValues(0)
      synth.param.gain.value = engine.const.zeroGain

      clearInterval(synth.interval)
      clearTimeout(synth.timeout)

      synth.timeout = setTimeout(() => {
        automate(synth)
        synth.interval = setInterval(() => automate(synth), duration)
      }, duration * i / synths.length)
    }
  }

  return {
    reset: function () {
      lfo.param.frequency.value = 0
      resetSynths()
      return this
    },
    update: function () {
      const position = engine.position.get()
      const lfoDepth = (position.y / content.const.roadRadius) / 2

      output.gain.value = 1 - lfoDepth
      lfo.param.depth.value = lfoDepth
      lfo.param.frequency.value = content.system.player.relativeVelocity()

      return this
    },
  }
})()
