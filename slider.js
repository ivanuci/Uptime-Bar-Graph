/* js: Slider       */
/* author: Ivanuci  */
/* date: 11/22/2020 */


let slider = {}


// style
slider.style = (function () {
    let style = document.createElement("style");
    style.appendChild(document.createTextNode(""));
    document.head.appendChild(style);
    return style;
})();

slider.style.sheet.insertRule(
    ".uptime-slider { margin: 5px 0 8px 0; -webkit-appearance: none; width: 100%; height: 15px; border-radius: 5px; background: #d3d3d3; outline: none; opacity: 0.7; -webkit-transition: .2s; transition: opacity .2s; }"
);


// create function
slider.create = function (parent, width, callBack) {

    let element = document.createElement("input");
    element.type = "range";
    element.min = -365;
    element.style.width = width;
    element.max = 0;
    element.value = 0;
    element.step = 1;
    element.className = "uptime-slider";
    element.onchange = callBack;
    element.oninput = callBack;

    let parentObject = document.getElementById(parent);
    parentObject.appendChild(element);
    element.onchange();
};
