const winston = require('winston');
const moment = require('moment');

/**
 * Accumulates useful functions for all code
 */
class Helper {
  /**
   *Generates a date with the timeZone set to be used in mongoDB
   */
  static saveDateMongo(date = false) {
    if (!date) {
      let date1 = Helper.clock();
      let date = `${date1.dia}/${date1.mes}/${date1.ano4} ${date1.hora}:${date1.min}:${date1.seg}`;
      return Helper.date(date)
    }
    return Helper.date(date)
  }
  /**
   * Common date converter for Date format. Prevents the date from being saved in the mongo with a time zone.
   * @param {string} date date  Ex.: 25/02/2020 09:40
   * @returns {string} 2020-01-01T10:10.000Z
   */
  static date(date) {
    // GMT-0000 maintains the time you entered without changing time zone -3
    //  if you want to insert a time zone, ex: Brazilia time -3GMT.
    //  GMT-0300
    let regex = date.replace(
      /([0-9]{1,2})\W([0-9]{1,2})\W([0-9]{4})\s([0-9]{1,2}\W[0-9]{1,2}\W[0-9]{1,2})/i,
      '$3-$2-$1 $4 GMT-0000'
    );
    return new Date(regex);
  }

  /**
   * take a date and subtract "x" days from it
   * @param {data} data1 put new Date ()
   * @param {number} dias number of days to subtract
   */
  static subtractDate(data1, days) {
    let d = data1;
    let newDate = new Date(d.setDate(d.getDate() - days));
    return Helper.data(
      `${newDate.getDate()}/${
        newDate.getMonth() + 1
      }/${newDate.getFullYear()} 00:00`
    );
  }

  /**
   * give me an object with the most used parts of a date
   * @param {Date} setDate date you want, if you want to use current date leave this field blank
   * @returns {Object} parts of a date
   */
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
    let mseg = data.getMilliseconds(); // 0-999
    // let tz = data.getTimezoneOffset(); // em minutos
    let arraySemana = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
    let diaSemana = arraySemana[dia_sem];

    return { dia, mes, ano4, hora, min, seg, diaSemana, seg, mseg };
  }
}

/**
 * @type {Class} Logger
 * @param {string} logLevel
 * @param {string} nomeArquivo
 * @param {object} options
 * @param {string} options.robotName
 * @param {null|string} options.processNumber
 */
class Logger {
  constructor(
    logLevel = 'info',
    nomeArquivo = '',
    { robotName, processNumber } = {}
  ) {
    this.robotName = robotName;
    this.number = processNumber;

    this.logs = [];
    this.consoleLogger = winston.createLogger({
      level: 'info',
      format: winston.format.simple(),
      transports: [new winston.transports.Console()],
    });
    this.fileLogger = winston.createLogger({
      level: logLevel,
      format: winston.format.simple(),
      transports: [
        new winston.transports.File({
          filename: nomeArquivo,
        }),
      ],
    });
  }

  /**
   * vPrint the Log in the shell
   * @param {string} log message
   */
  info(log) {
    let identificador = this.number;
    this.logs.push(`${this.robotName} - ${identificador} - ${log}`);
    return this.consoleLogger.info(
      `${this.robotName} - ${identificador} - ${log}`
    );
  }

  /**
   * Make a print on the console and save the log to file
   * @param {string} level level of importance of the log
   * @param {string} log message
   */
  log(level, log) {
    this.info(log);
    return this.fileLogger.log(level, `[${moment().format()}] ${log}`);
  }
  /**
   * Capture all logs of the desired class
   */
  allLog() {
    return this.logs;
  }

  /**
   * removes the logs of the desired class
   */
  resetLog() {
    this.logs = [];
  }
  /**
   * adds logs from another class instantiated to the current class.
   * @param {Array} logs Array of log strings
   */
  addLog(logs) {
    for (let i = 0; i < logs.length; i++) {
      this.logs.push(logs[i]);
    }
  }
}

module.exports.Helper = Helper;
module.exports.Logger = Logger;
