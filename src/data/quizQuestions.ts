export interface QuizQuestion {
  id: number;
  category: string;
  question: string;
  options: string[];
  correctAnswer: number; // 0-indexed
}

export const quizQuestions: QuizQuestion[] = [
  // LEGISLAÇÃO DE TRÂNSITO
  {
    id: 1,
    category: "Legislação de Trânsito",
    question: "A atual legislação de trânsito intitula-se:",
    options: [
      "Código Nacional de Trânsito.",
      "Código de Trânsito.",
      "Código de Trânsito Brasileiro.",
      "Código Brasileiro de Trânsito."
    ],
    correctAnswer: 2
  },
  {
    id: 2,
    category: "Legislação de Trânsito",
    question: "O trânsito de qualquer natureza nas vias terrestres do território nacional, abertas à circulação, rege-se pelo:",
    options: [
      "Código de Trânsito Brasileiro.",
      "Código Nacional de Trânsito.",
      "Código Brasileiro de Trânsito.",
      "Código de Trânsito."
    ],
    correctAnswer: 0
  },
  {
    id: 3,
    category: "Legislação de Trânsito",
    question: "Considera-se trânsito a utilização das vias por:",
    options: [
      "Pessoas e animais, isolados ou em grupos.",
      "Pessoas, veículos e animais, isolados ou em grupos, conduzidos ou não.",
      "Veículos conduzidos por condutores habilitados.",
      "Pessoas e veículos, conduzidos ou não."
    ],
    correctAnswer: 1
  },
  {
    id: 4,
    category: "Legislação de Trânsito",
    question: "A utilização das vias por pessoas, veículos e animais é para fins de:",
    options: [
      "Circulação, parada e estacionamento.",
      "Circulação e estacionamento.",
      "Circulação, parada e operação de carga ou descarga.",
      "Circulação, parada, estacionamento e operação de carga ou descarga."
    ],
    correctAnswer: 3
  },
  {
    id: 5,
    category: "Legislação de Trânsito",
    question: "A Junta Administrativa de Recursos de Infrações é um órgão colegiado componente do:",
    options: [
      "Conselho Estadual de Trânsito.",
      "Conselho Nacional de Trânsito.",
      "Sistema Nacional de Trânsito.",
      "Departamento Nacional de Trânsito."
    ],
    correctAnswer: 2
  },
  {
    id: 6,
    category: "Legislação de Trânsito",
    question: "Ao Departamento de Trânsito (DETRAN), cabe, entre outras, a atribuição de:",
    options: [
      "Propor a alteração da sinalização.",
      "Organizar estatística de trânsito em todo o país.",
      "Vistoriar, registrar e emplacar veículos.",
      "Emitir carteira internacional."
    ],
    correctAnswer: 2
  },
  // SINALIZAÇÃO
  {
    id: 7,
    category: "Sinalização de Trânsito",
    question: "Melhoram a percepção do condutor e separam as faixas de trânsito:",
    options: [
      "As marcas transversais",
      "Faixas contínuas",
      "As taxas e os tachões",
      "Todas as afirmativas acima"
    ],
    correctAnswer: 2
  },
  {
    id: 8,
    category: "Sinalização de Trânsito",
    question: "A placa de formato triangular com fundo amarelo indica:",
    options: [
      "Regulamentação",
      "Advertência",
      "Indicação",
      "Orientação de destino"
    ],
    correctAnswer: 1
  },
  {
    id: 9,
    category: "Sinalização de Trânsito",
    question: "A cor vermelha na sinalização de trânsito significa:",
    options: [
      "Atenção",
      "Perigo",
      "Parada obrigatória",
      "Velocidade reduzida"
    ],
    correctAnswer: 2
  },
  {
    id: 10,
    category: "Sinalização de Trânsito",
    question: "A faixa de pedestre tem a função de:",
    options: [
      "Indicar onde os veículos devem parar.",
      "Ordenar a travessia de pedestres.",
      "Indicar local de estacionamento.",
      "Delimitar área de manobra."
    ],
    correctAnswer: 1
  },
  // DIREÇÃO DEFENSIVA
  {
    id: 11,
    category: "Direção Defensiva",
    question: "Dirigir defensivamente significa:",
    options: [
      "Dirigir de forma agressiva para evitar acidentes.",
      "Dirigir apenas nas vias principais.",
      "Dirigir de modo a prevenir acidentes, apesar das condições adversas.",
      "Dirigir em alta velocidade para sair de situações de risco."
    ],
    correctAnswer: 2
  },
  {
    id: 12,
    category: "Direção Defensiva",
    question: "São elementos da direção defensiva:",
    options: [
      "Conhecimento, atenção, previsão, decisão e habilidade.",
      "Velocidade, potência e aceleração.",
      "Freio, embreagem e acelerador.",
      "Espelhos, faróis e buzina."
    ],
    correctAnswer: 0
  },
  {
    id: 13,
    category: "Direção Defensiva",
    question: "A distância de seguimento deve ser aumentada quando:",
    options: [
      "A via está seca e livre.",
      "Há neblina, chuva ou pista molhada.",
      "O veículo da frente é grande.",
      "Não há veículos nas proximidades."
    ],
    correctAnswer: 1
  },
  {
    id: 14,
    category: "Direção Defensiva",
    question: "O que é aquaplanagem?",
    options: [
      "Quando o veículo derrapa em pista seca.",
      "Quando os pneus perdem contato com o solo devido a uma camada de água.",
      "Quando o motor falha em subidas.",
      "Quando os freios não funcionam."
    ],
    correctAnswer: 1
  },
  // PRIMEIROS SOCORROS
  {
    id: 15,
    category: "Primeiros Socorros",
    question: "Em caso de acidente de trânsito, a primeira atitude deve ser:",
    options: [
      "Remover imediatamente as vítimas.",
      "Sinalizar o local e chamar socorro especializado.",
      "Dar água para as vítimas.",
      "Tentar consertar os veículos."
    ],
    correctAnswer: 1
  },
  {
    id: 16,
    category: "Primeiros Socorros",
    question: "Quando NÃO se deve mover uma vítima de acidente?",
    options: [
      "Quando ela está consciente.",
      "Quando há suspeita de lesão na coluna.",
      "Quando ela está com frio.",
      "Quando há congestionamento no local."
    ],
    correctAnswer: 1
  },
  {
    id: 17,
    category: "Primeiros Socorros",
    question: "A posição lateral de segurança é indicada para:",
    options: [
      "Vítimas conscientes e orientadas.",
      "Vítimas inconscientes que respiram normalmente.",
      "Vítimas com fraturas nas pernas.",
      "Qualquer tipo de vítima."
    ],
    correctAnswer: 1
  },
  {
    id: 18,
    category: "Primeiros Socorros",
    question: "O número de emergência do SAMU é:",
    options: [
      "190",
      "191",
      "192",
      "193"
    ],
    correctAnswer: 2
  },
  // MEIO AMBIENTE
  {
    id: 19,
    category: "Cidadania e Meio Ambiente",
    question: "A emissão de gases poluentes pelos veículos contribui para:",
    options: [
      "Melhoria da qualidade do ar.",
      "Redução do efeito estufa.",
      "Aquecimento global e poluição atmosférica.",
      "Aumento da camada de ozônio."
    ],
    correctAnswer: 2
  },
  {
    id: 20,
    category: "Cidadania e Meio Ambiente",
    question: "Para reduzir a poluição veicular, o condutor deve:",
    options: [
      "Acelerar bruscamente.",
      "Manter o veículo sempre regulado e fazer manutenções preventivas.",
      "Usar combustível adulterado.",
      "Remover o catalisador do veículo."
    ],
    correctAnswer: 1
  },
  // MECÂNICA BÁSICA
  {
    id: 21,
    category: "Mecânica Básica",
    question: "A calibragem incorreta dos pneus pode causar:",
    options: [
      "Economia de combustível.",
      "Desgaste irregular e risco de acidentes.",
      "Melhor aderência.",
      "Maior durabilidade."
    ],
    correctAnswer: 1
  },
  {
    id: 22,
    category: "Mecânica Básica",
    question: "O sistema de freios deve ser verificado:",
    options: [
      "Apenas quando falhar.",
      "Periodicamente conforme manual do veículo.",
      "Uma vez ao ano apenas.",
      "Somente na revisão geral."
    ],
    correctAnswer: 1
  },
  {
    id: 23,
    category: "Mecânica Básica",
    question: "A luz de óleo acesa no painel indica:",
    options: [
      "Nível de óleo normal.",
      "Problema no sistema de lubrificação.",
      "Hora de trocar de marcha.",
      "Bateria descarregada."
    ],
    correctAnswer: 1
  },
  // NORMAS DE CIRCULAÇÃO
  {
    id: 24,
    category: "Normas de Circulação",
    question: "Ao mudar de faixa, o condutor deve:",
    options: [
      "Fazer a manobra rapidamente.",
      "Sinalizar com antecedência e verificar os espelhos.",
      "Buzinar para alertar outros motoristas.",
      "Acelerar para completar a manobra."
    ],
    correctAnswer: 1
  },
  {
    id: 25,
    category: "Normas de Circulação",
    question: "Em uma rotatória, tem preferência:",
    options: [
      "Quem está entrando na rotatória.",
      "Quem já está circulando na rotatória.",
      "O veículo maior.",
      "O veículo mais rápido."
    ],
    correctAnswer: 1
  },
  {
    id: 26,
    category: "Normas de Circulação",
    question: "A ultrapassagem pela direita é permitida quando:",
    options: [
      "Nunca é permitida.",
      "O veículo da frente indicar que vai virar à esquerda.",
      "A pista está congestionada.",
      "O condutor tem pressa."
    ],
    correctAnswer: 1
  },
  {
    id: 27,
    category: "Infrações e Penalidades",
    question: "Dirigir sob influência de álcool é uma infração:",
    options: [
      "Leve.",
      "Média.",
      "Grave.",
      "Gravíssima."
    ],
    correctAnswer: 3
  },
  {
    id: 28,
    category: "Infrações e Penalidades",
    question: "Avançar o sinal vermelho é uma infração:",
    options: [
      "Leve.",
      "Média.",
      "Grave.",
      "Gravíssima."
    ],
    correctAnswer: 3
  },
  {
    id: 29,
    category: "Infrações e Penalidades",
    question: "Estacionar em local proibido é geralmente uma infração:",
    options: [
      "Leve.",
      "Média.",
      "Grave.",
      "Gravíssima."
    ],
    correctAnswer: 1
  },
  {
    id: 30,
    category: "Processo de Habilitação",
    question: "Para obter a primeira habilitação, o candidato deve ter no mínimo:",
    options: [
      "16 anos.",
      "17 anos.",
      "18 anos.",
      "21 anos."
    ],
    correctAnswer: 2
  }
];

export function getRandomQuestions(count: number = 30): QuizQuestion[] {
  const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
