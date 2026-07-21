export function calculateHeadbobOffset(
  bobTime: number,
  isSprinting: boolean,
): number {
  // tune to change how fast/bouncy the walk feels
  const frequency = isSprinting ? 15.0 : 10.0;
  const amplitude = isSprinting ? 0.12 : 0.06;

  // sine wave to calculate the Y-axis bounce
  return Math.sin(bobTime * frequency) * amplitude;
}
