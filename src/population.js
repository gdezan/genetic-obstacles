class Population {
  constructor(Element, size, lifespan, target, obstacles = []) {
    this.Element = Element;
    this.elements = [];
    this.populationSize = size;
    this.lifespan = lifespan;
    this.maxFitness = 0;
    this.totalFitness = 0;
    this.obstacles = obstacles;
    this.fitnessPool = [];
    this.allFinished = false;
    this.target = target;;;;;

    for (let i = 0; i < this.populationSize; i++) {
      this.elements[i] = new Element(this.lifespan);
    }
  }

  evaluate() {
    this.maxFitness = 0;
    this.totalFitness = 0;

    const maxTimeAlive = Math.max.apply(
      Math,
      this.elements.map(el => el.count % el.lifespan),
    );
    for (let i = 0; i < this.populationSize; i++) {
      const fitness = this.elements[i].calcFitness(this.target, maxTimeAlive);
      this.totalFitness += fitness;
      this.fitnessPool[i] = this.totalFitness;
      if (fitness >= this.maxFitness) {
        this.maxFitness = fitness;
      }
    }
    return this.maxFitness;
  }

  selection(mutationRate) {
    const Element = this.Element;
    let newElements = [];
    let parentA;
    let parentB;
    let childDNA;
    for (let i = 0; i < this.populationSize; i++) {
      parentA = this.getParent();
      parentB = this.getParent();
      childDNA = parentA.crossover(parentB, mutationRate);
      newElements[i] = new Element(this.lifespan, childDNA);
    }
    this.elements = newElements;
  }

  getParent() {
    const value = Math.random() * this.totalFitness;
    for (let i in this.fitnessPool) {
      if (this.fitnessPool[i] >= value) {
        return this.elements[i].dna;
      }
    }
    console.warn("Failed fitness pool");
    return this.elements[Math.floor(Math.random() * this.populationSize)].dna;
  }

  show() {
    for (let i = 0; i < this.populationSize; i++) {
      this.elements[i].show();
    }
  }

  run(walkerSpeed) {
    let allFinished = true;
    for (let i = 0; i < this.populationSize; i++) {
      this.elements[i].update(walkerSpeed, this.obstacles, target);
      if (allFinished && this.elements[i].completed <= 0 && !this.elements[i].crashed) {
        allFinished = false;
      }
    }
    this.show();
    this.allFinished = allFinished;
  }
}
