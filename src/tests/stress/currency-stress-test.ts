import { loadTest } from "loadtest";
import { promisify } from "util";

export default async () => {
  const test = promisify(loadTest);

  const result: any = await test({
    url: "http://localhost:3000/currencies",
    method: "GET",
    requestsPerSecond: 1000,
    maxSeconds: parseInt(process.env.STRESS_TEST_TIME_PER_ROUTE || "10")
  });

  console.table({
    "Target Route": "/currencies (GET)",
    "Total Requests": result.totalRequests,
    "Total Errors": result.totalErrors,
    "Requests per second": result.rps,
    "Mean Latency (ms)": result.meanLatencyMs,
    "Max Latency (ms)": result.maxLatencyMs,
    "Min Latency (ms)": result.minLatencyMs,
    "Total Time (seconds)": result.totalTimeSeconds
  });
};