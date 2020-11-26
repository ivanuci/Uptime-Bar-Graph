/* js: Graph Tools  */
/* author: Ivanuci  */
/* date: 11/22/2020 */


let graphTools = {}


// Single Bar Group
graphTools.cSingleBar = function (width, height, data, vertical, tooltip) {

    this.group = svgTools.group()

    let dataValues = data.map(function (item) { return item.value; });
    let sumAll = dataValues.reduce(function (a, b) { return a + b; }, 0);
    let factor = sumAll !== 0 ? ((vertical ? height : width) / sumAll) : 1;

    data.forEach(function (d, index) {
        let fv = d.value * factor
        let rect = svgTools.rectangle(vertical ? width : fv, vertical ? fv : height, d.color)

        let position = 0

        if (vertical) {
            position = sumAll - dataValues.slice(0, index + 1).reduce(function (a, b) { return a + b; }, 0)
            rect.move(0, position * factor)
        }
        else {
            position = index == 0 ? 0 : dataValues.slice(0, index).reduce(function (a, b) { return a + b; }, 0)
            rect.move(position * factor, 0)
        }

        rect.addEventListener('mouseover', function (event) {
            if (tooltip) {

                tooltip.values(d)
                let tooltipSize = tooltip.element.getBoundingClientRect()
                let windowSize = { width: window.innerWidth, height: window.innerHeight }
                let px = event.pageX < (windowSize.width / 2) ? (event.pageX + 15) : (event.pageX - tooltipSize.width - 10)
                let py = event.pageY < (windowSize.height / 2) ? (event.pageY + 10) : (event.pageY - tooltipSize.height - 10)
                tooltip.position(px + "px", py + "px")
                tooltip.show()
            }
        });

        rect.addEventListener('mouseout', function () {
            if (tooltip) tooltip.hide();
        });

        rect.appendToParent(this.group)

    }, this)

}

graphTools.cSingleBar.prototype.move = function (x, y) {
    this.group.move(x, y)
}

graphTools.cSingleBar.prototype.shiftX = function (value) {
    this.group.shiftX(value)
}

graphTools.cSingleBar.prototype.appendToParent = function (parent) {

    if (parent.isSvgToolsObject)
        parent.element.appendChild(this.group.element);
    else parent.appendChild(this.group.element);
}

graphTools.cSingleBar.prototype.remove = function () {
    this.group.removeChildren();
    this.group.remove();
}

graphTools.singleBar = function (width, height, data, vertical, tooltip) {
    return new graphTools.cSingleBar(width, height, data, vertical, tooltip)
}


// Uptime Bar Graph
graphTools.cUptimeBar = function (parent, width, height, gap, sistemData, tooltip) {

    this.parent = document.getElementById(parent);
    this.width = width
    this.height = height
    this.gap = gap

    // join ranges if they overlap each other
    this.ranges = algorithms.rangesUnion(
        sistemData.map(function (item) {
            return [item.time - item.uptime, item.time]; // range [start, end]
        })
    );

    this.svg = svgTools.svg(this.width, this.height);
    this.svg.appendToParent(this.parent);

    this.bars = [];
    this.barWidth = 1;
    this.barOffset = 1;
    this.referenceDay = 1;
    this.historyDays = 1;
    this.tooltip = tooltip

    this.config = {
        0: { name: "no data", color: '#eee' },
        1: { name: "down", color: '#c23b22' },
        2: { name: "up", color: '#8ce28c' }
    }

}

graphTools.cUptimeBar.prototype.getDayGraphData = function (dayStartTime) {

    let dayStart = dayStartTime;
    let dayEnd = dayStart + 86400; //daySeconds = 60 * 60 * 24 = 86400

    let dayRangesStatus = algorithms.rangesIntersectionStatus([dayStart, dayEnd], this.ranges);

    let dayGraphData = []
    dayRangesStatus.forEach(function (item) {

        let cfg = this.config[item.status]

        dayGraphData.push({
            name: cfg.name,
            value: (item.end - item.start),
            color: cfg.color,
            start: item.start,
            end: item.end
        });
    }, this)

    return dayGraphData;
}

graphTools.cUptimeBar.prototype.zeroDayTime = function (day) {

    let msFrom1970 = day.getTime()
    return Math.floor((msFrom1970 - (msFrom1970 % 864E5)) / 1000);
}

graphTools.cUptimeBar.prototype.draw = function (lastDayOnBar, historyDays, lastDayOffset) {

    this.svg.removeChildren()

    this.referenceDay = this.zeroDayTime(lastDayOnBar) + 864E2 * lastDayOffset
    this.historyDays = historyDays

    let sumGaps = this.gap * (historyDays - 1 < 0 ? 0 : historyDays - 1);
    this.barWidth = (this.width - sumGaps) / historyDays;
    this.barOffset = this.barWidth + this.gap;

    for (let d = historyDays - 1; d >= 0; d--) {

        let nDayStartTime = this.referenceDay - d * 86400
        let nBar = new graphTools.cSingleBar(this.barWidth, this.height, this.getDayGraphData(nDayStartTime), true, this.tooltip)
        nBar.shiftX(this.barOffset * (historyDays - d - 1));
        nBar.appendToParent(this.svg);
        this.bars.push(nBar);
    }
}

// Calculate SLA
graphTools.cUptimeBar.prototype.calcSLARange = function (startTime, endTime) {

    let measuretime = endTime - startTime

    let rangesStatus = algorithms.rangesIntersectionStatus([startTime, endTime], this.ranges);

    let sumUD = rangesStatus.reduce(function (sum, item) {

        if (item.status == 2) sum['uptime'] = (sum['uptime'] || 0) + (item.end - item.start)
        else if (item.status == 1) sum['downtime'] = (sum['downtime'] || 0) + (item.end - item.start)
        return sum;
    }, {})

    if (!sumUD['uptime']) sumUD['uptime'] = 0
    if (!sumUD['downtime']) sumUD['downtime'] = 0

    if (sumUD['uptime'] > 0) {
        
        if (sumUD['downtime'] > 0) {
            
            sumUD['SLA'] = (measuretime - sumUD['downtime']) / measuretime
        }
        else {

            sumUD['SLA'] = 1
        }
    }
    else {

        sumUD['SLA'] = 0    
    }

    return sumUD;
}

graphTools.cUptimeBar.prototype.calcSLA = function(day, rangeName) {

    let year = day.getFullYear()
    let month = day.getMonth()
    let dayOfWeek = day.getDay(); 
    dayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
    let zeroDay = this.zeroDayTime(day)
    let startTime = 0
    let endTime = 1
    switch (rangeName) {
        case 'year': {
            startTime = Math.floor(Date.UTC(year, 0) / 1000)
            endTime = Math.floor(Date.UTC(year + 1) / 1000)
            break;
        }
        case 'month': {
            startTime = Math.floor(Date.UTC(year, month) / 1000)
            endTime = Math.floor(Date.UTC(year, month + 1) / 1000)
            break;
        }
        case 'week': {
            startTime = zeroDay - (dayOfWeek - 1) * 86400
            endTime = startTime + 86400 * 7
            break;
        }
        default: {  //day
            startTime = zeroDay
            endTime = zeroDay + 86400
            break;
        }
    }

    return this.calcSLARange(startTime, endTime);
}


/*
graphTools.cUptimeBar.prototype.shiftRight = function () {

    this.bars[this.bars.length - 1].remove()
    this.bars[this.bars.length - 1] = null
    this.bars.pop()

    this.bars.forEach(function (bar) {
        bar.shiftX(this.barOffset);
    }, this)

    this.referenceDay -= 86400
    let nDayStartTime = this.referenceDay - (this.historyDays - 1) * 86400
    let nBar = new graphTools.cSingleBar(this.barWidth, this.height, this.getDayGraphData(nDayStartTime), true, this.tooltip)
    nBar.appendToParent(this.svg);
    this.bars.unshift(nBar)
}

graphTools.cUptimeBar.prototype.shiftLeft = function () {

    this.bars[0].remove()
    this.bars[0] = null
    this.bars.shift()

    this.bars.forEach(function (bar) {
        bar.shiftX(-this.barOffset);
    }, this)

    this.referenceDay += 86400
    let nDayStartTime = this.referenceDay
    let nBar = new graphTools.cSingleBar(this.barWidth, this.height, this.getDayGraphData(nDayStartTime), true, this.tooltip)
    nBar.shiftX(this.barOffset * (this.historyDays - 1));
    nBar.appendToParent(this.svg);
    this.bars.push(nBar)
}
*/

graphTools.uptimeBar = function (parent, width, height, gap, sistemData, tooltip) {
    return new graphTools.cUptimeBar(parent, width, height, gap, sistemData, tooltip)
}
