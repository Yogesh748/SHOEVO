import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { IoTrashOutline } from "react-icons/io5";

const AdminPromoCodes = () => {
    const [codes, setCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useContext(CartContext);

    // State for the "Add New Code" form, including expiryDate
    const [newCodeData, setNewCodeData] = useState({
        code: "",
        discountType: "percent",
        discountValue: "",
        description: "",
        expiryDate: "" // Initialize expiryDate as empty string
    });
    const [isAdding, setIsAdding] = useState(false);
    const [addError, setAddError] = useState("");
    const [addSuccess, setAddSuccess] = useState("");

    // Function to fetch all promo codes
    const fetchPromoCodes = async () => {
        if (!token) { setError("Auth error"); setLoading(false); return; }
        setLoading(true); setError(null);
        try {
            const response = await axios.get('http://localhost:4000/api/promo/list', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setCodes(response.data.data);
            } else { setError("Failed to fetch codes."); }
        } catch (err) { setError(`Fetch error: ${err.response?.data?.message || err.message}`); }
        finally { setLoading(false); }
    };

    // Fetch codes on mount
    useEffect(() => { fetchPromoCodes(); }, [token]);

    // Handler for form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCodeData(prev => ({ ...prev, [name]: value }));
    };

    // Handler for adding a new code (sends expiryDate)
    const handleAddCode = async (e) => {
        e.preventDefault();
        if (!token) { setAddError("Auth error"); return; }
        setIsAdding(true); setAddError(""); setAddSuccess("");

        // Basic validation
        if (!newCodeData.code || !newCodeData.discountType || newCodeData.discountValue === "") {
            setAddError("Code, Type, and Value are required."); setIsAdding(false); return;
        }
        const valueNum = Number(newCodeData.discountValue);
        if (isNaN(valueNum) || valueNum < 0) {
             setAddError("Value must be a non-negative number."); setIsAdding(false); return;
        }

        // Prepare data payload, including optional expiry date
        const payload = {
             code: newCodeData.code,
             discountType: newCodeData.discountType,
             discountValue: valueNum,
             description: newCodeData.description,
             // Only include expiryDate in payload if it's set
             ...(newCodeData.expiryDate && { expiryDate: newCodeData.expiryDate })
        };
        console.log("Submitting payload:", payload); // Log payload

        try {
            const response = await axios.post('http://localhost:4000/api/promo/add',
                payload, // Send the prepared payload
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
                setAddSuccess("Promo code added!");
                // Clear form including expiry date
                setNewCodeData({ code: "", discountType: "percent", discountValue: "", description: "", expiryDate: "" });
                fetchPromoCodes(); // Refresh list
                 // Clear success message after a few seconds
                setTimeout(() => setAddSuccess(""), 3000);
            } else { setAddError(`Failed: ${response.data.message}`); }
        } catch (err) {
             console.error("Add promo error:", err.response || err); // Log full error
             setAddError(`Submit Error: ${err.response?.data?.message || err.message}`);
        }
        finally { setIsAdding(false); }
    };

    // Handler for removing a code (unchanged)
    const handleRemoveCode = async (codeId, codeName) => {
         if (!token) { alert("Auth error"); return; }
         if (window.confirm(`Delete promo code "${codeName}"?`)) {
             try {
                 const response = await axios.delete(`http://localhost:4000/api/promo/remove/${codeId}`, {
                     headers: { Authorization: `Bearer ${token}` }
                 });
                 if (response.data.success) {
                     alert("Code removed!");
                     fetchPromoCodes(); // Refresh list
                 } else { alert(`Error: ${response.data.message}`); }
             } catch (err) { alert(`Error: ${err.response?.data?.message || err.message}`); }
         }
    };

    // Helper to format date string
    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        try {
            return new Date(dateString).toLocaleDateString('en-CA'); // YYYY-MM-DD format
        } catch (e) {
            return 'Invalid Date';
        }
    };

    // --- JSX ---
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold mb-8">Manage Promo Codes</h1>

            {/* --- Add New Promo Code Form --- */}
            <form onSubmit={handleAddCode} className="mb-10 p-6 bg-white rounded-lg shadow space-y-4">
                <h2 className="text-xl font-semibold mb-4">Add New Code</h2>
                {/* Code & Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700">Code</label>
                        <input type="text" name="code" id="code" value={newCodeData.code} onChange={handleInputChange} required className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-black focus:border-black"/>
                     </div>
                     <div>
                        <label htmlFor="discountType" className="block text-sm font-medium text-gray-700">Discount Type</label>
                        <select name="discountType" id="discountType" value={newCodeData.discountType} onChange={handleInputChange} required className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-black focus:border-black">
                            <option value="percent">Percent (%)</option>
                            <option value="fixed">Fixed Amount (₹)</option>
                            <option value="shipping">Free Shipping</option>
                        </select>
                     </div>
                </div>
                 {/* Value & Description */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                       <label htmlFor="discountValue" className="block text-sm font-medium text-gray-700">Value</label>
                       <input type="number" name="discountValue" id="discountValue" value={newCodeData.discountValue} onChange={handleInputChange} required min="0" step={newCodeData.discountType === 'fixed' ? '0.01' : '1'} className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-black focus:border-black"/>
                       <p className="text-xs text-gray-500 mt-1">
                         {newCodeData.discountType === 'percent' ? 'Enter percentage (e.g., 10 for 10%)' :
                          newCodeData.discountType === 'fixed' ? 'Enter fixed amount (e.g., 50 for ₹50)' :
                          'Value represents shipping cost to deduct (e.g., 5 for ₹5)'}
                       </p>
                    </div>
                     <div>
                         <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                         <input type="text" name="description" id="description" value={newCodeData.description} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-black focus:border-black"/>
                     </div>
                </div>
                 {/* Expiry Date Input */}
                 <div>
                      <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">Expiry Date (Optional)</label>
                      <input
                          type="date"
                          name="expiryDate"
                          id="expiryDate"
                          value={newCodeData.expiryDate}
                          onChange={handleInputChange}
                          // Set min date to today to prevent selecting past dates
                          min={new Date().toISOString().split('T')[0]}
                          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-black focus:border-black"
                      />
                 </div>

                {/* Submit Area */}
                <div className="flex justify-end items-center gap-4 pt-4 border-t">
                    {/* Display Add Error/Success */}
                    {addError && <p className="text-sm text-red-600 mr-auto">{addError}</p>}
                    {addSuccess && <p className="text-sm text-green-600 mr-auto">{addSuccess}</p>}
                    <button type="submit" disabled={isAdding} className={`py-2 px-5 rounded-md text-white font-semibold transition-colors ${isAdding ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'}`}>
                        {isAdding ? 'Adding...' : 'Add Code'}
                    </button>
                </div>
            </form>


            {/* --- List Existing Promo Codes --- */}
            <h2 className="text-xl font-semibold mb-4 mt-10">Existing Codes</h2>
            {loading && <p className="text-center py-4">Loading codes...</p>}
            {error && !loading && <p className="text-center py-4 text-red-600">{error}</p>}
            {!loading && !error && (
                 <div className="overflow-x-auto bg-white rounded-lg shadow">
                     <table className="min-w-full border-collapse">
                         <thead className="bg-gray-50 border-b">
                             <tr>
                                 <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Code</th>
                                 <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                                 <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Value</th>
                                 <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Description</th>
                                 <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Expiry</th>
                                 <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Active</th>
                                 <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Action</th>
                             </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-200">
                             {codes.length > 0 ? (
                                 codes.map((code) => (
                                     <tr key={code._id} className="hover:bg-gray-50">
                                         <td className="py-3 px-4 text-sm font-mono font-medium text-gray-900">{code.code}</td>
                                         <td className="py-3 px-4 text-sm text-gray-500">{code.discountType}</td>
                                         <td className="py-3 px-4 text-sm text-gray-500">
                                            {code.discountType === 'percent' ? `${code.discountValue}%` :
                                             code.discountType === 'fixed' ? `₹${code.discountValue.toFixed(2)}` :
                                             `₹${code.discountValue.toFixed(2)} (Shipping)`}
                                         </td>
                                         <td className="py-3 px-4 text-sm text-gray-500 max-w-xs truncate" title={code.description}>{code.description || '-'}</td>
                                         {/* Expiry Date Cell */}
                                         <td className="py-3 px-4 text-sm text-gray-500">
                                             {formatDate(code.expiryDate)}
                                         </td>
                                         {/* Active Status Cell */}
                                         <td className="py-3 px-4 text-sm">
                                             <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${code.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                 {code.isActive ? 'Active' : 'Inactive'}
                                             </span>
                                             {/* Optionally show expired status */}
                                             {code.expiryDate && new Date(code.expiryDate) < new Date() && code.isActive &&
                                                <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Expired</span>
                                             }
                                         </td>
                                         {/* Action Cell */}
                                         <td className="py-3 px-4 text-sm">
                                             <button
                                                 onClick={() => handleRemoveCode(code._id, code.code)}
                                                 className="text-red-600 hover:text-red-800 p-1"
                                                 title="Remove Code"
                                             >
                                                 <IoTrashOutline size={18} />
                                             </button>
                                             {/* Add Edit/Deactivate button here later if needed */}
                                         </td>
                                     </tr>
                                 ))
                             ) : (
                                <tr><td colSpan="7" className="text-center py-10 text-gray-500">No promo codes found.</td></tr> // Updated colspan
                             )}
                         </tbody>
                     </table>
                 </div>
             )}
        </div>
    );
};

export default AdminPromoCodes;