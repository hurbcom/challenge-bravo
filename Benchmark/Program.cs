// See https://aka.ms/new-console-template for more information
using BenchmarkDotNet.Running;

using Benchmark.Controllers;
using BenchmarkDotNet.Configs;

while (!System.Diagnostics.Debugger.IsAttached)
    Thread.Sleep(TimeSpan.FromMilliseconds(100));

var summary = BenchmarkRunner.Run<CurrencyConvertionControllerBenchmark>(new DebugInProcessConfig(), args);
