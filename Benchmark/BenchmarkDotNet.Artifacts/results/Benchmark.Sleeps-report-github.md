``` ini

BenchmarkDotNet=v0.13.1, OS=Windows 10.0.19044.1889 (21H2)
Intel Core i7-8565U CPU 1.80GHz (Whiskey Lake), 1 CPU, 8 logical and 4 physical cores
.NET SDK=6.0.400
  [Host]     : .NET 6.0.8 (6.0.822.36306), X64 RyuJIT
  DefaultJob : .NET 6.0.8 (6.0.822.36306), X64 RyuJIT


```
|  Method |      Mean |    Error |   StdDev | Ratio | RatioSD |
|-------- |----------:|---------:|---------:|------:|--------:|
|  Time50 |  60.28 ms | 1.196 ms | 1.862 ms |  0.56 |    0.02 |
| Time100 | 108.15 ms | 1.915 ms | 1.791 ms |  1.00 |    0.00 |
| Time150 | 156.01 ms | 0.846 ms | 0.791 ms |  1.44 |    0.03 |
