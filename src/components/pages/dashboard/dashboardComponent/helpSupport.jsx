import React, { useState } from 'react'
import Input from '../../../../utils/input';
import Textarea from '../../../../utils/textarea';

const HelpSupport = () => {
    const [supportData, setSupportData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleInputChange = (value, fieldName) => {
        // Convert fieldName to match our state keys
        const field = fieldName.toLowerCase().replace(' ', '');
        
        setSupportData(prev => ({
            ...prev,
            [field]: value
        }));
    };



    const handleSend = () => {
        // Add validation
        if (!supportData.name.trim()) {
            alert('Please enter your name');
            return;
        }
        
        if (!supportData.email.trim()) {
            alert('Please enter your email');
            return;
        }
        
        if (!supportData.message.trim()) {
            alert('Please enter your message');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(supportData.email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        console.log('Support request sent:', supportData);
        
        // Add your support request logic here
        // Reset form after successful submission
        setSupportData({
            name: '',
            email: '',
            message: ''
        });
        
        alert('Your message has been sent successfully!');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <h2 className="fs_24 poppins_medium text-[#2C2C2C] mb-6">
                Help & Support
            </h2>

            {/* Form */}
            <div className="space-y-4">
                {/* Name and Email - Two Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Input
                            labels="Name"
                            placeholder="Name"
                            type="text"
                            marginBottom="20px"
                            onChange={handleInputChange}
                            value={supportData.name}
                            name="name"
                        />
                    </div>
                    <div>
                        <Input
                            labels="Email"
                            placeholder="Email"
                            type="email"
                            marginBottom="20px"
                            onChange={handleInputChange}
                            value={supportData.email}
                            name="email"
                        />
                    </div>
                </div>

                {/* Message Field - Full Width */}
                <div>
                    <Textarea
                        labels="Message"
                        placeholder="Message"
                        value={supportData.message}
                        onChange={handleInputChange}
                        name="message"
                        rows={5}
                        marginBottom="20px"
                    />
                </div>

                {/* Send Button */}
                <div className="flex justify-end mt-8">
                    <button
                        onClick={handleSend}
                        className="bg-[#2C6B6F] hover:bg-[#245559] text-white px-8 py-3 rounded-lg fs_14 plus_Jakarta_Sans_medium transition-colors duration-200"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    )
}

export default HelpSupport