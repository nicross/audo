content.system.player.shield = (() => {
  let active = false

  return {
    grant: function () {
      active = true
      return this
    },
    has: () => active,
    remove: function () {
      active = false
      return this
    },
  }
})()
