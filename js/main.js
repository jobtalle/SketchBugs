const BUG_TIME_MINIMUM = 1;
const BUG_TIME_MAXIMUM = 2;

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
    bugs.push(new Bug(canvas.width * Math.random(), canvas.height * Math.random()));
};

const update = timeStep => {
    const context = canvas.getContext("2d");

    context.clearRect(0, 0, canvas.width, canvas.height);

    if ((bugTimer -= timeStep) < 0) {
        bugTimer = BUG_TIME_MINIMUM + (BUG_TIME_MAXIMUM - BUG_TIME_MINIMUM) * Math.random();

        spawn();
    }

    for (let i = bugs.length; i-- > 0;)
        if (bugs[i].update(timeStep, context, canvas.width, canvas.height))
            bugs.splice(i, 1);
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