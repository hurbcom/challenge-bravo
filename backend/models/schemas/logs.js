const mongoose = require('mongoose');

const ExecucaoSchema = new mongoose.Schema({
    ConsultaCadastradaId: {
    type: mongoose.Types.ObjectId,
  },
  DataEnfileiramento: { type: Date, default: new Date() },
  DataInicio: { type: Date, required: false },
  DataTermino: { type: Date, required: false },
  Tentativas: { type: Number, required: false },
  Log: { type: Array, default: new Array() },
  Mensagem: { type: Array, default: new Array() },
  Instancia: { type: Number },
  NomeRobo: { type: String, required: true },
});

const ExecucaoConsulta = mongoose.model(
  'ExecucaoConsulta',
  ExecucaoSchema,
  'execucoesConsultas'
);

module.exports = { ExecucaoConsulta };


const Schema = mongoose.Schema;

const LogSchema = new Schema(
  {
    cnj: { type: String, default: '' },
    oab: { type: String, default: '' },
    tipo: String,
    detalhes: String,
    tribunal: String,
    robo: String,
  },
  {
    versionKey: false,
    timestamps: { createdAt: 'dataCriacao', updatedAt: 'dataEdicao' },
  }
);

const Log = mongoose.model('Log', LogSchema, 'logs');

module.exports.Log = Log;



const logRequest = new mongoose.Schema({
	envio: Boolean,
	dataCriacao: Date,
	modulo: String,
	statusCode:Number,
	conteudo:{},
	
	
})

const Logs = mongoose.model('LogRequest', logRequest, 'logRequest');

module.exports.Logs = Logs;