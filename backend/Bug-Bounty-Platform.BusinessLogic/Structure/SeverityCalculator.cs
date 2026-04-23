using Bug_Bounty_Platform.Domain.Entities.BugReport;
using Bug_Bounty_Platform.Domain.Models.BugReport;

namespace Bug_Bounty_Platform.BusinessLogic.Structure
{
    // Implements CVSS v3.1 base score calculation per:
    // https://www.first.org/cvss/v3.1/specification-document
    public class SeverityCalculator
    {
        public CvssResultDto Calculate(CvssMetricsDto m)
        {
            double av  = AttackVectorScore(m.AttackVector);
            double ac  = m.AttackComplexity == CvssAttackComplexity.Low ? 0.77 : 0.44;
            double pr  = PrivilegesRequiredScore(m.PrivilegesRequired, m.Scope);
            double ui  = m.UserInteraction == CvssUserInteraction.None ? 0.85 : 0.62;
            double c   = ImpactScore(m.Confidentiality);
            double i   = ImpactScore(m.Integrity);
            double a   = ImpactScore(m.Availability);

            double iscBase = 1.0 - ((1.0 - c) * (1.0 - i) * (1.0 - a));

            double iss;
            if (m.Scope == CvssScope.Unchanged)
                iss = 6.42 * iscBase;
            else
                iss = 7.52 * (iscBase - 0.029) - 3.25 * Math.Pow(iscBase - 0.02, 15);

            double exploitability = 8.22 * av * ac * pr * ui;

            double baseScore;
            if (iss <= 0)
            {
                baseScore = 0;
            }
            else if (m.Scope == CvssScope.Unchanged)
            {
                baseScore = Roundup(Math.Min(iss + exploitability, 10));
            }
            else
            {
                baseScore = Roundup(Math.Min(1.08 * (iss + exploitability), 10));
            }

            return new CvssResultDto
            {
                BaseScore = baseScore,
                Severity = ScoreToSeverity(baseScore),
                VectorString = BuildVectorString(m)
            };
        }

        public BugSeverity ToBugSeverity(CvssMetricsDto m)
        {
            var result = Calculate(m);
            return result.BaseScore switch
            {
                0                      => BugSeverity.Low,
                <= 3.9                 => BugSeverity.Low,
                <= 6.9                 => BugSeverity.Medium,
                <= 8.9                 => BugSeverity.High,
                _                      => BugSeverity.Critical
            };
        }

        // CVSS 3.1 Roundup: smallest value with 1 decimal >= input
        private static double Roundup(double x)
        {
            int rounded = (int)Math.Ceiling(x * 10);
            return rounded / 10.0;
        }

        private static string ScoreToSeverity(double score) => score switch
        {
            0             => "None",
            <= 3.9        => "Low",
            <= 6.9        => "Medium",
            <= 8.9        => "High",
            _             => "Critical"
        };

        private static double AttackVectorScore(CvssAttackVector av) => av switch
        {
            CvssAttackVector.Network  => 0.85,
            CvssAttackVector.Adjacent => 0.62,
            CvssAttackVector.Local    => 0.55,
            CvssAttackVector.Physical => 0.20,
            _                         => 0.85
        };

        private static double PrivilegesRequiredScore(CvssPrivilegesRequired pr, CvssScope scope)
        {
            if (scope == CvssScope.Changed)
            {
                return pr switch
                {
                    CvssPrivilegesRequired.None => 0.85,
                    CvssPrivilegesRequired.Low  => 0.68,
                    CvssPrivilegesRequired.High => 0.50,
                    _                           => 0.85
                };
            }
            return pr switch
            {
                CvssPrivilegesRequired.None => 0.85,
                CvssPrivilegesRequired.Low  => 0.62,
                CvssPrivilegesRequired.High => 0.27,
                _                           => 0.85
            };
        }

        private static double ImpactScore(CvssImpact impact) => impact switch
        {
            CvssImpact.None => 0.00,
            CvssImpact.Low  => 0.22,
            CvssImpact.High => 0.56,
            _               => 0.00
        };

        private static string BuildVectorString(CvssMetricsDto m)
        {
            string av = m.AttackVector switch
            {
                CvssAttackVector.Network  => "N",
                CvssAttackVector.Adjacent => "A",
                CvssAttackVector.Local    => "L",
                CvssAttackVector.Physical => "P",
                _                         => "N"
            };
            string ac = m.AttackComplexity == CvssAttackComplexity.Low ? "L" : "H";
            string pr = m.PrivilegesRequired switch
            {
                CvssPrivilegesRequired.None => "N",
                CvssPrivilegesRequired.Low  => "L",
                CvssPrivilegesRequired.High => "H",
                _                           => "N"
            };
            string ui = m.UserInteraction == CvssUserInteraction.None ? "N" : "R";
            string s  = m.Scope == CvssScope.Unchanged ? "U" : "C";
            string c  = ImpactLetter(m.Confidentiality);
            string i  = ImpactLetter(m.Integrity);
            string a  = ImpactLetter(m.Availability);

            return $"CVSS:3.1/AV:{av}/AC:{ac}/PR:{pr}/UI:{ui}/S:{s}/C:{c}/I:{i}/A:{a}";
        }

        private static string ImpactLetter(CvssImpact impact) => impact switch
        {
            CvssImpact.None => "N",
            CvssImpact.Low  => "L",
            CvssImpact.High => "H",
            _               => "N"
        };
    }
}
