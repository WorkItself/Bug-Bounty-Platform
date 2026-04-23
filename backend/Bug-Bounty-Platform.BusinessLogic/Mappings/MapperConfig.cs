using AutoMapper;

namespace Bug_Bounty_Platform.BusinessLogic.Mappings
{
    // Single shared mapper instance for the whole BusinessLogic layer.
    // Lazy<T> ensures it's created once and is thread-safe.
    public static class MapperConfig
    {
        private static readonly Lazy<IMapper> _instance = new(() =>
        {
            var config = new MapperConfiguration(cfg =>
                cfg.AddProfile<MappingProfile>());
            return config.CreateMapper();
        });

        public static IMapper Mapper => _instance.Value;
    }
}
