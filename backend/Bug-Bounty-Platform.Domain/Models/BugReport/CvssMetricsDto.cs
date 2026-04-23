namespace Bug_Bounty_Platform.Domain.Models.BugReport
{
    public enum CvssAttackVector   { Network, Adjacent, Local, Physical }
    public enum CvssAttackComplexity { Low, High }
    public enum CvssPrivilegesRequired { None, Low, High }
    public enum CvssUserInteraction { None, Required }
    public enum CvssScope { Unchanged, Changed }
    public enum CvssImpact { None, Low, High }

    public class CvssMetricsDto
    {
        public CvssAttackVector AttackVector { get; set; }
        public CvssAttackComplexity AttackComplexity { get; set; }
        public CvssPrivilegesRequired PrivilegesRequired { get; set; }
        public CvssUserInteraction UserInteraction { get; set; }
        public CvssScope Scope { get; set; }
        public CvssImpact Confidentiality { get; set; }
        public CvssImpact Integrity { get; set; }
        public CvssImpact Availability { get; set; }
    }

    public class CvssResultDto
    {
        public double BaseScore { get; set; }
        public string Severity { get; set; }
        public string VectorString { get; set; }
    }
}
