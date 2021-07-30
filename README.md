# Desvio de obstáculos evolutivo

O projeto tem por objetivo implementar um algoritmo evolutivo para desvio de obstáculos para acertar um alvo. Os obstáculos são inseridos pelo próprio usuário, por meio da interface.

Disponível em [https://gdezan.github.io/genetic-obstacles/](https://gdezan.github.io/genetic-obstacles/).

![alt text](https://github.com/gdezan/genetic-obstacles/blob/master/assets/execution.gif 'Execução da aplicação')

# Vídeo da apresentação

Disponível em [https://drive.google.com/file/d/14_JwMrxvMEgdS6-Tt76V0tLPP1ScfBTj/view](https://drive.google.com/file/d/14_JwMrxvMEgdS6-Tt76V0tLPP1ScfBTj/view).

# Funcionamento da aplicação

![alt text](https://github.com/gdezan/genetic-obstacles/blob/master/assets/initial_screen.png 'Tela inicial da aplicação')

Conforme pode-se observar na figura acima, a aplicação dispõe de algumas funcionalidades. Falando primeiramente sobre os botões embaixo da tela de apresentação, temos quatro botões distintos: o de play, para dar início à execução do algoritmo; o de pause, para parar a execução do algoritmo; o de reset, para reiniciar a execução do algoritmo genérico para a primeira geração; o da lixeira, para excluir quaisquer obstáculos desenhados na tela.

Sobre os obstáculos, eles são desenhados utilizando o esquema de drag and drop, ou seja, ao clicar no mouse, o obstáculo é desenhado e ao liberar o mouse, ele é inserido de fato na tela. Um exemplo da funcionalidade pode ser conferido no GIF abaixo.

![alt text](https://github.com/gdezan/genetic-obstacles/blob/master/assets/dragndrop_demo.gif 'Demonstração da funcionalidade de drag and drop')

Também há o menu de sliders do lado direito da tela. Este menu fornece ao usuário a possibilidade de configurar quatro propriedades: a velocidade de cada indivíduo na tela, a taxa de mutação do algoritmo, o tamanho da população e a duração de cada geração em frames.

Por fim, abaixo do menu de sliders há um mostrador da quantidade de frames, da geração atual e do fitness máximo.

# Algoritmo genético

## Inicialização da população

A população é inicializada com cromossomos de genes aleatórios, sendo que cada gene do cromossomo é um vetor com direção aleatória. O tamanho da população pode ser definido através do menu de sliders. O tamanho de cada cromossomo é definido pelo tempo de vida de cada indivíduo.

## Avaliação

Para o cálculo do fitness de cada indivíduo, segue o passo a passo:

1. É calculada a distância do indivíduo ao alvo;
2. É calculado o tempo de vida do indivíduo, de forma que esse tempo é normalizado em relação ao tempo do indivíduo que passou mais tempo vivo;
3. É verificado se o indivíduo chegou no alvo;
4. Se sim, o fitness dele é dado por: (((tempo que resta para finalizar a geração) * 0.01 / (tempo de vida da população)) + 1). Dessa forma, indivíduos que chegam mais rápidos no alvo são beneficiados, pois quanto maior for o tempo que resta para finalizar a geração, significa que ele chegou bastante rápido no alvo;
5. Caso o indivíduo não tenha chegado no alvo, é verificado se o indivíduo já passou por um lugar próximo do alvo anteriormente. Se sim, fazemos uma média da distância atual com a menor, a fim de tentar levar a uma distância mais próxima. Então, o fitness é calculado da seguinte forma: (nota do tempo de vida do indivíduo - (distância até o alvo / 500)). Dessa forma, distâncias menores subtraem menos do fitness, enquanto distâncias maiores, subtraem mais.

## Seleção

Para realizar a seleção dos indivíduos da nova geração, é utilizado o método de elitismo. Assim, o melhor de todos cruza com todos os outros indivíduos da população e essa é a nova geração.

## Mutação

A mutação dos cromossomos é feita logo após a etapa anterior. É calculado um valor aleatório entre 0 e 1. Se esse valor for menor que a taxa de mutação, o gene do cromossomo em questão é mutado para um vetor de direção aleatória. Além disso, também utilizamos o esquema de mutação variável. Se após dez vezes o fitness do melhor de todos não aumentar dentro de um delta igual a 0.0001, então a taxa de mutação é dividida pela metade. Isso é realizado duas vezes. Se continuar falhando, ela aumenta até que continue sendo menor que 100%. Se passar disso, o valor é restaurado para a taxa de mutação original. Dessa forma, para uma taxa de mutação original de 1%, as taxas seriam então 1%, 0.5%, 0.25%, 2%, 4%, 8%, 16%, 32%, 64%, 1%, etc.

## Rearranjo da população

Para o rearranjo da população, a troca é feita simplesmente substituindo todos os indivíduos velhos pelos novos, com exceção do melhor de todos.

# Atualizações na aplicação

Foi implementada uma funcionalidade que insere em um gráfico, em tempo real, a nota do melhor de todos a cada geração além da média das notas da população. Segue o GIF mostrando a aplicação funcionando:

![alt text](https://github.com/gdezan/genetic-obstacles/blob/master/assets/graph.gif 'Execução da aplicação com o gráfico')

# Membros da equipe

- Gabriel de Andrade Dezan - gabrieldezan@usp.br
- Ivan Mateus de Lima Azevedo - ivanmateusla@usp.br
