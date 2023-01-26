import { dbscan } from './dbscan.ts';

const colorToHex = ({r,g,b,a}: ReturnType<typeof getPixelColor>) =>
    "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)+(a|0).toString(16).padStart(2,"0");

function getPixelColor(imageData: ImageData, x: number, y: number) {
    const index = (x + y * imageData.width) * 4;
    const [r, g, b, a] = imageData.data.slice(index, index + 4);
    return {
        r, g, b, a,
    };
}
function getPixelHexColor(imageData: ImageData, x: number, y: number) {
    return colorToHex(getPixelColor(imageData, x, y));
}

function setPixelColor(imageData: ImageData, color: ReturnType<typeof getPixelColor>, x: number, y: number) {
    const index = (x + y * imageData.width) * 4;
    imageData.data[index] = color.r;
    imageData.data[index+1] = color.g;
    imageData.data[index+2] = color.b;
    imageData.data[index+3] = color.a;
}

export type ImagePathOptions = {
    imageUrl: string
    resolution?: number
    maxEdgeOverlap?: number
    colorDifference?: number
    neighbourDistance?: number
    minimumNeighbours?: number
}

// Read the JPG image file
export async function findPathFromImage(params: ImagePathOptions) {

    const options = {
        imageUrl: params.imageUrl,
        resolution: params.resolution || 50,
        maxEdgeOverlap: params.maxEdgeOverlap || 0.3,
        colorDifference: params.colorDifference || 0.15,
        neighbourDistance: params.neighbourDistance || 2,
        minimumNeighbours: params.minimumNeighbours || 5,
    };
    
    const img = new Image();
    img.src = options.imageUrl;
    const bitmap: ImageData = await new Promise((resolve) => {
        img.onload = function() {
            // you can use img.width, img.height and img.data to access the image's properties
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d') as CanvasRenderingContext2D;
            canvas.width = options.resolution;// img.width;
            canvas.height = options.resolution;// img.height;
            context.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
            resolve(context.getImageData(0, 0, options.resolution, options.resolution));
            // you can use the variable bitmap to access the image's pixel data
        }
    });

    // Process the image data to create the list of strokes
    const points: [number, number, number][] = [];
    for (let y = 0; y < bitmap.height; y++) {
        for (let x = 0; x < bitmap.width; x++) {
            const color = getPixelColor(bitmap, x, y);
            console.log(color, x, y)

            // Add a stroke to the list for each non-transparent pixel
            if (color.a > 0) {
                const intensity = ((color.r * 0.299 + color.g * 0.587 + color.b * 0.114) / (255 * 0.299 + 255 * 0.587 + 255 * 0.114));
                points.push([x, y, intensity]);
            }
        }
    }

    // The list of strokes is now stored in the `strokes` array
    console.log("points", points);

    const clusters = dbscan(points, options.colorDifference, options.neighbourDistance, options.minimumNeighbours);
    console.log("clusters", clusters);


    // Create a new image with the same dimensions as the input image
    //const newImage = new Image(bitmap.width, bitmap.height);
    //const newImage2 = new Image(bitmap.width, bitmap.height);
    const intensityImage = new ImageData(options.resolution, options.resolution, {colorSpace: 'srgb'});
    const clusterImage = new ImageData(options.resolution, options.resolution, {colorSpace: 'srgb'});

    const clusterColors = new Array(clusters.length).fill(0).map(() => ({
        r: Math.round(Math.random() * 255),
        g: Math.round(Math.random() * 255),
        b: Math.round(Math.random() * 255),
        a: 255
    }));

    // Map clusters to pixels with color of the cluster
    clusters.forEach((cluster, clusterIndex) => {
        const intensityColor = {
            r: cluster[0][2] * 255,
            g: cluster[0][2] * 255,
            b: cluster[0][2] * 255,
            a: 255
        };

        return cluster.forEach(clusterPoint => {
            setPixelColor(intensityImage, intensityColor, clusterPoint[0], clusterPoint[1]);
            setPixelColor(clusterImage, clusterColors[clusterIndex], clusterPoint[0], clusterPoint[1]);
        });
    });

    // Check the edges for clusters and if they are large we remove them as background
    const maxClusterEdgeOverlap = options.maxEdgeOverlap;
    const clustersAndEdgesOverlap: {[id: string]: number} = {};
    for(let x = 0; x < bitmap.width; x++) {
        clustersAndEdgesOverlap[getPixelHexColor(clusterImage, x, 0)] = (clustersAndEdgesOverlap[getPixelHexColor(clusterImage, x, 0)] || 0) + 1;
        clustersAndEdgesOverlap[getPixelHexColor(clusterImage, x, bitmap.height-1)] = (clustersAndEdgesOverlap[getPixelHexColor(clusterImage, x, bitmap.height-1)] || 0) + 1;
    }
    for(let y = 0; y < bitmap.height; y++) {
        clustersAndEdgesOverlap[getPixelHexColor(clusterImage, 0, y)] = (clustersAndEdgesOverlap[getPixelHexColor(clusterImage, 0, y)] || 0) + 1;
        clustersAndEdgesOverlap[getPixelHexColor(clusterImage, bitmap.width-1, y)] = (clustersAndEdgesOverlap[getPixelHexColor(clusterImage, bitmap.width-1, y)] || 0) + 1;
    }

    // Find the colors with enough edge overlap
    const clusterColorsToBeRemoved = Object.keys(clustersAndEdgesOverlap)
        .filter(clusterKey => clustersAndEdgesOverlap[clusterKey] > (bitmap.height+bitmap.width)*maxClusterEdgeOverlap);

    console.log("remove: ", clusterColorsToBeRemoved)
    console.log("all colors: ", clusterColors.map(colorToHex))
        
    // Remove the color flro these clusters
    clusterColorsToBeRemoved.forEach(colorKey => {
        const clusterIndex = clusterColors.findIndex(color => colorToHex(color) === colorKey);
        if (clusterIndex !== -1) {
            const cluster = clusters[clusterIndex];
            console.log("removing", clusterIndex, cluster, clusters);
            cluster.forEach(clusterPoint => {
                setPixelColor(intensityImage, {r: 0, g: 0, b: 0, a: 0}, clusterPoint[0], clusterPoint[1]);
                setPixelColor(clusterImage, {r: 0, g: 0, b: 0, a: 0}, clusterPoint[0], clusterPoint[1]);
            });
        }
    });

    // Filter them out before generating the path
    const clustersToRender = clusters.filter((_, clusterIndex) => !clusterColorsToBeRemoved.some(color => color == colorToHex(clusterColors[clusterIndex])));

    // Find a path to walk from dark to light pixels
    const sortedClusters = clustersToRender.sort((a, b) => a[0][2] - b[0][2]);
    const sortedSubClusters = sortedClusters.map(cluster => cluster.sort((a, b) => {
        if (a[0] === b[0]) {
            return a[0] % 2 === 0 ? a[1] - b[1] : b[1] - a[1];
        }
        return a[0] - b[0];
    }));

    // createSVGPath
    // Initialize the path
    let path = ``;

    for (const points of sortedSubClusters) {
        path += `M ${points[0][0]} ${points[0][1]} `;
        for (let j = 0; j < points.length; j++) {
            const point = points[j];
            if (j > 0 && point[0] === points[j-1][0] && point[1] === points[j-1][1]) {
                continue;
            }
            if (j > 0 && Math.abs(points[j-1][1] - point[1]) <= 2) {
                path += `L ${point[0]} ${point[1]} `;
            } else {
                path += `M ${point[0]} ${point[1]} `;
            }
        }
    }

    // Close the path
    path += 'Z';

    // Render images and export as DataUrls
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    canvas.width = options.resolution;
    canvas.height = options.resolution;

    context.putImageData(intensityImage, 0, 0);
    const intensityImageDataUrl = canvas.toDataURL();
    context.putImageData(clusterImage, 0, 0);
    const clusterImageDataUrl = canvas.toDataURL();

    return {
        path,
        intensityImage: intensityImageDataUrl,
        clusterImage: clusterImageDataUrl,
    };
}
