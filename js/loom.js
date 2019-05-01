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
  constructor(braid) { this.braid = braid; }

  get number_of_threads()       { return this.braid.threads.length; }
  get number_of_beads_per_row() { return this.number_of_threads / 2; }
  get total_beads()             { return this.braid.numThreads * this.braid.numBeads; }

  get woven_beads() {
    var count = 0;
    this.beads.forEach(function(row) { row.forEach(function(bead) { count++; }); });
    return count;
  }

  opposite_thread_index(thread_index) {
    return (thread_index + this.number_of_threads / 2) % this.number_of_threads;
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

    this.beads = [[], []];
    this.current_row_index = 0;

    while(this.woven_beads < this.total_beads) {
      this.step();
    }
  }

  step() {
    for (var i = 0; i < this.groups.length / 2; i++) {
      this.beads[0].push(this.groups[i].next_bead);
    }
    for (var i = this.groups.length / 2; i < this.groups.length; i++) {
      this.beads[1].push(this.groups[i].next_bead);
    }
  }
}
