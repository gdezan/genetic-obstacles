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
    this.target = target;

    // Cria os indivíduos e adiciona à população
    for (let i = 0; i < this.populationSize; i++) {
      this.elements[i] = new Element(this.lifespan);
    }
  }

  evaluate() {
    this.maxFitness = 0;
    this.totalFitness = 0;

    // Guarda o tempo do indivíduo que passou mais tempo "vivo"
    const maxTimeAlive = Math.max.apply(
      Math,
      this.elements.map((el) => el.count % el.lifespan)
    );

    for (let i = 0; i < this.populationSize; i++) {
      const fitness = this.elements[i].calcFitness(this.target, maxTimeAlive);
      this.totalFitness += fitness;

      // Faz uma lista de intervalos de notas, para utilizar na seleção dos indíviduos "pai" e "mãe"
      this.fitnessPool[i] = this.totalFitness;
      if (fitness >= this.maxFitness) {
        this.maxFitness = fitness;
      }
    }
    return this.maxFitness;
  }

  // Faz o crossover dos indivíduos da população (roleta adaptada)
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
    // Pega um valor de 0 até soma das notas/fitness dos indivíduos
    const value = Math.random() * this.totalFitness;

    for (let i in this.fitnessPool) {
      if (this.fitnessPool[i] >= value) {
        // EX: indivíduo a tem nota 3, b tem nota 5 e c tem nota 2
        // A fitness pool fica como [3, (3+5), (3+5+2)] = [3, 8, 10]
        // "value" virá um valor entre 0 e 10, então se value for "4", ele se encaixa no intervalo
        // entre 3 e 8, portanto seu "pai" é o elements[1]
        return this.elements[i].dna;
      }
    }

    // Caso não ache um valor válido
    console.warn("Failed fitness pool");
    return this.elements[Math.floor(Math.random() * this.populationSize)].dna;
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
