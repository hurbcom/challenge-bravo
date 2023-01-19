namespace Cuco.Application.Base;

public interface IService<TInput, TOutput>
{
    Task<TOutput> Handle(TInput input);
}