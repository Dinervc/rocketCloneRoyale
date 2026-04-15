export interface PlayerInput {
  move: -1 | 0 | 1;
  fire: boolean;
  brake: boolean;
  utility: boolean;
  aimX: number;
  aimY: number;
  weaponIndexDelta: number;
}

export const emptyInput = (): PlayerInput => ({
  move: 0,
  fire: false,
  brake: false,
  utility: false,
  aimX: 0,
  aimY: 0,
  weaponIndexDelta: 0,
});
