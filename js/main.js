const BUG_TIME_MINIMUM = 1;
const BUG_TIME_MAXIMUM = 2;
const TIME_STEP_MAX = 1;
const LENGTH_MIN = 1;
const LENGTH_MAX = 8;

const wrapper = document.getElementById("wrapper");
const canvas = document.getElementById("renderer");
const bugs = [];
let lastDate = new Date();
let bugTimer = 0;

const resize = () => {
    canvas.width = wrapper.offsetWidth;
    canvas.height = wrapper.offsetHeight;
};

const makeSpawnLocation = () => {
    let x, y;

    if (Math.random() < 0.5) {
        if (Math.random() < 0.5) {
            x = -Bug.SPAWN_RADIUS;
        }
        else {
            x = canvas.width + Bug.SPAWN_RADIUS;
        }

        y = Math.random() * canvas.height;
    }
    else {
        if (Math.random() < 0.5) {
            y = -Bug.SPAWN_RADIUS;
        }
        else {
            y = canvas.height + Bug.SPAWN_RADIUS;
        }

        x = Math.random() * canvas.width;
    }

    return {
        x: x,
        y: y
    };
};

const makeInitialLocation = () => {
    return {
        x: canvas.width * 0.5,
        y: canvas.height * 0.5
    };
};

const spawn = center => {
    let lastBug;
    const location = center ? makeInitialLocation() : makeSpawnLocation();
    const length = LENGTH_MIN + Math.floor(Math.random() * (LENGTH_MAX - LENGTH_MIN));
    const newBug = lastBug = new Bug(location.x, location.y, null);

    for (let i = 0; i < length; ++i) {
        const newSegment = new Bug(0, 0, lastBug, 24);

        lastBug.setChild(newSegment);

        lastBug = newSegment;
    }

    bugs.push(newBug);
};

const update = timeStep => {
    if (timeStep > TIME_STEP_MAX)
        timeStep = TIME_STEP_MAX;

    const context = canvas.getContext("2d");

    context.clearRect(0, 0, canvas.width, canvas.height);

    if ((bugTimer -= timeStep) < 0) {
        bugTimer = BUG_TIME_MINIMUM + (BUG_TIME_MAXIMUM - BUG_TIME_MINIMUM) * Math.random();

        spawn(false);
    }

    for (let i = bugs.length; i-- > 0;) {
        if (bugs[i].update(timeStep, canvas.width, canvas.height)) {
            bugs.splice(i, 1);
        }
        else {
            bugs[i].drawLegs(context);
            bugs[i].drawBody(context);
        }
    }
};

const loopFunction = () => {
    const date = new Date();

    update((date - lastDate) * 0.001);
    requestAnimationFrame(loopFunction);

    lastDate = date;
};

window.onresize = resize;

resize();
requestAnimationFrame(loopFunction);
spawn(true);