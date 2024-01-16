import * as THREE from "three";

var mouse = { x: 0, y: 0 };
var cubes = []; // Array to hold all cubes
var raycaster = new THREE.Raycaster();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.2,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

// Create a grid of cubes
for (let i = -10; i <= 10; i++) {
  for (let j = -10; j <= 10; j++) {
    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff90 });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(i, 0, j);
    cube.userData.originalColor = cube.material.color.getHex(); // Store original color
    scene.add(cube);
    cubes.push(cube); // Add cube to array
  }
}

camera.position.z = 15;
camera.position.y = 12;
camera.position.x = 3;

document.addEventListener("mousemove", onDocumentMouseMove, false);
document.addEventListener("click", onDocumentMouseClick, false);

window.addEventListener("resize", onWindowResize, false);

animate();

/* Function */
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {
  event.preventDefault();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  hover();
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  camera.lookAt(scene.position);

  // rotation();
  renderer.render(scene, camera);
}

function hover() {
  if (mouse.x >= -1 && mouse.x <= 1 && mouse.y >= -1 && mouse.y <= 1) {
    var vector = new THREE.Vector3(mouse.x, mouse.y, 1);

    raycaster.setFromCamera(vector, camera);
    var intersects = raycaster.intersectObjects(cubes, true);

    // Reset color of previously hovered cubes
    cubes.forEach((cube) => {
      if (cube.userData.isHovered) {
        cube.material.color.set(cube.userData.originalColor);
        cube.userData.isHovered = false;
      }
    });

    // Set color of currently hovered cube
    if (intersects.length > 0) {
      var cube = intersects[0].object;
      cube.material.color.set(0xff0000); // Change color when hovered
      cube.userData.isHovered = true; // Mark cube as hovered
    }
  }
}

var radius = 20;
var theta = 0;
function rotation() {
  theta += 0.1;

  camera.position.x = radius * Math.sin((theta * Math.PI) / 360);
  camera.position.y = radius * Math.sin((theta * Math.PI) / 360);
  camera.position.z = radius * Math.cos((theta * Math.PI) / 360);
}

function onDocumentMouseClick(event) {
  event.preventDefault();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  var intersects = raycaster.intersectObjects(cubes, true);

  if (intersects.length > 0) {
    var cube = intersects[0].object;
    showModal(
      `Cube clicked at position (${cube.position.x}, ${cube.position.y}, ${cube.position.z})`
    );
  }
}

function showModal(message) {
  var modal = document.createElement("div");
  modal.style.position = "fixed";
  modal.style.top = "50%";
  modal.style.left = "50%";
  modal.style.transform = "translate(-50%, -50%)";
  modal.style.backgroundColor = "#fff";
  modal.style.padding = "20px";
  modal.style.borderRadius = "5px";
  modal.textContent = message;
  document.body.appendChild(modal);
}
