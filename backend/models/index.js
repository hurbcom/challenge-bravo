module.exports = {
  Processo: require('./schemas/processo').Processo,
  Andamento: require('./schemas/andamento').Andamento,
  Comarca: require('./schemas/comarcas').Comarca,
  CredenciaisAdvogados: require('./schemas/credenciaisAdvogados')
    .CredenciaisAdvogados,
  CotaMensal: require('./schemas/cotaMensal').CotaMensal,
  CotaEstado: require('./schemas/cotaEstado').CotaEstado,
};
