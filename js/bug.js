const Bug = function(x, y, body, parent, followDistance) {
    const legs = [];
    const noise = cubicNoiseConfig(Math.random());
    let child = null;
    let lifetime = 0;
    let speed;
    let direction;

    if (parent) {
        x = parent.getX() + Math.cos(parent.getDirection()) * -followDistance;
        y = parent.getY() + Math.sin(parent.getDirection()) * -followDistance;
        direction = parent.getDirection();
    }

    const sampleMotion = () => {
        speed = cubicNoiseSample1(
            noise,
            lifetime * Bug.SPEED_SCALE) * Bug.SPEED_MAX;
        direction = cubicNoiseSample2(
            noise,
            x * Bug.NOISE_SCALE,
            y * Bug.NOISE_SCALE) * Bug.NOISE_ANGLE_MAX;
    };

    const makeBody = () => {
        const legLength = Math.max(Bug.LEG_LENGTH_MIN, body.getThickness() * Bug.LEG_SCALE);
        const l = new Leg(x, y, direction, -body.getLegAngle(), legLength, 0, speed * 4);
        const r = new Leg(x, y, direction, body.getLegAngle(), legLength, 1, speed * 4);

        l.setCounterpart(r);
        r.setCounterpart(l);

        legs.push(l, r);
    };

    const drawEye = (x, y, context) => {
        const eyeAngle = (cubicNoiseSample1(noise, lifetime * Bug.EYE_SCALE) - 0.5) * Bug.EYE_DEVIANCE;

        context.fillStyle = "white";
        context.strokeStyle = "black";

        context.beginPath();
        context.arc(x, y, 5, 0, Math.PI * 2);
        context.fill();
        context.stroke();

        context.fillStyle = "black";

        context.beginPath();
        context.arc(
            x + Math.cos(eyeAngle) * 3,
            y + Math.sin(eyeAngle) * 3,
            2,
            0,
            Math.PI * 2);
        context.fill();
    };

    const drawEyes = context => {
        drawEye(12, -6, context);
        drawEye(12, 6, context);
    };

    const drawBody = context => {
        body.draw(context);
    };

    this.getX = () => x;

    this.getY = () => y;

    this.getDirection = () => direction;

    this.getSpeed = () => speed;

    this.setChild = bug => {
        child = bug;
    };

    this.drawLegs = context => {
        if (child)
            child.drawLegs(context);

        for (const leg of legs)
            leg.draw(context);
    };

    this.drawBody = context => {
        if (child)
            child.drawBody(context);

        context.save();
        context.translate(x, y);
        context.rotate(direction);

        drawBody(context);

        if (!parent)
            drawEyes(context);

        context.restore();
    };

    this.update = (timeStep, width, height) => {
        if (parent) {
            const dx = parent.getX() - x;
            const dy = parent.getY() - y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            x += (dx / distance) * (distance - followDistance);
            y += (dy / distance) * (distance - followDistance);

            direction = Math.atan2(dy, dx);
            speed = parent.getSpeed();
        }
        else {
            lifetime += timeStep;

            x += Math.cos(direction) * speed * timeStep;
            y += Math.sin(direction) * speed * timeStep;

            sampleMotion();
        }

        if (child)
            child.update(timeStep, width, height);

        for (const leg of legs)
            leg.update(x, y, direction, speed * 4, timeStep);

        return x < -Bug.VISIBILITY_RADIUS ||
            y < -Bug.VISIBILITY_RADIUS ||
            x > Bug.VISIBILITY_RADIUS + width ||
            y > Bug.VISIBILITY_RADIUS + height;
    };

    if (!parent)
        sampleMotion();

    makeBody();
};

Bug.VISIBILITY_RADIUS = 500;
Bug.SPAWN_RADIUS = 400;
Bug.NOISE_SCALE = 0.0065;
Bug.NOISE_ANGLE_MAX = Math.PI * 6;
Bug.SPEED_SCALE = 0.1;
Bug.SEGMENT_OVERLAP = 0.4;
Bug.LEG_SCALE = 1.5;
Bug.LEG_LENGTH_MIN = 18;
Bug.SPEED_MAX = 160;
Bug.EYE_SCALE = 1.5;
Bug.EYE_DEVIANCE = Math.PI;