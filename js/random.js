const Random = function(n) {
    this.getFloat = () => {
        n = (96096 * n + 1) % Random.MODULUS;

        return n / Random.MODULUS;
    }
}

Random.MULTIPLIER = 96096;
Random.MODULUS = 2 ** 32 - 1;
Random.INCREMENT = 1;