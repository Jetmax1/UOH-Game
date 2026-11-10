// Shared focus point (the player's position) used to fade world labels by distance,
// so only nearby names are fully visible and the screen doesn't fill with overlapping tags.
export const labelFocus = { x: 0, y: 0, active: false };

export function setLabelFocus(x, y) {
  labelFocus.x = x;
  labelFocus.y = y;
  labelFocus.active = true;
}

// Returns an alpha in [minAlpha, 1]: 1 within `near` px of the focus, fading to minAlpha at `far`.
export function labelAlpha(worldX, worldY, near, far, minAlpha = 0) {
  if (!labelFocus.active) return 1;
  const d = Math.hypot(worldX - labelFocus.x, worldY - labelFocus.y);
  if (d <= near) return 1;
  if (d >= far) return minAlpha;
  const t = (d - near) / (far - near);
  return 1 - t * (1 - minAlpha);
}
