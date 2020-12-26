app.crashFixer = (() => {
  const context = engine.audio.context()

  const analyzer = context.createAnalyser()
  analyzer.fftSize = 32
  engine.audio.mixer.master.output().connect(analyzer)

  const analyzerTimeData = new Uint8Array(analyzer.frequencyBinCount)

  return {
    update: function () {
      analyzer.getByteTimeDomainData(analyzerTimeData)

      if (isNaN(analyzerTimeData[0]) || !isFinite(analyzerTimeData[0])) {
        engine.audio.mixer.rebuildFilters()
      }

      return this
    },
  }
})()

engine.loop.on('frame', () => app.crashFixer.update())
