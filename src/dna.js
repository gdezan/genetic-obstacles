class DNA {
  constructor(length, genes = []) {
    this.genes = genes;
    this.length = length;
    this.mag = 0.1;

    if (genes.length === 0) {
      for (let i = 0; i < length; i++) {
        this.genes[i] = p5.Vector.random2D();
        this.genes[i].setMag(this.mag);
      }
    }
  }

  crossover(partner, mutationRate) {
    let childGenes = [];
    let cuttingPoint = Math.floor(Math.random() * this.genes.length);
    let currGene;
    for (let i = 0; i < this.genes.length; i++) {
      if (i > cuttingPoint) {
        currGene = this.genes[i];
      } else {
        currGene = partner.genes[i];
      }
      childGenes[i] = this.mutate(currGene, mutationRate);
    }
    return new DNA(this.length, childGenes);
  }

  mutate(gene, mutationRate) {
    let retVal = gene;
    if (Math.random() <= mutationRate) {
      retVal = p5.Vector.random2D();
      retVal.setMag(this.mag);
    }
    return retVal;
  }
}
