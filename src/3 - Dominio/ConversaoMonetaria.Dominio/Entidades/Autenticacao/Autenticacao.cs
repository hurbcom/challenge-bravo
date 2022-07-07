using System;
using FluentValidation.Results;

namespace ConversaoMonetaria.Dominio.Entidades.Autenticacao;

public class Autenticacao
{
    public Autenticacao(string usuario, string senha)
    {
        Usuario = usuario;
        Senha = senha;
        GuidJwt = Guid.NewGuid();
    }

    /// <summary>
    ///     Token para autenticação referente ao Micro Service de Auth
    /// </summary>
    public string Usuario { get; }

    /// <summary>
    ///     Documento do usuário que está realizando o login para auditoria
    /// </summary>
    public string Senha { get; }

    /// <summary>
    ///     Guid para composição do Jwt
    /// </summary>
    public Guid GuidJwt { get; set; }

    public ValidationResult Validar()
    {
        return new AutenticacaoValidador().Validate(this);
    }
}