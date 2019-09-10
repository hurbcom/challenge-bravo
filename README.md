<h2>Instalação da API</h2>
<p>A API foi construída em NodeJs, para instalação basta no diretório do projeto rodar o comando "npm install" e após isso "npm run start".</p>

<p>Ou fazer um docker build, o arquivo Dockerfile já está preparado neste repositório.</p>


<h3>Inserção de Moeda</h3>

<p>Os dados retornados pela API estão em formato JSON.</p>

<p><b>Endereço:</b> http://seuendereco:3000/moedas/ </p>

<p>
<b>Tipo:</b> POST </br>
<b>Content-Type:</b> application/x-www-form-urlencoded </br>
</p>

<table id="datatable" class="table table-striped table-bordered">
          <thead>
          <tr>
              <th>Key</th>
			  <th>Tipo</th>
			  <th>Obrigatório</th>
			  <th>Descrição</th>
            </tr>
          </thead>
          <tbody>
		  <tr>
			<td>moeda</td>
			<td>string (3 caracteres)</td>
			<td>Sim</td>
			<td>Tipo de Moeda.</td>
		  </tr>
  </tbody>
</table>



<h3>Exclusão de Moeda</h3>

<p>Os dados retornados pela API estão em formato JSON.</p>

<p><b>Endereço:</b> http://seuendereco:3000/moedas/'moeda a ser excluída' </p>

<p>
<b>Tipo:</b> DELETE </br>
<b>Content-Type:</b> application/json </br>
</p>

<h4>Exemplo de Consulta Completa</h4>
<p>
http://seuendereco:3000/moedas/EUR
</p>




<h3>Conversão de Valores</h3>

<p>Os dados retornados pela API estão em formato JSON.</p>

<p><b>Endereço:</b> http://seuendereco:3000/convert/'moeda origem'/'moeda destino'/'valor a ser convertido' </p>

<p>
<b>Tipo:</b> GET </br>
<b>Content-Type:</b> application/json </br>
</p>

<h4>Exemplo de Consulta Completa</h4>
<p>
http://seuendereco:3000/convert/USD/BRL/50.00
</p>