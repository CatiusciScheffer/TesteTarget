'''
TESTE 5
5) Escreva um programa que inverta os caracteres de um string.

IMPORTANTE:
a) Essa string pode ser informada através de qualquer entrada de sua preferência ou pode ser previamente definida no código;
b) Evite usar funções prontas, como, por exemplo, reverse;
'''

def inverter_string(s):
    texto_invertido = ""
    for char in s:
        texto_invertido = char + texto_invertido
    return texto_invertido

# Exemplo de uso
texto = "Ficaria muito feliz com esta oportunidade"
print("String original:", texto)
print("String invertida:", inverter_string(texto))
