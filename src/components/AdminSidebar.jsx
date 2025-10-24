// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import { IoMdAddCircleOutline } from "react-icons/io";
// import { TfiViewList } from "react-icons/tfi";
// import { FaShoppingBag } from "react-icons/fa"; // Import the order icon

// const AdminSidebar = () => {
//     const activeLinkStyle = "bg-gray-200 text-gray-800"; // Style for the active link

//     return (
//         <div className="w-64 h-full bg-gray-100 border-r py-6 px-4 flex flex-col gap-4 flex-shrink-0"> {/* Ensure flex-shrink-0 */}
//             <NavLink
//                 to="/admin/add"
//                 className={({ isActive }) => `flex items-center gap-3 p-3 rounded-md hover:bg-gray-200 transition-colors ${isActive ? activeLinkStyle : 'text-gray-600'}`}
//             >
//                 <IoMdAddCircleOutline size={22}/>
//                 <span className="font-medium">Add Product</span>
//             </NavLink>
//             <NavLink
//                 to="/admin/list"
//                 className={({ isActive }) => `flex items-center gap-3 p-3 rounded-md hover:bg-gray-200 transition-colors ${isActive ? activeLinkStyle : 'text-gray-600'}`}
//             >
//                 <TfiViewList size={20}/>
//                 <span className="font-medium">List Products</span>
//             </NavLink>
//             {/* Add link for Orders page */}
//             <NavLink
//                 to="/admin/orders"
//                 className={({ isActive }) => `flex items-center gap-3 p-3 rounded-md hover:bg-gray-200 transition-colors ${isActive ? activeLinkStyle : 'text-gray-600'}`}
//             >
//                 <FaShoppingBag size={20}/>
//                 <span className="font-medium">Manage Orders</span>
//             </NavLink>
//         </div>
//     );
// };

// export default AdminSidebar;

import React from 'react';
import { NavLink } from 'react-router-dom';
import { IoMdAddCircleOutline } from "react-icons/io";
import { TfiViewList } from "react-icons/tfi";
import { FaShoppingBag, FaTags } from "react-icons/fa"; // Import FaTags icon

const AdminSidebar = () => {
    const activeLinkStyle = "bg-gray-200 text-gray-800"; // Style for the active link
    // Reusable function to generate className based on isActive state
    const linkClass = ({ isActive }) =>
        `flex items-center gap-3 p-3 rounded-md hover:bg-gray-200 transition-colors ${
            isActive ? activeLinkStyle : 'text-gray-600'
        }`;

    return (
        <div className="w-64 h-full bg-gray-100 border-r py-6 px-4 flex flex-col gap-4 flex-shrink-0"> {/* Ensure flex-shrink-0 */}
            {/* Add Product Link */}
            <NavLink to="/admin/add" className={linkClass}>
                <IoMdAddCircleOutline size={22}/>
                <span className="font-medium">Add Product</span>
            </NavLink>
            {/* List Products Link */}
            <NavLink to="/admin/list" className={linkClass}>
                <TfiViewList size={20}/>
                <span className="font-medium">List Products</span>
            </NavLink>
            {/* Manage Orders Link */}
            <NavLink to="/admin/orders" className={linkClass}>
                <FaShoppingBag size={20}/>
                <span className="font-medium">Manage Orders</span>
            </NavLink>
            {/* Promo Codes Link */}
            <NavLink to="/admin/promos" className={linkClass}>
                <FaTags size={20}/>
                <span className="font-medium">Promo Codes</span>
            </NavLink>
        </div>
    );
};

export default AdminSidebar;