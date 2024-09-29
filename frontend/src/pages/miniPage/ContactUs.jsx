import React, { useState } from 'react';

function ContactUs() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic (e.g., send an email or save to database)
        console.log(formData);
        alert("Message sent!");
    };

    return (
        <div className='container mx-auto px-4 py-8'>
            <h1 className='text-3xl font-bold mb-4'>Contact Us</h1>
            <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                    <label className='block mb-2'>Name:</label>
                    <input
                        type='text'
                        name='name'
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className='w-full p-2 border border-gray-300 rounded'
                    />
                </div>
                <div>
                    <label className='block mb-2'>Email:</label>
                    <input
                        type='email'
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className='w-full p-2 border border-gray-300 rounded'
                    />
                </div>
                <div>
                    <label className='block mb-2'>Message:</label>
                    <textarea
                        name='message'
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className='w-full p-2 border border-gray-300 rounded'
                    />
                </div>
                <button type='submit' className='bg-blue-500 text-white py-2 px-4 rounded'>
                    Send Message
                </button>
            </form>
        </div>
    );
}

export default ContactUs;
