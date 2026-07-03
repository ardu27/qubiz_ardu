namespace Meridian.Services.Onboarding.Domain.Entities;

public class SlackChannel
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsRequired { get; set; }
}
