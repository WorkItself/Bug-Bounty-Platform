namespace Bug_Bounty_Platform.BusinessLogic.Structure
{
    public class TokenService
    {
        public TokenService() { }

        public string GenerateToken()
        {
            return Guid.NewGuid().ToString();
        }
    }
}
