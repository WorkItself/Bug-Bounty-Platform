using AutoMapper;
using Bug_Bounty_Platform.BusinessLogic.Mappings;
using Bug_Bounty_Platform.DataAccess.Context;
using Bug_Bounty_Platform.Domain.Entities.BugReport;
using Bug_Bounty_Platform.Domain.Models.BugReport;
using Bug_Bounty_Platform.Domain.Models.Responces;

namespace Bug_Bounty_Platform.BusinessLogic.Core
{
    public class BugReportCommentActions
    {
        private readonly IMapper _mapper = MapperConfig.Mapper;

        protected BugReportCommentActions() { }

        protected List<BugReportCommentDto> GetCommentsByReportExecution(int bugReportId)
        {
            List<BugReportComment> comments;
            using (var db = new BugReportCommentContext())
            {
                comments = db.BugReportComments
                    .Where(x => x.BugReportId == bugReportId && !x.IsHidden)
                    .OrderBy(x => x.CreatedAt)
                    .ToList();
            }

            return _mapper.Map<List<BugReportCommentDto>>(comments);
        }

        protected ActionResponce AddCommentExecution(BugReportCommentDto data)
        {
            if (string.IsNullOrWhiteSpace(data.Content))
            {
                return new ActionResponce
                {
                    IsSuccess = false,
                    Message = "Comment content cannot be empty."
                };
            }

            using (var db = new BugReportCommentContext())
            {
                var entity = new BugReportComment
                {
                    BugReportId = data.BugReportId,
                    AuthorId    = data.AuthorId,
                    Content     = data.Content,
                    IsInternal  = data.IsInternal,
                    CreatedAt   = DateTime.UtcNow
                };
                db.BugReportComments.Add(entity);
                db.SaveChanges();
            }

            return new ActionResponce { IsSuccess = true, Message = "Comment added." };
        }

        protected ActionResponce DeleteCommentExecution(int commentId)
        {
            BugReportComment? entity;
            using (var db = new BugReportCommentContext())
            {
                entity = db.BugReportComments.FirstOrDefault(x => x.Id == commentId);
                if (entity == null)
                    return new ActionResponce { IsSuccess = false, Message = "Comment not found." };

                entity.IsHidden = true;
                db.SaveChanges();
            }

            return new ActionResponce { IsSuccess = true, Message = "Comment deleted." };
        }
    }
}
