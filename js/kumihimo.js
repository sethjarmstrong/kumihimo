class Bead {
  constructor(colour = 'red') {
    this.colour = colour;
  }
}

class Thread {
  constructor(numBeads) {
    this.beads = [];

    for (var i = 0; i < numBeads; i++) {
      this.beads.push(new Bead());
    }
  }
}

class Braid {
  constructor(numThreads, numBeads) {
    this.numThreads = numThreads;
    this.numBeads = numBeads;

    this.threads = [];

    for (var i = 0; i < numThreads; i++) {
      this.threads.push(new Thread(numBeads));
    }
  }
}
