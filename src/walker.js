class Walker {
  constructor(lifespan, dna = null) {
    this.position = createVector(width / 2, height - 50);
    this.velocity = createVector();
    this.acceleration = createVector();
    this.dna = dna || new DNA(lifespan);
    this.fitness = 0;
    this.count = 0;
    this.completed = -1;
    this.crashed = false;
    this.lifespan = lifespan;
    this.closestDistance = Infinity;
  }

  // Adiciona aceleração ao indivíduo, de acordo com seu dna
  applyForce(force) {
    this.acceleration.add(force);
  }

  calcFitness(target, maxTimeAlive) {
    // Distância até o alvo, quando terminou de se "movimentar"
    let distance = dist(this.position.x, this.position.y, target.x, target.y);

    // Nota do tempo de vida do indivíduo, em relação ao tempo máximo de vida
    const timeAliveFactor = (this.count % this.lifespan) / maxTimeAlive;

    if (this.completed > 0) {
      // Se chegou no "alvo", o cálculo muda para favorecer indivíduos mais rápidos
      // N = x + 1, onde x é o quanto resta de tempo na geração após o indivíduo chegar
      // no "alvo"
      this.fitness = ((this.lifespan - this.completed) * 0.01) / this.lifespan + 1;
    } else {
      if (this.closestDistance < distance) {
        // Ele passou por um lugar próximo do alvo antes de bater
        distance = (this.closestDistance + distance) / 2;
      }

      // Função inversa para avaliar, levando em conta a distância final e o tempo "vivo"
      this.fitness = timeAliveFactor - distance / 500;
    }

    return this.fitness;
  }

  update(walkerSpeed, obstacles, target) {
    if (this.completed > 0 || this.crashed) {
      // Se chegou no fim, ou "bateu", não movimentar mais
      return;
    }

    const d2t = dist(this.position.x, this.position.y, target.x, target.y);
    if (d2t < this.closestDistance) {
      // Cálculo da distância mais próxima do alvo durante todo o percurso
      this.closestDistance = d2t;
    }

    const { x: px, y: py } = this.position;
    // Se chegar no alvo
    if (dist(px, py, target.x, target.y) < 10) {
      this.completed = frameCount % this.lifespan;
      this.position = target.copy();
    }

    // Passar por todos os obstáculos e conferir se o indivíduo se encontra dentro dos seus limites
    for (let i = 0; i < obstacles.length; i++) {
      let { x: ox, y: oy, w: ow, h: oh } = obstacles[i];

      const borderX1 = ox;
      const borderX2 = ox + ow;
      const isBetweenX = px <= Math.max(borderX1, borderX2) && px >= Math.min(borderX1, borderX2);

      const borderY1 = oy;
      const borderY2 = oy + oh;
      const isBetweenY = py <= Math.max(borderY1, borderY2) && py >= Math.min(borderY1, borderY2);

      if (isBetweenX && isBetweenY) {
        this.crashed = true;
        return;
      }
    }

    // Confere se passou da borda da tela
    if (px > width || px < 0 || py > height || py < 0) {
      this.crashed = true;
      return;
    }

    // Aplica a aceleração no objeto, de acordo com seu dna
    this.applyForce(p5.Vector.mult(this.dna.genes[this.count], walkerSpeed));
    this.count++;
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  // Desenho dos objetos no canvas
  show() {
    push();
    noStroke();
    fill(120, 180, 255, 150);

    translate(this.position.x, this.position.y);

    if (this.crashed) {
      fill(255, 0, 0);

      circle(0, 0, 12);

      pop();
      return;
    }

    circle(0, 0, 14);
    pop();
  }
}
