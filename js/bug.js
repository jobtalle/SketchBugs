const Bug = function(x, y) {
    const legs = [];
    let speed = 80;
    let direction = Math.random() * Math.PI * 2;
    let aim = direction;

    const makeBody = () => {
        legs.push(
            new Leg(x, y, direction, 0.4, 64, 128),
            new Leg(x, y, direction, -0.4, 64, 128)
        );
    };

    const drawBody = context => {
        context.fillStyle = "yellow";
        context.strokeStyle = "black";
        context.beginPath();
        context.moveTo(16, 0);
        context.lineTo(-16, -8);
        context.lineTo(-16, 8);
        context.closePath();
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

        for (const leg of legs)
            leg.update(x, y, direction, timeStep, context);

        if (
            x < -Bug.VISIBILITY_RADIUS ||
            y < -Bug.VISIBILITY_RADIUS ||
            x > Bug.VISIBILITY_RADIUS + width ||
            y > Bug.VISIBILITY_RADIUS + height)
            return true;

        draw(context);

        return false;
    };

    makeBody();
};

Bug.VISIBILITY_RADIUS = 80;