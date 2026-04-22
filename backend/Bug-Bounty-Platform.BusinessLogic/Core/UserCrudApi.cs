using System;
using System.Collections.Generic;
using System.Linq;
using Bug_Bounty_Platform.Domain.Entities;
using Bug_Bounty_Platform.Domain.Entities.User;

namespace Bug_Bounty_Platform.BusinessLogic.Core
{
    public class UserCrudApi
    {
        // In-memory store — replace with DB repository later
        private static readonly List<User> _users = new();
        private static int _nextId = 1;

        public List<User> GetAll()
        {
            return _users.ToList();
        }

        public User? GetById(int id)
        {
            return _users.FirstOrDefault(u => u.Id == id);
        }

        public ActionResponse Create(UCreateData data)
        {
            if (_users.Any(u => u.Email == data.Email))
                return new ActionResponse { Status = false, StatusMsg = "Email already exists." };

            _users.Add(new User
            {
                Id = _nextId++,
                Username = data.Username,
                Email = data.Email,
                PasswordHash = data.Password, // TODO: hash password
                Role = data.Role,
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            });

            return new ActionResponse { Status = true, StatusMsg = "User created." };
        }

        public ActionResponse Update(int id, UUpdateData data)
        {
            var user = _users.FirstOrDefault(u => u.Id == id);
            if (user == null)
                return new ActionResponse { Status = false, StatusMsg = "User not found." };

            if (data.Username != null) user.Username = data.Username;
            if (data.Email != null) user.Email = data.Email;
            if (data.Role != null) user.Role = data.Role;
            if (data.IsActive.HasValue) user.IsActive = data.IsActive.Value;

            return new ActionResponse { Status = true, StatusMsg = "User updated." };
        }

        public ActionResponse Delete(int id)
        {
            var user = _users.FirstOrDefault(u => u.Id == id);
            if (user == null)
                return new ActionResponse { Status = false, StatusMsg = "User not found." };

            _users.Remove(user);
            return new ActionResponse { Status = true, StatusMsg = "User deleted." };
        }
    }
}
