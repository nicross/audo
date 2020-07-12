content.system.player.audio.shield = (() => {
  let synth

  function createSynth() {
    const frequency = engine.utility.midiToFrequency(48)

    synth = engine.audio.synth.createSimple({
      frequency,
      type: 'sawtooth',
    }).filtered({
      frequency: frequency * 3,
    }).assign('lfoFilter', engine.audio.synth.createLfo({
      frequency: 1/2,
      depth: frequency * 2,
    })).assign('lfoPanner', engine.audio.synth.createLfo({
      frequency: 1,
      depth: 1/2,
    })).chainAssign('panner', engine.audio.context().createStereoPanner())

    synth.chainStop(synth.lfoFilter)
      .chainStop(synth.lfoPanner)
      .connect(content.system.player.audio.bus())

    synth.lfoFilter.connect(synth.filter.frequency)
    synth.lfoPanner.connect(synth.panner.pan)

    engine.audio.ramp.linear(synth.param.gain, engine.utility.fromDb(-21), 1)
  }

  function destroySynth() {
    engine.audio.ramp.linear(synth.param.gain, engine.const.zeroGain, 1)
    engine.audio.ramp.linear(synth.lfoFilter.param.frequency, 20, 1)

    synth.stop(engine.audio.time(1))
    synth = null
  }

  return {
    onGrant: function () {
      if (!synth) {
        createSynth()
      }
      return this
    },
    onRemove: function () {
      if (synth) {
        destroySynth()
      }
      return this
    },
  }
})()

content.system.player.shield.on('grant', () => content.system.player.audio.shield.onGrant())
content.system.player.shield.on('remove', () => content.system.player.audio.shield.onRemove())
