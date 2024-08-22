import { PaperClipIcon } from '@heroicons/react/20/solid'
import { useState, useEffect } from "react";
import axios from 'axios';

export default function Userinfo() {
  const [userData, setUserData] = useState();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch user information and products from the backend
        const response = await axios.post(
          'http://localhost:3000/userpageinfo',
          {},
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        // Update state with the fetched user data
        setUserData(response.data);
        
      } catch (error) {
        console.error('Error fetching user information:', error);
      }
    };

    fetchUserInfo();
  }, []);

  if (!userData) {
    return <div>Loading...</div>;
  }

  const { user, products, currentProducts } = userData;

  const handleDelete = async (_id) => {
    const confirmation = window.confirm('Are you sure you want to delete this auction item?');
    
    if (confirmation) {
      try {
        const token = localStorage.getItem('token');
  
        // Fetch user information and products from the backend
        const response = await axios.post(
          'http://localhost:3000/cancelbid',
          { _id: _id },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
  
        alert('Auction item deleted successfully!');
        
        // Refresh the page after deletion
        window.location.reload();
      } catch (error) {
        alert('Failed to delete the auction item.');
        console.error('Error deleting item:', error);
      }
    }
  }
  

  return (
    <div className='mx-10'>
      <div className="px-4 sm:px-0">
        <h3 className="text-base font-semibold leading-7 text-gray-900">User Information</h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Personal details</p>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Full name</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{user.username}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Email address</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{user.email}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Products Bidded</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <ul role="list" className="divide-y divide-gray-100 rounded-md border border-gray-200">
                {products.map(product => (
                  <li key={product._id} className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                    <div className="flex w-0 flex-1 items-center">
                      <PaperClipIcon aria-hidden="true" className="h-5 w-5 flex-shrink-0 text-gray-400" />
                      <div className="ml-4 flex min-w-0 flex-1 gap-2">
                        <span className="truncate font-medium">{product.name}</span>
                        <span className="flex-shrink-0 text-gray-400">Bid Price: {product.bidPrice}</span>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <a href={`/iteminfo/${product._id}`} className="font-medium text-indigo-600 hover:text-indigo-500">
                        View Details
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Your Products</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <ul role="list" className="divide-y divide-gray-100 rounded-md border border-gray-200">
                {currentProducts.map(product => (
                  <li key={product._id} className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                    <div className="flex w-0 flex-1 items-center">
                      <PaperClipIcon aria-hidden="true" className="h-5 w-5 flex-shrink-0 text-gray-400" />
                      <div className="ml-4 flex min-w-0 flex-1 gap-2">
                        <span className="truncate font-medium">{product.name}</span>
                        <span className="flex-shrink-0 text-gray-400">Bid Price: {product.bidPrice}</span>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <a href={`/iteminfo/${product._id}`} className="font-medium text-indigo-600 hover:text-indigo-500">
                        View Details
                      </a>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <a href={`/iteminfo/${product._id}`} className="font-medium text-indigo-600 hover:text-indigo-500">
                        Edit
                      </a>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <button onClick={() => handleDelete(product._id)} className="font-medium text-red-600 hover:text-red-500">
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
