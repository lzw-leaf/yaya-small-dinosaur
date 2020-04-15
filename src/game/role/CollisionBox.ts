/**
 * Collision box
 * @param  X X position.
 * @param  Y Y Position.
 * @param WIDTH  Width.
 * @param HEIGHT Height.
 * @constructor
 */
export default class CollisionBox {
  constructor(
    public X: number,
    public Y: number,
    public WIDTH: number,
    public HEIGHT: number
  ) {}
}
