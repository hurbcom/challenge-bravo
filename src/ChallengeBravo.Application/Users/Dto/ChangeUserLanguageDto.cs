using System.ComponentModel.DataAnnotations;

namespace ChallengeBravo.Users.Dto
{
    public class ChangeUserLanguageDto
    {
        [Required]
        public string LanguageName { get; set; }
    }
}