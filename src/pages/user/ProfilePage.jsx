// src/pages/user/ProfilePage.jsx
import React from 'react';
import { ProfileSettings } from '../../components/user';

const ProfilePage = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto">
                <ProfileSettings />
            </div>
        </div>
    );
};

export default ProfilePage;