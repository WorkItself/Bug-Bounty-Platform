using Bug_Bounty_Platform.DataAccess.Context;
using Bug_Bounty_Platform.Domain.Entities.BountyProgram;
using Bug_Bounty_Platform.Domain.Models.BountyProgram;
using Bug_Bounty_Platform.Domain.Models.Responces;

namespace Bug_Bounty_Platform.BusinessLogic.Core
{
    public class BountyProgramActions
    {
        protected BountyProgramActions()
        {
        }

        protected List<BountyProgramDto> GetAllBountyProgramActionExecution()
        {
            var data = new List<BountyProgramDto>();
            List<BountyProgramData> bpData;
            using (var db = new BountyProgramContext())
            {
                bpData = db.BountyPrograms.
                    Where(x => !x.IsDeleted).ToList();
            }

            if (bpData.Count <= 0) return data;
            foreach (var item in bpData)
            {
                data.Add(new BountyProgramDto
                {
                    Id = item.Id,
                    ProgramName = item.ProgramName,
                    ProgramDescription = item.ProgramDescription,
                    ProgramScope = item.ProgramScope,
                    MinReward = item.MinReward,
                    MaxReward = item.MaxReward,
                    OwnerId = item.OwnerId,
                    IsActive = item.IsActive
                });
            }

            return data;
        }

        protected BountyProgramDto? GetBountyProgramByIdActionExecution(int id)
        {
            BountyProgramData? bpData;
            using (var db = new BountyProgramContext())
            {
                bpData = db.BountyPrograms
                    .FirstOrDefault(x =>
                        x.Id == id && !x.IsDeleted);
            }

            if (bpData == null) return null;
            var data = new BountyProgramDto
            {
                Id = bpData.Id,
                ProgramName = bpData.ProgramName,
                ProgramDescription = bpData.ProgramDescription,
                ProgramScope = bpData.ProgramScope,
                MinReward = bpData.MinReward,
                MaxReward = bpData.MaxReward,
                OwnerId = bpData.OwnerId,
                IsActive = bpData.IsActive
            };
            return data;
        }

        protected ActionResponce CreateBountyProgramActionExecution(BountyProgramDto data)
        {
            var status = ValidateBountyProgramName(data);
            if (!status.IsSuccess)
            {
                return status;
            }

            if (data.MaxReward < data.MinReward)
            {
                return new ActionResponce
                {
                    IsSuccess = false,
                    Message = "MaxReward must be greater than or equal to MinReward."
                };
            }

            using (var db = new BountyProgramContext())
            {
                var bpData = new BountyProgramData
                {
                    ProgramName = data.ProgramName,
                    ProgramDescription = data.ProgramDescription,
                    ProgramScope = data.ProgramScope,
                    MinReward = data.MinReward,
                    MaxReward = data.MaxReward,
                    OwnerId = data.OwnerId,
                    IsActive = true,
                    CreatedAt = DateTime.Now
                };
                db.BountyPrograms.Add(bpData);
                db.SaveChanges();
            }

            return new ActionResponce
            {
                IsSuccess = true,
                Message = "Bounty program created successfully."
            };
        }

        protected ActionResponce UpdateBountyProgramActionExecution(BountyProgramDto data)
        {
            var localData = GetBountyProgramByIdIternal(data.Id);
            if (localData == null)
            {
                return new ActionResponce
                {
                    IsSuccess = false,
                    Message = "Bounty program not found."
                };
            }

            localData.ProgramName = data.ProgramName;
            localData.ProgramDescription = data.ProgramDescription;
            localData.ProgramScope = data.ProgramScope;
            localData.MinReward = data.MinReward;
            localData.MaxReward = data.MaxReward;
            localData.IsActive = data.IsActive;

            localData.UpdatedAt = DateTime.Now;

            using (var db = new BountyProgramContext())
            {
                db.BountyPrograms.Update(localData);
                db.SaveChanges();
            }

            return new ActionResponce
            {
                IsSuccess = true,
                Message = "Bounty program updated successfully."
            };
        }

        protected ActionResponce DeleteBountyProgramActionExecution(int id)
        {
            var localData = GetBountyProgramByIdIternal(id);
            if (localData == null)
            {
                return new ActionResponce
                {
                    IsSuccess = false,
                    Message = "Bounty program not found."
                };
            }

            localData.IsDeleted = true;

            using (var db = new BountyProgramContext())
            {
                db.BountyPrograms.Update(localData);
                db.SaveChanges();
            }

            return new ActionResponce()
            {
                IsSuccess = true,
                Message = "Bounty Program Deleted"
            };
        }

        /// <summary>
        /// Helper for Action of Getting Bounty Programs by ID
        /// </summary>
        private BountyProgramData? GetBountyProgramByIdIternal(int id)
        {
            BountyProgramData? localData;
            using (var db = new BountyProgramContext())
            {
                localData = db.BountyPrograms.
                    FirstOrDefault(x => x.Id == id);
            }

            return localData;
        }

        /// <summary>
        /// Validate Bounty Program Name as a unique value.
        /// </summary>
        private ActionResponce ValidateBountyProgramName(BountyProgramDto data)
        {
            BountyProgramData? localData;
            using (var db = new BountyProgramContext())
            {
                localData = db.BountyPrograms
                .FirstOrDefault(x =>
                        x.ProgramName.ToLower() == data.ProgramName.ToLower() && !x.IsDeleted);
            }

            if (localData != null)
            {
                return new ActionResponce
                {
                    IsSuccess = false,
                    Message = "A bounty program with the same name already exists."
                };
            }

            return new ActionResponce()
            {
                IsSuccess = true,
                Message = "A bounty program name is valid."
            };
        }
    }
}
