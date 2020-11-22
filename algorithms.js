/* js: Algorithms   */
/* author: Ivanuci  */
/* date: 11/22/2020 */

let algorithms = {}


algorithms.rangesUnion = function (a) {
    let b = [];

    a.sort(function (a, b) {
        return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0;
    });

    for (let i = 0; i < a.length; i++) {
        let bLast = b[b.length - 1];
        let aBegin = a[i][0];
        let aEnd = a[i][1];

        if (bLast && bLast[1] >= aBegin - 1) bLast[1] = Math.max(bLast[1], aEnd);
        else b.push([aBegin, aEnd]);
    }

    return b;
};


algorithms.twoRangeIntersection = function (a, b) {
    // lowest start
    let min = a[0] < b[0] ? a : b;
    let max = a[0] < b[0] ? b : a;

    // max starts after min ends -> no intersection
    if (max[0] > min[1]) return null;

    return [max[0], min[1] < max[1] ? min[1] : max[1]];
};


algorithms.rangesIntersection = function (main, a) {
    let intersections = [];

    for (let i = 0; i < a.length; i++) {
        let inter = algorithms.twoRangeIntersection(main, a[i]);
        if (inter) intersections.push(inter);
    }

    return intersections.length > 0 ? intersections : null;
};


algorithms.rangesIntersectionStatus = function (main, ranges) {
    /*
      STATUS
      0: outside ranges a
      1: down (does not intersect)
      2: up   (intersects)
      */

    let rangesStart = ranges[0][0];
    let rangesEnd = ranges[ranges.length - 1][1];
    let intersections = algorithms.rangesIntersection(main, ranges);
    let vStart = main[0];
    let vEnd = main[1];

    if (!intersections) {

        if (vStart >= rangesStart && vEnd <= rangesEnd)
            return [{ start: vStart, end: vEnd, status: 1 }];
        else
            return [{ start: vStart, end: vEnd, status: 0 }];
    }

    let sequence = [];
    sequence.push(main[0]);
    for (let i = 0; i < intersections.length; i++) {
        sequence.push(intersections[i][0]); // - 1
        sequence.push(intersections[i][0]);
        sequence.push(intersections[i][1]);
        sequence.push(intersections[i][1]); // + 1
    }
    sequence.push(main[1]);

    let mainFill = [];
    let currentState = false;

    for (let i = 0; i < sequence.length; i += 2) {

        vStart = sequence[i];
        vEnd = sequence[i + 1];

        if (vEnd - vStart >= 0) {
            let item = {
                start: vStart,
                end: vEnd,
                status: currentState ? 2 : ((vStart >= rangesStart && vEnd <= rangesEnd) ? 1 : 0),
            };

            mainFill.push(item);
        }

        currentState = !currentState;
    }

    return mainFill;
};
