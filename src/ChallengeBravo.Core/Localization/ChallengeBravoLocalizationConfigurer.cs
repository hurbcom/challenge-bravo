using Abp.Configuration.Startup;
using Abp.Localization.Dictionaries;
using Abp.Localization.Dictionaries.Xml;
using Abp.Reflection.Extensions;

namespace ChallengeBravo.Localization
{
    public static class ChallengeBravoLocalizationConfigurer
    {
        public static void Configure(ILocalizationConfiguration localizationConfiguration)
        {
            localizationConfiguration.Sources.Add(
                new DictionaryBasedLocalizationSource(ChallengeBravoConsts.LocalizationSourceName,
                    new XmlEmbeddedFileLocalizationDictionaryProvider(
                        typeof(ChallengeBravoLocalizationConfigurer).GetAssembly(),
                        "ChallengeBravo.Localization.SourceFiles"
                    )
                )
            );
        }
    }
}
