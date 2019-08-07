const Bug = function(x, y, body, right, parent, followDistance) {
    const legs = [];
    const noise = cubicNoiseConfig(Math.random());
    const eyeRadius = Math.max(body.getThickness() * 0.5 * Math.random(), Bug.EYE_RADIUS_MIN);
    const eyeSpacing = (body.getThickness() * 0.5 - eyeRadius) * Math.random();
    const pupilRadius = eyeRadius * Bug.EYE_PUPIL_RATIO;
    let child = null;
    let wings = null;
    let lifetime = 0;
    let speed;
    let direction;
    let blinkDelay = 0;
    let blink = true;

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
            y * Bug.NOISE_SCALE) * Math.PI * 2;

        if (!right)
            direction += Math.PI;
    };

    const makeBody = () => {
        const legLength = Math.max(Bug.LEG_LENGTH_MIN, body.getThickness() * Bug.LEG_SCALE);
        const l = new Leg(x, y, direction, -body.getLegAngle(), legLength, Math.random(), speed * 4);
        const r = new Leg(x, y, direction, body.getLegAngle(), legLength, Math.random(), speed * 4);

        l.setCounterpart(r);
        r.setCounterpart(l);

        legs.push(l, r);
    };

    const drawEye = (x, y, eyeRadius, pupilRadius, context) => {
        const eyeAngle = (cubicNoiseSample1(noise, lifetime * Bug.EYE_SCALE) - 0.5) * Bug.EYE_DEVIANCE;

        context.save();

        context.translate(x + eyeRadius, y);
        context.fillStyle = "white";
        context.strokeStyle = "black";

        context.beginPath();
        context.arc(0, 0, eyeRadius, 0, Math.PI * 2);
        context.fill();
        context.stroke();

        context.rotate(eyeAngle);

        context.beginPath();

        if (blink) {
            context.strokeStyle = "black";
            context.moveTo(eyeRadius - pupilRadius, -pupilRadius);
            context.lineTo(eyeRadius - pupilRadius, pupilRadius);
            context.stroke();
        }
        else {
            context.fillStyle = "black";
            context.arc(
                eyeRadius - pupilRadius,
                0,
                pupilRadius,
                0,
                Math.PI * 2);
            context.fill();
        }

        context.restore();
    };

    const drawEyes = context => {
        drawEye(0, -eyeRadius - eyeSpacing * 0.5, eyeRadius, pupilRadius, context);
        drawEye(0, eyeRadius + eyeSpacing * 0.5, eyeRadius, pupilRadius, context);
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

    this.setWings = w => {
        wings = w;
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

        if (wings)
            wings.draw(context, lifetime);

        context.restore();
    };

    this.update = (timeStep, width, height) => {
        lifetime += timeStep;

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
            x += Math.cos(direction) * speed * timeStep;
            y += Math.sin(direction) * speed * timeStep;

            sampleMotion();

            if ((blinkDelay -= timeStep) < 0) {
                if (blink)
                    blinkDelay = Bug.EYE_BLINK_DELAY_MIN + (Bug.EYE_BLINK_DELAY_MAX - Bug.EYE_BLINK_DELAY_MIN) * Math.random();
                else
                    blinkDelay = Bug.EYE_BLINK_DURATION;

                blink = !blink;
            }
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
Bug.SPEED_SCALE = 0.3;
Bug.SEGMENT_OVERLAP = 0.4;
Bug.LEG_SCALE = 1.5;
Bug.LEG_LENGTH_MIN = 18;
Bug.SPEED_MAX = 160;
Bug.EYE_SCALE = 1.5;
Bug.EYE_DEVIANCE = Math.PI;
Bug.EYE_BLINK_DELAY_MIN = 1;
Bug.EYE_BLINK_DELAY_MAX = 4;
Bug.EYE_BLINK_DURATION = 0.1;
Bug.EYE_PUPIL_RATIO = 2 / 5;
Bug.EYE_RADIUS_MIN = 5;