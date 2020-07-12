engine.const.movementDeceleration = engine.const.gravity
engine.const.propFadeDuration = 1/4

content.const = {
  initialVelocity: 25,
  lapTime: 30,
  maxOpponents: 12,
  maxVelocity: 10 ** 6,
  minOpponents: 3,
  opponentRadius: 0.75,
  powerupRadius: 1,
  roadRadius: 10,
}

engine.const.movementMaxVelocity = content.const.roadRadius * 4
