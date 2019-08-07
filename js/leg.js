const Leg = function(x, y, bugDirection, direction, length, initialProgress, airSpeed) {
    let onGround = true;
    let footX = x + Math.cos(bugDirection + direction) * length;
    let footY = y + Math.sin(bugDirection + direction) * length;

    const applyInitialProgress = () => {
        const dist = Math.cos(direction) * length * -2 * initialProgress;

        footX += Math.cos(bugDirection) * dist;
        footY += Math.sin(bugDirection) * dist;
    };

    const draw = (context, dist) => {
        const elbowAngle = Math.acos(dist / length) * Math.sign(direction);
        const footDirection = Math.atan2(footY - y, footX - x);
        const elbowX = x + Math.cos(footDirection + elbowAngle) * length * 0.5;
        const elbowY = y + Math.sin(footDirection + elbowAngle) * length * 0.5;

        context.fillStyle = "blue";

        context.beginPath();
        context.arc(footX, footY, 8, 0, Math.PI * 2);
        context.fill();

        context.strokeStyle = "black";

        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(elbowX, elbowY);
        context.lineTo(footX, footY);
        context.stroke();
    };

    this.update = (newX, newY, bugDirection, timeStep, context) => {
        x = newX;
        y = newY;

        const dx = footX - x;
        const dy = footY - y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (onGround) {
            if (dist > length)
                onGround = false;
        }
        else {
            const xAim = x + Math.cos(bugDirection + direction) * length;
            const yAim = y + Math.sin(bugDirection + direction) * length;
            const dxAim = xAim - footX;
            const dyAim = yAim - footY;
            const lengthAim = Math.sqrt(dxAim * dxAim + dyAim * dyAim);

            if (lengthAim < length * (1 - Leg.GROUND_THRESHOLD))
                onGround = true;

            footX += (dxAim / lengthAim) * airSpeed * timeStep;
            footY += (dyAim / lengthAim) * airSpeed * timeStep;
        }

        draw(context, dist);
    };

    applyInitialProgress();
};

Leg.GROUND_THRESHOLD = 0.95;