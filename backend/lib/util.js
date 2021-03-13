

class Helper {
  /**
     * Converte data comum para formato Date. sem alterar o fuso horário
     * @param {string} data Data comum. Ex.: 25/02/2020 09:40
     * @returns {string} 2020-01-01T10:10.000Z
     */
  static data(data) {
    // O GMT-0000 mantem a hora que você inseriu sem alterar fuso -3
    // se quiser inserir fuso, ex.: horario de brazilia -3GMT.
    //GMT-0300
    let regex = data.replace(
      /([0-9]{1,2})\W([0-9]{1,2})\W([0-9]{4})\s([0-9]{1,2}\W[0-9]{1,2}\W[0-9]{1,2})/i,
      '$3-$2-$1 $4 GMT-0000'
    );
    return new Date(regex);
  }

  /**
   * pega uma data e subtrai "x" dias dela
   * @param {data} data1 colocar new Date()
   * @param {number} dias numero de dias a subtrair
   */
  static subtractDate(data1, dias) {
    let d = data1;
    let novo = new Date(d.setDate(d.getDate() - dias));
    // Helper.data(`${novo.getDate()}/${novo.getMonth()+1}/${novo.getFullYear()} 00:00`)
    // console.log(novo.getDate(),novo.getMonth()+1, novo.getFullYear());
    return Helper.data(
      `${novo.getDate()}/${novo.getMonth() + 1}/${novo.getFullYear()} 00:00`
    );
  }

  static clock(setDate) {
    let data;
    if (!setDate) {
      data = new Date();
    } else data = setDate;

    // Guarda cada pedaço em uma variável
    let dia = data.getDate(); // 1-31
    let dia_sem = data.getDay(); // 0-6 (zero=domingo)
    let mes = data.getMonth(); // 0-11 (zero=janeiro)
    // let ano2 = data.getYear();           // 2 dígitos
    let ano4 = data.getFullYear(); // 4 dígitos
    let hora = data.getHours(); // 0-23
    let min = data.getMinutes(); // 0-59
    let seg = data.getSeconds(); // 0-59
    let mseg = data.getMilliseconds();   // 0-999
    // let tz = data.getTimezoneOffset(); // em minutos
    let arraySemana = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
    let diaSemana = arraySemana[dia_sem];

    return { dia, mes, ano4, hora, min, seg, diaSemana, seg, mseg };
  }
}

module.exports.Helper = Helper;