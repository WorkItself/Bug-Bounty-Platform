using System;
using System.Collections.Generic;
using System.Linq;
using Bug_Bounty_Platform.Domain.Entities;
using Bug_Bounty_Platform.Domain.Entities.BountyProgram;

namespace Bug_Bounty_Platform.BusinessLogic.Core
{
    public class BountyProgramCrudApi
    {
        private static readonly List<BountyProgram> _programs = new();
        private static int _nextId = 1;

        public List<BountyProgram> GetAll()
        {
            return _programs.ToList();
        }

        public BountyProgram? GetById(int id)
        {
            return _programs.FirstOrDefault(p => p.Id == id);
        }

        public ActionResponse Create(BPCreateData data)
        {
            if (string.IsNullOrWhiteSpace(data.Name))
                return new ActionResponse { Status = false, StatusMsg = "Program name is required." };

            if (data.MaxReward < data.MinReward)
                return new ActionResponse { Status = false, StatusMsg = "MaxReward must be >= MinReward." };

            _programs.Add(new BountyProgram
            {
                Id = _nextId++,
                Name = data.Name,
                Description = data.Description,
                Scope = data.Scope,
                MinReward = data.MinReward,
                MaxReward = data.MaxReward,
                OwnerId = data.OwnerId,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            });

            return new ActionResponse { Status = true, StatusMsg = "Program created." };
        }

        public ActionResponse Update(int id, BPUpdateData data)
        {
            var program = _programs.FirstOrDefault(p => p.Id == id);
            if (program == null)
                return new ActionResponse { Status = false, StatusMsg = "Program not found." };

            if (data.Name != null) program.Name = data.Name;
            if (data.Description != null) program.Description = data.Description;
            if (data.Scope != null) program.Scope = data.Scope;
            if (data.MinReward.HasValue) program.MinReward = data.MinReward.Value;
            if (data.MaxReward.HasValue) program.MaxReward = data.MaxReward.Value;
            if (data.IsActive.HasValue) program.IsActive = data.IsActive.Value;

            return new ActionResponse { Status = true, StatusMsg = "Program updated." };
        }

        public ActionResponse Delete(int id)
        {
            var program = _programs.FirstOrDefault(p => p.Id == id);
            if (program == null)
                return new ActionResponse { Status = false, StatusMsg = "Program not found." };

            _programs.Remove(program);
            return new ActionResponse { Status = true, StatusMsg = "Program deleted." };
        }
    }
}
