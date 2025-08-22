import React, { useState } from 'react'
import Input from '../../../../utils/input';

const EditProfile = () => {
    const [formData, setFormData] = useState({
        name: 'Adam Stephen',
        email: 'adamstephen@gmail.com',
        age: '',
        phoneNumber: '',
        country: ''
    });

    const handleInputChange = (value, fieldName) => {
        // Convert fieldName to match our state keys
        const field = fieldName.toLowerCase().replace(' ', '');
        const stateField = field === 'phonenumber' ? 'phoneNumber' : field;
        
        setFormData(prev => ({
            ...prev,
            [stateField]: value
        }));
    };

    const handleUpdate = () => {
        console.log('Profile updated:', formData);
        // Add your update logic here
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <h2 className="fs_24 poppins_medium text-[#2C2C2C] mb-6">
                Edit Profile
            </h2>

            {/* Form */}
            <div className="space-y-4">
                {/* Name Field - Full Width */}
                <div>
                    <Input
                        labels="Name"
                        placeholder="Adam Stephen"
                        type="text"
                        marginBottom="20px"
                        onChange={handleInputChange}
                        value={formData.name}
                        name="name"
                    />
                </div>

                {/* Email and Age - Two Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Input
                            labels="Email"
                            placeholder="adamstephen@gmail.com"
                            type="email"
                            marginBottom="20px"
                            onChange={handleInputChange}
                            value={formData.email}
                            name="email"
                        />
                    </div>
                    <div>
                        <Input
                            labels="Age"
                            placeholder="Age"
                            type="number"
                            marginBottom="20px"
                            onChange={handleInputChange}
                            value={formData.age}
                            name="age"
                        />
                    </div>
                </div>

                {/* Phone Number and Country - Two Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Input
                            labels="Phone Number"
                            placeholder="Phone Number"
                            type="tel"
                            marginBottom="20px"
                            onChange={handleInputChange}
                            value={formData.phoneNumber}
                            name="phoneNumber"
                        />
                    </div>
                    <div>
                        <Input
                            labels="Country"
                            placeholder="Country"
                            type="text"
                            marginBottom="20px"
                            onChange={handleInputChange}
                            value={formData.country}
                            name="country"
                        />
                    </div>
                </div>

                {/* Update Button */}
                <div className="flex justify-end mt-8">
                    <button
                        onClick={handleUpdate}
                        className="bg-[#2C6B6F] hover:bg-[#245559] text-white px-8 py-3 rounded-lg fs_14 plus_Jakarta_Sans_medium transition-colors duration-200"
                    >
                        Updated
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EditProfile