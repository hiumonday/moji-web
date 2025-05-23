import { Link } from "react-router-dom";
import React from "react";
import Container from "./container";
import Logo from '../assets/logo.png'
export default function Footer({className}) {
  const navigation = [
    { label: "Về Moji", to: "https://moji.education/about.html" }, // Update the href as per your route
    { label: "Liên hệ", to: "https://www.facebook.com/MojiSATPlatform" }, // Update the href as per your route
    {label: "Hotline:", to:''},
    {label: "0961188133", to:''},
    {label: "0375435373", to:''},

    
  ];
  // const legal = ["Terms", "Privacy", "Legal"];
  return (
    <div className={`relative ${className}`}>
      <Container>
        <div className={`grid max-w-screen-xl grid-cols-1 gap-10 pt-10 mx-auto mt-5 border-t border-gray-100 dark:border-trueGray-700 lg:grid-cols-5 ${className}`}>
          <div className="lg:col-span-2">
            <div>
              {" "}
              <Link href="/" className="flex items-center space-x-2 text-2xl font-medium text-indigo-500 dark:text-gray-100">
                <img
                  src={Logo}
                  alt="N"
                  width="100"
                  height="100"
                  className="w-20"
                />
                <span>Moji Education</span>
              </Link>
            </div>

            <div className="max-w-md mt-4 ml-4 text-gray-500 dark:text-gray-400">
              Moji Education cung cấp các dịch vụ giáo dục cao cấp như tranh biện, năng lực tư duy, và chứng chỉ tiếng Anh, với giá cả phải chăng và hình thức học đổi mới để tối đa hóa tiếp cận với giáo dục.
            </div>

          </div>

          <div>
            <div className="flex flex-wrap w-full -mt-2 -ml-3 lg:ml-0">
              {navigation.map((item, index) => (
                <Link key={index} to={item.to} className="w-full px-4 py-2 text-gray-500 rounded-md dark:text-gray-300 hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 focus:outline-none dark:focus:bg-trueGray-700">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            {/* <div className="flex flex-wrap w-full -mt-2 -ml-3 lg:ml-0">
              {legal.map((item, index) => (
                <Link key={index} href="/" className="w-full px-4 py-2 text-gray-500 rounded-md dark:text-gray-300 hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 focus:outline-none dark:focus:bg-trueGray-700">      
                    {item}
                </Link>
              ))}
            </div> */}
          </div>
          <div className="">
            <div>Follow us</div>
            <div className="flex mt-5 space-x-5 text-gray-400 dark:text-gray-500">
              {/* <a
                href="https://twitter.com/web3templates"
                target="_blank"
                rel="noopener">
                <span className="sr-only">Twitter</span>
                <Twitter />
              </a> */}
              <a
                href="https://facebook.com/MojiSATPlatform"
                >
                <span className="sr-only">Facebook</span>
                <Facebook />
              </a>
              {/* <a
                href="https://instagram.com/web3templates"
                target="_blank"
                rel="noopener">
                <span className="sr-only">Instagram</span>
                <Instagram />
              </a> */}
              <a
                href="https://www.linkedin.com/company/moji-education/"
                >
                <span className="sr-only">Linkedin</span>
                <Linkedin />
              </a>
            </div>
          </div>
        </div>

      </Container>
    </div>
  );
}


const Facebook = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor">
    <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07" />
  </svg>
);


const Linkedin = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor">
    <path d="M22.23 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0zM7.27 20.1H3.65V9.24h3.62V20.1zM5.47 7.76h-.03c-1.22 0-2-.83-2-1.87 0-1.06.8-1.87 2.05-1.87 1.24 0 2 .8 2.02 1.87 0 1.04-.78 1.87-2.05 1.87zM20.34 20.1h-3.63v-5.8c0-1.45-.52-2.45-1.83-2.45-1 0-1.6.67-1.87 1.32-.1.23-.11.55-.11.88v6.05H9.28s.05-9.82 0-10.84h3.63v1.54a3.6 3.6 0 0 1 3.26-1.8c2.39 0 4.18 1.56 4.18 4.89v6.21z" />
  </svg>
);

