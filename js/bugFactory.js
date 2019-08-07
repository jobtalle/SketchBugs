const BugFactory = function() {
    this.makeBug = (right, x, y) => {
        let lastBug;
        const lengthRandomizer = Math.random();
        const length = LENGTH_MIN + Math.floor(lengthRandomizer * lengthRandomizer * lengthRandomizer * (LENGTH_MAX - LENGTH_MIN + 1)) - 1;
        const body = new BodyShape();
        const newBug = lastBug = new Bug(x, y, body, right, null);

        for (let i = 0; i < length; ++i) {
            const newSegment = new Bug(0, 0, body, right, lastBug, body.getLength() * Bug.SEGMENT_OVERLAP);

            lastBug.setChild(newSegment);

            lastBug = newSegment;
        }

        return newBug;
    };
};