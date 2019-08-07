const Bug = function(x, y, parent, followDistance) {
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
            lifetime * Bug.SPEED_SCALE) * 120;
        direction = cubicNoiseSample2(
            noise,
            x * Bug.NOISE_SCALE,
            y * Bug.NOISE_SCALE) * Bug.NOISE_ANGLE_MAX;
    };

    const makeBody = () => {
        const l = new Leg(x, y, direction, -0.8, 32, 0, speed * 4);
        const r = new Leg(x, y, direction, 0.8, 32, 1, speed * 4);

        l.setCounterpart(r);
        r.setCounterpart(l);

        legs.push(l, r);
    };

    const drawBody = context => {
        context.fillStyle = "gray";
        context.strokeStyle = "black";
        context.beginPath();
        context.moveTo(20, 0);
        context.lineTo(-20, -12);
        context.lineTo(-20, 12);
        context.closePath();
        context.fill();
        context.stroke();
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

Bug.VISIBILITY_RADIUS = 400;
Bug.SPAWN_RADIUS = 200;
Bug.NOISE_SCALE = 0.0065;
Bug.NOISE_ANGLE_MAX = Math.PI * 6;
Bug.SPEED_SCALE = 0.1;