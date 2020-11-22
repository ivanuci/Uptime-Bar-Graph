/* js: Tooltip      */
/* author: Ivanuci  */
/* date: 11/22/2020 */


let tooltip = {}


tooltip.style = (function () {

    var style = document.createElement("style");
    style.appendChild(document.createTextNode(""));
    document.head.appendChild(style);
    return style;
})();

tooltip.style.sheet.insertRule('#uptime-tooltip {position: absolute; text-align: left; padding: 5px; background: #FFFFFF; color: #313639; border: 0.5px solid #313639; border-radius: 4px; pointer-events: none; font-size: 14px;}', 0);


tooltip.cInstance = function () {

    this.element = document.createElement("div")
    this.element.style.display = "block"
    this.element.id = "uptime-tooltip"
    this.element.style.opacity = "0"

    this.ttTitle = document.createElement("div")
    this.ttTitle.innerHTML = "Naslov"
    this.ttTitle.style.fontWeight = "bold"
    this.ttTitle.style.backgroundColor = "green"
    this.ttTitle.style.padding = "2px"
    this.ttTitle.style.textAlign = "center"

    var table = document.createElement("table")

    var rowStart = table.insertRow()
    var cellStartName = rowStart.insertCell()
    cellStartName.innerHTML = "Start:"
    cellStartName.style.textAlign = "right"
    this.ttStart = rowStart.insertCell()
    this.ttStart.innerHTML = "123"

    var rowEnd = table.insertRow()
    var cellEndName = rowEnd.insertCell()
    cellEndName.innerHTML = "End:"
    cellEndName.style.textAlign = "right"
    this.ttEnd = rowEnd.insertCell()
    this.ttEnd.innerHTML = "123"

    this.element.appendChild(this.ttTitle)
    this.element.appendChild(table)

}

tooltip.cInstance.prototype.appendToParent = function (parent) {
    parent.appendChild(this.element)
}

tooltip.cInstance.prototype.values = function (data) {
    this.ttTitle.innerHTML = data.name
    this.ttTitle.style.backgroundColor = data.color
    this.ttStart.innerHTML = (new Date(data.start * 1000)).toUTCString()
    this.ttEnd.innerHTML = (new Date(data.end * 1000)).toUTCString()
}

tooltip.cInstance.prototype.show = function () {
    this.element.style.opacity = "1"
}

tooltip.cInstance.prototype.hide = function () {
    this.element.style.opacity = "0"
}

tooltip.cInstance.prototype.position = function (left, top) {
    this.element.style.left = left
    this.element.style.top = top
}

tooltip.instance = new tooltip.cInstance()

