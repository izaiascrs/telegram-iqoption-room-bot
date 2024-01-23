import { LocalPath, MessageLike } from 'telegram/define';
import { TMakeCounter, makeCounter } from '../utils/helpers';

export type TAdvertiseMessage = {
  messagesIndexController: TMakeCounter,
  messages: {
    message: MessageLike,
    file?: LocalPath
  }[]
}

export const topSignalsIqOptionAdvertiseMessages : TAdvertiseMessage = {
	messagesIndexController: makeCounter(),
	messages:[
		{
			message: 
      '🤑 SABIA QUE VOCÊ PODE TER A SUA PRÓPRIA SALA DE SINAIS? 😲\n' +'\n' +
      '🌟 É isso mesmo! Imagine ser o dono da sua própria Sala de Sinais e faturar muita grana todos os meses? 💰😃\n' +'\n' +
      '🚀 Você terá assessoria para lucrar, vender diariamente e administrar seu negócio.\n' +' \n' +
      '👉🏻 Não perca tempo! Número de licenças limitadas no preço promocional!\n' +'\n' +
      '🫰💵 Chama rápido: @gsantos_ob\n'
		},
		{
			message:'🤝 QUE TAL SER DONO DESSA SALA DE SINAIS AQUI COMO NOSSO SÓCIO?\n' +'\n' +
      '🌟 Quer saber como? Então chama o suporte e entenda como ter seus próprios clientes e  ganhar muita grana todos os meses! Ficou interessado? 💰\n' +'\n' +
      '🚀 Se isso faz sentido para você, aproveite AGORA uma das vagas são limitadas no preço promocional. \n' +'\n' +
      'Clique no link abaixo:\n' +'\n' +
      '👉🏻 *Link:* @gsantos_ob\n' +'\n'      
		},
		{
			message:'🤑 ESQUEÇA QUALQUER COISA SOBRE SALA DE SINAIS E PASSE PARA O PRÓXIMO NÍVEL COM A GENTE!\n' +'\n' +
      '🚀 Venha para a Sala IQ OPTION que vai te levar ao próximo nível!😱 Você vai investir só R$39,90 por mês para lucrar muito com a gente!🤩\n' +'\n' +
      'Vem lucrar...👇👇👇\n' +'\n' +
      '💵 Chama agora: @gsantos_ob \n' +'\n'      
		},
		{
			message: '💰VEM PRA NA NOSSA SALA VIP LUCRAR MUITO MAIS! 🤑\n' +'\n' +
      '🌟SIIIMMM! EU SEI! Você já está lucrando com nossos Sinais Free? Mas, que tal lucrar MUITO MAIS ?😱\n' +'\n' +
      '🤩Gostou né!?\n' +'\n' +
      '🚀 💵 Chama agora: @gsantos_ob',
		}
	]
};

export const communityOfTradersIqOptionAdvertiseMessages : TAdvertiseMessage = {
	messagesIndexController: makeCounter(),
	messages:[
		{
			message: '🫰TENHA A SUA PRÓPRIA SALA DE SINAIS! 🤑\n'  +'\n' +
      '🌟 Sim, você leu certo! Você pode ser dono da sua própria Sala de Sinais e faturar muita grana todos os meses. 💰😃\n' +'\n' +
      '🚀 Oferecemos assessoria especializada para você lucrar, vender diariamente e administrar seu negócio.\n' +'\n' +
      '👉🏻 Não deixe escapar! Licenças limitadas no preço promocional!\n' +'\n' +
      '💵 Chama agora: https://bit.ly/QUERO-MINHA-PRÓPRIA-SALA-DE-SINAIS\n' +'\n' ,   
		},
		{
			message: '🤝 QUE TAL SER DONO DESSA SALA DE SINAIS AQUI COMO NOSSO SÓCIO?\n' +'\n' +
      '🌟 Quer saber como? Então chama o suporte e entenda como ter seus próprios clientes e  ganhar muita grana todos os meses! Gostou? 🤑\n' +'\n' +
      '🚀 Se isso faz sentido para você, aproveite AGORA uma das vagas são limitadas no preço promocional. \n' +'\n' +
      '💵 Chama agora: https://bit.ly/QUERO-MINHA-PRÓPRIA-SALA-DE-SINAIS\n' +'\n'
		},
		{
			message: '🤑 ESQUEÇA QUALQUER COISA SOBRE SALA DE SINAIS E VEM LUCRAR COM A GENTE!\n' +'\n' +
      '🚀 Venha para a Sala IQ OPTION que vai te levar ao próximo nível!😱 Você vai investir só R$39,90 por mês para lucrar muito com a gente!🤩\n' +'\n' +
      'Vem lucrar...👇👇👇\n' +'\n' +
      '💵 Chama agora:  https://bit.ly/QUERO-MINHA-PRÓPRIA-SALA-DE-SINAIS\n' + '\n'
		}, 
		{
			message: '💰VEM PRA NA NOSSA SALA VIP LUCRAR MUITO MAIS! 🤑\n' + '\n' +
      '🌟SIIIMMM! EU SEI! Você já está lucrando com nossos Sinais Free? Mas, que tal lucrar MUITO MAIS ?😱\n' +'\n' +
      '🤩Gostou né!?\n' +'\n' +
      '🚀 💵 Chama agora: https://bit.ly/QUERO-MINHA-PRÓPRIA-SALA-DE-SINAIS',
		}
	]
};
