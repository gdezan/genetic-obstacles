class Population {
  constructor(Element, size, lifespan, target, obstacles = []) {
    this.Element = Element;
    this.elements = [];
    this.populationSize = size;
    this.lifespan = lifespan;
    this.maxFitness = 0;
    this.lastMaxFitness = 0;
    this.smallVarianceCounter = 0;
    this.maxElement = 0;
    this.totalFitness = 0;
    this.obstacles = obstacles;
    this.allFinished = false;
    this.target = target;

    // Cria os indivíduos e adiciona à população
    for (let i = 0; i < this.populationSize; i++) {
      this.elements[i] = new Element(this.lifespan);
    }
  }

  evaluateMutationRate(mutationRate, originalMutationRate) {
    if ((this.maxFitness - this.lastMaxFitness) < 0.001) {
      this.smallVarianceCounter += 1;
      if (this.smallVarianceCounter > 10) {
        this.smallVarianceCounter = 0;
        return mutationRate * 2; 
      }
      return mutationRate;
    }
    return originalMutationRate;
  }

  evaluate() {
    this.lastMaxFitness = this.maxFitness;
    this.totalFitness = 0;

    // Guarda o tempo do indivíduo que passou mais tempo "vivo"
    const maxTimeAlive = Math.max.apply(
      Math,
      this.elements.map((el) => el.count % el.lifespan)
    );

    for (let i = 0; i < this.populationSize; i++) {
      const fitness = this.elements[i].calcFitness(this.target, maxTimeAlive);
      this.totalFitness += fitness;

      // Calcula o "maior de todos"
      if (fitness >= this.maxFitness) {
        this.maxFitness = fitness;
        this.maxElement = i;
      }
    }
    return this.maxFitness;
  }

  // Faz o crossover dos indivíduos da população (roleta adaptada)
  selection(mutationRate) {
    const Element = this.Element;
    let newElements = [];
    let childDNA;
    for (let i = 0; i < this.populationSize; i++) {
      if (i != this.maxElement) {
        childDNA = this.elements[this.maxElement].dna.crossover(this.elements[i].dna, mutationRate);
        newElements[i] = new Element(this.lifespan, childDNA);
      } else {
        newElements[i] = new Element(this.lifespan, this.elements[this.maxElement].dna);
      }
    }
    this.elements = newElements;
  }

  // Exibição da população
  show() {
    for (let i = 0; i < this.populationSize; i++) {
      this.elements[i].show();
    }
  }

  run(walkerSpeed) {
    let allFinished = true;

    for (let i = 0; i < this.populationSize; i++) {
      // Atualiza a posição
      this.elements[i].update(walkerSpeed, this.obstacles, target);

      if (allFinished && this.elements[i].completed <= 0 && !this.elements[i].crashed) {
        allFinished = false;
      }
    }

    this.show();
    this.allFinished = allFinished;
  }
}
