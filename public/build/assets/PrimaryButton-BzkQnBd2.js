import{j as s,L as u}from"./app-BcUxkPYW.js";function f({className:a="",disabled:e=!1,children:t,href:r=null,routeName:n=null,...l}){const o=`
        w-full flex justify-center items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white 
        transition-all duration-200 ease-in-out
        ${e?"bg-gradient-to-r from-blue-500 to-blue-400 opacity-50 cursor-not-allowed":"bg-gradient-to-r from-primary-100 to-blue-400 hover:brightness-110 shadow-md hover:shadow-lg"}
        focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2
        ${a}
    `;return n?s.jsx(u,{href:route(n),className:o,children:t}):r?s.jsx(u,{href:r,className:o,children:t}):s.jsx("button",{...l,disabled:e,className:o,children:t})}export{f as P};
