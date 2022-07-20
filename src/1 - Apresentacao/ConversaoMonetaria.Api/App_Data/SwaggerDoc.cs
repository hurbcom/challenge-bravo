namespace ConversaoMonetaria.Api.App_Data;

/// <summary>
///     Descrições para o Swagger
/// </summary>
public static class SwaggerDoc
{
    /// <summary>
    ///     Título da plataforma
    /// </summary>
    public const string Title = "ConversaoMonetaria API";

    /// <summary>
    ///     Versão
    /// </summary>
    public const string Version1 = "v1";

    /// <summary>
    ///     Contato Nome
    /// </summary>
    public const string OpenApiContactName = "Lucas Fernandes";

    /// <summary>
    ///     Contato E-mail
    /// </summary>
    public const string OpenApiContactEmail = "lucas.marcelino.fernandes@outlook.com.br";

    /// <summary>
    ///     Descrição da API
    /// </summary>
    public const string Description = "<h4><b>Retornos:</b></h4>" +
                                      "\n<h5>2xx - Sucesso</h5>" +
                                      "\n<li>200 Ok - Representa sucesso</li>" +
                                      "\n<li>201 Created - Indica que foi criado.</li>" +
                                      "\n<li>202 Accepted - Indica que foi aceitoe irá processar posteriormente</li>" +
                                      "\n<li>204 No Content - A request foi processada, mas não há conteúdo para ser retornado</li>" +
                                      "\n<h5>4xx - Client error</h5>" +
                                      "<li>400 Bad Request - Não foi processada, pois o servidor não entendeu a requisição</li>" +
                                      "\n<li>401 Unauthorized - Indica que não está autenticado</li>" +
                                      "\n<li>403 Forbidden - Indica que está autenticado e a requisição é válida. Porém não tem permissão</li>" +
                                      "\n<li>404 Not Found - O recurso não foi localizado</li>" +
                                      "\n<h5>5xx - Erros no servidor</h5>" +
                                      "<li>500 Internal Server Error - O servidor encontrou uma situação inesperada</li>" +
                                      "\n<li>501 Not Implemented - O método da requisição não é suportado pelo servidor</li>" +
                                      "\n<li>503 Service Unavailable - O servidor não está disponível</li>" +
                                      "\n<h5><b>Autorização:</b></h4>" +
                                      "<p>Crie sua autenticação através de um usuário e senha, como ainda não foi implementado cadatro de usuário você pode utilizar admin e admin. Esta autorização é válida por 2 horas.</p>";

    /// <summary>
    ///     Nome da definição de seguran;ca
    /// </summary>
    public const string SecurityDefinitionName = "Bearer";

    /// <summary>
    ///     Nome do schema Open Api Security
    /// </summary>
    public const string OpenApiSecuritySchemeName = "Authorization";

    /// <summary>
    ///     Formato Bearer
    /// </summary>
    public const string OpenApiSecuritySchemeBearerFormat = "JWT";

    /// <summary>
    ///     Descrição
    /// </summary>
    public const string OpenApiSecuritySchemeDescription =
        "Digite 'Bearer' [espaço] e em seguida informe o seu token.\r\n\r\nConversaoMonetaria: \"Bearer eyJhbGcASUDsavu1InR5cCI6IkpXVCJ9\"";
}