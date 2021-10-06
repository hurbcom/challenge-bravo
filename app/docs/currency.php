<?php
/**
 * @OA\Get(
 *  path="/api/v1/currencies",
 *  summary="Lista de todas as Moedas cadastradas na API",
 *  operationId="id",
 *  tags={"Currency"},
 *  description="Lista de todas as Moedas cadastradas na API",
 *  @OA\Response(
 *     response=200,
 *     description="Successful operation",
 *     @OA\JsonContent(ref="#/components/schemas/CurrencyResource")
 *  ),
 * )
 */

/**
 * @OA\Get(
 *  path="/api/v1/currencies/{id}",
 *  summary="Retornar 1 Moeda",
 *  operationId="UmaMoeda",
 *  tags={"Currency"},
 *  description="Retorna uma moeda pelo ID",
 *  @OA\Parameter(
 *      name="id",
 *      in="path",
 *      description="ID da Moeda",
 *      required=true,
 *      @OA\Schema(type="integer")
 *  ),
 *  @OA\Response(
 *     response=200,
 *     description="Successful operation",
 *     @OA\MediaType(
 *          mediaType="application/json",
 *          @OA\Schema(
 *              @OA\Property(
 *                  property="data",
 *                  type="array",
 *                  @OA\Items(
 *                       @OA\Property(property="id", type="string", example="1"),
 *                       @OA\Property(property="code_currency", type="string", example="hurb"),
 *                       @OA\Property(property="base_currency", type="string", example="usd"),
 *                       @OA\Property(property="equivalente_value", type="decimal", example="1.2456"),
 *                  )
 *             )
 *         )
 *     )
 *  ),
 *  @OA\Response(
 *     response=400,
 *     description="{'error': 'ID must be a number.}",
 *  ),
 *  @OA\Response(
 *     response=404,
 *     description="{'error': 'Currency Not Found.' }",
 *  )
 * )
 */

/**
 * @OA\Get(
 *  path="/api/v1/currencies/convert-amount?from={code_currency}&to={to_code_currency}&amount={amount}",
 *  summary="Converter Moeda",
 *  operationId="ConvertCurrency",
 *  tags={"Currency"},
 *  description="Retorna o valor informado convertido na moeda desejada. A conversão será feita apenas para as moedas cadastradas. Caso alguma moeda informada nos parâmetros não esteja cadastrada, o endpoint retornará uma mensagem de Moeda não Encontrada. 3 parametros obrigatórios:
 * from (modeda a ser convertida)
 * to (moeda após converrsão)
 * amount (valor a ser convertido)",
 *  @OA\Parameter(
 *      name="code_currency",
 *      in="path",
 *      description="Modeda a ser convertida. Ex.: USD",
 *      required=true,
 *      @OA\Schema(type="string")
 *  ),
 *  @OA\Parameter(
 *      name="to_code_currency",
 *      in="path",
 *      description="Moeda após converrsão. Ex.: BRL",
 *      required=true,
 *      @OA\Schema(type="string")
 *  ),
 *  @OA\Parameter(
 *      name="amount",
 *      in="path",
 *      description="Valor a ser convertido. Ex.: 10.25",
 *      required=false,
 *      @OA\Schema(type="decimal")
 *  ),
 *  @OA\Response(
 *     response=200,
 *     description="Successful operation",
 *     @OA\MediaType(
 *          mediaType="application/json",
 *          @OA\Schema(
 *              @OA\Property(
 *                  property="data",
 *                  type="array",
 *                  @OA\Items(
 *                       @OA\Property(property="amount", type="string", example="1"),
 *                       @OA\Property(property="currency", type="string", example="usd"),
 *                       @OA\Property(property="amountConverted", type="string", example="5,4771"),
 *                       @OA\Property(property="currencyAmountConverted", type="string", example="brl"),
 *                  )
 *             )
 *         )
 *     )
 *  ),
 *  @OA\Response(
 *    response=422,
 *    description="Retorno será um array contendo a informação do(s) campo(s) obrigatório(s)",
 *    @OA\MediaType(
 *       mediaType="application/json",
 *       @OA\Schema(
 *         @OA\Property(
 *            property="to",
 *            type="array",
 *            @OA\Items(
 *               type="string",
 *               enum = {"The to field is required."},
 *            ),
 *         ),
 *         @OA\Property(
 *            property="from",
 *            type="array",
 *            @OA\Items(
 *               type="string",
 *               enum = {"The from field is required."},
 *            ),
 *         ),
 *         @OA\Property(
 *            property="amount ",
 *            type="array",
 *            @OA\Items(
 *               type="float",
 *               enum = {"The amount field is required."},
 *            ),
 *         ),
 *       ),
 *     ),
 *   ),
 *  @OA\Response(
 *     response=500,
 *     description="{'error': 'Could not resolve host: cdn.jsdelivr.net'}",
 *  ),
 * )
 */

/**
 * @OA\Post(
 *  path="/api/v1/currencies",
 *  summary="Cadastrar uma Moeda",
 *  operationId="createCurrency",
 *  tags={"Currency"},
 *  description="Cadastrar uma nova Moeda. Toda moeda Fictícia terá USD como moeda de lastro. No momento do cadastro o sistema verifica se a moeda informada é real ou fictícia. Se for real, mesmo que o usuário informe o 'Valor Equivalente', ele não será gravado. Se for moeda fictícia, este valor é obrigatório. Retorna a moeda cadastrada.
 * Valor Equivalente: representa o quanto a moeda fictícia vale em relação a 1 dolar (USD). Ex.: 1 HURB equivale 3 USD.
 * O sistema utiliza uma API pública para verificar se a moeda informada é real.
 * code_currency é obrigatório",
 *  @OA\RequestBody(
 *     required=true,
 *     @OA\JsonContent(ref="#/components/schemas/CurrencyRequest")
 *  ),
 *  @OA\Response(
 *     response=201,
 *     description="{'success': 'Currency json data'}",
 *  ),
 *  @OA\Response(
 *     response=420,
 *     description="{'error': 'For fictitious Currency you should fill equivalent_value field.'}",
 *  ),
 *  @OA\Response(
 *    response=422,
 *    description="Retorno será um array contendo a informação do(s) campo(s) obrigatório(s)",
 *    @OA\MediaType(
 *       mediaType="application/json",
 *       @OA\Schema(
 *         @OA\Property(
 *            property="code_currency",
 *            type="array",
 *            @OA\Items(
 *               type="string",
 *               enum = {"The code currency field is required."},
 *            ),
 *         ),
 *         @OA\Property(
 *            property="code_currency ",
 *            type="array",
 *            @OA\Items(
 *               type="string",
 *               enum = {"The code currency has already been taken."},
 *            ),
 *         ),
 *       ),
 *     ),
 *   ),
 * )
 */

/**
 * @OA\Delete(
 *  path="/api/v1/currencies/{id}",
 *  summary="Deletar uma Moeda",
 *  operationId="deleteCurrency",
 *  tags={"Currency"},
 *  description="Deletar uma Moeda.
 * Somente a moeda USD não pode ser deletada. Ela é a moeda de Lastro usada por todas as moedas Fictícias.",
 *  @OA\Parameter(
 *      name="id",
 *      in="path",
 *      description="ID da Moeda",
 *      required=true,
 *      @OA\Schema(type="integer")
 *  ),
 *  @OA\Response(
 *     response=204,
 *     description="{ }",
 *  ),
 *   @OA\Response(
 *     response=400,
 *     description="{'error': 'ID must be a number.'}",
 *  ),
 *  @OA\Response(
 *     response=403,
 *     description="{'error': 'Not allowed to delete USD currency.'}",
 *  ),
 *  @OA\Response(
 *     response=404,
 *     description="{'error': 'Currency Not Found.'}",
 *  )
 * )
 */
