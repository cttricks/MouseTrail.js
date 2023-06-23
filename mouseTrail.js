class MouseTrail {
    constructor(initialSize, initialLength, colorIndex, motionStatus){

        this.size = initialSize !== undefined ? initialSize : 24;
        this.length = initialLength !== undefined ? initialLength : 15;
        this.start = motionStatus !== undefined ? motionStatus : true;
        this.color = colorIndex !== undefined ? colorIndex : 0;
        
        this.colorDiff = 15;
        this.coordinateX = 1;
        this.coordinateY = 1;
        this.isMuseMoving = false;
        this.timeout;
        this.circles = [];
        this.eventListeners = {
            moving: [],
            stopped: []
        };

        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.animateCircles = this.animateCircles.bind(this);
        this.composeTrails = this.composeTrails.bind(this);
        document.addEventListener('mousemove', this.handleMouseMove);

        this.composeTrails();
    }

    composeTrails(){
        while(this.circles.length < 15){
            let circle = document.createElement('div');
            circle.style.height = `${this.size}px`;
            circle.style.width = `${this.size}px`;
            circle.style.borderRadius = '50%';
            circle.style.backgroundColor = `hsl(${(this.circles.length + this.color + this.colorDiff)}, 100%, 50%)`;
            circle.style.position = 'absolute';
            circle.style.left = '0px';
            circle.style.top = '0px';
            circle.style.pointerEvents = 'none';
        
            circle.x = 0;
            circle.y = 0;
        
            document.body.appendChild(circle);
            this.circles.push(circle);
        }

        this.animateCircles();
    }

    animateCircles(){
        let x = this.coordinateX;
        let y = this.coordinateY;
        this.circles.forEach((circle, index) => {
            circle.style.left = `${x - Math.floor(this.size/2)}px`;
            circle.style.top = `${y - Math.floor(this.size/2)}px`;
            circle.x = x;
            circle.y = y;
            circle.style.scale = (this.length - index) / this.length;
    
            const nextCircle = this.circles[index + 1] || this.circles[0];
            x += (nextCircle.x - x) * 0.3;
            y += (nextCircle.y - y) * 0.3;
        });
    
        requestAnimationFrame(this.animateCircles);
    }

    handleMouseMove(event) {
        this.coordinateX = event.pageX;
        this.coordinateY = event.pageY;

        this.mouseStartedMoving();

        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.mouseStoppedMoving();
        }, 100);
    }

    destroy() {
        document.removeEventListener('mousemove', this.handleMouseMove);
    }

    addEventListener(eventName, callback) {
        if (this.eventListeners[eventName]) {
          this.eventListeners[eventName].push(callback);
        }
    }

    removeEventListener(eventName, callback) {
        if (this.eventListeners[eventName]) {
          const index = this.eventListeners[eventName].indexOf(callback);
          if (index !== -1) {
            this.eventListeners[eventName].splice(index, 1);
          }
        }
    }
    
    dispatchEvent(eventName) {
        if (this.eventListeners[eventName]) {
          this.eventListeners[eventName].forEach(callback => callback());
        }
    }

    mouseStartedMoving(){
        if(!this.start) return;
        if(this.isMuseMoving) return;
        this.isMuseMoving = true;
        this.dispatchEvent('moving');
    }

    mouseStoppedMoving(){
        if(!this.start) return;
        this.isMuseMoving = false;
        this.dispatchEvent('stopped');
    }

    show(){
        this.start = true;
        this.circles.forEach(item => {
            item.style.display = 'block';
        })
    }
    hide(){
        this.start = false;
        this.circles.forEach(item => {
            item.style.display = 'none';
        })
    }

}