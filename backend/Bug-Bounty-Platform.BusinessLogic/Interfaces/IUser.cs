using System.Collections.Generic;
using Bug_Bounty_Platform.Domain.Entities;
using Bug_Bounty_Platform.Domain.Entities.User;

namespace Bug_Bounty_Platform.BusinessLogic.Interfaces
{
    public interface IUser
    {
        List<User> GetAll();
        User? GetById(int id);
        ActionResponse Create(UCreateData data);
        ActionResponse Update(int id, UUpdateData data);
        ActionResponse Delete(int id);
    }
}
