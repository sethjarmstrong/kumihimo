class Loom {
  constructor(braid) {
    this.braid = braid;
  }

  get opposite_thread_index() {
    return (this.current_thread_index + this.number_of_threads / 2) % this.number_of_threads;
  }

  get opposite_bead_index() {
    var beads_to_skip_over = (this.threads.length - 4) / 4;
    return this.current_bead_index + beads_to_skip_over + 1;
  }

  get number_of_threads() {
    return this.threads.length;
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

  weave() {
    this.braid.reset_beading();
    this.threads = this.braid.threads.slice();
    this.beads = [[]];
    this.current_thread_index = 0;
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

    this.weave_thread(this.current_thread_index, this.current_bead_index);
    this.weave_thread(this.opposite_thread_index, this.opposite_bead_index);
    this.current_thread_index = (this.current_thread_index + 1) % this.number_of_threads;
    this.current_bead_index++;
  }

  create_row() {
    this.beads[++this.current_row_index] = [];
    this.current_bead_index = 0;
  }

  weave_thread(thread_index, bead_index) {
    var thread = this.threads[thread_index];
    var bead = thread.next_bead();
    bead.thread = thread;
    this.current_bead_row[bead_index] = bead;
    var threads_to_pass_over = (this.threads.length - 4) / 2;
    thread = this.threads[thread_index];

    for (var i = 0; i < threads_to_pass_over; i++) {
      var next_index = (thread_index + 1) % this.number_of_threads;
      var temp = this.threads[next_index];
      this.threads[next_index] = thread;
      this.threads[thread_index] = temp;
      thread_index = next_index;
    }
  }
}
