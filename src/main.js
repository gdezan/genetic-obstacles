const canvasContainer = document.querySelector(".canvas");

// Info panel
const countText = document.querySelector(".count");
const generationText = document.querySelector(".generation");
const maxFit = document.querySelector(".max-fit");

// Playback buttons
const playButton = document.querySelector("#play-button");
const pauseButton = document.querySelector("#pause-button");
const trashButton = document.querySelector("#trash-button");
const refreshButton = document.querySelector("#refresh-button");

// Sliders
const elementsValue = document.querySelector("#elements-value");
const elementsSlider = document.querySelector("#elements-slider");
const speedValue = document.querySelector("#speed-value");
const speedSlider = document.querySelector("#speed-slider");
const lifespanValue = document.querySelector("#lifespan-value");
const lifespanSlider = document.querySelector("#lifespan-slider");
const mutationValue = document.querySelector("#mutation-value");
const mutationSlider = document.querySelector("#mutation-slider");

// Quantidade inicial de indivíduos
let populationSize = 100;

// Duração de cada geração (em frames)
let lifespan = 200;

// Taxa de mutação inicial
const originalMutationRate = 0.01;
let mutationRate = 0.01;

// Velocidade inicial do indivíduo
let walkerSpeed = 10;

// Inicialização das variáveis
let population;
let target;
let maxFitness;
let frameCount;
let generation;
let started;
let playing;
let obstacles;

let currRect = { x: 0, y: 0, w: 0, h: 0 };

function resetState(options = {}) {
  const { keepPlaying = false, resetObstacles = true, stop } = options;

  // Conferir se o usuário deu o play inicial
  started = stop != null ? !stop : started;

  // Flag para conferir se deve continuar em execução
  playing = started && keepPlaying;

  // Contador de frames
  frameCount = 0;

  // Indicador da geração atual
  generation = 1;

  // Maior nota da geração
  maxFitness = 0;

  if (resetObstacles) {
    // Se passada a flag de resetar obstáculos (caso de clicar na "lixeira"), os apaga
    obstacles = [];
  }

  // Criação da população
  population = new Population(Walker, populationSize, lifespan, target, obstacles);

  // Atualização de valores na UI
  elementsSlider.value = populationSize;
  elementsValue.textContent = populationSize;
  speedSlider.value = walkerSpeed;
  speedValue.textContent = walkerSpeed;
  mutationSlider.value = mutationRate * 500;
  mutationValue.textContent = `${(mutationRate * 100).toFixed(2)}%`;
  countText.textContent = `Frames: ${frameCount}`;
  generationText.textContent = `Geração: ${generation}`;
  maxFit.textContent = `Nota máxima: ${maxFitness.toFixed(4)}`;
}

// Função de inicialização do "canvas"
function setup() {
  const canvas = createCanvas(700, 500);
  canvas.mousePressed(onCanvasMousePressed);
  canvas.mouseReleased(onCanvasMouseReleased);
  canvas.parent("canvas");

  target = createVector(width / 2, 50);
  spawn = createVector(width / 2, height - 50);
  resetState();
}

function draw() {
  // Desenhando dos elementos no canvas
  background(0);
  fill(0, 255, 0);
  circle(target.x, target.y, 16);
  fill(200, 150, 30);
  circle(spawn.x, spawn.y, 16);

  fill(255);

  // Desenhando os obstáculos já criados
  for (i in obstacles) {
    let obs = obstacles[i];
    rect(obs.x, obs.y, obs.w, obs.h);
  }

  noStroke();

  // Desenha o obstáculo sendo criado pelo usuário
  if (mouseIsPressed && mouseX < width && mouseX > 0 && mouseY < height && mouseY > 0) {
    currRect.w = mouseX - currRect.x;
    currRect.h = mouseY - currRect.y;
    rect(currRect.x, currRect.y, currRect.w, currRect.h);
  }

  if (!started) {
    // Se não começou, não mostrar a população
    return;
  }

  if (!playing) {
    // Para o caso de execução pausada
    population.show();
    return;
  }

  population.run(walkerSpeed);
  countText.textContent = `Frames: ${frameCount}`;
  frameCount++;

  // Confere se chegou no final da geração, ou se todos os indivíduos pararam de se movimentar
  // (para acelerar o processo)
  if (frameCount >= lifespan || (population.allFinished && frameCount > 10)) {
    frameCount = 0;

    // Calcula a maior nota entre os indivíduos
    maxFitness = population.evaluate(target);

    // Faz a geração da nova população
    mutationRate = population.evaluateMutationRate(mutationRate, originalMutationRate);
    population.selection(mutationRate);

    generation++;
    generationText.textContent = `Geração: ${generation}`;
    maxFit.textContent = `Nota máxima: ${maxFitness.toFixed(4)}`;
  }
}

// Funções auxiliares / Eventos DOM

function onCanvasMousePressed() {
  currRect = {};
  currRect.x = mouseX;
  currRect.y = mouseY;
}

function onCanvasMouseReleased() {
  obstacles.push(currRect);
}

playButton.addEventListener("click", () => {
  started = true;
  playing = true;
  accentPlaybackButton(playButton);
});

pauseButton.addEventListener("click", () => {
  if (started) {
    if (playing) {
      playing = false;
    }
    accentPlaybackButton(pauseButton);
  }
});

trashButton.addEventListener("click", () => {
  resetState({ keepPlaying: false, resetObstacles: true });
  accentPlaybackButton(pauseButton);
});

refreshButton.addEventListener("click", () => {
  resetState({ keepPlaying: true, resetObstacles: false });
  accentPlaybackButton(playButton);
});

elementsSlider.addEventListener("input", (e) => {
  elementsValue.textContent = e.target.value;
});
elementsSlider.addEventListener("change", (e) => {
  populationSize = e.target.value;
  resetState({ keepPlaying: true, resetObstacles: false });
});

lifespanSlider.addEventListener("input", (e) => {
  lifespanValue.textContent = `${e.target.value} frames`;
});
lifespanSlider.addEventListener("change", (e) => {
  lifespan = parseInt(e.target.value);
  resetState({ keepPlaying: true, resetObstacles: false });
});

speedSlider.addEventListener("input", (e) => {
  speedValue.textContent = e.target.value;
});
speedSlider.addEventListener("change", (e) => {
  walkerSpeed = parseInt(e.target.value);
});

mutationSlider.addEventListener("input", (e) => {
  mutationValue.textContent = `${(e.target.value / 5).toFixed(2)}%`;
});
mutationSlider.addEventListener("change", (e) => {
  mutationRate = e.target.value / 500;
});

function accentPlaybackButton(button) {
  const playbackButtons = [playButton, pauseButton, trashButton];
  playbackButtons.forEach((playbackButton) => {
    if (playbackButton === button) {
      playbackButton.classList.add("accent-svg");
    } else {
      playbackButton.classList.remove("accent-svg");
    }
  });
}
