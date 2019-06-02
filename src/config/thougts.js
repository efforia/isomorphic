const positiveQuestions = [
  {
    question: 'Será divertido fazer algumas atividades de lazer nesse fim de semana.'
  },
  {
    question: 'Eu consegui mais coisas boas na vida do que uma pessoa comum.'
  },
  {
    question: 'O clima/tempo está ótimo hoje.'
  },
  {
    question: 'Eu posso fazer melhor do que isso.'
  },
  {
    question: 'Mesmo que as coisas estejam ruins agora, elas irão melhorar.'
  },
  {
    question: 'Eu aprenderei a ser feliz enquanto eu viver.'
  },
  {
    question: 'Essa foi provavelmente a melhor solução para um problema difícil.'
  },
  {
    question: 'A vida é interessante.'
  },
  {
    question: 'Eu mereço crédito por me esforçar.'
  },
  {
    question: 'Eu fiz uma coisa boa.'
  },
  {
    question: 'Eu realmente me sinto ótimo(a).'
  },
  {
    question: 'Isso é divertido.'
  },
  {
    question: 'Eu sou uma boa pessoa.'
  },
  {
    question: 'Eu posso fazer praticamente tudo, se eu me focar para isso.'
  },
  {
    question: 'Eu tenho grandes esperanças para o futuro.'
  },
  {
    question: 'Eu tenho um bom autocontrole.'
  },
  {
    question: 'Isso é um interessante.'
  },
  {
    question: 'Eu realmente lidei bem com a situação.'
  },
  {
    question: 'As pessoas são legais, depois que você as conhece.'
  },
  {
    question: 'Eu gosto de ler.'
  },
  {
    question: 'Eu sou uma pessoa fácil de lidar.'
  },
  {
    question: 'Se eu me mantiver firme até [dia do término do estressor], eu ficarei bem.'
  },
  {
    question: 'Uma noite boa e relaxante pode ser muito agradável.'
  },
  {
    question: 'Eu já trabalhei demais, agora é hora de me divertir.'
  },
  {
    question: 'Eu me importo com as pessoas.'
  },
  {
    question: 'Eu tenho tempo suficiente para conquistar as coisas que eu quero.'
  },
  {
    question: 'Algum dia eu vou olhar para o passado e sorrir.'
  },
  {
    question: 'Eu gosto de pessoas.'
  },
  {
    question: 'Eu sempre encontrarei forças para lidar com o que vier.'
  },
  {
    question: 'Eu sou uma boa mãe (pai, filho(a), marido, esposa, etc.).'
  },
  {
    question: 'Eu sou uma pessoa sensível.'
  },
  {
    question: 'Eu sou honesto(a).'
  },
  {
    question: 'Eu conseguiria lidar com uma crise tão bem quanto outra pessoa.'
  },
  {
    question: 'Eu tenho muita sorte.'
  },
  {
    question: 'Eu sou responsável.'
  },
  {
    question: 'Minhas experiências me prepararam bem para o futuro.'
  },
  {
    question: 'Isso é engraçado.'
  },
  {
    question: 'Eu sou inteligente.'
  },
  {
    question: 'Eu sou fisicamente atraente.'
  },
  {
    question: 'Eu não quero perder essa oportunidade, e vou lutar por ela.'
  }
]

const negativeThoughts = [
  {
    question: 'Eu sou confuso(a).'
  },
  {
    question: 'Não existe amor no mundo.'
  },
  {
    question: 'Eu estou desperdiçando a minha vida.'
  },
  {
    question: 'Eu estou assustado(a).'
  },
  {
    question: 'Ninguém me ama.'
  },
  {
    question: 'Eu acabarei vivendo sozinho(a).'
  },
  {
    question: 'As pessoas não consideram mais que a amizade seja importante.'
  },
  {
    question: 'Eu não tenho paciência alguma.'
  },
  {
    question: 'Pra que?'
  },
  {
    question: 'Isso é uma coisa idiota pra eu fazer.'
  },
  {
    question: 'Provavelmente algum dia vou acabar indo para um hospício.'
  },
  {
    question: 'Quem pensa que eu sou legal não me conhece de verdade.'
  },
  {
    question: 'A vida não tem sentido.'
  },
  {
    question: 'Eu sou feio(a).'
  },
  {
    question: 'Eu não consigo expressar meus sentimentos.'
  },
  {
    question: 'Eu nunca vou encontrar o que eu realmente quero.'
  },
  {
    question: 'Eu sou incapaz de amar.'
  },
  {
    question: 'Eu não tenho valor.'
  },
  {
    question: 'É tudo minha culpa.'
  },
  {
    question: 'Por que tantas coisas ruins acontecem para mim?'
  },
  {
    question: 'Eu não consigo pensar em nada que seria divertido.'
  },
  {
    question: 'Eu não tenho aquilo que preciso.'
  },
  {
    question: 'É cruel que crianças venham ao mundo, pois a vida não vale a pena.'
  },
  {
    question: 'Eu nunca vou superar essa depressão.'
  },
  {
    question: 'As coisas estão tão bagunçadas que não faz sentido tentar arrumar.'
  },
  {
    question: 'Eu não tenho força de vontade suficiente.'
  },
  {
    question: 'Por que se dar o trabalho de levantar de manhã?'
  },
  {
    question: 'Eu gostaria de estar morto.'
  },
  {
    question: 'Eu fico imaginando se as pessoas estão falando de mim.'
  },
  {
    question: 'As coisas só tendem a piorar.'
  },
  {
    question: 'Eu tenho um temperamento ruim.'
  },
  {
    question: 'Não adianta me esforçar, os outros nunca ficam satisfeitos.'
  },
  {
    question: 'A vida é injusta.'
  },
  {
    question: 'Eu nunca vou ter uma boa renda.'
  },
  {
    question: 'Eu não ouso imaginar como vai estar a minha vida daqui a 10 anos.'
  },
  {
    question: 'Tem algo errado comigo.'
  },
  {
    question: 'Eu sou egoísta.'
  },
  {
    question: 'Minha memória é ruim.'
  },
  {
    question: 'Eu não são tão bom quanto o [pessoa com quem se compara].'
  },
  {
    question: 'Eu me magôo facilmente.'
  }
]

const formatItems = items =>
  /* eslint-disable-next-line */
  items.map(item => {
    return {
      ...item,
      property: item.question
        .toLowerCase()
        .replace(/ /g, '_')
        .replace(/á/g, 'a')
        .replace(/ã/g, 'a')
        .replace(/â/g, 'a')
        .replace(/ó/g, 'o')
        .replace(/õ/g, 'o')
        .replace(/ô/g, 'o')
        .replace(/é/g, 'e')
        .replace(/ê/g, 'e')
        .replace(/ú/g, 'u')
        .replace(/\//g, '_')
    }
  })

export default {
  positive: formatItems(positiveQuestions),
  negative: formatItems(negativeThoughts)
}
