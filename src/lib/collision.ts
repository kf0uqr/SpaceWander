export type Rect = { x: number; y: number; width: number; height: number };
export type Point = { x: number; y: number };

function circleIntersectsRect(center: Point, radius: number, rect: Rect): boolean {
  const closestX = Math.max(rect.x, Math.min(center.x, rect.x + rect.width));
  const closestY = Math.max(rect.y, Math.min(center.y, rect.y + rect.height));
  const dx = center.x - closestX;
  const dy = center.y - closestY;
  return dx * dx + dy * dy < radius * radius;
}

/**
 * Moves a circular actor by (dx, dy), resolving collisions against solid rects
 * one axis at a time so movement slides along walls instead of stopping dead.
 */
export function resolveMove(position: Point, dx: number, dy: number, radius: number, solids: Rect[]): Point {
  let { x, y } = position;

  const nextX = x + dx;
  if (!solids.some((rect) => circleIntersectsRect({ x: nextX, y }, radius, rect))) {
    x = nextX;
  }

  const nextY = y + dy;
  if (!solids.some((rect) => circleIntersectsRect({ x, y: nextY }, radius, rect))) {
    y = nextY;
  }

  return { x, y };
}

/**
 * Nearest point on a rect's boundary (expanded by `margin`) to `from`. A
 * straight line from outside that boundary to this point never crosses the
 * rect's interior, so it's a safe walk target regardless of which side the
 * actor is approaching from - unlike a single fixed "front door" point,
 * which the actor can get stuck trying to reach in a straight line whenever
 * it's approaching from a different side.
 */
export function getApproachPoint(rect: Rect, margin: number, from: Point): Point {
  const left = rect.x - margin;
  const right = rect.x + rect.width + margin;
  const top = rect.y - margin;
  const bottom = rect.y + rect.height + margin;

  const clampedX = Math.min(Math.max(from.x, left), right);
  const clampedY = Math.min(Math.max(from.y, top), bottom);

  const distLeft = clampedX - left;
  const distRight = right - clampedX;
  const distTop = clampedY - top;
  const distBottom = bottom - clampedY;
  const minDist = Math.min(distLeft, distRight, distTop, distBottom);

  if (minDist === distLeft) return { x: left, y: clampedY };
  if (minDist === distRight) return { x: right, y: clampedY };
  if (minDist === distTop) return { x: clampedX, y: top };
  return { x: clampedX, y: bottom };
}
