engine.const.audioLookaheadTime = 1/120
engine.const.distancePower = 2
engine.const.distancePowerHorizon = true
engine.const.distancePowerExponent = 1
engine.const.propFadeDuration = 1/4

content.const = {
  lapTime: 30,
  maxOpponents: 12,
  maxRelativeVelocity: 22,
  minOpponents: 0,
  minRelativeVelocity: 2,
  movementDeceleration: engine.const.gravity,
  movementMaxVelocity: 10 * 4, // Move roadRadius in 0.25s
  opponentRadius: 1,
  powerupRadius: 1.5,
  roadRadius: 10,
}
