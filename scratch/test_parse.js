const fs = require('fs');

const jsonStr = `[
  {
    "id": "o2em54camr31ufpl",
    "createdAt": 1782954625701,
    "track": "calibration",
    "match": {
      "home": "Espanha",
      "away": "Áustria",
      "kickoff": "16:00",
      "stage": "32 avos de final",
      "venue": "SoFi Stadium, Los Angeles (Inglewood, CA)",
      "date": "2026-07-02"
    },
    "exAnte": {
      "track": "calibration",
      "market": "Espanha vence a partida (90 min / moneyline)",
      "probability": 68,
      "confidence": 3,
      "rationale": "O mercado precifica Espanha a ~-300/-320 no moneyline de 90 min (FanDuel), equivalente a ~75-76% de probabilidade implícita bruta. Minha estimativa recalibrada é de 68% de vitória regular da Espanha nos 90 min — ligeiramente abaixo do implied do mercado, mas não o suficiente para divergência apostável. A ancoragem no mercado é o ponto de partida obrigatório. O que justifica o pequeno desconto em relação ao implied: (1) CORREÇÃO APLICADA — Nico Williams (addutor direito) e Yeremy Pino (acromioclavicular) estão ambos confirmados ausentes para este jogo, deixando De la Fuente criticamente curto de opções nas alas; isso reduz o teto ofensivo de Espanha e é o único fator concreto não trivialmente já incorporado — embora o mercado, publicado APÓS o anúncio das lesões, muito provavelmente já as tenha incorporado em grande parte. (2) A Áustria demonstrou capacidade de pontuar mesmo contra oponentes de alto nível (3-3 vs. Argélia, 3-1 vs. Jordânia) e Rangnick é treinador de alta capacidade tática com potencial para explorar o espaço deixado por wingers ausentes. (3) A forma geral de Espanha é excelente — 34 jogos de invencibilidade, zero gols sofridos nos 3 jogos de grupo — e a solidez defensiva é real e verificada. (4) Não há evidência de edge genuíno contra o mercado. Nenhuma informação concreta e verificável (lineup surpresa, condition clima severo, fator extra-esportivo) sugere divergência material não incorporada nas odds. Mercados Copa do Mundo são eficientes; a narrativa das lesões é pública e amplamente divulgada. Conclusão: sem bet. Calibration apenas.",
      "keyFactors": [
        "Espanha zerou 3 jogos de grupo, 34 jogos invicta — solidez defensiva real e verificada",
        "Nico Williams (addutor) e Yeremy Pino (acromioclavicular) CONFIRMADOS ausentes — flancos esvaziados",
        "Lamine Yamal em ascensão de forma após lesão; deve assumir liderança ofensiva principal",
        "XI previsto Espanha (4-2-3-1): Simón; Llorente, Cubarsí, Laporte, Cucurella; Rodri, Pedri; Yamal, Merino, Baena; Oyarzabal",
        "Áustria XI previsto: A. Schlager; Posch, Lienhart, Alaba, Mwene; Siewald, X. Schlager; Laimer, Schmid, Sabitzer; Arnautovic",
        "Áustria concedeu gols em 12 jogos consecutivos de Copa do Mundo — linha defensiva permeável",
        "H2H: último encontro 2009 (Espanha 5-1 Áustria); último resultado positivo da Áustria: 1990 (amistoso)",
        "Espanha avança -950 no mercado (implícito ~90%) — altíssima confiança na progressão global",
        "Clima SoFi Stadium: ~68-72°F, parcialmente nublado, ventos calmos — condições neutras, sem impacto tático"
      ],
      "risks": [
        "Espanha sem Williams e Pino: flancos esvaziados reduzem amplitude e criatividade ofensiva de forma mensurável",
        "Rangnick pode explorar o meio-campo denso e explorar as transições — Áustria tem velocidade em Laimer e Schmid",
        "Espanha ainda não produziu seu melhor futebol no torneio (toile vs. Cabo Verde e Uruguai, apenas 2 gols em 2 jogos excl. Arábia Saudita)",
        "Arnautovic (37 anos) — curiosamente produtivo: 2 gols nesta Copa — pode ser ameaça pontual",
        "Mercado já incorporou lesões: odds pós-anúncio são prior correto; qualquer desconto adicional é narrativa"
      ],
      "suggestedBet": "SEM APOSTA RECOMENDADA. Mercado eficiente e lesões já incorporadas. Se obrigado a escolher para exposição mínima: Under 2.5 gols (+106 aprox.) alinha melhor com o perfil de Espanha controladora com alas ausentes e estrutura defensiva austríaca — mas ainda é calibration, não bet com edge verificado.",
      "dataGate": {
        "lineup": {
          "status": "confirmed",
          "note": "XI provável Espanha confirmado por múltiplas fontes (Racing Post, Yahoo Sports, 101greatgoals): Simón; Llorente, Cubarsí, Laporte, Cucurella; Rodri, Pedri; Yamal, Merino, Baena; Oyarzabal. Áustria: A. Schlager; Posch, Lienhart, Alaba, Mwene; Siewald, X. Schlager; Laimer, Schmid, Sabitzer; Arnautovic."
        },
        "injuries": {
          "status": "confirmed",
          "note": "Nico Williams (addutor direito, moderado) e Yeremy Pino (entorse acromioclavicular, moderada) CONFIRMADOS ausentes para este jogo per federação espanhola. Victor Muñoz ainda não estreou no torneio mas pode ser convocado. Nenhuma baixa confirmada para a Áustria."
        },
        "form": {
          "status": "confirmed",
          "note": "Espanha: 34 jogos invicta, 7 vitórias nos últimos 9 jogos competitivos, zero gols sofridos nos 3 jogos de grupo (4-0 Arábia Saudita, 1-0 Cabo Verde [empate], 1-0 Uruguai). Áustria: 3-1 Jordânia, 0-2 Argentina, 3-3 Argélia — classificou em 2º no Grupo J."
        },
        "h2h": {
          "status": "partial",
          "note": "Último confronto direto: 2009 (Espanha 5-1 Áustria). Última vitória austríaca: 1990 (amistoso, 3-2). Espanha venceu 6 dos últimos 8 jogos no H2H. Dados históricos completos não recuperados mas amostra relevante disponível."
        },
        "motivation": {
          "status": "confirmed",
          "note": "Knockout — ambos com motivação máxima. Espanha busca confirmar candidatura ao título como campeã europeia. Áustria retorna às oitavas pela primeira vez desde 1954 (via round of 32) — motivação histórica elevada."
        },
        "odds": {
          "status": "confirmed",
          "note": "FanDuel: Espanha -300/-320 (moneyline 90 min), Empate +420/+425, Áustria +900/+950. Espanha avança -950, Áustria +610. O/U 2.5 gols. Implícito: Espanha ~75% vencer nos 90 min; ~90% avançar."
        },
        "conditions": {
          "status": "confirmed",
          "note": "SoFi Stadium, Inglewood CA. Temperatura atual ~68°F, prevista ~72°F no horário do jogo. Parcialmente nublado, ventos calmos (~3 mph). Condições ideais para futebol. Sem pressão de altitude. Áustria sem vantagem de deslocamento — ambos neutros em Los Angeles."
        },
        "extraSporting": {
          "status": "partial",
          "note": "Nenhum fator extra-esportivo verificável identificado (sem sanções FIFA, sem protestos, sem questões políticas). Lamine Yamal em processo de recuperação de lesão de isquiotibial da pré-temporada — progressão gradual de minutos confirmada mas avaliação de pico de forma incerta."
        }
      },
      "correctionApplied": {
        "applied": true,
        "note": "Nico Williams e Yeremy Pino CONFIRMADOS ausentes — dois wingers titulares do XI ofensivo de Espanha. Por regra: redução de 10-15pp no teto ofensivo do favorito aplicada ao modelo interno. Probabilidade bruta do mercado (~75-76%) foi reduzida para ~68% na vitória em 90 min. Ressalva crítica: o mercado publicou odds APÓS o anúncio das lesões; portanto a maior parte desse ajuste já está incorporada no prior. A correção residual reflete incerteza sobre quão completamente o mercado processou o impacto tático real (não apenas a disponibilidade nominal) de ambas as ausências simultâneas nas alas."
      }
    },
    "status": "pending",
    "learned": false
  }
]`;

try {
  const parsed = JSON.parse(jsonStr);
  console.log('Parsed is array:', Array.isArray(parsed));
  console.log('Length:', parsed.length);
  const item = parsed[0];
  console.log('Item keys:', Object.keys(item));
  console.log('match is defined:', !!item.match, typeof item.match);
  console.log('exAnte is defined:', !!item.exAnte, typeof item.exAnte);
} catch (e) {
  console.error('Error parsing:', e.message);
}
