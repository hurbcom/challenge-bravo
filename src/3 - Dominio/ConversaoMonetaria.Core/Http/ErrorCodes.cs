namespace ConversaoMonetaria.Dominio.Core.Http;

public enum ErrorCodes
{
    /// <summary>
    ///     Chamada não está no formato correto.
    /// </summary>
    BadRequest = 0400,

    /// <summary>
    ///     Não autorizado
    /// </summary>
    Unauthorized = 401,

    /// <summary>
    ///     Ação proibida. O server entendeu o pedido, mas não pode executá-lo.
    /// </summary>
    Forbidden = 0403,

    /// <summary>
    ///     Objeto não encontrado.
    /// </summary>
    NotFound = 0404,

    /// <summary>
    ///     equivale ao httpStatus 405 not allowed
    /// </summary>
    NotAllowed = 0405,

    /// <summary>
    ///     HttpStatus Conflict
    /// </summary>
    AlreadyExists = 0409,

    /// <summary>
    ///     Não atende as pré-condições para execução
    /// </summary>
    PreconditionFailed = 0412,

    /// <summary>
    ///     Objeto invalido equivale ao httpStaus 422 Unprocessable Entity
    /// </summary>
    InvalidObject = 0422,

    /// <summary>
    ///     Exceção não tratada.(Internal Server error)
    /// </summary>
    Unhandled = 0500,

    /// <summary>
    ///     Serviço não disponível
    /// </summary>
    ServiceUnavailable = 0503
}