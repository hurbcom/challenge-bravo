using System.ComponentModel.DataAnnotations;

namespace Cuco.Commons.Base;

public abstract class Entity
{
    [Key] public long Id { get; set; }
}