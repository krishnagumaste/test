import { useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import ip from './ip';

// Function to generate a unique 7-digit ID
const generateUniqueId = () => Math.floor(Math.random() * 9000000) + 1000000; // Generates a 7-digit number

export default function EditProductDialog({ isOpen, onClose, product }) {
    const [formData, setFormData] = useState({
        name: product.name,
        details: product.details,
        endDate: product.endDate,
        imageSrc: product.imageSrc,
    });

    const [file, setFile] = useState(null);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            let imageUrl = formData.imageSrc; // Default to the existing imageSrc
            // Generate a random 7-digit number and rename the file
            const randomId = generateUniqueId().toString();
            const newFileName = `${randomId}.jpeg`;
    
            if (file) {
    
                // Create a new File object with the new name
                const renamedFile = new File([file], newFileName, { type: file.type });
    
                // Step 1: Get presigned URL for the file upload
                const { data } = await axios.post(ip + '/geturl', { image: renamedFile.name }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
    
                const { url } = data;
    
                // Step 2: Upload the file to S3 using the presigned URL
                await axios.put(url, renamedFile, {
                    headers: {
                        'Content-Type': renamedFile.type,
                    },
                });
    
                // Step 3: Update the form data with the S3 image URL (remove query params)
                imageUrl = url.split('?')[0];
            }
    
            // Step 4: Send the updated product details to the backend
            const response = await axios.post(ip + '/edit', {
                _id: product._id,
                name: formData.name,
                details: formData.details,
                endDate: formData.endDate.toString(),
                imageSrc: newFileName, // Use the new image URL or the existing one
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
    
            // Step 5: Handle successful response
            if (response.status === 200) {
                alert('Product updated successfully!');
                onClose(); // Close the dialog after a successful update
            } else {
                alert('Failed to update the product. Please try again.');
            }
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Failed to update the product. Please try again.');
        }
    };
    

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-10">
            <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center px-4 py-8">
                    <DialogPanel className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
                        >
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Product Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        id="endDate"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        required
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label htmlFor="details" className="block text-sm font-medium text-gray-700">
                                        Details
                                    </label>
                                    <textarea
                                        id="details"
                                        name="details"
                                        rows={4}
                                        value={formData.details}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="imageSrc" className="block text-sm font-medium text-gray-700">
                                        Product Image
                                    </label>
                                    <input
                                        type="file"
                                        id="imageSrc"
                                        name="imageSrc"
                                        onChange={handleFileChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-x-6 mt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="text-sm font-semibold text-gray-900"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-500"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}