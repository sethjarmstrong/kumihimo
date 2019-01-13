// String 0, its opposite
// String 7, its opposite
// String 2, its opposite
// String 1, its opposite

class Group {
  constructor(threads) {
    this.threads = threads;
    this.index = 0;
  }

  get next_bead() {
    var thread = this.threads[this.index];
    this.index = (this.index + 1) % this.threads.length;
    return thread.next_bead();
  }
}

class Loom {
  constructor(braid) {
    this.braid = braid;
  }

  opposite_thread_index(thread_index) {
    return (thread_index + this.number_of_threads / 2) % this.number_of_threads;
  }

  get number_of_threads() {
    return this.braid.threads.length;
  }

  get number_of_beads_per_row() {
    return this.number_of_threads / 2;
  }

  get current_bead_row() {
    return this.beads[this.current_row_index];
  }

  get woven_beads() {
    var count = 0;
    this.beads.forEach(function(row) {
      row.forEach(function(bead) {
        count++;
      });
    });
    return count;
  }

  get total_beads() {
    return this.braid.numThreads * this.braid.numBeads;
  }

  normalize_thread_index(index) {
    if (index < 0) {
      return (index + this.braid.threads.length) % this.braid.threads.length;
    }
    return index % this.braid.threads.length;
  }

  weave() {
    this.braid.reset_beading();

    var threads = this.braid.threads;
    this.groups = [];

    for (var i = 0; i < threads.length; i += 2) {
      var prior_index = this.normalize_thread_index(i - 1);

      this.groups.push(
        new Group(
          [
            threads[i],
            threads[prior_index],
            threads[this.opposite_thread_index(i)],
            threads[this.opposite_thread_index(prior_index)]
          ]
        )
      );
    }

    this.beads = [[]];
    this.current_row_index = 0;

    while(this.woven_beads < this.total_beads) {
      this.step();
    }
  }

  step() {
    if (this.current_bead_row.length == this.number_of_beads_per_row) {
      this.create_row();
    }

    for (var i = 0; i < this.groups.length; i++) {
      this.current_bead_row.push(this.groups[i].next_bead);
    }
  }

  create_row() {
    this.beads[++this.current_row_index] = [];
  }
}
