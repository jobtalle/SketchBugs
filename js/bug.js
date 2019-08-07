const Bug = function(x, y) {
    let speed = 80;
    let direction = Math.random() * Math.PI * 2;
    let aim = direction;

    const drawBody = context => {
        context.fillStyle = "yellow";
        context.strokeStyle = "gray";
        context.beginPath();
        context.moveTo(16, 0);
        context.lineTo(-16, -8);
        context.lineTo(-16, 8);
        context.fill();
        context.stroke();
    };

    const draw = context => {
        context.save();
        context.translate(x, y);
        context.rotate(direction);

        drawBody(context);

        context.restore();

        context.strokeStyle = "black";
        context.beginPath();
        context.arc(x, y, Bug.VISIBILITY_RADIUS, 0, Math.PI * 2);
        context.stroke();
    };

    this.update = (timeStep, context, width, height) => {
        x += Math.cos(direction) * speed * timeStep;
        y += Math.sin(direction) * speed * timeStep;

        if (
            x < -Bug.VISIBILITY_RADIUS ||
            y < -Bug.VISIBILITY_RADIUS ||
            x > Bug.VISIBILITY_RADIUS + canvas.width ||
            y > Bug.VISIBILITY_RADIUS + canvas.height)
            return true;

        draw(context);

        return false;
    };
};

Bug.VISIBILITY_RADIUS = 80;