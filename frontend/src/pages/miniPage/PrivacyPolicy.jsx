import React from 'react';

function PrivacyPolicy() {
    return (
        <div className='container mx-auto px-4 py-8'>
            <h1 className='text-3xl font-bold mb-4'>Privacy Policy</h1>
            <p>Your privacy is important to us. This privacy policy explains how we collect, use, and protect your information when you visit our website.</p>
            <h2 className='text-xl font-semibold mt-6'>Information We Collect</h2>
            <p>We may collect personal information that you provide to us, such as your name, email address, and any other details you submit through our forms.</p>
            <h2 className='text-xl font-semibold mt-6'>How We Use Your Information</h2>
            <p>Your information may be used to:</p>
            <ul className='list-disc list-inside'>
                <li>Improve our website and services.</li>
                <li>Send you updates and promotional materials.</li>
                <li>Respond to your inquiries and support needs.</li>
            </ul>
            <h2 className='text-xl font-semibold mt-6'>Data Protection</h2>
            <p>We implement a variety of security measures to maintain the safety of your personal information.</p>
            <h2 className='text-xl font-semibold mt-6'>Changes to Our Privacy Policy</h2>
            <p>We may update this privacy policy from time to time. Any changes will be posted on this page.</p>
        </div>
    );
}

export default PrivacyPolicy;
