using System.ComponentModel.DataAnnotations;

namespace PerspectiveAPI.Util;

[AttributeUsage(AttributeTargets.Property)]
public class RequiredIfAttribute : ValidationAttribute
{
    private readonly bool _flagIsTrue;
    private readonly string _boolPropertyName;
    private readonly string _errorMessage;
    public RequiredIfAttribute(bool flagIs, string boolPropertyName, string errorMessage)
    {
        _flagIsTrue = flagIs;
        _boolPropertyName = boolPropertyName;
        _errorMessage = errorMessage;
    }
    
    protected override ValidationResult? IsValid(object? value, ValidationContext context)
    {
        var field = context.ObjectType.GetProperty(_boolPropertyName);
        if (field is null) throw new ArgumentException($"Свойство {_boolPropertyName} не существует у типа {context.ObjectType}");

        var flag = field.GetValue(context.ObjectInstance) is true;
        if (_flagIsTrue) return flag && value is null ? new ValidationResult(_errorMessage) : ValidationResult.Success;
        
        return !flag && value is null ? new ValidationResult(_errorMessage) : ValidationResult.Success;
    }
}