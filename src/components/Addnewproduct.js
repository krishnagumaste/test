import { useState, useEffect } from 'react';
import axios from 'axios';
import ip from './ip';
// Function to generate a unique 7-digit ID
const generateUniqueId = () => Math.floor(Math.random() * 9000000) + 1000000; // Generates a 7-digit number

export default function Addnewproduct() {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    bidPrice: '',
    imageSrc: '',
    imageAlt: '',
    details: '',
    endDate: '',
  });

  const [file, setFile] = useState(null); // State for the image file

  useEffect(() => {
    // Generate a unique ID when the component mounts
    setFormData((prevFormData) => ({
      ...prevFormData,
      id: generateUniqueId().toString(),
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (file) {
      try {
        const token = localStorage.getItem('token');
        
        // Generate a random 7-digit number and rename the file
        const randomId = generateUniqueId().toString();
        const newFileName = `${randomId}.jpeg`;
        
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
            'Content-Type': renamedFile.type, // Ensure the correct content type is set
          },
        });
  
        // Step 3: Update the form data with the S3 image URL (remove query params)
        const imageUrl = url.split('?')[0];
        setFormData((prevFormData) => ({ ...prevFormData, imageSrc: imageUrl }));
  
        // Step 4: Submit the auction item with the new image URL
        await axios.post(ip + '/newproduct', {
          id: formData.id,
          name: formData.name,
          bidPrice: "$" + formData.bidPrice,
          imageSrc: newFileName,
          imageAlt: formData.imageAlt,
          details: formData.details,
          endDate: formData.endDate.toString(),
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
  
        alert('Auction item added successfully!');
        // Reset the form
        setFormData({
          id: '',
          name: '',
          bidPrice: '',
          imageSrc: '',
          imageAlt: '',
          details: '',
          endDate: '',
        });
        setFile(null); // Clear the file input
      } catch (error) {
        console.error('Error adding auction item:', error);
        alert('Error adding auction item. Please try again.');
      }
    } else {
      alert('Please select an image file.');
    }
  };  

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Add Auction Item</h2>
      <form onSubmit={handleSubmit} className="space-y-6">

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-900">
            Product Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="bidPrice" className="block text-sm font-medium text-gray-900">
            Starting Bid Price
          </label>
          <input
            id="bidPrice"
            name="bidPrice"
            type="number"
            placeholder="Starting Bid Price"
            value={formData.bidPrice}
            onChange={handleChange}
            className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="details" className="block text-sm font-medium text-gray-900">
            Details
          </label>
          <textarea
            id="details"
            name="details"
            rows={4}
            placeholder="Product details"
            value={formData.details}
            onChange={handleChange}
            className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-900">
            End Date
          </label>
          <input
            id="endDate"
            name="endDate"
            type="date" // Changed to date to exclude time
            value={formData.endDate}
            onChange={handleChange}
            className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="imageSrc" className="block text-sm font-medium text-gray-900">
            Product Image
          </label>
          <input
            id="imageSrc"
            name="imageSrc"
            type="file"
            onChange={handleFileChange}
            className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="imageAlt" className="block text-sm font-medium text-gray-900">
            Image Alt Text
          </label>
          <input
            id="imageAlt"
            name="imageAlt"
            type="text"
            placeholder="Alt text for image"
            value={formData.imageAlt}
            onChange={handleChange}
            className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div className="flex justify-end gap-x-6 mt-4">
          <button
            type="button"
            className="text-sm font-semibold text-gray-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-500"
          >
            Add Auction Item
          </button>
        </div>
      </form>
    </div>
  );
}