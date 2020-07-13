AFRAME.registerComponent('contact-listener', {
    init: function () {
        var message = "Now it's ";
        let object = this.el.id;
        let color = '#9300ff';
        
        console.log("hello world", object);
        
        this.el.addEventListener('over', function(evt){
            document.getElementById("text").setAttribute("value", message+object);
            this.setAttribute('material', 'color', color);
        });
        
//        this.el.addEventListener('click', function (evt) {
//            lastIndex = (lastIndex + 1) % COLORS.length;
//            this.setAttribute('material', 'color', COLORS[lastIndex]);
//            console.log('I was clicked at: ', evt.detail.intersection.point);
//            document.getElementById("text").setAttribute("value", message+COLORS[lastIndex]);
//        });
    }
});

AFRAME.registerComponent('controllisten', {
    init: function(){
        let el = this.el;// controller
        let id = el.id;
        console.log("testing", el);
        console.log("test2", id);
        
        el.addEventListener('buttonup', function(evt){
            console.log(id, "button released");
            console.log(evt, "button");
        });
        
        el.addEventListener('axismove', function(evt){
            console.log(id, "joystick moved");
            console.log("Axis value =", evt.detail.axis);
            console.log("Axis changed value =", evt.detail.changed);
        });
    }
});