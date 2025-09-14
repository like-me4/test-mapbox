import { describe, expect, it } from 'vitest';
import { splitHexagonToGeoJSON } from '../processHexagon';

describe('splitHexagonToGeoJSON', () => {
  it('returns a single ring when the hexagon does not cross the antimeridian', () => {
    const hex = [
      [0, 0],
      [1, 0],
      [1.5, 0.5],
      [1, 1],
      [0, 1],
      [-0.5, 0.5],
      [0, 0]
    ];

    const polygon = splitHexagonToGeoJSON(hex);

    expect(polygon.rings).toHaveLength(1);
    expect(polygon.rings[0]).toEqual(hex);
  });

  it('splits a hexagon into two rings when crossing the antimeridian', () => {
    const hex = [
      [170, 0],
      [190, 0],
      [200, 10],
      [190, 20],
      [170, 20],
      [160, 10],
      [170, 0]
    ];

    const polygon = splitHexagonToGeoJSON(hex);

    expect(polygon.rings).toHaveLength(2);

    const [left, right] = polygon.rings;

    expect(left.every(([lng]) => lng <= 0)).toBe(true);
    expect(right.every(([lng]) => lng >= 0)).toBe(true);

    expect(left).toContainEqual([-180, 0]);
    expect(left).toContainEqual([-180, 20]);
    expect(right).toContainEqual([180, 0]);
    expect(right).toContainEqual([180, 20]);
  });
});

