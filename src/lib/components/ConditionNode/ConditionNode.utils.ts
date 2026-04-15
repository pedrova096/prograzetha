export const roundedCornerPath = (options: {
  position: { x: number; y: number };
  size: { width: number; height: number };
  direction: { x: 1 | -1; y: 1 | -1 };
  radius: number;
  stroke?: number;
}) => {
  const {
    position,
    size,
    direction,
    radius: radiusFromOptions,
    stroke = 0,
  } = options;

  // Inset by half stroke so the stroke stays within bounds
  const inset = stroke / 2;

  const width = size.width;
  const height = size.height;

  const radius = Math.min(radiusFromOptions, width, height);

  // Start at the outer end of the first leg (horizontal), then go toward the corner
  // Offset by inset to keep stroke within bounds
  const startX =
    direction.x === 1 ? position.x - inset : position.x + size.width + inset;
  const startY =
    direction.y === 1 ? position.y + inset : position.y + size.height - inset;

  // Relative vectors
  const horizontalToCornerX = direction.x * (width - radius);
  const horizontalToCornerY = 0;

  // Arc ends after moving radius in x and radius in y (in the chosen directions)
  const arcEndX = direction.x * radius;
  const arcEndY = direction.y * radius;

  // Then continue down/up the vertical leg after the arc
  const verticalAfterArcX = 0;
  const verticalAfterArcY = direction.y * (height - radius);

  // Sweep flag mapping for screen coordinates (y increases downward)
  // This combination makes the arc bulge "outward" for the chosen corner.
  const sweepFlag =
    direction.x === 1 && direction.y === 1
      ? 1 // top-left going right+down
      : direction.x === -1 && direction.y === 1
      ? 0 // top-right going left+down
      : direction.x === -1 && direction.y === -1
      ? 1 // bottom-right going left+up
      : 0; // bottom-left going right+up

  const largeArcFlag = 0;
  const xAxisRotation = 0;

  return [
    `m ${startX} ${startY}`,
    `l ${horizontalToCornerX} ${horizontalToCornerY}`,
    `a ${radius} ${radius} ${xAxisRotation} ${largeArcFlag} ${sweepFlag} ${arcEndX} ${arcEndY}`,
    `l ${verticalAfterArcX} ${verticalAfterArcY}`,
  ].join(' ');
};
