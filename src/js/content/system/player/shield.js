content.system.player.shield = (() => {
  let active = false

  return {
    grant: function () {
      active = true
      content.sfx.shieldUp()
      return this
    },
    has: () => active,
    remove: function () {
      active = false
      content.sfx.shieldDown()
      return this
    },
  }
})()
