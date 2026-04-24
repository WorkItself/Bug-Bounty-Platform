using Bug_Bounty_Platform.BusinessLogic.Interfaces;
using Bug_Bounty_Platform.BusinessLogic.Structure;
using Microsoft.Extensions.Configuration;

namespace Bug_Bounty_Platform.BusinessLogic
{
    public class BusinessLogic
    {
        private readonly IConfiguration _configuration;

        public BusinessLogic(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public IUserLoginAction UserLoginAction()
        {
            return new UserAuthAction(_configuration);
        }

        public IUserRegAction UserRegAction()
        {
            return new UserRegActionExecution(_configuration);
        }

        public IBountyProgramAction BountyProgramAction()
        {
            return new BountyProgramExecution();
        }

        public IBugReportAction BugReportAction()
        {
            return new BugReportExecution();
        }

        public IBugReportCommentAction BugReportCommentAction()
        {
            return new BugReportCommentExecution();
        }

        public ICompanyProfileAction CompanyProfileAction()
        {
            return new CompanyProfileExecution();
        }
    }
}
