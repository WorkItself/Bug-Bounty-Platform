using Bug_Bounty_Platform.Domain.Entities.User;
using System;
using Bug_Bounty_Platform.Domain.Entities;

namespace Bug_Bounty_Platform.BusinessLogic.Interfaces
{
    public interface ISession
    {
        ActionResponse UserLogin(ULoginData data);
    }
}
