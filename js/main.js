const BUG_TIME_MINIMUM = 2;
const BUG_TIME_MAXIMUM = 3;
const TIME_STEP_MAX = 0.2;

const fps = 1 / 60;
const wrapper = document.getElementById("wrapper");
const canvas = document.getElementById("renderer");
const context = canvas.getContext("2d");
const bugs = [];
const bugSeed = Math.floor(Math.random() * Random.MODULUS);
const random = new Random(Math.floor(Math.random() * Random.MODULUS));
const factory = new BugFactory();
let bugTimer = 0;

const resize = () => {
    canvas.width = wrapper.offsetWidth;
    canvas.height = wrapper.offsetHeight;
};

const makeSpawnLocation = right => {
    if (right)
        return {
            x: canvas.width + Bug.SPAWN_RADIUS,
            y: (canvas.height + Bug.SPAWN_RADIUS) * random.getFloat() - Bug.SPAWN_RADIUS * .5
        };
    else
        return {
            x: -Bug.SPAWN_RADIUS,
            y: (canvas.height + Bug.SPAWN_RADIUS) * random.getFloat() - Bug.SPAWN_RADIUS * .5
        };
};

const makeInitialLocation = () => {
    return {
        x: canvas.width * 0.5,
        y: canvas.height * 0.5
    };
};

const spawn = center => {
    const right = random.getFloat() < 0.5;
    const location = center ? makeInitialLocation() : makeSpawnLocation(right);

    bugs.push(factory.makeBug(new Random(bugSeed), right, location.x, location.y, random.getFloat() * 160));
};

const update = (timeStep, render = true) => {
    if (timeStep > TIME_STEP_MAX)
        timeStep = TIME_STEP_MAX;

    if (render)
        context.clearRect(0, 0, canvas.width, canvas.height);

    if ((bugTimer -= timeStep * canvas.width * canvas.height / 750000) < 0) {
        bugTimer = BUG_TIME_MINIMUM + (BUG_TIME_MAXIMUM - BUG_TIME_MINIMUM) * random.getFloat();

        spawn(false);
    }

    for (let i = bugs.length; i-- > 0;) {
        if (bugs[i].update(timeStep, canvas.width, canvas.height)) {
            bugs.splice(i, 1);
        }
        else if (render) {
            bugs[i].drawLegs(context);
            bugs[i].drawBody(context);
        }
    }
};

const loopFunction = () => {
    update(fps);
    requestAnimationFrame(loopFunction);
};

window.onresize = resize;

resize();
requestAnimationFrame(loopFunction);

for (let i = 0; i < 1500; ++i)
    update(fps, false);

spawn(true);