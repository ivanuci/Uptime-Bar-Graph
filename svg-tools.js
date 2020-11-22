/* js: Svg Tools    */
/* author: Ivanuci  */
/* date: 11/22/2020 */

let svgTools = {}


svgTools.xmlns = "http://www.w3.org/2000/svg";


// SVG
svgTools.cSvg = function (width, height) {

    this.element = document.createElementNS(svgTools.xmlns, "svg");
    //this.element.setAttributeNS(null, "viewBox", "0 0 " + boxWidth + " " + boxHeight);
    this.element.setAttributeNS(null, "width", width);
    this.element.setAttributeNS(null, "height", height);
    //this.element.style.display = "block";
    this.isSvgToolsObject = true;
}

svgTools.cSvg.prototype.appendToParent = function (parent) {

    if (parent.isSvgToolsObject)
        parent.element.appendChild(this.element);
    else parent.appendChild(this.element);
}

svgTools.cSvg.prototype.getElement = function () { return this.element; }

svgTools.cSvg.prototype.move = function (x, y) {
    this.element.setAttributeNS(null, 'transform', 'translate(' + x + ',' + y + ')');
}

svgTools.cSvg.prototype.removeChildren = function () {
    while (this.element.firstChild) {
        this.element.removeChild(this.element.firstChild);
    }
}

svgTools.svg = function (width, height) {
    return new svgTools.cSvg(width, height);
}


// GROUP
svgTools.cGroup = function () {

    this.offset = { x: 0, y: 0 }
    this.element = document.createElementNS(svgTools.xmlns, "g");
    this.isSvgToolsObject = true;
}

svgTools.cGroup.prototype.appendToParent = function (parent) {

    if (parent.isSvgToolsObject)
        parent.element.appendChild(this.element);
    else parent.appendChild(this.element);
}

svgTools.cGroup.prototype.getElement = function () { return this.element; }

svgTools.cGroup.prototype.move = function (x, y) {
    this.element.setAttributeNS(null, 'transform', 'translate(' + x + ',' + y + ')');
    this.offset.x = x
    this.offset.y = y
}

svgTools.cGroup.prototype.shiftX = function (value) {
    this.offset.x += value
    this.element.setAttributeNS(null, 'transform', 'translate(' + this.offset.x + ')');
}

svgTools.cGroup.prototype.removeChildren = function () {
    while (this.element.firstChild) {
        this.element.removeChild(this.element.firstChild);
    }
}

svgTools.cGroup.prototype.remove = function () {
    this.element.remove()
}

svgTools.group = function () {

    return new svgTools.cGroup();
}


// RECTANGLE
svgTools.cRectangle = function (width, height, fill) {

    this.element = document.createElementNS(svgTools.xmlns, "path");
    this.element.setAttributeNS(null, "d", `M0,0 h${width} v${height} h-${width} z`);   //sharp
    this.element.setAttributeNS(null, 'fill', fill);
    this.isSvgToolsObject = true;
}

svgTools.cRectangle.prototype.appendToParent = function (parent) {

    if (parent.isSvgToolsObject)
        parent.element.appendChild(this.element);
    else parent.appendChild(this.element);
}

svgTools.cRectangle.prototype.getElement = function () { return this.element; }

svgTools.cRectangle.prototype.move = function (x, y) {
    this.element.setAttributeNS(null, 'transform', 'translate(' + x + ',' + y + ')');
}

svgTools.cRectangle.prototype.addEventListener = function (type, listener) {
    this.element.addEventListener(type, listener, false)
}

svgTools.rectangle = function (width, height, fill) {
    return new svgTools.cRectangle(width, height, fill)
}

