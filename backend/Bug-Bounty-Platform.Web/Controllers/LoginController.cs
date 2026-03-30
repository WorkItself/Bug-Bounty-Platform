using Microsoft.AspNetCore.Mvc;
using Bug_Bounty_Platform.BusinessLogic;
using Bug_Bounty_Platform.BusinessLogic.Interfaces;
using Bug_Bounty_Platform.Domain.Entities.User;
using System;

namespace Bug_Bounty_Platform.Web.Controllers
{
    public class UserLoginModel
    {
        public string Credential { get; set; }
        public string Password { get; set; }
    }

    public class LoginController : Controller
    {
        private readonly Bug_Bounty_Platform.BusinessLogic.Interfaces.ISession _session;

        public LoginController()
        {
            var bl = new BussinesLogic();
            _session = bl.GetSessionBL();
        }

        // GET: Login
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Index(UserLoginModel login)
        {
            if (ModelState.IsValid)
            {
                ULoginData data = new ULoginData
                {
                    Credential = login.Credential,
                    Password = login.Password,
                    LoginIp = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "0.0.0.0",
                    LoginDateTime = DateTime.Now
                };

                var userLogin = _session.UserLogin(data);
                if (userLogin.Status)
                {
                    //ADD COOKIE
                    return RedirectToAction("Index", "Home");
                }
                else
                {
                    ModelState.AddModelError("", userLogin.StatusMsg);
                    return View();
                }
            }
            
            return View();
        }
    }
}
