# Desvio de obstáculos evolutivo

O projeto tem por objetivo implementar um algoritmo evolutivo para desvio de obstáculos para acertar um alvo. Os obstáculos são inseridos pelo próprio usuário, por meio da interface.

Disponível em [https://gdezan.github.io/genetic-obstacles/](https://gdezan.github.io/genetic-obstacles/)

# Funcionamento da aplicação

![alt text](https://github.com/gdezan/genetic-obstacles/blob/master/assets/initial_screen.png 'Tela inicial da aplicação')

Conforme pode-se observar na figura acima, a aplicação dispõe de algumas funcionalidades. Falando primeiramente sobre os botões embaixo da tela de apresentação, temos quatro botões distintos: o de play, para dar início à execução do algoritmo; o de pause, para parar a execução do algoritmo; o de reset, para reiniciar a execução do algoritmo genérico para a primeira geração; o da lixeira, para excluir quaisquer obstáculos desenhados na tela.

Sobre os obstáculos, eles são desenhados utilizando o esquema de drag and drop, ou seja, ao clicar no mouse, o obstáculo é desenhado e ao liberar o mouse, ele é inserido de fato na tela. Um exemplo da funcionalidade pode ser conferido no GIF abaixo.

![alt text](https://github.com/gdezan/genetic-obstacles/blob/master/assets/dragndrop_demo.gif 'Demonstração da funcionalidade de drag and drop')

Também há o menu de sliders do lado direito da tela. Este menu fornece ao usuário a possibilidade de configurar quatro propriedades: a velocidade de cada indivíduo na tela, a taxa de mutação do algoritmo, o tamanho da população e a duração de cada geração em frames.

Por fim, abaixo do menu de sliders há um mostrador da quantidade de frames, da geração atual e do fitness máximo.

# Algoritmo genético

## Inicialização da população

A população é inicializada com indivíduos de gene aleatório, sendo que cada cromossomo do gene é um vetor com direção aleatória. O tamanho da população pode ser definido através do menu de sliders. O tamanho de cada gene é definido pelo tempo de vida de cada indivíduo.

## Avaliação

Para o cálculo do fitness de cada indivíduo, segue o passo a passo:

1. É calculada a distância do indivíduo ao alvo;
2. É calculado o tempo de vida do indivíduo, de forma que esse tempo é normalizado em relação ao tempo do indivíduo que passou mais tempo vivo. Essa norma é multiplicada por 10, de forma que o indivíduo que passou mais tempo vivo obtém 10 "pontos";
3. É verificado se o indivíduo chegou no alvo;
4. Se sim, o fitness dele é dado por: (((tempo que resta para finalizar a geração) / 50) + 1) ^ 3. Dessa forma, indivíduos que chegam mais rápidos no alvo são beneficiados, pois quanto maior for o tempo que resta para finalizar a geração, significa que ele chegou bastante rápido no alvo;
5. Caso o indivíduo não tenha chegado no alvo, é verificado se o indivíduo já passou por um lugar próximo do alvo anteriormente. Se sim, fazemos uma média da distância atual com a menor, a fim de tentar levar a uma distância mais próxima. Então, o fitness é calculado da seguinte forma: 20 / (distância até o alvo + nota do tempo de vida do indivíduo - 20);
6. Por fim, também é verificado se o indivíduo bateu em algum obstáculo. Se sim, reduzimos o fitness dele pela metade a fim de punir esse comportamento.

## Seleção

Para realizar a seleção dos indivíduos da nova geração, é utilizada uma adaptação do método de roleta. A fim de melhor explicar o método, será utilizado um exemplo com uma população de três indivíduos, A, B e C, com fitness 4, 8 e 3, respectivamente. Assim, o método funciona da seguinte forma: durante a etapa de avaliação, é criado um vetor de fitness acumulado. Pelo exemplo utilizado, o vetor seria então [4, (4+8), (4+8+3)] = [4, 12, 14].

A escolha dos pais se dá então da seguinte forma: é calculado um valor aleatório entre 0 e a soma do fitness total (14, no caso do exemplo). Se o valor for 10, por exemplo, então será retornado o indivíduo que está na posição do vetor de fitness acumulado correspondente ao limite superior do intervalo que encobre esse valor. No caso do exemplo, o intervalo é entre 4 e 12. Assim, o indivíduo escolhido será aquele que está na posição 1 (posição do valor 12, que é o limite superior do intervalo), ou seja, o indivíduo B.

## Crossover

Após a escolha dos pais, é feito um crossover de um ponto entre eles. Esse ponto é calculado de forma aleatória e então os cromossomos da "esquerda" do filho são os cromossomos do pai até o ponto calculado e os cromossomos da "direita" do filho, os da mãe a partir do ponto calculado.

## Mutação

A mutação dos cromossomos é feita logo após a etapa anterior. É calculado um valor aleatório entre 0 e 1. Se esse valor for menor que a taxa de mutação, o cromossomo em questão é mutado para um vetor de direção aleatória.

## Rearranjo da população

Para o rearranjo da população, a troca é feita simplesmente substituindo todos os indivíduos velhos pelos novos.

# Membros da equipe

- Gabriel de Andrade Dezan - gabrieldezan@usp.br
- Ivan Mateus de Lima Azevedo - ivanmateusla@usp.br
