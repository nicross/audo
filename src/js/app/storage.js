app.storage = (() => {
  const isSupported = 'localStorage' in window

  const storage = isSupported
    ? window.localStorage
    : {
        data: {},
        getItem: (key) => this.data[key],
        setItem: (key) => this.data[key] = value,
      }

  const highscoreKey = 'highscore'

  function get(key) {
    return storage.getItem(key)
  }

  function set(key, value) {
    return storage.setItem(key, value)
  }

  return {
    getHighscore: () => get(highscoreKey),
    hasHighscore: () => Boolean(get(highscoreKey)),
    setHighscore: function (value) {
      set(highscoreKey, value)
      return this
    },
  }
})()
