import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import typeface from 'three/examples/fonts/helvetiker_regular.typeface.json'
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

var audioContext = new (window.AudioContext || window.webkitAudioContext)();
var buffer; // Define the buffer variable outside the functions

const soundBuffers = {};


function loadAudio(url, callback) {
  fetch(url)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer, callback));
}

function loadSound(name, url) {
  loadAudio(url, function (decodedBuffer) {
    soundBuffers[name] = decodedBuffer;
  });
}

// Load sounds
const audioUrls = {
  gateSound: 'gate_sound.mp3',
  houseSound: 'house_sound.mp3',
  // Add more sound URLs here
};

// Load each sound
for (const soundName in audioUrls) {
  if (audioUrls.hasOwnProperty(soundName)) {
    const soundUrl = audioUrls[soundName];
    loadSound(soundName, soundUrl);
  }
}






/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


const fog = new THREE.Fog('#262837', 2, 15)
scene.fog = fog











/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const door_texture = textureLoader.load('/textures/door/door.jpg')
const wall_texture = textureLoader.load('/textures/bricks/side_wall.jpg')
const roof_texture = textureLoader.load('/textures/door/roof.jpg')
const grass_texture = textureLoader.load('/textures/grass/color.jpg')
const grass_ambient = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grass_normal = textureLoader.load('/textures/grass/normal.jpg')
const grass_roughness = textureLoader.load('/textures/grass/roughness.jpg')
const balcony_texture = textureLoader.load('/textures/bricks/color.jpg')
const side_wall_texture = textureLoader.load('/textures/bricks/side_wall.jpg')
grass_texture.repeat.set(8, 8)
grass_ambient.repeat.set(8, 8)
grass_normal.repeat.set(8, 8)
grass_roughness.repeat.set(8, 8)

grass_texture.wrapS = THREE.RepeatWrapping
grass_ambient.wrapS = THREE.RepeatWrapping
grass_normal.wrapS = THREE.RepeatWrapping
grass_roughness.wrapS = THREE.RepeatWrapping

grass_texture.wrapT = THREE.RepeatWrapping
grass_ambient.wrapT = THREE.RepeatWrapping
grass_normal.wrapT = THREE.RepeatWrapping
grass_roughness.wrapT = THREE.RepeatWrapping







const bush_texture = textureLoader.load('/textures/door/bush.jpg')
const grave_texture = textureLoader.load('/textures/door/grave.jpg')



/**
 * House
 */
const house = new THREE.Group()
scene.add(house)


// walls 
const wall = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2, 4),
  new THREE.MeshStandardMaterial({ map: wall_texture })
)
wall.position.y = 3.2
house.add(wall)

const wall1 = new THREE.Mesh(
  new THREE.BoxGeometry(5, 3, 5),
  new THREE.MeshStandardMaterial({ map: wall_texture })
)
wall1.position.y = 1
house.add(wall1)



// balcony
const balcony_geometry = new THREE.BoxBufferGeometry(5, 0.6, 0.1)
const balcony_material = new THREE.MeshStandardMaterial({})

const balcony = new THREE.Mesh(balcony_geometry, balcony_material)
balcony.position.set(0, 2.7, 2.5)

const balcony1 = new THREE.Mesh(balcony_geometry, balcony_material)
balcony1.position.set(0, 2.7, -2.5)

const balcony2 = new THREE.Mesh(balcony_geometry, balcony_material)
balcony2.rotation.y = Math.PI * 0.5
balcony2.position.set(2.5, 2.7, 0)

const balcony3 = new THREE.Mesh(balcony_geometry, balcony_material)
balcony3.rotation.y = Math.PI * 0.5
balcony3.position.set(-2.5, 2.7, 0)


house.add(balcony, balcony1, balcony2, balcony3)


const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3, 1.5, 4),
  new THREE.MeshStandardMaterial({ map: roof_texture })
)
roof.position.y = 2.7 + 2.1
roof.rotation.y = Math.PI * 0.25
house.add(roof)



// side_wall
const side_wall = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 3),
  new THREE.MeshStandardMaterial({
    map: side_wall_texture

  })
)
side_wall.rotation.y = Math.PI * 0.5
side_wall.position.x = 2.511
side_wall.position.y = 1
scene.add(side_wall)



// const side_wall2 = new THREE.Mesh(
//   new THREE.PlaneGeometry(5, 3),
//   new THREE.MeshStandardMaterial({ 
//     map:side_wall_texture

//    })
// )
// side_wall2.rotation.y=Math.PI+Math.PI*0.5
// side_wall2.position.x=-2.511
// side_wall2.position.y=1


// const side_wall1 = new THREE.Mesh(
//   new THREE.PlaneGeometry(5, 3),
//   new THREE.MeshStandardMaterial({ 
//     map:side_wall_texture

//    })
// )
// side_wall1.rotation.y=Math.PI
// side_wall1.position.z=-2.511
// side_wall1.position.y=1



// // side_wall4.rotation.y=

// house.add(side_wall,side_wall1,side_wall2)




// door 
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 1.5),
  new THREE.MeshStandardMaterial({ map: door_texture })
)
door.position.y = 0.75
door.position.z = 2 + 0.01 + 0.5
house.add(door)

const door_upper = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 1.5),
  new THREE.MeshStandardMaterial({ map: door_texture })
)
door_upper.position.y = 0.75 + 2.5
door_upper.position.z = 2.001
house.add(door_upper)

door.addEventListener('click', function () {
  const soundName = 'gateSound'; // Change this to the desired sound name
  const buffer = soundBuffers[soundName];
  if (buffer) {
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start(0);
  }
});



// let rectLight=null
const width = 3;
const height = 3;
const intensity = 4;
const rectLight = new THREE.RectAreaLight(0xffffff, intensity, width, height);
rectLight.position.set(2.5, 2.4, 0);
rectLight.lookAt(2, 1.5, 0);
// scene.add(rectLight)

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {
  // Calculate normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // Calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects([door, door_upper]);
  const intersect1 = raycaster.intersectObjects([side_wall]);

  if (intersects.length > 0) {
    // Door is clicked
    const soundName = 'gateSound'; // Change this to the desired sound name
    const buffer = soundBuffers[soundName];
    if (buffer) {
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start(0);
    }
  }
  if (intersect1.length > 0) {


    if (rectLight != null) {
      scene.add(rectLight)
      // rectLight = null
      setTimeout(() => {
        scene.remove(rectLight);
        rectLight.dispose();
        rectLight = null;
      }, 2000);

    }

   

  }
}

window.addEventListener('click', onMouseClick, false);

// ...







// bush 
const bush_material = new THREE.MeshStandardMaterial({ map: bush_texture })
const bush_geometry = new THREE.SphereGeometry(1, 16, 16)

const bush1 = new THREE.Mesh(bush_geometry, bush_material)
bush1.scale.set(0.4, 0.6, 0.5)
bush1.position.set(1.8, 0, 2.5)

const bush2 = new THREE.Mesh(bush_geometry, bush_material)
bush2.scale.set(0.2, 0.4, 0.3)
bush2.position.set(1.2, 0, 2.5)

const bush3 = new THREE.Mesh(bush_geometry, bush_material)
bush3.scale.set(0.6, 0.5, 0.7)
bush3.position.set(-1.8, 0, 2.5)


const bush4 = new THREE.Mesh(bush_geometry, bush_material)
bush4.scale.set(1, 0.9, 0.7)
bush4.position.set(-5, 0, 5)
scene.add(bush1, bush2, bush3, bush4)


// grave 
const grave_material = new THREE.MeshStandardMaterial({ map: grave_texture })
const grave_geometry = new THREE.BoxBufferGeometry(0.5, 0.7, 0.15)


for (let i = 1; i < 50; i++) {


  const angle = Math.random() * Math.PI * 2
  const radius = 4 + Math.random() * 6
  const x = Math.sin(angle) * radius
  const z = Math.cos(angle) * radius
  const rotate = (Math.random() - 0.5) * 0.5

  const grave = new THREE.Mesh(grave_geometry, grave_material)
  grave.position.set(x, 0.5, z)
  grave.rotation.z = rotate
  scene.add(grave)

}



// border 
const border_geometry = new THREE.BoxBufferGeometry(0.6, 3, 20)
const border_material = new THREE.MeshStandardMaterial({ map: bush_texture })

const border1 = new THREE.Mesh(border_geometry, border_material)
border1.position.x = 10
scene.add(border1)

const border2 = new THREE.Mesh(border_geometry, border_material)
border2.position.x = -10
scene.add(border2)

const border3 = new THREE.Mesh(border_geometry, border_material)
border3.rotation.y = Math.PI * 0.5
border3.position.z = -10
scene.add(border3)

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: grass_texture,
    aoMap: grass_ambient,
    roughness: grass_roughness,
    normalMap: grass_normal
  })
)
floor.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2))
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.1)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.2)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)



// Light on door 
const doorLight = new THREE.PointLight('#ff7d46', 3, 7);
doorLight.position.set(0, 2, 2.2);
scene.add(doorLight);

const frontLight = new THREE.PointLight('red', 2, 7);
frontLight.position.set(0, 2, 2.8);
scene.add(frontLight);

// Light on floor 
const floor_light = new THREE.PointLight('red', 4, 7);
floor_light.position.set(0, 6, 0);
// floor_light.lookAt.set(0,8,0)
scene.add(floor_light);

const floor_light1 = new THREE.PointLight('#ff7d46', 4, 7);
floor_light1.position.set(0, 6, 2.5);
floor_light.lookAt(2.3, 4.2, 3)
scene.add(floor_light1);



// scene.add( rectLight )











// ghost 
const ghost1 = new THREE.PointLight(0xff0000, 2, 3);
// ghost1.position.set( 50, 50, 50 );
scene.add(ghost1);
const ghost2 = new THREE.PointLight('yellow', 2, 3);
// ghost1.position.set( 50, 50, 50 );
scene.add(ghost2);



// points effect 
const point_geometry = new THREE.SphereGeometry(1, 64, 64)
const point_material = new THREE.PointsMaterial({
  size: 0.01,
  color: ''
})
const point = new THREE.Points(point_geometry, point_material)
point.position.set(0, 5, 0)
scene.add(point)



// text 
const loader = new FontLoader();
const text_material = new THREE.MeshBasicMaterial({ map: side_wall_texture })

loader.load('/fonts/helvetiker_regular.typeface.json', function (font) {

  const geometry = new TextGeometry('Haunted House', {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5
  });
  const text = new THREE.Mesh(geometry, text_material)
  // material.wireframe=true
  // text.position.y=9
  text.position.z = 2
  text.position.x = -2.3
  text.position.y = 4.2
  scene.add(text)
});





/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 3
camera.position.z = 7
scene.add(camera)




// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.maxPolarAngle = 1.4
controls.maxDistance = 10

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#262837')




/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime() * 0.5

  ghost1.position.x = Math.sin(elapsedTime) * 5
  ghost1.position.z = Math.cos(elapsedTime) * 5

  ghost2.position.x = Math.cos(elapsedTime) * 5 + 1
  ghost2.position.z = Math.sin(elapsedTime) * 5 + 1


  // point rotation 
  point.rotation.y = elapsedTime * 0.7





  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()