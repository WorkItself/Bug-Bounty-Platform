using AutoMapper;
using Bug_Bounty_Platform.BusinessLogic.Mappings;
using Bug_Bounty_Platform.DataAccess.Context;
using Bug_Bounty_Platform.Domain.Entities.BountyProgram;
using Bug_Bounty_Platform.Domain.Models.BountyProgram;
using Bug_Bounty_Platform.Domain.Models.Responces;
using Microsoft.EntityFrameworkCore;

namespace Bug_Bounty_Platform.BusinessLogic.Core
{
    public class BountyProgramActions
    {
        private readonly IMapper _mapper = MapperConfig.Mapper;

        protected BountyProgramActions()
        {
        }

        protected List<BountyProgramDto> GetAllBountyProgramActionExecution()
        {
            List<BountyProgramData> bpData;
            using (var db = new BountyProgramContext())
                bpData = db.BountyPrograms.Where(x => !x.IsHidden).ToList();

            if (bpData.Count == 0) return new List<BountyProgramDto>();

            var dtos = _mapper.Map<List<BountyProgramDto>>(bpData);
            EnrichWithOwnerInfo(dtos);
            return dtos;
        }

        protected BountyProgramDto? GetBountyProgramByIdActionExecution(int id)
        {
            BountyProgramData? bpData;
            using (var db = new BountyProgramContext())
                bpData = db.BountyPrograms.FirstOrDefault(x => x.Id == id && !x.IsHidden);

            if (bpData == null) return null;
            var dto = _mapper.Map<BountyProgramDto>(bpData);
            EnrichWithOwnerInfo(new List<BountyProgramDto> { dto });
            return dto;
        }

        private static void EnrichWithOwnerInfo(List<BountyProgramDto> dtos)
        {
            var ownerIds = dtos.Select(d => d.OwnerId).Distinct().ToList();
            using var db = new CompanyProfileContext();
            var profiles = db.CompanyProfiles
                .Where(p => ownerIds.Contains(p.UserId))
                .Select(p => new { p.UserId, p.DisplayName, p.Handle })
                .ToList();

            var lookup = profiles.ToDictionary(p => p.UserId);
            foreach (var dto in dtos)
            {
                if (lookup.TryGetValue(dto.OwnerId, out var p))
                {
                    dto.OwnerDisplayName = p.DisplayName;
                    dto.OwnerHandle      = p.Handle;
                }
            }
        }

        protected ActionResponce CreateBountyProgramActionExecution(BountyProgramDto data)
        {
            var status = ValidateBountyProgramName(data);
            if (!status.IsSuccess)
            {
                return status;
            }

            using (var db = new BountyProgramContext())
            {
                var bpData = new BountyProgramData
                {
                    ProgramName = data.ProgramName,
                    ProgramDescription = data.ProgramDescription,
                    ProgramScope = data.ProgramScope,
                    Website = data.Website,
                    RewardCritical = data.RewardCritical,
                    RewardHigh = data.RewardHigh,
                    RewardMedium = data.RewardMedium,
                    RewardLow = data.RewardLow,
                    RewardInformational = data.RewardInformational,
                    OwnerId = data.OwnerId,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
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
            localData.Website = data.Website;
            localData.RewardCritical = data.RewardCritical;
            localData.RewardHigh = data.RewardHigh;
            localData.RewardMedium = data.RewardMedium;
            localData.RewardLow = data.RewardLow;
            localData.RewardInformational = data.RewardInformational;
            localData.IsActive = data.IsActive;

            localData.UpdatedAt = DateTime.UtcNow;

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

            localData.IsHidden = true;

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
                        x.ProgramName.ToLower() == data.ProgramName.ToLower() && !x.IsHidden);
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
