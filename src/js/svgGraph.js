/**
 * Generates a graph with specified options
 * @param {object} options The options of the graph 
 * @param {int} options.height The height of the graph
 * @param {int} options.width The width of the graph
 * @param {int} options.modulo The modulo for the calculation of the amount of x points
 * @param {string} options.points The list of points for the polyline "x,y x2,y2"
 * @param {string} options.topColor The color at the top of the graph
 * @param {string} options.bottomColor The color at the bottom of the graph
 * 
 * @author Felix Bole <felix.bole@yahoo.fr>
 * @hint Setting the width to 90 is useful for month counts as it results in 30 points on the x axis
 */
function generateGraph({height = 90, width = 30, modulo = 3, points = "", topColor = "gold", bottomColor = "red"} = {}) {
    const graphKeyId = makeId();
    
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");

    const linearGradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    linearGradient.id = `gradient-${graphKeyId}`;
    linearGradient.setAttribute("gradientTransform", "rotate(90)");

    const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");

    stop1.setAttribute("offset", "20%");
    stop2.setAttribute("offset", "80%");
    stop1.setAttribute("stop-color", topColor);
    stop2.setAttribute("stop-color", bottomColor);

    linearGradient.appendChild(stop1);
    linearGradient.appendChild(stop2);

    const mask = document.createElementNS("http://www.w3.org/2000/svg", "mask");
    mask.setAttribute("width", width);
    mask.setAttribute("height", height);
    mask.setAttribute("x", "0");
    mask.setAttribute("y", "0");
    mask.id = `graphline-${graphKeyId}`;

    const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    polyline.setAttribute("transform", `translate(0,${height}) scale(1,-1)`)
    const graphPoints = points == "" ? randomPolylinePoints(width, height, modulo) : points; 
    polyline.setAttribute("points", graphPoints);
    polyline.setAttribute("fill", "transparent");
    polyline.setAttribute("stroke", "white"); // White stroke because we're on mask
    polyline.setAttribute("stroke-width", "2");

    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("transform", "translate(0, 2.0)");

    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", "0");
    rect.setAttribute("y", "-2"); // Since we're translating the y of g to 2
    rect.setAttribute("width", width);
    rect.setAttribute("height", height);
    rect.setAttribute("style", `stroke:none;mask:url(#${mask.id});fill:url(#${linearGradient.id})`);

    g.appendChild(rect);
    mask.appendChild(polyline);
    defs.appendChild(linearGradient);
    defs.appendChild(mask);
    svg.appendChild(defs);
    svg.appendChild(g);

    document.body.appendChild(svg);
}

function randomPolylinePoints(maxWidth, maxHeight, modulo) {
    const xValues = processPoints(maxWidth, modulo);

    let points = "";
    for (let i = 0; i < xValues.length; i++) {
			const x = xValues[i];
			const y = Math.floor(Math.random() * maxHeight + 1);
			points += `${x},${y} `;
		}
    return points;
}

function makeId(length = 6) {
    const possible = "azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN1234567890";

    let id = "";
    for (let i = 0; i < length; i++) {
        index = Math.floor(Math.random() * ((possible.length - 1) - 0 + 1));
        id += possible[index];
    }

    return id;
}

function processPoints(size, modulo = 3) {
    let points = [];
    for (let i = 0; i < size; i++) {
        if (i % modulo === 0)
            points.push(i);
    }
    return points;
}