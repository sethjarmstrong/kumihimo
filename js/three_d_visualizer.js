function initialize_visualization() {
  var scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xf0f0f0 );

  var element = document.querySelector('.visualization');
  var width = element.clientWidth;
  var height = element.clientHeight;

  var camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.set(0, 0, 10);
  camera.lookAt(0, 0, 0);

  var light = new THREE.PointLight( 0xffffff, 0.8 );
  camera.add(light);

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  element.appendChild(renderer.domElement);

  function createLine() {
    var material = new THREE.LineBasicMaterial({ color: 0x0000ff });
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(-5, -5, 0));
    geometry.vertices.push(new THREE.Vector3(-5, 5, 0));
    geometry.vertices.push(new THREE.Vector3(5, 5, 0));
    geometry.vertices.push(new THREE.Vector3(5, -5, 0));
    geometry.vertices.push(new THREE.Vector3(-5, -5, 0));
    return new THREE.Line(geometry, material);
  }

  var line = createLine();
  scene.add(line);

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  animate();
}

window.addEventListener('load', initialize_visualization);
