const BUG_TIME_MINIMUM = 1;
const BUG_TIME_MAXIMUM = 2;
const TIME_STEP_MAX = 1;

const wrapper = document.getElementById("wrapper");
const canvas = document.getElementById("renderer");
const bugs = [];
let lastDate = new Date();
let bugTimer = 0;

const resize = () => {
    canvas.width = wrapper.offsetWidth;
    canvas.height = wrapper.offsetHeight;
};

const spawn = () => {
    const newBug = new Bug(canvas.width * Math.random(), canvas.height * Math.random(), null);
    const child1 = new Bug(0, 0, newBug, 32);
    const child2 = new Bug(0, 0, child1, 32);

    newBug.setChild(child1);
    child1.setChild(child2);

    bugs.push(newBug);
};

const update = timeStep => {
    if (timeStep > TIME_STEP_MAX)
        timeStep = TIME_STEP_MAX;

    const context = canvas.getContext("2d");

    context.clearRect(0, 0, canvas.width, canvas.height);

    if ((bugTimer -= timeStep) < 0) {
        bugTimer = BUG_TIME_MINIMUM + (BUG_TIME_MAXIMUM - BUG_TIME_MINIMUM) * Math.random();

        spawn();
    }

    for (let i = bugs.length; i-- > 0;) {
        if (bugs[i].update(timeStep, canvas.width, canvas.height)) {
            bugs.splice(i, 1);
        }

        bugs[i].drawLegs(context);
        bugs[i].drawBody(context);
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