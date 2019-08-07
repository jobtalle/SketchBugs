const BUG_TIME_MINIMUM = 2;
const BUG_TIME_MAXIMUM = 4;
const TIME_STEP_MAX = 0.2;
const LENGTH_MIN = 2;
const LENGTH_MAX = 12;

const wrapper = document.getElementById("wrapper");
const canvas = document.getElementById("renderer");
const bugs = [];
let lastDate = new Date();
let bugTimer = 0;

const resize = () => {
    canvas.width = wrapper.offsetWidth;
    canvas.height = wrapper.offsetHeight;
};

const makeSpawnLocation = right => {
    if (right)
        return {
            x: canvas.width + Bug.SPAWN_RADIUS,
            y: canvas.height * Math.random()
        };
    else
        return {
            x: -Bug.SPAWN_RADIUS,
            y: canvas.height * Math.random()
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
    const right = Math.random() < 0.5;
    const location = center ? makeInitialLocation() : makeSpawnLocation(right);
    const lengthRandomizer = Math.random();
    const length = LENGTH_MIN + Math.floor(lengthRandomizer * lengthRandomizer * (LENGTH_MAX - LENGTH_MIN + 1)) - 1;
    const body = new BodyShape();
    const newBug = lastBug = new Bug(location.x, location.y, body, right, null);

    for (let i = 0; i < length; ++i) {
        const newSegment = new Bug(0, 0, body, right, lastBug, body.getLength() * Bug.SEGMENT_OVERLAP);

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