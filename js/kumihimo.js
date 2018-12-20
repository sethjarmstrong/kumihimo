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
  constructor(numThreads, numBeads) {
    this.numThreads = 0;
    this.numBeads = numBeads;
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

function init() {
  var braid = new Braid(12, 40);

  var unv = new UnbraidedVisualizer(braid, document.getElementById('unbraided'));
  var brv = new BraidedVisualizer(braid, document.getElementById('braided'));
  var stv = new StringingVisualizer(braid, document.getElementById('stringing_guide'));
  var tdv = new ThreeDVisualizer(braid, document.getElementById('three_d'));

  var manager = new VisualizerManager(
    braid,
    document.getElementById('add_threads'),
    document.getElementById('remove_threads'),
    document.getElementById('bead_number'),
    document.getElementById('bead_colour')
  );

  manager.register_visualizer(unv);
  manager.register_visualizer(brv);
  manager.register_visualizer(stv);
  manager.register_visualizer(tdv);

  manager.render();
}

window.addEventListener('load', init);
