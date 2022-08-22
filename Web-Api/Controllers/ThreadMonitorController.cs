using Microsoft.AspNetCore.Mvc;

namespace Web_Api.Controllers;

[Route("thread")]
[ApiController]
public class ThreadsMonitorController : ControllerBase
{
    [HttpGet]
    public ThreadCount Get()
    {
        ThreadCount threadCount = new();
        ThreadPool.GetMinThreads(out int workerThreads, out int completionPortThreads);
        threadCount.MinWorkerThreads = workerThreads;
        threadCount.MinCompletionPortThreads = completionPortThreads;
            
        ThreadPool.GetMaxThreads(out workerThreads, out completionPortThreads);
        threadCount.MaxWorkerThreads = workerThreads;
        threadCount.MaxCompletionPortThreads = completionPortThreads;
            
        return threadCount;
    }
}
 