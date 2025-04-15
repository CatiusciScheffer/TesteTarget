'''
TESTE 3
Dado um vetor que guarda o valor de faturamento diário de uma distribuidora, faça um programa, na linguagem que desejar, que calcule e retorne:
• O menor_valor valor de faturamento ocorrido em um dia do mês;
• O maior_valor valor de faturamento ocorrido em um dia do mês;
• Número de dias no mês em que o valor de faturamento diário foi superior à média mensal.

IMPORTANTE:
a) Usar o json ou xml disponível como fonte dos dados do faturamento mensal;
b) Podem existir dias sem faturamento, como nos finais de semana e feriados. Estes dias devem ser ignorados no cálculo da média;
'''

import json

with open('dados.json') as f:
    dados = json.load(f)

# Ignorar dias com faturamento 0
valores = [d["valor"] for d in dados if d["valor"] > 0]

menor_valor = min(valores)
maior_valor = max(valores)
media_sem_considerar_zeros = sum(valores) / len(valores)
dias_acima_media = len([v for v in valores if v > media_sem_considerar_zeros])

print(f"menor_valor faturamento: R${menor_valor:.2f}")
print(f"maior_valor faturamento: R${maior_valor:.2f}")
print(f"Dias com faturamento acima da média: {dias_acima_media}")
