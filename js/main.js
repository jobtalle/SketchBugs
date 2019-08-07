const BUG_TIME_MINIMUM = 2;
const BUG_TIME_MAXIMUM = 4;
const TIME_STEP_MAX = 0.2;
const LENGTH_MIN = 2;
const LENGTH_MAX = 10;

const wrapper = document.getElementById("wrapper");
const canvas = document.getElementById("renderer");
const bugs = [];
const factory = new BugFactory();
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
    const right = Math.random() < 0.5;
    const location = center ? makeInitialLocation() : makeSpawnLocation(right);

    bugs.push(factory.makeBug(right, location.x, location.y));
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