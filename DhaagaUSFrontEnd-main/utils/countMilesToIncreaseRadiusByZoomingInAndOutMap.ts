export const countMilesToIncreaseRadiusByZoomingInAndOutMap = (
  zoomValue: number
) => {
  const defaultZoom = 0;
  const milesToFillTheMapWhenZoomZoomValueZero = 32768;

  const zoomPointFromDefaultZoom = zoomValue - defaultZoom;
  const valueToBeDividedWithMilesToFillTheMap = Math.pow(
    2,
    zoomPointFromDefaultZoom
  );

  const milesToFeelTheMap =
    milesToFillTheMapWhenZoomZoomValueZero /
    valueToBeDividedWithMilesToFillTheMap;

  return zoomValue === 0
    ? milesToFillTheMapWhenZoomZoomValueZero
    : Math.ceil(milesToFeelTheMap);
};
