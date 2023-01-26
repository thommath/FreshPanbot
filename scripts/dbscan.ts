
export type Point = {
  0: number
  1: number
  2: number
  isVisited?: boolean
  isNoise?: boolean
  color?: {r: number, g: number, b: number, a: number}
}

export function dbscan(points: Point[], colorDifference = 0.3, epsilon = 0.5, minimumPoints = 3) {
    const clusters: Point[][] = [];
    
    points.forEach((point) => {
      if (point.isVisited) {
        return;
      }
    
      point.isVisited = true;
      const neighbors = getNeighbors(point);
    
      if (neighbors.length < minimumPoints) {
        point.isNoise = true;
        return;
      }
    
      const newCluster = [point];
      clusters.push(newCluster);

      for(let i = 0; i < neighbors.length; i++) {
        const neighbor = neighbors[i];
        if (neighbor.isVisited) {
          continue;
        }
        neighbor.isVisited = true;
        const neighborNeighbors = getNeighbors(neighbor).filter(neighbor => getColorDifference(neighbor, point) <= colorDifference);

        if (neighborNeighbors.length >= minimumPoints) {
          neighbors.push(...neighborNeighbors);//.filter(neighbor => neighbor.isVisited === false));
        }
      }
    
      newCluster.push(...neighbors);
    });
    
    function getNeighbors(point: Point) {
      return points.filter((p) => p !== point && getDistance(point, p) <= epsilon && getColorDifference(point, p) <= colorDifference);
    }
    
    function getDistance(point1: Point, point2: Point) {
        return Math.sqrt(Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2));
    }
    function getColorDifference(pixel1: Point, pixel2: Point) {
        return Math.abs(pixel1[2] - pixel2[2]);
    }
    return clusters;
}
