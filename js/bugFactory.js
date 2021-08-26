const BugFactory = function() {
    this.makeBug = (random, right, x, y) => {
        let lastBug;
        let legs = true;
        const lengthRandomizer = random.getFloat();
        const length = BugFactory.LENGTH_MIN + Math.floor(lengthRandomizer * lengthRandomizer * lengthRandomizer * (BugFactory.LENGTH_MAX - BugFactory.LENGTH_MIN + 1));
        const body = new BodyShape(random);
        const interleaveLegs = length >= BugFactory.INTERLEAVE_LEGS_THRESHOLD && random.getFloat() < BugFactory.INTERLEAVE_LEGS_CHANCE;
        const newBug = lastBug = new Bug(random, x, y, body, right, interleaveLegs ? (legs = (length & 1) === 1) : legs, null);
        const segments = [];

        for (let i = 0; i < length - 1; ++i) {
            if (interleaveLegs)
                legs = !legs;

            const newSegment = new Bug(random, 0, 0, body, right, legs, lastBug, body.getLength() * Bug.SEGMENT_OVERLAP);

            segments.push(newSegment);
            lastBug.setChild(newSegment);

            lastBug = newSegment;
        }

        if (length >= BugFactory.WING_LENGTH_MIN && length <= BugFactory.WING_LENGTH_MAX && random.getFloat() < BugFactory.WING_CHANCE) {
            const wingSize = Math.max(body.getThickness() * BugFactory.WING_SCALE * length, BugFactory.WING_SIZE_MIN);

            if (length <= BugFactory.WING_ROOT_THRESHOLD)
                newBug.setWings(new Wings(random, wingSize));
            else
                segments[0].setWings(new Wings(random, wingSize));
        }

        return newBug;
    };
};

BugFactory.WING_CHANCE = 0.6;
BugFactory.WING_LENGTH_MIN = 2;
BugFactory.WING_LENGTH_MAX = 4;
BugFactory.WING_SIZE_MIN = 70;
BugFactory.WING_ROOT_THRESHOLD = 2;
BugFactory.WING_SCALE = 1;
BugFactory.LENGTH_MIN = 2;
BugFactory.LENGTH_MAX = 10;
BugFactory.INTERLEAVE_LEGS_THRESHOLD = 3;
BugFactory.INTERLEAVE_LEGS_CHANCE = 0.7;