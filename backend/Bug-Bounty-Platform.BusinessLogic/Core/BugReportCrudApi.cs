using System;
using System.Collections.Generic;
using System.Linq;
using Bug_Bounty_Platform.Domain.Entities;
using Bug_Bounty_Platform.Domain.Entities.BugReport;

namespace Bug_Bounty_Platform.BusinessLogic.Core
{
    public class BugReportCrudApi
    {
        private static readonly List<BugReport> _reports = new();
        private static int _nextId = 1;

        private static readonly HashSet<string> _validSeverities = new() { "Low", "Medium", "High", "Critical" };
        private static readonly HashSet<string> _validStatuses = new() { "Pending", "Triaged", "Resolved", "Rejected" };

        public List<BugReport> GetAll()
        {
            return _reports.ToList();
        }

        public BugReport? GetById(int id)
        {
            return _reports.FirstOrDefault(r => r.Id == id);
        }

        public ActionResponse Create(BRCreateData data)
        {
            if (string.IsNullOrWhiteSpace(data.Title))
                return new ActionResponse { Status = false, StatusMsg = "Title is required." };

            if (!_validSeverities.Contains(data.Severity))
                return new ActionResponse { Status = false, StatusMsg = "Invalid severity. Use: Low, Medium, High, Critical." };

            _reports.Add(new BugReport
            {
                Id = _nextId++,
                Title = data.Title,
                Description = data.Description,
                Severity = data.Severity,
                Status = "Pending",
                ProgramId = data.ProgramId,
                ReporterId = data.ReporterId,
                SubmittedAt = DateTime.UtcNow
            });

            return new ActionResponse { Status = true, StatusMsg = "Bug report submitted." };
        }

        public ActionResponse Update(int id, BRUpdateData data)
        {
            var report = _reports.FirstOrDefault(r => r.Id == id);
            if (report == null)
                return new ActionResponse { Status = false, StatusMsg = "Report not found." };

            if (data.Severity != null && !_validSeverities.Contains(data.Severity))
                return new ActionResponse { Status = false, StatusMsg = "Invalid severity." };

            if (data.Status != null && !_validStatuses.Contains(data.Status))
                return new ActionResponse { Status = false, StatusMsg = "Invalid status." };

            if (data.Title != null) report.Title = data.Title;
            if (data.Description != null) report.Description = data.Description;
            if (data.Severity != null) report.Severity = data.Severity;
            if (data.Status != null) report.Status = data.Status;

            return new ActionResponse { Status = true, StatusMsg = "Report updated." };
        }

        public ActionResponse Delete(int id)
        {
            var report = _reports.FirstOrDefault(r => r.Id == id);
            if (report == null)
                return new ActionResponse { Status = false, StatusMsg = "Report not found." };

            _reports.Remove(report);
            return new ActionResponse { Status = true, StatusMsg = "Report deleted." };
        }
    }
}
