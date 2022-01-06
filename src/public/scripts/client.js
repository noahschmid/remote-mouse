let Client = function(context, w, h) {
    this.id = 0;
    this.canvas = canvas;
	this.context = canvas.getContext("2d");

    this.canvasWidth = w;
	this.canvasHeight = h;

    this.keyboardButtonPos = {x:0, y:this.canvasHeight - this.canvasHeight/10, w:this.canvasWidth/2, h:this.canvasHeight/10};
	this.rightMouseButtonPos = {x:this.canvasWidth/2, y:this.canvasHeight - this.canvasHeight/10, w:this.canvasWidth/2, h:this.canvasHeight/10};
}

Client.prototype.connectToServer = function() {
    this.socket = io.connect();
};	

Client.prototype.resize = function(width, height)  {
    this.canvasHeight = height;
    this.canvasWidth = width;
}

Client.prototype.draw = function() {
    this.context.fillStyle = "grey";
	this.context.beginPath ();
    this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.context.stroke();

    this.context.fillStyle = "#5d5e5e";
    this.context.beginPath();
    this.context.fillRect(0, this.canvasHeight - this.canvasHeight/10, this.canvasWidth, this.canvasHeight/10);
    this.context.stroke();

    this.context.fillStyle = "black";
    this.context.beginPath();
    this.context.strokeRect(0, this.canvasHeight - this.canvasHeight/10, this.canvasWidth/2, this.canvasHeight/10);
    this.context.stroke();

    this.context.fillStyle = "black";
    this.context.beginPath();
    this.context.strokeRect(this.canvasWidth/2, this.canvasHeight - this.canvasHeight/10, this.canvasWidth/2, this.canvasHeight/10);
    this.context.stroke();

    this.context.font = "15px Verdana";
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
    this.context.fontWeight = "bold";
    this.context.fillText("KEYBOARD", this.canvasWidth/4, this.canvasHeight - this.canvasHeight/10 + this.canvasHeight/20);
    this.context.fillText("RIGHT CLICK", 3*this.canvasWidth/4, this.canvasHeight - this.canvasHeight/10 + this.canvasHeight/20);
}

Client.prototype.update = function(time) {
    delta = new Date().getTime() - time;

    this.draw();
    
    //this.context.drawLine()
    
    window.requestAnimationFrame( this.update.bind(this), this.viewport );
}

Client.prototype.sendPos = function(pos) {
    this.socket.emit("p", pos)
}

Client.prototype.sendClick = function() {
    this.socket.emit("c", {});
}

Client.prototype.sendRightClick = function(msg) {
    this.socket.emit("r", {});
}