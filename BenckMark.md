Bombarding http://127.0.0.1:8080/coin with 100000 request(s) using 125 connection(s)
 100000 / 100000 [=============================] 100.00% 3869/s 25s
Done!
Statistics        Avg      Stdev        Max
  Reqs/sec      3875.02    1635.56    9711.15
  Latency       32.25ms    18.83ms   206.19ms
  HTTP codes:
    1xx - 0, 2xx - 100000, 3xx - 0, 4xx - 0, 5xx - 0
    others - 0
  Throughput:     1.05MB/s



Bombarding http://127.0.0.1:8080/price-conversion?from=USD&to=brl&amount=92 with 100000 request(s) using 125 connection(s)
 100000 / 100000 [==============================] 100.00% 2217/s 45s
Done!
Statistics        Avg      Stdev        Max
  Reqs/sec      2224.91    1885.03   11373.28
  Latency       56.12ms    72.84ms      1.90s
  HTTP codes:
    1xx - 0, 2xx - 99952, 3xx - 0, 4xx - 0, 5xx - 48
    others - 0
  Throughput:   633.26KB/s

