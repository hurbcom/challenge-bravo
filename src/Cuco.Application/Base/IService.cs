namespace Cuco.Application.Base;

public interface IService<in TInput, TOutput>
{
    Task<TOutput> Handle(TInput input);
}