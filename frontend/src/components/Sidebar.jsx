import React, { useState } from 'react';
import {
    FiHome,
    FiFileText,
    FiSettings,
    FiLogOut,
    FiChevronDown,
    FiChevronUp,
    FiPackage,
    FiShoppingBag
} from 'react-icons/fi';
import {
    MdOutlineRadioButtonUnchecked,
    MdCheckCircleOutline,
    MdBlock,
    MdCancel
} from 'react-icons/md';
import {
    HiOutlineDocumentText,
    HiOutlineClipboardList
} from 'react-icons/hi';

const Sidebar = () => {
    const [servicesOpen, setServicesOpen] = useState(false);
    const [invoicesOpen, setInvoicesOpen] = useState(false);

    const menuItems = [
        { icon: <FiHome />, label: 'Dashboard', active: true },
        { icon: <FiFileText />, label: 'Nexus' },
        { icon: <FiShoppingBag />, label: 'Intake' },
    ];

    const servicesSubmenu = [
        { label: 'Pre-active', icon: <MdOutlineRadioButtonUnchecked className="text-sm" /> },
        { label: 'Active', icon: <MdCheckCircleOutline className="text-sm" /> },
        { label: 'Blocked', icon: <MdBlock className="text-sm" /> },
        { label: 'Closed', icon: <MdCancel className="text-sm" /> },
    ];

    const invoicesSubmenu = [
        { label: 'Proforma Invoices', icon: <HiOutlineDocumentText className="text-sm" /> },
        { label: 'Final Invoices', icon: <HiOutlineClipboardList className="text-sm" /> },
    ];

    return (
        <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center shadow-sm">
                        <span className="text-white font-bold text-xl">S</span>
                    </div>
                    <div>
                        <h2 className="font-bold text-gray-950">Vault</h2>
                        <p className="text-xs text-gray-600">Suman Kumar</p>
                    </div>
                </div>
            </div>


            <nav className="flex-1 overflow-y-auto py-2">
                <div className="space-y-0.5">

                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all ${item.active
                                    ? 'bg-blue-50 text-blue-700 font-medium border-r-3 border-blue-600'
                                    : 'text-gray-900 hover:bg-gray-50 hover:text-gray-950 hover:font-semibold'
                                }`}
                        >
                            <span className="text-base">{item.icon}</span>
                            <span className="flex-1 text-left">{item.label}</span>
                        </button>
                    ))}


                    <div>
                        <button
                            onClick={() => setServicesOpen(!servicesOpen)}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-50 hover:text-gray-950 hover:font-semibold transition-all"
                        >
                            <FiPackage className="text-base" />
                            <span className="flex-1 text-left">Services</span>
                            {servicesOpen ? <FiChevronUp className="text-sm" /> : <FiChevronDown className="text-sm" />}
                        </button>
                        {servicesOpen && (
                            <div className="bg-gray-50 py-1">
                                {servicesSubmenu.map((item, index) => (
                                    <button
                                        key={index}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:text-gray-950 hover:bg-gray-100 hover:font-semibold transition-all flex items-center gap-3"
                                    >
                                        <span className="ml-7 text-gray-500">{item.icon}</span>
                                        <span>{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>


                    <div>
                        <button
                            onClick={() => setInvoicesOpen(!invoicesOpen)}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-50 hover:text-gray-950 hover:font-semibold transition-all"
                        >
                            <FiFileText className="text-base" />
                            <span className="flex-1 text-left">Invoices</span>
                            {invoicesOpen ? <FiChevronUp className="text-sm" /> : <FiChevronDown className="text-sm" />}
                        </button>
                        {invoicesOpen && (
                            <div className="bg-gray-50 py-1">
                                {invoicesSubmenu.map((item, index) => (
                                    <button
                                        key={index}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:text-gray-950 hover:bg-gray-100 hover:font-semibold transition-all flex items-center gap-3"
                                    >
                                        <span className="ml-7 text-gray-500">{item.icon}</span>
                                        <span>{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </nav>


            <div className="border-t border-gray-200 p-2">
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-50 hover:text-gray-950 hover:font-semibold rounded-lg transition-all">
                    <FiSettings className="text-base" />
                    <span>Settings</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 hover:font-semibold rounded-lg transition-all">
                    <FiLogOut className="text-base" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
