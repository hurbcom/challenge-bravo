using System.ComponentModel;

namespace ConversaoMonetaria.Dominio.Enums;

public enum EStatusMoeda
{
    [Description("Ativa")] Ativa = 0,

    [Description("Inativada")] Inativada = 1
}