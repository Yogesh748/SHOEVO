// import React, { useState, useEffect, useContext } from 'react';
// import axios from 'axios';
// import { useParams, useNavigate, Link } from 'react-router-dom'; // Import Link
// import { CartContext } from '../context/CartContext';
// import { IoArrowBack } from 'react-icons/io5'; // For back button

// const EditProduct = () => {
//     const { productId } = useParams(); // Get product ID from URL parameter
//     const navigate = useNavigate();
//     const { token } = useContext(CartContext);

//     // State for form data, image files, loading, messages
//     const [data, setData] = useState({
//         name: "", description: "", category: "Sneakers", price: "", audience: "Men", sizes: "",
//     });
//     const [currentImages, setCurrentImages] = useState([]); // Display existing images
//     const [newImages, setNewImages] = useState([]); // Store new FileList object for uploads
//     const [loading, setLoading] = useState(true); // Loading product data
//     const [submitting, setSubmitting] = useState(false); // Submitting update
//     const [message, setMessage] = useState(""); // Success message
//     const [error, setError] = useState(""); // Error messages (fetch or submit)

//     // Fetch existing product data when component mounts or productId changes
//     useEffect(() => {
//         const fetchProduct = async () => {
//             setError("");
//             setMessage(""); // Clear previous messages
//             setLoading(true);
//             if (!token) {
//                 setError("Authentication required to edit products.");
//                 setLoading(false);
//                 return;
//             }
//             if (!productId) {
//                  setError("Product ID is missing.");
//                  setLoading(false);
//                  return;
//             }

//             try {
//                 // Fetch data for the specific product using its _id
//                 const response = await axios.get(`http://localhost:4000/api/product/${productId}`);
//                 if (response.data.success) {
//                     const productData = response.data.data;
//                     // Pre-fill form state with fetched data
//                     setData({
//                         name: productData.name || '',
//                         description: productData.description || '',
//                         category: productData.category || 'Sneakers',
//                         price: productData.price?.toString() || '', // Convert number to string for input
//                         audience: productData.audience || 'Men',
//                         sizes: productData.sizes?.join(',') || '', // Convert array back to comma-separated string
//                     });
//                     setCurrentImages(productData.images || []); // Store existing image URLs
//                 } else {
//                     setError(`Failed to fetch product details: ${response.data.message}`);
//                 }
//             } catch (err) {
//                 setError(`Error fetching product: ${err.response?.data?.message || err.message}`);
//                 console.error("Fetch product error:", err);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchProduct();
//     }, [productId, token]); // Dependencies: re-fetch if ID or token changes


//     // Handler for text/select input changes
//     const onChangeHandler = (event) => {
//         const { name, value } = event.target;
//         setData(prevData => ({ ...prevData, [name]: value }));
//     };

//     // Handler for file input changes
//     const onImageChange = (event) => {
//          if (event.target.files) {
//             setNewImages(event.target.files); // Store the FileList
//          }
//     };

//     // Handle form submission for updating the product
//     const onSubmitHandler = async (event) => {
//         event.preventDefault();
//         setSubmitting(true);
//         setMessage("");
//         setError("");

//         // Basic client-side validation
//         if (!token) { setError("Authentication error."); setSubmitting(false); return; }
//         if (newImages.length > 4) { setError("Maximum 4 new images allowed."); setSubmitting(false); return; }
//         if (!data.name || !data.description || !data.category || !data.price || !data.audience || !data.sizes) { setError("Please fill in all required fields."); setSubmitting(false); return; }


//         // Create FormData to send data + potential new files
//         const formData = new FormData();
//         formData.append("name", data.name);
//         formData.append("description", data.description);
//         formData.append("category", data.category);
//         formData.append("price", Number(data.price));
//         formData.append("audience", data.audience);
//         formData.append("sizes", data.sizes);

//         // Append NEW image files if selected by the user
//         if (newImages && newImages.length > 0) {
//              for (let i = 0; i < newImages.length; i++) {
//                  // Key "images" must match the backend upload.array() name
//                  formData.append("images", newImages[i]);
//              }
//         }
//         // If no new images are selected, the backend logic keeps the old ones

//         try {
//             // Send PUT request to the update endpoint with product ID
//             const response = await axios.put(`http://localhost:4000/api/product/update/${productId}`, formData, {
//                 headers: {
//                   // Axios sets Content-Type for FormData automatically
//                   'Authorization': `Bearer ${token}` // Send authentication token
//                 }
//             });

//             if (response.data.success) {
//                 setMessage("Product updated successfully!");
//                 setCurrentImages(response.data.data.images); // Update current images if backend returns updated data
//                 setNewImages([]); // Clear new image selection
//                 const fileInput = document.getElementById('newImages'); // Reset file input
//                 if(fileInput) fileInput.value = "";
//                 // Optionally redirect back to list after a delay
//                 setTimeout(() => navigate('/admin/list'), 2000);
//             } else {
//                 setError(`Error updating product: ${response.data.message}`);
//             }
//         } catch (err) {
//             console.error("Error updating product:", err);
//              if (err.response?.status === 403) setError(`Error: Admin access required.`);
//              else setError(`Update Error: ${err.response?.data?.message || 'Could not connect to server.'}`);
//         } finally {
//             setSubmitting(false);
//         }
//     };


//     // --- Render Loading/Error or Form ---
//     if (loading) {
//         return <div className="text-center py-20"><p className="text-xl font-semibold">Loading product details...</p></div>;
//     }
//     // Show fetch error if loading is done and there was an error fetching data initially
//     if (error && !message && !submitting) {
//          return <div className="text-center py-20 text-red-600 font-semibold">{error}</div>;
//     }


//     // --- Render the Edit Form ---
//     return (
//         <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8"> {/* Increased max-width */}
//              <Link to="/admin/list" className="inline-flex items-center gap-2 mb-6 text-gray-600 hover:text-black transition-colors">
//                  <IoArrowBack />
//                  <span>Back to Product List</span>
//              </Link>
//             <h1 className="text-3xl font-bold mb-8 text-center">Edit Product</h1>

//             {/* Display Current Images */}
//             <div className="mb-6 bg-gray-50 p-4 rounded-md">
//                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Images</label>
//                  <div className="flex flex-wrap gap-3">
//                      {currentImages && currentImages.length > 0 ? (
//                         currentImages.map((imgUrl, index) => (
//                             <img key={index} src={imgUrl} alt={`Current ${index+1}`} className="w-24 h-24 object-cover rounded border shadow-sm"/>
//                         ))
//                      ) : (
//                          <p className="text-sm text-gray-500">No current images found for this product.</p>
//                      )}
//                  </div>
//             </div>

//             {/* Edit Form */}
//             <form onSubmit={onSubmitHandler} className="space-y-6 bg-white p-8 rounded-lg shadow">
//                  {/* Name Input */}
//                  <div>
//                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
//                      <input type="text" name="name" id="name" value={data.name} onChange={onChangeHandler} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-black focus:border-black" />
//                  </div>

//                 {/* Description Textarea */}
//                 <div>
//                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
//                      <textarea name="description" id="description" value={data.description} onChange={onChangeHandler} required rows="4" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-black focus:border-black"></textarea>
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
//                          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price ($)</label>
//                          <input type="number" name="price" id="price" value={data.price} onChange={onChangeHandler} required min="0" step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-black focus:border-black" />
//                     </div>
//                 </div>

//                 {/* Audience & Sizes */}
//                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                      <div>
//                          <label htmlFor="audience" className="block text-sm font-medium text-gray-700">Audience</label>
//                          <select name="audience" id="audience" value={data.audience} onChange={onChangeHandler} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white focus:ring-black focus:border-black">
//                              <option value="Men">Men</option>
//                              <option value="Women">Women</option>
//                              <option value="Kids">Kids</option>
//                          </select>
//                      </div>
//                      <div>
//                          <label htmlFor="sizes" className="block text-sm font-medium text-gray-700">Sizes (comma-separated)</label>
//                          <input type="text" name="sizes" id="sizes" value={data.sizes} onChange={onChangeHandler} required placeholder="e.g., 8,9,10,11" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-black focus:border-black" />
//                      </div>
//                  </div>

//                 {/* NEW Image Upload */}
//                 <div>
//                     <label htmlFor="newImages" className="block text-sm font-medium text-gray-700">Upload New Images (Optional - Replaces Old)</label>
//                     <input
//                         type="file"
//                         name="images" // Name matches backend expectation
//                         id="newImages" // Unique ID for the file input
//                         onChange={onImageChange}
//                         multiple // Allow selecting multiple files
//                         accept="image/jpeg, image/png, image/jpg, image/avif, image/webp" // Specify accepted types
//                         className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
//                     />
//                      {/* Display names of selected NEW files */}
//                      {newImages && newImages.length > 0 && (
//                         <div className="text-xs text-gray-500 mt-1">
//                             New files selected: ({newImages.length}) {Array.from(newImages).map(file => file.name).join(', ')}
//                         </div>
//                      )}
//                      <p className="text-xs text-gray-500 mt-1">If you upload new images, the existing ones will be replaced.</p>
//                 </div>

//                 {/* Submit Button */}
//                 <div>
//                     <button
//                         type="submit"
//                         disabled={submitting}
//                         className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black'}`}
//                     >
//                         {submitting ? 'Updating...' : 'Update Product'}
//                     </button>
//                 </div>

//                 {/* Messages */}
//                 {message && <p className="text-sm text-center mt-4 text-green-600">{message}</p>}
//                 {/* Show submit error preferentially over fetch error if submitting */}
//                 {error && !message && <p className="text-sm text-center mt-4 text-red-600">{error}</p>}
//             </form>
//         </div>
//     );
// };

// export default EditProduct;

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { IoArrowBack } from 'react-icons/io5';

const EditProduct = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { token } = useContext(CartContext);

    const [data, setData] = useState({
        name: "", description: "", category: "Sneakers", price: "", audience: "Men", sizes: "",
        stock: "0", isFeatured: false, isTrending: false
    });
    const [currentImages, setCurrentImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Fetch existing product data
    useEffect(() => {
        const fetchProduct = async () => {
            setError(""); setMessage(""); setLoading(true);
            if (!token) { setError("Auth required."); setLoading(false); return; }
            if (!productId) { setError("ID missing."); setLoading(false); return; }
            try {
                const response = await axios.get(`http://localhost:4000/api/product/${productId}`);
                if (response.data.success) {
                    const productData = response.data.data;
                    setData({
                        name: productData.name || '',
                        description: productData.description || '',
                        category: productData.category || 'Sneakers',
                        price: productData.price?.toString() || '',
                        audience: productData.audience || 'Men',
                        sizes: productData.sizes?.join(',') || '',
                        stock: productData.stock?.toString() || '0',
                        isFeatured: productData.isFeatured || false,
                        isTrending: productData.isTrending || false
                    });
                    setCurrentImages(productData.images || []);
                } else { setError(`Fetch failed: ${response.data.message}`); }
            } catch (err) { setError(`Fetch Error: ${err.response?.data?.message || err.message}`); }
            finally { setLoading(false); }
        };
        fetchProduct();
    }, [productId, token]);


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
            setNewImages(event.target.files);
        }
    };

    // Handle update submission
    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setSubmitting(true); setMessage(""); setError("");

        if (!token) { setError("Auth error."); setSubmitting(false); return; }
        if (newImages.length > 4) { setError("Max 4 new images."); setSubmitting(false); return; }
        const stockNum = Number(data.stock);
        if (isNaN(stockNum) || stockNum < 0) { setError("Stock must be non-negative."); setSubmitting(false); return; }
        if (!data.name || !data.description || !data.category || !data.price || !data.audience || !data.sizes) { setError("Please fill required fields."); setSubmitting(false); return; }

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("category", data.category);
        formData.append("price", Number(data.price));
        formData.append("audience", data.audience);
        formData.append("sizes", data.sizes);
        formData.append("stock", stockNum);
        formData.append("isFeatured", data.isFeatured);
        formData.append("isTrending", data.isTrending);

        if (newImages && newImages.length > 0) {
            for (let i = 0; i < newImages.length; i++) { formData.append("images", newImages[i]); }
        }

        try {
            const response = await axios.put(`http://localhost:4000/api/product/update/${productId}`, formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data.success) {
                setMessage("Product updated successfully!");
                setCurrentImages(response.data.data.images);
                setNewImages([]);
                const fileInput = document.getElementById('newImages');
                if (fileInput) fileInput.value = "";
                setTimeout(() => navigate('/admin/list'), 2000);
            } else { setError(`Update Error: ${response.data.message}`); }
        } catch (err) {
            if (err.response?.status === 403) setError(`Error: Admin access required.`);
            else setError(`Update Error: ${err.response?.data?.message || 'Could not connect.'}`);
        } finally { setSubmitting(false); }
    };


    if (loading) { return <div className="text-center py-20"><p className="text-xl font-semibold">Loading product details...</p></div>; }
    if (error && !message && !submitting) { return <div className="text-center py-20 text-red-600 font-semibold">{error}</div>; }


    return (
        <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <Link to="/admin/list" className="inline-flex items-center gap-2 mb-6 text-gray-600 hover:text-black transition-colors">
                <IoArrowBack />
                <span>Back to Product List</span>
            </Link>
            <h1 className="text-3xl font-bold mb-8 text-center">Edit Product</h1>

            <div className="mb-6 bg-gray-50 p-4 rounded-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Images</label>
                <div className="flex flex-wrap gap-3">
                    {currentImages && currentImages.length > 0 ? (
                        currentImages.map((imgUrl, index) => (
                            <img key={index} src={imgUrl} alt={`Current ${index + 1}`} className="w-24 h-24 object-cover rounded border shadow-sm" />
                        ))
                    ) : (<p className="text-sm text-gray-500">No current images.</p>)}
                </div>
            </div>

            <form onSubmit={onSubmitHandler} className="space-y-6 bg-white p-8 rounded-lg shadow">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
                    <input type="text" name="name" id="name" value={data.name} onChange={onChangeHandler} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-black focus:border-black" />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea name="description" id="description" value={data.description} onChange={onChangeHandler} required rows="4" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-black focus:border-black"></textarea>
                </div>
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
                <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock Quantity</label>
                    <input type="number" name="stock" id="stock" value={data.stock} onChange={onChangeHandler} required min="0" step="1" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-black focus:border-black" />
                </div>

                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="highlightType"
                            id="isFeatured"
                            checked={data.isFeatured && !data.isTrending}
                            onChange={() => setData(prev => ({ ...prev, isFeatured: true, isTrending: false }))}
                            className="h-4 w-4 text-black border-gray-300 focus:ring-black"
                        />
                        <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">
                            Mark as Featured
                        </label>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="highlightType"
                            id="isTrending"
                            checked={data.isTrending && !data.isFeatured}
                            onChange={() => setData(prev => ({ ...prev, isFeatured: false, isTrending: true }))}
                            className="h-4 w-4 text-black border-gray-300 focus:ring-black"
                        />
                        <label htmlFor="isTrending" className="text-sm font-medium text-gray-700">
                            Mark as Trending
                        </label>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="highlightType"
                            id="none"
                            checked={!data.isFeatured && !data.isTrending}
                            onChange={() => setData(prev => ({ ...prev, isFeatured: false, isTrending: false }))}
                            className="h-4 w-4 text-black border-gray-300 focus:ring-black"
                        />
                        <label htmlFor="none" className="text-sm font-medium text-gray-700">
                            None
                        </label>
                    </div>
                </div>


                <div>
                    <label htmlFor="newImages" className="block text-sm font-medium text-gray-700">Upload New Images (Optional - Replaces Old)</label>
                    <input
                        type="file"
                        name="images"
                        id="newImages"
                        onChange={onImageChange}
                        multiple
                        accept="image/jpeg, image/png, image/jpg, image/avif, image/webp"
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                    />
                    {newImages && newImages.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                            New: ({newImages.length} files) {Array.from(newImages).map(file => file.name).join(', ')}
                        </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Uploading new images will replace all current images.</p>
                </div>
                <div>
                    <button
                        type="submit"
                        disabled={submitting}
                        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black'}`}
                    >
                        {submitting ? 'Updating...' : 'Update Product'}
                    </button>
                </div>
                {message && <p className="text-sm text-center mt-4 text-green-600 font-semibold">{message}</p>}
                {error && !message && <p className="text-sm text-center mt-4 text-red-600 font-semibold">{error}</p>}
            </form>
        </div>
    );
};
export default EditProduct;
