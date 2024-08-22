import { useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function BidDialog({ isOpen, onClose, _id, name, endDate, bidPrice, bidHistory, imageUrl }) {
    const [newBid, setNewBid] = useState('');
    const [error, setError] = useState('');

    const handleBidChange = (e) => {
        const value = e.target.value;
        setNewBid(value);

        // Validate that the new bid is greater than the current bid
        if (Number(value) <= Number(bidPrice.replace('$', ''))) {
            setError(`Bid must be greater than the current bid of ${bidPrice}`);
        } else {
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        console.log(_id);
        e.preventDefault();
        if (error) return; // Prevent submission if there's an error

        try {
            const token = localStorage.getItem('token');

            const response = await fetch('http://localhost:3000/placebid', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ _id, bidValue: `$${newBid}` }), // Formatting the bidValue with a dollar sign
            });

            if (!response.ok) {
                throw new Error('Failed to place bid');
            }

            const updatedProduct = await response.json();
            console.log('Bid placed successfully:', updatedProduct);

            onClose(); // Close the dialog after a successful bid
        } catch (error) {
            console.error('Error placing bid:', error);
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <img src={imageUrl} alt={name} className="object-cover rounded-lg" />
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
                                <p className="text-gray-500 mt-2">Ends on: {endDate}</p>
                                <p className="text-xl font-medium text-gray-900 mt-4">Current Bid: {bidPrice}</p>
                                <form className="mt-6">
                                    <label htmlFor="bid" className="block text-sm font-medium text-gray-700">
                                        Your Bid (must be greater than {bidPrice})
                                    </label>
                                    <input
                                        type="number"
                                        id="bid"
                                        name="bid"
                                        value={newBid}
                                        onChange={handleBidChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        required
                                    />
                                    {error && (
                                        <p className="mt-2 text-sm text-red-600">{error}</p>
                                    )}
                                    <button
                                        onClick={handleSubmit}
                                        className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                                        disabled={Boolean(error)} // Disable button if there's an error
                                    >
                                        Place Bid
                                    </button>
                                </form>
                                <div className="mt-6">
                                    <h3 className="font-medium text-gray-900">Bid History</h3>
                                    <ul className="mt-2 space-y-2">
                                        {bidHistory && bidHistory.slice().reverse().map((bid) => (
                                            <li key={bid._id} className="text-sm text-gray-500">
                                                {bid.username}: {bid.bidPrice}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}