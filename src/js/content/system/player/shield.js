content.system.player.shield = (() => {
  const pubsub = engine.utility.pubsub.create()

  let active = false

  return engine.utility.pubsub.decorate({
    grant: function () {
      active = true
      pubsub.emit('grant')
      content.sfx.shieldUp()
      return this
    },
    has: () => active,
    remove: function () {
      active = false
      pubsub.emit('remove')
      content.sfx.shieldDown()
      return this
    },
  }, pubsub)
})()
