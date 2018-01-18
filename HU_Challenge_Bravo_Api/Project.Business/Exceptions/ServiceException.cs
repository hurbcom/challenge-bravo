using System;

namespace Project.Business.Exceptions
{
    /// <summary>
    /// This class is used to handle customized exceptions.
    /// </summary>
    public class ServiceException : Exception
    {
        public ServiceException(string message) : base(message) { }
        public ServiceException(string message, Exception exception) : base(message, exception) { }
    }
}
