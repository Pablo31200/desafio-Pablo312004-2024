class RecintosZoo {
  analisaRecintos(animal, quantidade) {
    const recintos = [
      {
        numero: 1,
        bioma: ["savana"],
        tamanhoTotal: 10,
        animais: [{ especie: "MACACO", quantidade: 2 }],
      },
      { numero: 2, bioma: ["floresta"], tamanhoTotal: 5, animais: [] },
      {
        numero: 3,
        bioma: ["savana", "rio"],
        tamanhoTotal: 7,
        animais: [{ especie: "GAZELA", quantidade: 1 }],
      },
      { numero: 4, bioma: ["rio"], tamanhoTotal: 8, animais: [] },
      {
        numero: 5,
        bioma: ["savana"],
        tamanhoTotal: 9,
        animais: [{ especie: "LEAO", quantidade: 1 }],
      },
    ];

    const especies = {
      LEAO: { tamanho: 3, biomas: ["savana"], carnivoro: true },
      LEOPARDO: { tamanho: 2, biomas: ["savana"], carnivoro: true },
      CROCODILO: { tamanho: 3, biomas: ["rio"], carnivoro: true },
      MACACO: { tamanho: 1, biomas: ["savana", "floresta"], carnivoro: false },
      GAZELA: { tamanho: 2, biomas: ["savana"], carnivoro: false },
      HIPOPOTAMO: { tamanho: 4, biomas: ["savana", "rio"], carnivoro: false },
    };

    // Verificação para saber se o animal é válido:
    if (!especies[animal]) {
      return { erro: "Animal inválido" };
    }

    // Validação da quantidade
    if (typeof quantidade !== "number" || quantidade <= 0) {
      return { erro: "Quantidade inválida" };
    }

    const animalInfo = especies[animal];
    const tamanhoNecessario = animalInfo.tamanho * quantidade;

    let recintosViaveis = [];

    // Função auxiliar para calcular o espaço ocupado no recinto
    const calculo_de_Espaco_Ocupado = (animais) => {
      return animais.reduce((total, a) => {
        return total + especies[a.especie].tamanho * a.quantidade;
      }, 0);
    };

    // Função auxiliar para verificar se o bioma do recinto é compatível com o animal
    const biomaCompativel = (recintoBiomas, animalBiomas) => {
      return recintoBiomas.some((bioma) => animalBiomas.includes(bioma));
    };

    // Verificação dos recintos viáveis
    recintos.forEach((recinto) => {
      // Verifica se o bioma é compatível
      if (!biomaCompativel(recinto.bioma, animalInfo.biomas)) {
        return;
      }

      let espacoOcupado = calculo_de_Espaco_Ocupado(recinto.animais);
      const animaisNoRecinto = recinto.animais.map((a) => a.especie);

      // Regras dos animais carnívoros (só podem conviver com a mesma espécie)
      const AnCarnivoro = recinto.animais.some(
        (a) => especies[a.especie].carnivoro
      );
      if (
        animalInfo.carnivoro &&
        (AnCarnivoro ||
          (animaisNoRecinto.length > 0 && animaisNoRecinto[0] !== animal))
      ) {
        return;
      }

      // Hipopótamo pode viver com outras espécies apenas no bioma savana e rio
      if (
        animal === "HIPOPOTAMO" &&
        recinto.bioma.length < 2 &&
        animaisNoRecinto.length > 0
      ) {
        return;
      }

      // Para macacos, eles podem ficar em recintos que já têm animais,
      // ou em recintos vazios, desde que o bioma seja compatível
      if (animal === "MACACO" && recinto.animais.length === 0) {
        espacoOcupado = 0;
      }

      let espacoDisponivel = recinto.tamanhoTotal - espacoOcupado;

      // Se há mais de uma espécie, considere 1 espaço extra
      if (recinto.animais.length > 0 && !AnCarnivoro) {
        espacoDisponivel -= 1; // Ajuste para o espaço extra
      }

      // Se o espaço disponível for suficiente, adiciona o recinto à lista de viáveis
      if (espacoDisponivel >= tamanhoNecessario) {
        recintosViaveis.push({
          numero: recinto.numero,
          espacoLivre: espacoDisponivel - tamanhoNecessario,
          espacoTotal: recinto.tamanhoTotal,
        });
      }
    });

    // Ordena os recintos viáveis pelo número do recinto
    recintosViaveis.sort((a, b) => a.numero - b.numero);

    // Verifica se encontrou recintos viáveis
    if (recintosViaveis.length === 0) {
      return { erro: "Não há recinto viável" };
    }

    // Verifica se o número de recintos viáveis excede o necessário para o animal
    if (recintosViaveis.length > 3) {
      recintosViaveis = recintosViaveis.slice(0, 3); // Limita a 3 recintos viáveis
    }

    // Retorna a lista de recintos viáveis formatados
    return {
      recintosViaveis: recintosViaveis.map(
        (r) =>
          `Recinto ${r.numero} (espaço livre: ${r.espacoLivre} total: ${r.espacoTotal})`
      ),
    };
  }
}

export { RecintosZoo as RecintosZoo };
