class Grouping {
  constructor(threads) {
    this.threads = threads;
  }

  get next_thread() {
    return this.threads.pop();
  }

  add_thread(thread) {
    this.threads.unshift(thread);
  }
}

class Pair {
  constructor(active_grouping, opposite_grouping) {
    this.active_grouping = active_grouping;
    this.opposite_grouping = opposite_grouping;
  }

  move_threads() {
    // Physically move the threads.
    var active_thread = this.active_grouping.next_thread;
    var opposite_thread = this.opposite_grouping.next_thread;
    this.opposite_grouping.add_thread(active_thread);
    this.active_grouping.add_thread(opposite_thread);

    // Swap which thread is the active.
    var temp = this.active_grouping;
    this.active_grouping = this.opposite_grouping;
    this.opposite_grouping = temp;

    // Get the beads which should be put on the braid next.
    var beads = [active_thread.next_bead(), opposite_thread.next_bead()];
    return beads;
  }
}

class Loom {
  constructor(braid) {
    this.braid = braid;
  }

  opposite_thread_index(thread_index) {
    return (thread_index + this.number_of_threads / 2) % this.number_of_threads;
  }

  get opposite_bead_index() {
    var beads_to_skip_over = (this.braid.threads.length - 4) / 4;
    return this.current_bead_index + beads_to_skip_over + 1;
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
    this.pairs = [];

    for (var i = 0; i < threads.length / 2; i += 2) {
      var prior_index = this.normalize_thread_index(i - 1);
      this.pairs.push(
        new Pair(
          new Grouping([threads[prior_index], threads[i]]),
          new Grouping([threads[this.opposite_thread_index(prior_index)], threads[this.opposite_thread_index(i)]])
        )
      );
    }

    this.current_pair_index = 0;
    this.beads = [[]];
    this.current_row_index = 0;
    this.current_bead_index = 0;

    while(this.woven_beads < this.total_beads) {
      this.step();
    }
  }

  step() {
    if (this.current_bead_row.length == this.number_of_beads_per_row) {
      this.create_row();
    }

    var beads = this.pairs[this.current_pair_index].move_threads();
    this.current_bead_row[this.current_bead_index] = beads[0];
    this.current_bead_row[this.opposite_bead_index] = beads[1];

    this.current_pair_index = (this.current_pair_index + 1) % this.pairs.length;
    this.current_bead_index++;
  }

  create_row() {
    this.beads[++this.current_row_index] = [];
    this.current_bead_index = 0;
  }
}
