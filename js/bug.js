const Bug = function(random, motionOffset, x, y, body, right, hasLegs, parent, followDistance) {
    const legs = [];
    const noise = cubicNoiseConfig(random.getFloat());
    const eyeRadius = Math.max(body.getThickness() * 0.5 * random.getFloat() * Bug.EYE_RADIUS_FACTOR_MAX, Bug.EYE_RADIUS_MIN);
    const eyeSpacing = (body.getThickness() * 0.5 - eyeRadius) * random.getFloat();
    const eyeScale = Bug.EYE_SCALE_MIN + (Bug.EYE_SCALE_MAX - Bug.EYE_SCALE_MIN) * random.getFloat();
    const pupilRadius = eyeRadius * Bug.EYE_PUPIL_RATIO;
    const speedScale = Bug.SPEED_SCALE_MIN + (Bug.SPEED_SCALE_MAX - Bug.SPEED_SCALE_MIN) * random.getFloat();
    const noiseScale = Bug.NOISE_SCALE_MIN + (Bug.NOISE_SCALE_MAX - Bug.NOISE_SCALE_MIN) * random.getFloat();
    const speedMax = Bug.SPEED_MAX_MIN + (Bug.SPEED_MAX_MAX - Bug.SPEED_MAX_MIN) * random.getFloat();
    const eyeDeviance = Bug.EYE_DEVIANCE_MIN + (Bug.EYE_DEVIANCE_MAX - Bug.EYE_DEVIANCE_MIN) * random.getFloat();
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
            lifetime * speedScale) * speedMax;
        direction = cubicNoiseSample2(
            noise,
            x * noiseScale,
            (y + motionOffset) * noiseScale) * Math.PI * 2;

        if (!right)
            direction += Math.PI;
    };

    const makeBody = () => {
        if (!hasLegs)
            return;

        const l = new Leg(x, y, direction, -body.getLegAngle(), body.getLegLength(), random.getFloat(), speed * 4);
        const r = new Leg(x, y, direction, body.getLegAngle(), body.getLegLength(), random.getFloat(), speed * 4);

        l.setCounterpart(r);
        r.setCounterpart(l);

        legs.push(l, r);
    };

    const drawEye = (x, y, eyeRadius, pupilRadius, context) => {
        const eyeAngle = (cubicNoiseSample1(noise, lifetime * eyeScale) - 0.5) * eyeDeviance;

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
                    blinkDelay = Bug.EYE_BLINK_DELAY_MIN + (Bug.EYE_BLINK_DELAY_MAX - Bug.EYE_BLINK_DELAY_MIN) * random.getFloat();
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

Bug.VISIBILITY_RADIUS = 250;
Bug.SPAWN_RADIUS = 200;
Bug.NOISE_SCALE_MIN = 0.003;
Bug.NOISE_SCALE_MAX = 0.01;
Bug.SPEED_SCALE_MIN = 0.1;
Bug.SPEED_SCALE_MAX = 0.6;
Bug.SEGMENT_OVERLAP = 0.4;
Bug.SPEED_MAX_MIN = 100;
Bug.SPEED_MAX_MAX = 180;
Bug.EYE_SCALE_MIN = 0.2;
Bug.EYE_SCALE_MAX = 1.8;
Bug.EYE_DEVIANCE_MIN = Math.PI * 0.8;
Bug.EYE_DEVIANCE_MAX = Math.PI * 1.5;
Bug.EYE_BLINK_DELAY_MIN = 1;
Bug.EYE_BLINK_DELAY_MAX = 4;
Bug.EYE_BLINK_DURATION = 0.1;
Bug.EYE_PUPIL_RATIO = 2 / 5;
Bug.EYE_RADIUS_MIN = 5;
Bug.EYE_RADIUS_FACTOR_MAX = 0.8;