window.onload = function(){
    console.log("onload");
    var svgObject = document.getElementById('svg-object').contentDocument;
    var svg = svgObject.getElementById('Cog-Large');
    console.log(svgObject);
    console.log(svg);
    var element = svg.getAttribute('transform');
    console.log(element);
}