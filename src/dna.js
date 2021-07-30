class DNA {
  constructor(length, genes = []) {
    this.genes = genes;
    this.length = length;
    this.mag = 0.1; // Módulo dos vetores

    // Caso os genes não tenham sido passados, cria uma lista, com o tamanho proporcional com a
    // duração da geração, de vetores do p5 com direções aleatórias
    if (genes.length === 0) {
      for (let i = 0; i < length; i++) {
        this.genes[i] = p5.Vector.random2D();
        this.genes[i].setMag(this.mag);
      }
    }
  }

  crossover(partner, mutationRate) {
    let childGenes = [];

    let currGene;
    for (let i = 0; i < this.genes.length; i++) {
      // Faz a média dos genes dos pais
      currGene = p5.Vector.add(this.genes[i], partner.genes[i]).div(2);
      childGenes[i] = this.mutate(currGene, mutationRate);
    }
    return new DNA(this.length, childGenes);
  }

  mutate(gene, mutationRate) {
    let retVal = gene;
    if (Math.random() <= mutationRate) {
      // Gera um valor aleatório, se ele está dentro da taxa de mutação, muda o "gene"
      // aleatoriamente
      retVal = p5.Vector.random2D();
      retVal.setMag(this.mag);
    }
    return retVal;
  }
}
