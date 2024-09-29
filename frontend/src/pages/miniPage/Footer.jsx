import React from 'react';

function Footer() {
    return (
        <footer className='bg-gray-800 text-white py-4'>
            <div className='container mx-auto flex justify-between items-center'>
                <div className='flex space-x-4'>
                    <a href="/about" className='hover:underline'>About Us</a>
                    <a href="/privacy" className='hover:underline'>Privacy Policy</a>
                    <a href="/contact" className='hover:underline'>Contact Us</a>
                </div>
                <p className='text-sm'>&copy; {new Date().getFullYear()} Blog Bazzar. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
