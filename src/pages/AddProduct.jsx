// import React, { useState, useContext } from 'react';
// import axios from 'axios';
// import { CartContext } from '../context/CartContext'; // Import CartContext to get token

// const AddProduct = () => {
//     const { token } = useContext(CartContext); // Get token for authorization
//     const [data, setData] = useState({
//         name: "",
//         description: "", // Added description field
//         category: "Sneakers", // Default category
//         price: "",
//         audience: "Men", // Default audience
//         sizes: "", // Will be comma-separated
//     });
//     const [images, setImages] = useState([]); // State for multiple File objects
//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState("");

//     // Handles changes in text inputs, textarea, and selects
//     const onChangeHandler = (event) => {
//         const { name, value } = event.target;
//         setData(prevData => ({ ...prevData, [name]: value }));
//     };

//     // Handles changes in the file input
//     const onImageChange = (event) => {
//         if (event.target.files) {
//             // event.target.files is a FileList, store it directly
//             setImages(event.target.files);
//         }
//     };

//     // Handles form submission
//     const onSubmitHandler = async (event) => {
//         event.preventDefault();
//         setLoading(true);
//         setMessage("");

//         // Basic validation
//         if (!images || images.length === 0) {
//             setMessage("Please select at least one image file.");
//             setLoading(false);
//             return;
//         }
//         if (images.length > 4) {
//              setMessage("You can upload a maximum of 4 images.");
//              setLoading(false);
//              return;
//         }
//          if (!token) {
//              setMessage("Error: Authentication required. Please log in again.");
//              setLoading(false);
//              return;
//          }
//          if (!data.name || !data.description || !data.category || !data.price || !data.audience || !data.sizes) {
//               setMessage("Error: Please fill in all required fields.");
//               setLoading(false);
//               return;
//          }


//         // Use FormData to send both text data and multiple files
//         const formData = new FormData();
//         formData.append("name", data.name);
//         formData.append("description", data.description);
//         formData.append("category", data.category);
//         formData.append("price", Number(data.price)); // Send price as number
//         formData.append("audience", data.audience);
//         formData.append("sizes", data.sizes); // Send sizes as comma-separated string

//         // Append each file under the field name "images"
//         for (let i = 0; i < images.length; i++) {
//             formData.append("images", images[i]);
//         }

//         try {
//             // Send the POST request to the backend endpoint
//             const response = await axios.post('http://localhost:4000/api/product/add', formData, {
//                 headers: {
//                   // Axios sets Content-Type automatically for FormData
//                   'Authorization': `Bearer ${token}` // Include the auth token
//                 }
//             });

//             if (response.data.success) {
//                 setMessage("Product added successfully!");
//                 // Reset the form fields and image state
//                 setData({ name: "", description: "", category: "Sneakers", price: "", audience: "Men", sizes: "" });
//                 setImages([]);
//                 // Reset the file input visually
//                 const fileInput = document.getElementById('images');
//                 if(fileInput) fileInput.value = "";
//             } else {
//                 // Display error message from the backend
//                 setMessage(`Error: ${response.data.message}`);
//             }
//         } catch (error) {
//             // Handle network errors or errors from the backend
//             console.error("Error submitting form:", error);
//              if (error.response?.status === 403) {
//                  setMessage(`Error: Admin access required.`);
//              } else {
//                 setMessage(`Error: ${error.response?.data?.message || 'Could not connect to server or server error'}`);
//              }
//         } finally {
//             // Stop the loading indicator
//             setLoading(false);
//         }
//     };

//     // --- JSX for the form ---
//     return (
//         <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
//             <h1 className="text-3xl font-bold mb-8 text-center">Add New Product</h1>
//             <form onSubmit={onSubmitHandler} className="space-y-6 bg-white p-8 rounded-lg shadow"> {/* Added background and padding */}
//                 {/* Product Name */}
//                 <div>
//                     <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
//                     <input type="text" name="name" id="name" value={data.name} onChange={onChangeHandler} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-black focus:border-black" />
//                 </div>

//                 {/* Description */}
//                 <div>
//                     <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
//                     <textarea name="description" id="description" value={data.description} onChange={onChangeHandler} required rows="4" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-black focus:border-black"></textarea>
//                 </div>

//                 {/* Category & Price */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div>
//                         <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
//                         <select name="category" id="category" value={data.category} onChange={onChangeHandler} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white focus:ring-black focus:border-black">
//                             <option value="Sneakers">Sneakers</option>
//                             <option value="Formal">Formal</option>
//                             <option value="Running">Running</option>
//                             <option value="Casual">Casual</option>
//                             <option value="Boots">Boots</option>
//                         </select>
//                     </div>
//                     <div>
//                         <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price ($)</label>
//                         <input type="number" name="price" id="price" value={data.price} onChange={onChangeHandler} required min="0" step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-black focus:border-black" />
//                     </div>
//                 </div>

//                 {/* Audience & Sizes */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div>
//                         <label htmlFor="audience" className="block text-sm font-medium text-gray-700">Audience</label>
//                         <select name="audience" id="audience" value={data.audience} onChange={onChangeHandler} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white focus:ring-black focus:border-black">
//                             <option value="Men">Men</option>
//                             <option value="Women">Women</option>
//                             <option value="Kids">Kids</option>
//                         </select>
//                     </div>
//                     <div>
//                         <label htmlFor="sizes" className="block text-sm font-medium text-gray-700">Sizes (comma-separated)</label>
//                         <input type="text" name="sizes" id="sizes" value={data.sizes} onChange={onChangeHandler} required placeholder="e.g., 8,9,10,11" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-black focus:border-black" />
//                     </div>
//                 </div>

//                 {/* Image Upload */}
//                 <div>
//                     <label htmlFor="images" className="block text-sm font-medium text-gray-700">Product Images (Up to 4)</label>
//                     <input
//                         type="file"
//                         name="images"
//                         id="images" // Correct ID for resetting
//                         onChange={onImageChange}
//                         required
//                         multiple // Allow multiple files
//                         accept="image/jpeg, image/png, image/jpg, image/avif, image/webp" // Specify accepted types
//                         className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" // Added cursor-pointer
//                     />
//                      {/* Display names of selected files */}
//                      {images && images.length > 0 && (
//                         <div className="text-xs text-gray-500 mt-1">
//                             Selected: ({images.length} files) {Array.from(images).map(file => file.name).join(', ')}
//                         </div>
//                      )}
//                 </div>

//                 {/* Submit Button */}
//                 <div>
//                     <button
//                         type="submit"
//                         disabled={loading}
//                         className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black'}`}
//                     >
//                         {loading ? 'Adding...' : 'Add Product'}
//                     </button>
//                 </div>

//                 {/* Message Area */}
//                 {message && <p className={`text-sm text-center mt-4 ${message.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}
//             </form>
//         </div>
//     );
// };

// export default AddProduct;

import React, { useState, useContext } from 'react';
import axios from 'axios';
import { CartContext } from '../context/CartContext';

const AddProduct = () => {
    const { token } = useContext(CartContext);
    const [data, setData] = useState({
        name: "",
        description: "",
        category: "Sneakers",
        price: "",
        audience: "Men",
        sizes: "",
        stock: "",
        isFeatured: false, // Added state
        isTrending: false  // Added state
    });
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Universal change handler for inputs, textareas, selects, and checkboxes
    const onChangeHandler = (event) => {
        const { name, value, type, checked } = event.target;
        setData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const onImageChange = (event) => {
        if (event.target.files) {
            setImages(event.target.files);
        }
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setLoading(true);
        setMessage("");

        if (!images || images.length === 0) { setMessage("Select image(s)."); setLoading(false); return; }
        if (images.length > 4) { setMessage("Max 4 images."); setLoading(false); return; }
        if (!token) { setMessage("Auth error."); setLoading(false); return; }
        const stockNum = Number(data.stock);
        if (isNaN(stockNum) || stockNum < 0) { setMessage("Stock must be non-negative."); setLoading(false); return; }
        if (!data.name || !data.description || !data.category || !data.price || !data.audience || !data.sizes) {
              setMessage("Error: Please fill in all required fields.");
              setLoading(false);
              return;
         }

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("category", data.category);
        formData.append("price", Number(data.price));
        formData.append("audience", data.audience);
        formData.append("sizes", data.sizes);
        formData.append("stock", stockNum);
        formData.append("isFeatured", data.isFeatured); // Append boolean
        formData.append("isTrending", data.isTrending); // Append boolean

        for (let i = 0; i < images.length; i++) {
            formData.append("images", images[i]);
        }

        try {
            const response = await axios.post('http://localhost:4000/api/product/add', formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.success) {
                setMessage("Product added successfully!");
                // Reset form completely
                setData({ name: "", description: "", category: "Sneakers", price: "", audience: "Men", sizes: "", stock: "", isFeatured: false, isTrending: false });
                setImages([]);
                const fileInput = document.getElementById('images');
                if(fileInput) fileInput.value = "";
                setTimeout(() => setMessage(""), 3000);
            } else { setMessage(`Error: ${response.data.message}`); }
        } catch (error) {
             if (error.response?.status === 403) setMessage(`Error: Admin access required.`);
             else setMessage(`Error: ${error.response?.data?.message || 'Server error'}`);
        } finally { setLoading(false); }
    };

    return (
        <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Add New Product</h1>
            <form onSubmit={onSubmitHandler} className="space-y-6 bg-white p-8 rounded-lg shadow">
                {/* Product Name */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
                    <input type="text" name="name" id="name" value={data.name} onChange={onChangeHandler} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-black focus:border-black" />
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea name="description" id="description" value={data.description} onChange={onChangeHandler} required rows="4" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-black focus:border-black"></textarea>
                </div>

                {/* Category & Price */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                        <select name="category" id="category" value={data.category} onChange={onChangeHandler} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white focus:ring-black focus:border-black">
                            <option value="Sneakers">Sneakers</option>
                            <option value="Formal">Formal</option>
                            <option value="Running">Running</option>
                            <option value="Casual">Casual</option>
                            <option value="Boots">Boots</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (₹)</label>
                        <input type="number" name="price" id="price" value={data.price} onChange={onChangeHandler} required min="0" step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-black focus:border-black" />
                    </div>
                </div>

                {/* Audience & Sizes */}
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                         <label htmlFor="audience" className="block text-sm font-medium text-gray-700">Audience</label>
                         <select name="audience" id="audience" value={data.audience} onChange={onChangeHandler} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white focus:ring-black focus:border-black">
                             <option value="Men">Men</option>
                             <option value="Women">Women</option>
                             <option value="Kids">Kids</option>
                         </select>
                     </div>
                     <div>
                         <label htmlFor="sizes" className="block text-sm font-medium text-gray-700">Sizes (comma-separated)</label>
                         <input type="text" name="sizes" id="sizes" value={data.sizes} onChange={onChangeHandler} required placeholder="e.g., 8,9,10" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-black focus:border-black" />
                     </div>
                 </div>

                {/* Stock Input */}
                <div>
                     <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock Quantity</label>
                     <input type="number" name="stock" id="stock" value={data.stock} onChange={onChangeHandler} required min="0" step="1" placeholder='e.g., 50' className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-black focus:border-black" />
                </div>

                {/* Checkboxes */}
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="isFeatured"
                            id="isFeatured"
                            checked={data.isFeatured}
                            onChange={onChangeHandler}
                            className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
                        />
                        <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">Mark as Featured</label>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="isTrending"
                            id="isTrending"
                            checked={data.isTrending}
                            onChange={onChangeHandler}
                            className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
                        />
                        <label htmlFor="isTrending" className="text-sm font-medium text-gray-700">Mark as Trending</label>
                    </div>
                </div>

                {/* Image Upload */}
                <div>
                    <label htmlFor="images" className="block text-sm font-medium text-gray-700">Product Images (Up to 4)</label>
                    <input type="file" name="images" id="images" onChange={onImageChange} required multiple accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"/>
                     {images && images.length > 0 && ( <div className="text-xs text-gray-500 mt-1"> Selected: ({images.length} files) {Array.from(images).map(file => file.name).join(', ')} </div> )}
                </div>

                {/* Submit Button */}
                <div>
                    <button type="submit" disabled={loading} className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black'}`}>
                        {loading ? 'Adding...' : 'Add Product'}
                    </button>
                </div>

                {/* Message Area */}
                {message && <p className={`text-sm text-center mt-4 ${message.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}
            </form>
        </div>
    );
};
export default AddProduct;