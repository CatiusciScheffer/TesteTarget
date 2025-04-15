'''
TESTE 2
2) Dado a sequência de Fibonacci, onde se inicia por 0 e 1 e o próximo valor sempre será a soma dos 2 valores anteriores (exemplo: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34...), escreva um programa na linguagem que desejar onde, informado um número, ele calcule a sequência de Fibonacci e retorne uma mensagem avisando se o número informado pertence ou não a sequência.
'''
def pertence_fibonacci(numero):
    a, b = 0, 1
    while b < numero:
        a, b = b, a + b
    return numero == b or numero == 0

def obter_numero_inteiro():
    while True:
        entrada_int_usu = input('Digite um número inteiro para verificar se pertence à sequência de Fibonacci: ')
        if entrada_int_usu.isdigit() or (entrada_int_usu.startswith('-') and entrada_int_usu[1:].isdigit()):
            return int(entrada_int_usu)
        else:
            print('')
            print(f"Entrada inválida.\nPor favor, digite um número inteiro.")
            print('')

# Exemplo de uso
num = obter_numero_inteiro()
if pertence_fibonacci(num):
    print(f"O número {num} pertence à sequência de Fibonacci.")
else:
    print(f"O número {num} NÃO pertence à sequência de Fibonacci.")
