using Bug_Bounty_Platform.DataAccess.Context;
using Bug_Bounty_Platform.Domain.Models.BugReport;

namespace Bug_Bounty_Platform.BusinessLogic.Structure
{
    public class DuplicateDetector
    {
        // Minimum token overlap ratio to flag a potential duplicate
        private const double SimilarityThreshold = 0.5;

        public List<DuplicateCandidateDto> FindDuplicates(BugReportDto incoming)
        {
            List<BugReportDto> existing;
            using (var db = new BugReportContext())
            {
                existing = db.BugReports
                    .Where(x => x.ProgramId == incoming.ProgramId && !x.IsDeleted)
                    .Select(x => new BugReportDto
                    {
                        Id = x.Id,
                        Title = x.Title,
                        Description = x.Description,
                        Severity = x.Severity,
                        Status = x.Status,
                        ProgramId = x.ProgramId,
                        ReporterId = x.ReporterId
                    })
                    .ToList();
            }

            var candidates = new List<DuplicateCandidateDto>();

            foreach (var report in existing)
            {
                double titleSim = TokenSimilarity(incoming.Title, report.Title);
                double descSim = TokenSimilarity(incoming.Description, report.Description);
                // Weighted: title counts more
                double combined = (titleSim * 0.6) + (descSim * 0.4);

                if (combined >= SimilarityThreshold)
                {
                    candidates.Add(new DuplicateCandidateDto
                    {
                        ReportId = report.Id,
                        Title = report.Title,
                        Status = report.Status,
                        ConfidenceScore = Math.Round(combined * 100, 1)
                    });
                }
            }

            return candidates.OrderByDescending(x => x.ConfidenceScore).ToList();
        }

        // Jaccard similarity over word tokens (case-insensitive)
        private static double TokenSimilarity(string? a, string? b)
        {
            if (string.IsNullOrWhiteSpace(a) || string.IsNullOrWhiteSpace(b))
                return 0;

            var setA = Tokenize(a);
            var setB = Tokenize(b);

            int intersection = setA.Intersect(setB).Count();
            int union = setA.Union(setB).Count();

            return union == 0 ? 0 : (double)intersection / union;
        }

        private static HashSet<string> Tokenize(string text)
        {
            return text
                .ToLowerInvariant()
                .Split(new[] { ' ', '\t', '\n', '\r', '.', ',', ';', ':', '!', '?', '-', '_' },
                    StringSplitOptions.RemoveEmptyEntries)
                .Where(t => t.Length > 2)
                .ToHashSet();
        }
    }
}
