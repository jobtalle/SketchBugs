const BugFactory = function() {
    this.makeBug = (right, x, y) => {
        let lastBug;
        let legs = true;
        const lengthRandomizer = Math.random();
        const length = BugFactory.LENGTH_MIN + Math.floor(lengthRandomizer * lengthRandomizer * lengthRandomizer * (BugFactory.LENGTH_MAX - BugFactory.LENGTH_MIN + 1));
        const body = new BodyShape();
        const newBug = lastBug = new Bug(x, y, body, right, legs, null);
        const segments = [];
        const interleaveLegs = length >= BugFactory.INTERLEAVE_LEGS_THRESHOLD && (length & 1) === 1 && Math.random() < BugFactory.INTERLEAVE_LEGS_CHANCE;

        for (let i = 0; i < length - 1; ++i) {
            if (interleaveLegs)
                legs = !legs;

            const newSegment = new Bug(0, 0, body, right, legs, lastBug, body.getLength() * Bug.SEGMENT_OVERLAP);

            segments.push(newSegment);
            lastBug.setChild(newSegment);

            lastBug = newSegment;
        }

        if (length >= BugFactory.WING_LENGTH_MIN && length <= BugFactory.WING_LENGTH_MAX && Math.random() < BugFactory.WING_CHANCE) {
            const wingSize = Math.max(body.getThickness() * BugFactory.WING_SCALE * length, BugFactory.WING_SIZE_MIN);

            if (length <= BugFactory.WING_ROOT_THRESHOLD)
                newBug.setWings(new Wings(wingSize));
            else
                segments[0].setWings(new Wings(wingSize));
        }

        return newBug;
    };
};

BugFactory.WING_CHANCE = 0.8;
BugFactory.WING_LENGTH_MIN = 2;
BugFactory.WING_LENGTH_MAX = 4;
BugFactory.WING_SIZE_MIN = 70;
BugFactory.WING_ROOT_THRESHOLD = 2;
BugFactory.WING_SCALE = 1;
BugFactory.LENGTH_MIN = 2;
BugFactory.LENGTH_MAX = 10;
BugFactory.INTERLEAVE_LEGS_THRESHOLD = 3;
BugFactory.INTERLEAVE_LEGS_CHANCE = 0.7;