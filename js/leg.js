const Leg = function(x, y, bugDirection, direction, length, airSpeed) {
    let onGround = true;
    let footX = x + Math.cos(bugDirection + direction) * length;
    let footY = y + Math.sin(bugDirection + direction) * length;

    const draw = context => {
        context.fillStyle = "blue";

        context.beginPath();
        context.arc(footX, footY, 8, 0, Math.PI * 2);
        context.fill();

        context.strokeStyle = "black";

        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(footX, footY);
        context.stroke();
    };

    this.update = (newX, newY, bugDirection, timeStep, context) => {
        x = newX;
        y = newY;

        if (onGround) {
            const dx = footX - x;
            const dy = footY - y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > length)
                onGround = false;
        }
        else {
            const xAim = x + Math.cos(bugDirection + direction) * length;
            const yAim = y + Math.sin(bugDirection + direction) * length;

            footX = xAim;
            footY = yAim;

            onGround = true;
        }

        draw(context);
    };
};