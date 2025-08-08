// src/pages/user/PreferencesPage.jsx
import React from 'react';
import { UserPreferences } from '../../components/user';

const PreferencesPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto">
                <UserPreferences />
            </div>
        </div>
    );
};

export default PreferencesPage;
