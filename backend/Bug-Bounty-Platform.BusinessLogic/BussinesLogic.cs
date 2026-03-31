using Bug_Bounty_Platform.BusinessLogic.Interfaces;

namespace Bug_Bounty_Platform.BusinessLogic
{
    public class BussinesLogic
    {
        public ISession GetSessionBL()
        {
            return new SessionBL();
        }

        public IUser GetUserBL()
        {
            return new UserBL();
        }

        public IBountyProgram GetBountyProgramBL()
        {
            return new BountyProgramBL();
        }

        public IBugReport GetBugReportBL()
        {
            return new BugReportBL();
        }
    }
}
