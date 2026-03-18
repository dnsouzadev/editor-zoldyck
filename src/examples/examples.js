const pseudocodeExamples = {
  helloWorld: {
    name: 'Hello World',
    code: `algoritmo "Hello World"
inicio
   escreval("Olá, Mundo!")
   escreval("Bem-vindo ao Editor Portugol Web!")
fimalgoritmo`,
  },
  calculadora: {
    name: 'Calculadora Simples',
    code: `algoritmo "Calculadora Simples"
var
   num1, num2, resultado: real
   operacao: caractere
inicio
   escreva("Digite o primeiro número: ")
   leia(num1)
   escreva("Digite o segundo número: ")
   leia(num2)
   escreva("Digite a operação (+, -, *, /): ")
   leia(operacao)
   
   se operacao = "+" entao
      resultado <- num1 + num2
   senao
      se operacao = "-" entao
         resultado <- num1 - num2
      senao
         se operacao = "*" entao
            resultado <- num1 * num2
         senao
            se operacao = "/" entao
               resultado <- num1 / num2
            fimse
         fimse
      fimse
   fimse
   
   escreval("Resultado: ", resultado)
fimalgoritmo`,
  },
  tabuada: {
    name: 'Tabuada',
    code: `algoritmo "Tabuada"
var
   numero, i, resultado: inteiro
inicio
   escreva("Digite um número para ver a tabuada: ")
   leia(numero)
   escreval("")
   escreval("Tabuada do ", numero, ":")
   escreval("-------------------")
   
   para i de 1 ate 10 faca
      resultado <- numero * i
      escreval(numero, " x ", i, " = ", resultado)
   fimpara
fimalgoritmo`,
  },
  parImpar: {
    name: 'Par ou Ímpar',
    code: `algoritmo "Par ou Ímpar"
var
   numero: inteiro
inicio
   escreva("Digite um número: ")
   leia(numero)
   
   se numero mod 2 = 0 entao
      escreval("O número ", numero, " é PAR")
   senao
      escreval("O número ", numero, " é ÍMPAR")
   fimse
fimalgoritmo`,
  },
  media: {
    name: 'Média de Notas',
    code: `algoritmo "Média de Notas"
var
   nota1, nota2, nota3, media: real
inicio
   escreval("=== Cálculo de Média ===")
   escreval("")
   
   escreva("Digite a primeira nota: ")
   leia(nota1)
   escreva("Digite a segunda nota: ")
   leia(nota2)
   escreva("Digite a terceira nota: ")
   leia(nota3)
   
   media <- (nota1 + nota2 + nota3) / 3
   
   escreval("")
   escreval("Média: ", media)
   
   se media >= 7 entao
      escreval("Situação: APROVADO")
   senao
      se media >= 5 entao
         escreval("Situação: RECUPERAÇÃO")
      senao
         escreval("Situação: REPROVADO")
      fimse
   fimse
fimalgoritmo`,
  },
  vetores: {
    name: 'Soma de Vetores',
    code: `algoritmo "Soma de Vetores"
var
   numeros: vetor[1..5] de inteiro
   i, soma: inteiro
inicio
   soma <- 0
   
   escreval("Digite 5 números:")
   para i de 1 ate 5 faca
      escreva("Número ", i, ": ")
      leia(numeros[i])
      soma <- soma + numeros[i]
   fimpara
   
   escreval("")
   escreval("Números digitados:")
   para i de 1 ate 5 faca
      escreval("Posição ", i, ": ", numeros[i])
   fimpara
   
   escreval("")
   escreval("Soma total: ", soma)
fimalgoritmo`,
  },
  contagem: {
    name: 'Contagem com Enquanto',
    code: `algoritmo "Contagem Regressiva"
var
   contador: inteiro
inicio
   contador <- 10
   
   escreval("Contagem regressiva:")
   enquanto contador >= 0 faca
      escreval(contador)
      contador <- contador - 1
   fimenquanto
   
   escreval("FIM!")
fimalgoritmo`,
  },
  fibonacci: {
    name: 'Sequência de Fibonacci',
    code: `algoritmo "fibonacci"
var
   inteiro m, i, a, b, c
inicio
   escreva("Quantos termos da sequência de Fibonacci deseja ver? ")
   leia(m)
   
   a <- 0
   b <- 1

   escreval("")
   escreval("Sequência:")
   para i de 1 ate m faca
      escreva(a, " ")
      c <- a + b
      a <- b
      b <- c
   fimpara
   escreval("")
fimalgoritmo`,
  },
};

const visualgExamples = {
  visualgTabuada: {
    name: 'Tabuada VisualG',
    code: `programa
{
	funcao inicio() 
	{
		inteiro numero, resultado, contador
		
		escreva("Informe um número para ver sua tabuada: ")
		leia(numero)

		limpa()
		
		para (contador = 1; contador <= 10; contador++) 
		{
			resultado = numero * contador 
			escreva (numero, " X ", contador, " = ", resultado , "\\n")
		}
	}
}`,
  },
  visualgMensagem: {
    name: 'Procedimento de Mensagem',
    code: `programa
{
	funcao inicio()
	{
		mensagem("Bem Vindo")
	     escreva("O resultado do primeiro cálculo é: ", calcula (3.0, 4.0))  		
	     escreva("\\nO resultado do segundo cálculo é: ", calcula (7.0, 2.0), "\\n")  		
	     mensagem("Tchau")
	}

	funcao mensagem (cadeia texto)
	{
		inteiro i
		
		para(i = 0; i < 50; i++)
		{
		  escreva ("-")
		}
		
		escreva ("\\n", texto, "\\n")
		
		para(i = 0; i < 50; i++)
		{
		  escreva ("-")
		}

		escreva("\\n")
	}

	funcao real calcula (real a, real b)
	{
		real resultado
		resultado = a * a + b * b
		retorne resultado
	}
}`,
  },
  visualgTroca: {
    name: 'Troca de Variáveis',
    code: `programa
{
	funcao inicio() 
	{
		inteiro a, b, aux

		escreva("Informe um valor para A: ")
		leia(a)

		escreva("Informe um valor para B: ")
		leia(b)

		limpa()

		escreva("Antes da troca: A = ", a, "; B = ", b, "\\n")
		
		aux = a
		a = b
		b = aux

		escreva("Depois da troca: A = ", a, "; B = ", b, "\\n")
	}
}`,
  },
  visualgDias: {
    name: 'Dias desde 01/01/0001',
    code: `programa
{
	funcao inicio()
	{
		inteiro ano_atual, qtd_anos_bi, dias

		escreva("Informe o ano atual: ")
		leia(ano_atual)

		qtd_anos_bi = ano_atual / 4 
		dias = (ano_atual - 1) * 365 +  qtd_anos_bi 
		
		escreva("Já se passaram ", dias, " dias desde 01/01/0001\\n")
	}
}`,
  },
};

const EXAMPLES_BY_MODE = {
  pseudocode: pseudocodeExamples,
  visualg: visualgExamples,
};

const DEFAULT_EXAMPLE_BY_MODE = {
  pseudocode: 'helloWorld',
  visualg: 'visualgTabuada',
};

export function getExamplesList(mode = 'pseudocode') {
  const registry = EXAMPLES_BY_MODE[mode] || EXAMPLES_BY_MODE.pseudocode;
  return Object.keys(registry).map((key) => ({
    id: key,
    name: registry[key].name,
  }));
}

export function getExample(id, mode = 'pseudocode') {
  const registry = EXAMPLES_BY_MODE[mode] || EXAMPLES_BY_MODE.pseudocode;
  const fallback = registry[DEFAULT_EXAMPLE_BY_MODE[mode] || DEFAULT_EXAMPLE_BY_MODE.pseudocode];
  return registry[id]?.code || fallback.code;
}

export function getDefaultCode(mode = 'pseudocode') {
  return getExample(DEFAULT_EXAMPLE_BY_MODE[mode] || DEFAULT_EXAMPLE_BY_MODE.pseudocode, mode);
}
