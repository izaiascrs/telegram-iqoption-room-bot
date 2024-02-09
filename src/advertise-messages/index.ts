import path from 'path';
import { LocalPath, MessageLike } from 'telegram/define';
import { TMakeCounter, makeCounter } from '../utils/helpers';

export type TAdvertiseMessage = {
	messagesIndexController: TMakeCounter,
	messages: {
		message: MessageLike,
		file?: LocalPath
	}[]
}

// Vip and Free channels ad
export const topSignalsIqOptionAdvertiseMessages: TAdvertiseMessage = {
	messagesIndexController: makeCounter(),
	messages: [
		{
			message:
				'🤑 SABIA QUE VOCÊ PODE TER A SUA PRÓPRIA SALA DE SINAIS? 😲\n' + '\n' +
				'🌟 É isso mesmo! Imagine ser o dono da sua própria Sala de Sinais e faturar muita grana todos os meses? 💰😃\n' + '\n' +
				'🚀 Você terá assessoria para lucrar, vender diariamente e administrar seu negócio.\n' + ' \n' +
				'👉🏻 Não perca tempo! Número de licenças limitadas no preço promocional!\n' + '\n' +
				'🫰💵 Chama rápido: @gsantos_ob\n'
		},
		{
			message: '🤝 QUE TAL SER DONO DESSA SALA DE SINAIS AQUI COMO NOSSO SÓCIO?\n' + '\n' +
				'🌟 Quer saber como? Então chama o suporte e entenda como ter seus próprios clientes e  ganhar muita grana todos os meses! Ficou interessado? 💰\n' + '\n' +
				'🚀 Se isso faz sentido para você, aproveite AGORA uma das vagas são limitadas no preço promocional. \n' + '\n' +
				'Clique no link abaixo:\n' + '\n' +
				'👉🏻 *Link:* @gsantos_ob\n' + '\n'
		},
		{
			message: '🤑 ESQUEÇA QUALQUER COISA SOBRE SALA DE SINAIS E PASSE PARA O PRÓXIMO NÍVEL COM A GENTE!\n' + '\n' +
				'🚀 Venha para a Sala IQ OPTION que vai te levar ao próximo nível!😱 Você vai investir só R$39,90 por mês para lucrar muito com a gente!🤩\n' + '\n' +
				'Vem lucrar...👇👇👇\n' + '\n' +
				'💵 Chama agora: @gsantos_ob \n' + '\n'
		},
		{
			message: '💰VEM PRA NA NOSSA SALA VIP LUCRAR MUITO MAIS! 🤑\n' + '\n' +
				'🌟SIIIMMM! EU SEI! Você já está lucrando com nossos Sinais Free? Mas, que tal lucrar MUITO MAIS ?😱\n' + '\n' +
				'🤩Gostou né!?\n' + '\n' +
				'🚀 💵 Chama agora: @gsantos_ob',
		},
		{
			message: '📉📈  COMO APROVEITAR NOSSOS SINAIS❓\n' +
				'\n' +
				'\n' +
				'🚨 NÃO RECOMENDAMOS O USO DE MARTINGALE, PORÉM, SE VOCÊ DECIDIR USAR, SUGERIMOS QUE UTILIZE SOMENTE 1 MARTINGALE (SE NECESSÁRIO) 🚨\n' +
				'\n' +
				'\n' +
				'⚠️ 👉 🔎 FILTRE AS OPERAÇÕES:\n' +
				'\n' +
				'✔️ Verifique a tendência e entre somente a favor da tendência.\n' +
				'\n' +
				'❌ Não entre em todas as operações! Você tem mais de 100 por dia. 😃 \n' +
				'\n' +
				'👉 Dê preferência para entrar nas operações que aconteça um GAP em seu favor. \n' +
				'\n' +
				'⏰ Fique atento ao Tempo de Expiração da operação.\n' +
				'\n' +
				'🔢 Siga um Gerenciamento inteligente e profissional.\n' +
				'\n' +
				'🤯 Não opere se estiver com o seu psicológico abalado de alguma forma.\n' +
				'\n' +
				'🚫 Não opere colocando em risco dinheiro comprometido com contas e sua subsistência. \n' +
				'\n' +
				'\n' +
				'💲👉 Se precisa saber \n' +
				'mais sobre trade entre em contato com o nosso suporte e solicite materiais GRATUITOS 🆓',
		},
		{
			message: '⚠️🤑👇\n' + '\n' +
    'VEM GANHAR DINHEIRO COM A GENTE ❗️\n' + '\n' +
    '👉🏦 Clique para Abrir na IQ OPTION -  https://bit.ly/CliqueAqui-IqOption\n' +'\n' +
    '📈🆘📉 Não sabe Operar? Clique aqui 👉 https://www.youtube.com/@GabrielSantosOB/featured',
		},
		{
			message: '📉📈COMO APROVEITAR NOSSOS SINAIS❓\n' + '\n' + '\n' +
    '🚨 NÃO RECOMENDAMOS O USO DE MARTINGALE, PORÉM, SE VOCÊ DECIDIR USAR, SUGERIMOS QUE UTILIZE SOMENTE 1 MARTINGALE (SE NECESSÁRIO) 🚨\n' +'\n' +'\n' +
    '⚠️ 👉 🔎 FILTRE AS OPERAÇÕES:\n' +'\n' +
    '✔️ Verifique a tendência e entre somente a favor da tendência.\n' +'\n' +
    '❌ Não entre em todas as operações! Você tem mais de 100 por dia. 😃 \n' +'\n' +
    '👉 Dê preferência para entrar nas operações que aconteça um GAP em seu favor. \n' +'\n' +
    '⏰ Fique atento ao Tempo de Expiração da operação.\n' +'\n' +
    '🔢 Siga um Gerenciamento inteligente e profissional.\n' +'\n' +
    '🤯 Não opere se estiver com o seu psicológico abalado de alguma forma.\n' +'\n' +
    '🚫 Não opere colocando em risco dinheiro comprometido com contas e sua subsistência. \n' +'\n' +'\n' +
    '💲👉 Se precisa saber mais sobre trade entre em contato com o nosso suporte e solicite materiais GRATUITOS 🆓',
		}
	]
};

// Vip channel ad
export const communityOfTradersIqOptionVipAdvertiseMessages: TAdvertiseMessage = {
	messagesIndexController: makeCounter(),
	messages: [
		{
			message: '🤑📌 TOP SINAIS CATALOGADOS LOGO MAIS.... VAI PERDER?! 🗒👇👇👇\n' + '\n' +
				'👉 🚥 Para saber como pegar nossos sinais, envie uma mensagem para o suporte:\n' + '\n' +
				'🆘 https://wa.me/message/RMWFMXEKWKD3B1\n' + '\n' +
				'🚨👉 Abra conta GRÁTIS, ganhe $ 10.000 para treinar e um BÔNUS da Corretora.\n' + '\n' +
				' 🤑👇 \n' +
				'https://affiliate.iqbroker.com/redir/?aff=378040&aff_model=revenue&afftrack='
		},
		{
			message: '🚨👉 Abra conta GRÁTIS, ganhe $ 10.000 para treinar e um BÔNUS da Corretora.\n' + '\n' +
				' 🤑👇 \n' +
				'https://affiliate.iqbroker.com/redir/?aff=378040&aff_model=revenue&afftrack=\n' + '\n' +
				'🆘 Se precisa de ajuda, chama o SUPORTE: https://wa.me/message/RMWFMXEKWKD3B1'
		},
		{
			message: '📊 NÃO ESQUECA❗️De 2ª a 6ª Feira, entre 19h e 22h... Sinais catalogados, dicas, setups, cursos, orientações e materiais GRATUITOS de trade.\n' + '\n' +
				'Somente aqui 🥇😃👍',
		},
		{
			message: '🤑👇\n' + '\n' +
				'Para ganhar dinheiro com a gente, abra conta agora nesse link 👇 \n' +
				'https://affiliate.iqbroker.com/redir/?aff=378040&aff_model=revenue\n' + '\n' +
				'  e envie o ID para: https://wa.me/message/RMWFMXEKWKD3B1\n' + '\n' + '\n' +
				'Depois, siga as demais orientações que colocamos aqui no Canal.👍🤑'
		},
		{
			message: '🚦🗒 COMO APROVEITAR MELHOR NOSSOS SINAIS TOP❓\n' + '\n' + '\n' +
				'🤑👉 Abra conta GRÁTIS na Corretora: https://affiliate.iqbroker.com/redir/?aff=378040&aff_model=revenue&afftrack=\n' + '\n' +
				'🚨🔂 Se você decidir usar martingale, UTILIZE SOMENTE UM.\n' + '\n' +
				'📈📉 Entre nas operações somente a favor da tendência.\n' + '\n' +
				'❌⛔️ Não entre em todas as operações!\n' + '\n' +
				'🎯👉 Só entre nas operações que aconteceram um GAP em seu favor. \n' + '\n' +
				'⏰👉 Fique atento ao Tempo de Expiração da operação, para qual Corretora é o sinal, se é OTC ou mercado normal.\n' + '\n' +
				'🔢👉 Siga um Gerenciamento inteligente e profissional.\n' + '\n' +
				'😡😞 Não opere se estiver com o seu psicológico abalado de alguma forma.\n' + '\n' +
				'💸🚫 Não opere colocando em risco dinheiro comprometido com contas e sua subsistência. \n' + '\n' +
				'🆓👉 Se precisa saber mais sobre trade, aproveite os materiais GRATUITOS que colocamos aqui de 2ª a 6ª Feira, entre 19h e 22h...',
		},
		{
			message: '❔❓❔❓❔❓❔❓❔❓❔❓❔❓❔\n' + '\n' + '\n' +
				'🤷‍♂️ PERGUNTAS FREQUENTES E RESPOSTAS: 🤷‍♀️\n' + '\n' + '\n' +
				'1️⃣ Por que não manda no Canal o print das operações realizadas?\n' + '\n' +
				'RESPOSTA: Porque se a gente for fazer o print de cada operação para colocar no Canal, pode atrapalhar os Sinais que vão chegando. 📈🌎\n' + '\n' + '\n' +
				'2️⃣ As operações são enviadas por robôs?\n' + '\n' +
				'RESPOSTA: Não! Nós utilizamos uma automação apenas para formatar as mensagens do nosso jeito e  colocar no Canal. 🤖🌐\n' + '\n' + '\n' +
				'3️⃣ Os sinais são assertivos?\n' + '\n' +
				'RESPOSTA: Sim, com certeza! Se você seguir todas as dicas e orientações que damos, a assertividade varia de 88 a 97%. 🎯✅\n' + '\n' + '\n' +
				'4️⃣ É tudo grátis mesmo ou é só pegadinha?\n' + '\n' +
				'RESPOSTA: Por enquanto é tudo realmente grátis e sem pegadinha ou surpresas. Basta abrir uma conta com o nosso código, fazer um depósito inicial de R$ 100,00 na sua conta e movimentar pelo menos R$ 100,00 todo mês.💰🆓\n' + '\n' + '\n' +
				'5️⃣ Mas se eu não quiser abrir conta com o código de vocês e mesmo assim quiser participar do Canal? Tem como?\n' + '\n' +
				'RESPOSTA: Tem sim. Neste caso, você pode optar por pagar uma pequena taxa mensal para participar.😃👍 \n' + '\n' + '\n' +
				'6️⃣ Vocês têm programa de Afiliados?\n' + '\n' +
				'RESPOSTA: Com certeza. Entre em contato com o nosso suporte para saber como ganhar dinheiro como afiliado 🤝🚀\n' + '\n' + '\n' +
				'🚨👉 Abra conta GRÁTIS , ganhe $ 10.000 para treinar e um BÔNUS da Corretora.\n' + '\n' +
				'🤑👇 https://affiliate.iqbroker.com/redir/?aff=378040&aff_model=revenue&afftrack=\n' + '\n' + '\n' +
				'🆘 Se precisar de ajuda é só chamar: https://wa.me/message/RMWFMXEKWKD3B1',
		},
		{
			message: '🚀 COMO VOCÊ GANHA DINHEIRO COM A GENTE?\n' + '\n' + '\n' +
				'✅ Abra conta com o nosso código 😃👍\n' + '\n' + '\n' +
				'✅ Aproveite de 50-120 sinais diários de M1, M5 com alta assertividade dos melhores Traders do mundo 🌐🎯\n' + '\n' + '\n' +
				'✅ Assista ao vídeo fixado para saber como pegar os sinais💰😃\n' + '\n' + '\n' +
				'✅ Aproveite nossas Listas de Sinais Catalogados e Lives periódicas 📹📈\n' + '\n' + '\n' +
				'✅ Suporte por telegram, orientação de Contador, Advogado, Psicólogo, Pdf\'s , materiais de gerenciamento, operacional e psicotrade 📚⚖️\n' + '\n' + '\n' +
				'✅ Bônus e descontos especiais 💰🎁',
			file: path.join(__dirname, '..', 'imgs', 'comunidade-traders', 'img-3.jpg'),
		},
		{
			message: '🚨🚨🚨 ATENÇÃO INICIANTES NO TRADE E NOVATOS DO CANAL‼️\n' + '\n' + '\n' +
				'🤑👉 Aqui é SIMPLES, RÁPIDO e FÁCIL para você começar a ganhar dinheiro.\n' + '\n' +
				'Siga esses 2 passos... \n' +
				'👇👇👇\n' + '\n' + '\n' +
				'✅ (1º PASSO): Comece criando uma conta GRATUITA na Corretora IQ OPTION com o nosso link https://affiliate.iqbroker.com/redir/?aff=378040&aff_model=revenue&afftrack=  para ganhar $ 10.000 dólares e treinar como LUCRAR COM A GENTE sem ARRISCAR o seu DINHEIRO NO INÍCIO!\n' + '\n' + '\n' +
				'✅ (2º PASSO):  Acompanhe nossas atividades aqui no Canal de 2ª a 6ª Feira entre 19:00 e 22:00. Nós vamos te dar todo suporte GRATUITAMENTE. 😃👍\n' + '\n' + '\n' +
				'🆘 Se precisar de ajuda, MANDE UMA MENSAGEM PARA O NOSSO SUPORTE: https://wa.me/message/RMWFMXEKWKD3B1',
			file: path.join(__dirname, '..', 'imgs', 'comunidade-traders', 'img-1.jpg'),
		}
	]
};
// Free channel ad
export const communityOfTradersIqOptionFreeAdvertiseMessages: TAdvertiseMessage = {
	messagesIndexController: makeCounter(),
	messages: [
		{
			message: '🫰TENHA A SUA PRÓPRIA SALA DE SINAIS! 🤑\n' + '\n' +
				'🌟 Sim, você leu certo! Você pode ser dono da sua própria Sala de Sinais e faturar muita grana todos os meses. 💰😃\n' + '\n' +
				'🚀 Oferecemos assessoria especializada para você lucrar, vender diariamente e administrar seu negócio.\n' + '\n' +
				'👉🏻 Não deixe escapar! Licenças limitadas no preço promocional!\n' + '\n' +
				'💵 Chama agora: https://bit.ly/QUERO-MINHA-PRÓPRIA-SALA-DE-SINAIS\n' + '\n',
		},
		{
			message: '🤝 QUE TAL SER DONO DESSA SALA DE SINAIS AQUI COMO NOSSO SÓCIO?\n' + '\n' +
				'🌟 Quer saber como? Então chama o suporte e entenda como ter seus próprios clientes e  ganhar muita grana todos os meses! Gostou? 🤑\n' + '\n' +
				'🚀 Se isso faz sentido para você, aproveite AGORA uma das vagas são limitadas no preço promocional. \n' + '\n' +
				'💵 Chama agora: https://bit.ly/QUERO-MINHA-PRÓPRIA-SALA-DE-SINAIS\n' + '\n'
		},
		{
			message: '🤑 ESQUEÇA QUALQUER COISA SOBRE SALA DE SINAIS E VEM LUCRAR COM A GENTE!\n' + '\n' +
				'🚀 Venha para a Sala IQ OPTION que vai te levar ao próximo nível!😱 Você vai investir só R$39,90 por mês para lucrar muito com a gente!🤩\n' + '\n' +
				'Vem lucrar...👇👇👇\n' + '\n' +
				'💵 Chama agora:  https://bit.ly/QUERO-MINHA-PRÓPRIA-SALA-DE-SINAIS\n' + '\n'
		},
		{
			message: '💰VEM PRA NA NOSSA SALA VIP LUCRAR MUITO MAIS! 🤑\n' + '\n' +
				'🌟SIIIMMM! EU SEI! Você já está lucrando com nossos Sinais Free? Mas, que tal lucrar MUITO MAIS ?😱\n' + '\n' +
				'🤩Gostou né!?\n' + '\n' +
				'🚀 💵 Chama agora: https://bit.ly/QUERO-MINHA-PRÓPRIA-SALA-DE-SINAIS',
		},
		{
			message: '📉📈  COMO APROVEITAR NOSSOS SINAIS❓\n' + '\n' + '\n' +
				'🚨 NÃO RECOMENDAMOS O USO DE MARTINGALE, PORÉM, SE VOCÊ DECIDIR USAR, SUGERIMOS QUE UTILIZE SOMENTE 1 MARTINGALE (SE NECESSÁRIO) 🚨\n' + '\n' + '\n' +
				'⚠️ 👉 🔎 FILTRE AS OPERAÇÕES:\n' + '\n' +
				'✔️ Verifique a tendência e entre somente a favor da tendência.\n' + '\n' +
				'❌ Não entre em todas as operações! Você tem mais de 100 por dia. 😃 \n' + '\n' +
				'👉 Dê preferência para entrar nas operações que aconteça um GAP em seu favor. \n' + '\n' +
				'⏰ Fique atento ao Tempo de Expiração da operação.\n' + '\n' +
				'🔢 Siga um Gerenciamento inteligente e profissional.\n' + '\n' +
				'🤯 Não opere se estiver com o seu psicológico abalado de alguma forma.\n' + '\n' +
				'🚫 Não opere colocando em risco dinheiro comprometido com contas e sua subsistência. \n' + '\n' + '\n' +
				'💲👉 Se precisa saber \n' +
				'mais sobre trade entre em contato com o nosso suporte e solicite materiais GRATUITOS 🆓',
		},
		{
			message: '🤑 ESQUEÇA QUALQUER COISA QUE JÁ OUVIU SOBRE SALA DE SINAIS E VEM LUCRAR COM A GENTE!\n' + '\n' +
				'🚀 Venha para a Sala IQ OPTION que vai te levar ao próximo nível!😱 Você vai investir só R$39,90 por mês para lucrar muito com a gente!🤩\n' + '\n' +
				'Vem lucrar...👇👇👇\n' + '\n' +
				'💵 Chama agora:  https://wa.me/message/RMWFMXEKWKD3B1',
		}
	]
};