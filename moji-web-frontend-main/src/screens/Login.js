import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginAction } from "../redux/actions/userAction";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet";

const Login = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      loginAction(formData, () => {
        navigate("/"); // Redirect on successful login
      })
    );
  };

  return (
    <div>
      <Helmet>
        <title>{t("login")}</title>
        <link rel="icon" href="/favicon.ico" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              {t("login")}
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Email"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  {t("passWord")}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder={t("passWord")}
                />
              </div>
            </div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {t("login")}
            </button>
          </form>
          <div className="text-center">
            <p className="mt-2 text-sm text-gray-600">
              {t("accountExist")}?{" "}
              <NavLink
                to="/register"
                className="font-medium text-yellow-500 hover:text-yellow-400"
              >
                {t("registerNow")}
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

// import { useNavigate } from "react-router-dom";
// import { Fragment } from "react";
// import Meta from "../utils/Meta";
// import React from "react";
// import { Link } from "react-router-dom";
// import { NavLink } from "react-router-dom";
// import { Helmet } from "react-helmet";
// import { useTranslation } from "react-i18next";

// const Login = () => {
//   const { t } = useTranslation();

//   return (
//     <div>
//       <Helmet>
//         <title>{t("login")}</title>
//         <link rel="icon" href="/favicon.ico" />
//       </Helmet>

//       <div className="min-h-screen flex items-center justify-center bg-white">
//         <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
//           <div className="text-center">
//             <h2 className="mt-6 text-3xl font-bold text-gray-900">
//               {t("login")}
//             </h2>
//           </div>
//           <form className="mt-8 space-y-6" action="#" method="POST">
//             <input type="hidden" name="remember" value="true" />
//             <div className="rounded-md shadow-sm -space-y-px">
//               <div>
//                 <label htmlFor="email-address" className="sr-only">
//                   Email
//                 </label>
//                 <input
//                   id="email-address"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   required
//                   className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                   placeholder="Email"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="password" className="sr-only">
//                   {t("passWord")}
//                 </label>
//                 <input
//                   id="password"
//                   name="password"
//                   type="password"
//                   autoComplete="current-password"
//                   required
//                   className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                   placeholder={t("passWord")}
//                 />
//               </div>
//             </div>

//             <div className="flex items-center justify-between">
//               <div className="flex items-center"></div>

//               <div className="text-sm">
//                 <a
//                   href="/register"
//                   className="font-medium text-blue-900 hover:text-blue-800"
//                 >
//                   {t("forgotPassWord")}?
//                 </a>
//               </div>
//             </div>

//             <div>
//               <button
//                 type="submit"
//                 className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               >
//                 {t("login")}
//               </button>
//             </div>
//           </form>
//           <div className="text-center">
//             <p className="mt-2 text-sm text-gray-600">
//               {t("accountExist")}?{" "}
//               <NavLink
//                 to="/register"
//                 className="font-medium text-yellow-500 hover:text-yellow-400"
//               >
//                 {t("registerNow")}
//               </NavLink>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
