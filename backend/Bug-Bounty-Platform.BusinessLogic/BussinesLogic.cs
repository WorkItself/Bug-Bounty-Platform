using Bug_Bounty_Platform.BusinessLogic.Interfaces;

namespace Bug_Bounty_Platform.BusinessLogic
{
    public class BussinesLogic
    {
        public ISession GetSessionBL()
        {
            return new SessionBL();
        }
    }
}
