class Bead {
  constructor(colour = '#ffffff') {
    this.colour = colour;
  }
}

class Thread {
  constructor(numBeads) {
    this.beads = [];
    this.current_bead = 0;
    this.set_beads(numBeads);
  }

  change_colour(colour) {
    this.beads.forEach(function(bead) {
      bead.colour = colour;
    });
  }

  next_bead() {
    if (this.current_bead == this.beads.length) {
      return null;
    }
    return this.beads[this.current_bead++];
  }

  add_bead() {
    this.beads.push(new Bead());
  }

  remove_bead() {
    this.beads.pop();
  }

  set_beads(amount) {
    while (this.beads.length > amount) {
      this.remove_bead();
    }

    while (this.beads.length < amount) {
      this.add_bead();
    }
  }
}

class Braid {
  constructor(numThreads, numBeads, beadsPerRow, beadStep) {
    this.numThreads = 0;
    this.numBeads = numBeads;
    this.beadsPerRow = beadsPerRow;
    this.beadStep = beadStep;
    this.threads = [];

    this.add_threads(numThreads);
  }

  add_threads(amount) {
    this.numThreads += amount;

    while (this.threads.length < this.numThreads) {
      this.threads.push(new Thread(this.numBeads));
    }
  }

  remove_threads(amount) {
    this.numThreads -= amount;

    while (this.threads.length > this.numThreads) {
      this.threads.pop();
    }
  }

  set_beads(amount) {
    this.numBeads = amount;
    for (var i = 0; i < this.numThreads; i++) {
      this.threads[i].set_beads(amount);
    }
  }

  reset_beading() {
    this.threads.forEach(function(thread) {
      thread.current_bead = 0;
    });
  }
}
