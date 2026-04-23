using Bug_Bounty_Platform.DataAccess.Context;
using Bug_Bounty_Platform.Domain.Entities.BugReport;
using Bug_Bounty_Platform.Domain.Models.BugReport;
using Bug_Bounty_Platform.Domain.Models.Responces;

namespace Bug_Bounty_Platform.BusinessLogic.Core
{
    public class BugReportActions
    {
        protected BugReportActions()
        {
        }

        protected List<BugReportDto> GetAllBugReportActionExecution()
        {
            var data = new List<BugReportDto>();
            List<BugReportData> brData;
            using (var db = new BugReportContext())
            {
                brData = db.BugReports.
                    Where(x => !x.IsDeleted).ToList();
            }

            if (brData.Count <= 0) return data;
            foreach (var item in brData)
            {
                data.Add(new BugReportDto
                {
                    Id = item.Id,
                    Title = item.Title,
                    Description = item.Description,
                    Severity = item.Severity,
                    Status = item.Status,
                    ProgramId = item.ProgramId,
                    ReporterId = item.ReporterId
                });
            }

            return data;
        }

        protected BugReportDto? GetBugReportByIdActionExecution(int id)
        {
            BugReportData? brData;
            using (var db = new BugReportContext())
            {
                brData = db.BugReports
                    .FirstOrDefault(x =>
                        x.Id == id && !x.IsDeleted);
            }

            if (brData == null) return null;
            var data = new BugReportDto
            {
                Id = brData.Id,
                Title = brData.Title,
                Description = brData.Description,
                Severity = brData.Severity,
                Status = brData.Status,
                ProgramId = brData.ProgramId,
                ReporterId = brData.ReporterId
            };
            return data;
        }

        protected ActionResponce CreateBugReportActionExecution(BugReportDto data)
        {
            var status = ValidateBugReportTitle(data);
            if (!status.IsSuccess)
            {
                return status;
            }

            using (var db = new BugReportContext())
            {
                var brData = new BugReportData
                {
                    Title = data.Title,
                    Description = data.Description,
                    Severity = data.Severity,
                    Status = BugStatus.New,
                    ProgramId = data.ProgramId,
                    ReporterId = data.ReporterId,
                    SubmittedAt = DateTime.Now
                };
                db.BugReports.Add(brData);
                db.SaveChanges();
            }

            return new ActionResponce
            {
                IsSuccess = true,
                Message = "Bug report submitted successfully."
            };
        }

        protected ActionResponce UpdateBugReportActionExecution(BugReportDto data)
        {
            var localData = GetBugReportByIdIternal(data.Id);
            if (localData == null)
            {
                return new ActionResponce
                {
                    IsSuccess = false,
                    Message = "Bug report not found."
                };
            }

            localData.Title = data.Title;
            localData.Description = data.Description;
            localData.Severity = data.Severity;
            localData.Status = data.Status;
            localData.ProgramId = data.ProgramId;
            localData.ReporterId = data.ReporterId;

            localData.UpdatedAt = DateTime.Now;

            using (var db = new BugReportContext())
            {
                db.BugReports.Update(localData);
                db.SaveChanges();
            }

            return new ActionResponce
            {
                IsSuccess = true,
                Message = "Bug report updated successfully."
            };
        }

        protected ActionResponce DeleteBugReportActionExecution(int id)
        {
            var localData = GetBugReportByIdIternal(id);
            if (localData == null)
            {
                return new ActionResponce
                {
                    IsSuccess = false,
                    Message = "Bug report not found."
                };
            }

            localData.IsDeleted = true;

            using (var db = new BugReportContext())
            {
                db.BugReports.Update(localData);
                db.SaveChanges();
            }

            return new ActionResponce()
            {
                IsSuccess = true,
                Message = "Bug Report Deleted"
            };
        }

        /// <summary>
        /// Helper for Action of Getting Bug Report by ID
        /// </summary>
        private BugReportData? GetBugReportByIdIternal(int id)
        {
            BugReportData? localData;
            using (var db = new BugReportContext())
            {
                localData = db.BugReports.
                    FirstOrDefault(x => x.Id == id);
            }

            return localData;
        }

        /// <summary>
        /// Validate Bug Report Title an unique value within the program.
        /// </summary>
        private ActionResponce ValidateBugReportTitle(BugReportDto data)
        {
            BugReportData? localData;
            using (var db = new BugReportContext())
            {
                localData = db.BugReports
                .FirstOrDefault(x =>
                        x.Title.ToLower() == data.Title.ToLower() &&
                        x.ProgramId == data.ProgramId &&
                        !x.IsDeleted);
            }

            if (localData != null)
            {
                return new ActionResponce
                {
                    IsSuccess = false,
                    Message = "A bug report with the same title already exists in this program."
                };
            }

            return new ActionResponce()
            {
                IsSuccess = true,
                Message = "A bug report title is valid."
            };
        }
    }
}
