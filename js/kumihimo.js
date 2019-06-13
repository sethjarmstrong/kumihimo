class Bead {
  constructor(colour = '#ffffff') {
    this.colour = colour;
  }
}

class Thread {
  constructor(num_beads) {
    this.beads = [];
    this.current_bead = 0;
    this.set_beads_from_the_bottom(num_beads);
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

  add_bead_to_the_top() {
    this.beads.unshift(new Bead());
  }

  add_bead_to_the_bottom() {
    this.beads.push(new Bead());
  }

  remove_bead_from_the_top() {
    this.beads.shift();
  }

  remove_bead_from_the_bottom() {
    this.beads.pop();
  }

  set_beads(amount, removal_method, addition_method) {
    while (this.beads.length > amount) {
      removal_method.call(this);
    }

    while (this.beads.length < amount) {
      addition_method.call(this);
    }
  }

  set_beads_from_the_top(amount) {
    this.set_beads(amount, this.remove_bead_from_the_top, this.add_bead_to_the_top);
  }

  set_beads_from_the_bottom(amount) {
    this.set_beads(amount, this.remove_bead_from_the_bottom, this.add_bead_to_the_bottom);
  }
}

class Braid {
  constructor(parameters, three_d_parameters) {
    this.parameters = parameters;
    this.three_d_parameters = three_d_parameters;
    this.threads = [];

    this.set_threads(this.parameters.num_threads);
  }

  set_threads(amount) {
    this.remove_threads(this.parameters.num_threads);
    this.add_threads(amount);
  }

  add_threads(amount) {
    this.parameters.num_threads += amount;

    while (this.threads.length < this.parameters.num_threads) {
      this.threads.push(new Thread(this.parameters.num_beads));
    }
  }

  remove_threads(amount) {
    this.parameters.num_threads = Math.min(this.parameters.num_threads - amount, 0);

    while (this.threads.length > this.parameters.num_threads) {
      this.threads.pop();
    }
  }

  set_beads(amount, method) {
    this.parameters.num_beads = amount;
    for (var i = 0; i < this.parameters.num_threads; i++) {
      method.call(this.threads[i], amount);
    }
  }

  set_beads_from_the_top(amount) {
    this.set_beads(amount, this.threads[0].set_beads_from_the_top);
  }

  set_beads_from_the_bottom(amount) {
    this.set_beads(amount, this.threads[0].set_beads_from_the_bottom);
  }

  reset_beading() {
    this.threads.forEach(function(thread) {
      thread.current_bead = 0;
    });
  }

  load_demo() {
    this.set_threads(12);
    this.set_beads_from_the_bottom(5);

    var colours = {
       0: { 0: '#035fb2', 1: '#ffffff', 2: '#035fb2', 3: '#fef100', 4: '#ffffff' },
       1: { 0: '#035fb2', 1: '#ffffff', 2: '#035fb2', 3: '#035fb2', 4: '#ffffff' },
       2: { 0: '#ffffff', 1: '#ffffff', 2: '#fef100', 3: '#035fb2', 4: '#ffffff' },
       3: { 0: '#ffffff', 1: '#ffffff', 2: '#fef100', 3: '#ffffff', 4: '#ffffff' },
       4: { 0: '#ffffff', 1: '#ffffff', 2: '#035fb2', 3: '#ffffff', 4: '#ffffff' },
       5: { 0: '#ffffff', 1: '#035fb2', 2: '#fef100', 3: '#ffffff', 4: '#ffffff' },
       6: { 0: '#ffffff', 1: '#035fb2', 2: '#fef100', 3: '#ffffff', 4: '#ffffff' },
       7: { 0: '#ffffff', 1: '#fef100', 2: '#035fb2', 3: '#ffffff', 4: '#ffffff' },
       8: { 0: '#ffffff', 1: '#fef100', 2: '#035fb2', 3: '#ffffff', 4: '#035fb2' },
       9: { 0: '#ffffff', 1: '#fef100', 2: '#ffffff', 3: '#ffffff', 4: '#ffffff' },
      10: { 0: '#ffffff', 1: '#035fb2', 2: '#ffffff', 3: '#035fb2', 4: '#ffffff' },
      11: { 0: '#035fb2', 1: '#035fb2', 2: '#ffffff', 3: '#035fb2', 4: '#ffffff' },
    };

    for (var thread_index in colours) {
      for (var bead_index in colours[thread_index]) {
        this.threads[thread_index].beads[bead_index].colour = colours[thread_index][bead_index];
      }
    }
  }
}
