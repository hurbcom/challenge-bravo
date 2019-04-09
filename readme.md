 
# Desafio Bravo
#Pre Requisitos
<ul>
<li><a href="https://getcomposer.org/download/">Composer</a></li>
<li><a href="https://www.docker.com/get-started">Docker</a></li>
</ul>
<h1><a id="Instalao_8"></a>Instalação</h1>
<p>Clone o <a href="https://github.com">repositório</a><br>
<p>Copie o arquivo .env</p>
<pre><code class="language-sh">$ cp .env.example .env
</code></pre>
<p>Instale as dependências.</p>
<pre>
<code class="language-sh">
$ composer install

</code>
</pre>

<p>Adicione a entrada em seu arquivo hosts</p>
<pre>
<code class="language-sh">
$ <span class="hljs-number">127.0</span>.<span class="hljs-number">0.1</span> cbravo.local
</code>
<code class="language-sh">
$ <span class="hljs-number">127.0</span>.<span class="hljs-number">0.1</span> redis
</code>
</pre>

Instale o <a href="https://www.docker.com/get-started">Docker</a> e a partir da raiz da aplicação :
<pre>
<code class="language-sh">
$ docker-compose up
</code>
</pre>

 
#Unit Test
<p>Unit Test</p>
<pre><code class="language-sh">$ vendor/bin/phpunit 
</code></pre>

#Stress test

<p>Inicie uma sessão no container NGINX</p>
<pre>
<code class="language-sh">docker exec -it cbravo_nginx bash</code>
</pre>
<p>Execute o teste de stress (customize como quiser)</p>

<code class="language-sh">ab -n 1000 -c 50 http://localhost/api/convert?from=BRL&to=USD&amount=100.00</code>
<p>Parâmetros</p>

<pre>
<code class="language-sh">-n : número de requests</code>

<code class="language-sh">-c : conexões concorrentes</code>
</pre>


#[API Docs](api.md)