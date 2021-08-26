const Wings = function(radius) {
    const noise = cubicNoiseConfig(random.getFloat());
    const radians = Wings.RADIANS_MIN + (Wings.RADIANS_MAX - Wings.RADIANS_MIN) * random.getFloat();
    const radii = [];

    const drawWing = (context, sign, step) => {
        let a = Math.PI;

        context.beginPath();
        context.moveTo(0, 0);

        for (const radius of radii) {
            context.lineTo(Math.cos(a) * radius, Math.sin(a) * radius);

            a += step * sign;
        }

        context.closePath();
        context.fill();
        context.stroke();
    };

    this.draw = (context, lifetime) => {
        const step = radians / Wings.PRECISION;
        const amp = Math.pow(cubicNoiseSample1(noise, lifetime * Wings.SPEED_ACTIVATE), Wings.FLUTTER_ACTIVATION_POWER);
        const angle = (cubicNoiseSample1(noise, lifetime * Wings.SPEED_FLUTTER) - 0.5) * Wings.AMPLITUDE * amp;

        context.fillStyle = Wings.COLOR;
        context.strokeStyle = "black";

        context.save();
        context.rotate(-angle);

        drawWing(context, 1, step);

        context.restore();
        context.save();
        context.rotate(angle);

        drawWing(context, -1, step);

        context.restore();
    };

    for (let i = 0; i < Wings.PRECISION; ++i)
        radii.push(Math.sin((i / (Wings.PRECISION - 1)) * Math.PI) * radius);
};

Wings.COLOR = "rgba(200,200,200,0.4)";
Wings.PRECISION = 18;
Wings.RADIANS_MIN = Math.PI * 0.2;
Wings.RADIANS_MAX = Math.PI * 0.5;
Wings.SPEED_FLUTTER = 12;
Wings.SPEED_ACTIVATE = 0.3;
Wings.AMPLITUDE = Math.PI;
Wings.FLUTTER_ACTIVATION_POWER = 4;