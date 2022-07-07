using System.ComponentModel;

namespace ConversaoMonetaria.Dominio.Enums;

public enum EStatusMoeda
{
    [Description("Ativa")] Ativa = 1,

    [Description("Inativada")] Inativada = 2
}