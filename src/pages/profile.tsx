import React, { useState, useEffect } from 'react';
import { SharePointService } from '../services/SharePointService';
import BottomNavigation from '../components/BottomNavigation';

const SHAREPOINT_PROFILE_FOLDER = 'portfolio profile picture';
const PROFILE_JSON = 'profile.json';
const DOMAIN = 'https://wrightspark625.sharepoint.com/';

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    fullName: '',
    jobTitle: '',
    employer: '',
    yearsOfExperience: 0,
    sharePointUrl: '',
    profilePicUrl: ''
  });
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showingSharePointHelp, setShowingSharePointHelp] = useState(false);

  useEffect(() => {
    // Load profile.json and profile picture from SharePoint
    const loadProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        // Load SharePoint URL from localStorage
        const savedProfile = localStorage.getItem('profile');
        if (savedProfile) {
          const { sharePointUrl } = JSON.parse(savedProfile);
          if (sharePointUrl) {
            setProfile(prev => ({ ...prev, sharePointUrl }));
          }
        }

        const sp = SharePointService.getInstance();
        await sp.authenticate();

        try {
          // Try to fetch profile.json
          const driveId = await sp['getDriveId']();
          if (!sp['client']) {
            throw new Error('SharePoint client not initialized');
          }

          const response = await sp['client']
            .api(`/drives/${driveId}/root:/${SHAREPOINT_PROFILE_FOLDER}/${PROFILE_JSON}`)
            .get();

          if (response['@microsoft.graph.downloadUrl']) {
            const res = await fetch(response['@microsoft.graph.downloadUrl']);
            const data = await res.json();
            setProfile(prev => ({ ...prev, ...data }));
          }

          // Try to fetch profile picture
          const picResponse = await sp['client']
            .api(`/drives/${driveId}/root:/${SHAREPOINT_PROFILE_FOLDER}/ProfilePic.jpg`)
            .get();

          if (picResponse['@microsoft.graph.downloadUrl']) {
            setProfile(prev => ({ ...prev, profilePicUrl: picResponse['@microsoft.graph.downloadUrl'] }));
          }
        } catch (e) {
          // Ignore if files don't exist yet
          console.log('Profile files not found, will create on save');
        }
      } catch (e) {
        console.error('Load error:', e);
        setError(e instanceof Error ? e.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: name === 'yearsOfExperience' ? Number(value) : value }));
  };

  const handlePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setProfilePicFile(file);
    setProfile((prev) => ({ ...prev, profilePicUrl: URL.createObjectURL(file) }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      if (!profile.sharePointUrl.startsWith(DOMAIN)) {
        setError('SharePoint URL must start with ' + DOMAIN);
        setLoading(false);
        return;
      }

      const sp = SharePointService.getInstance();
      
      // Validate the SharePoint URL before saving
      try {
        // Ensure we're authenticated
        await sp.authenticate();
        
        console.log('Validating SharePoint URL:', profile.sharePointUrl);
        await sp.validateSiteUrl(profile.sharePointUrl);
      } catch (validationError: any) {
        setError(`SharePoint URL validation failed: ${validationError.message}`);
        setLoading(false);
        return;
      }

      // Save SharePoint URL to localStorage
      localStorage.setItem('profile', JSON.stringify({ sharePointUrl: profile.sharePointUrl }));
      localStorage.setItem('sharepointSiteUrl', profile.sharePointUrl);
      
      // Create the profile folder if it doesn't exist
      await sp.createFolderIfNeeded(SHAREPOINT_PROFILE_FOLDER);
      
      // Upload profile.json
      const blob = new Blob([JSON.stringify(profile)], { type: 'application/json' });
      const file = new File([blob], PROFILE_JSON, { type: 'application/json' });
      await sp.uploadEvidence(file, SHAREPOINT_PROFILE_FOLDER, PROFILE_JSON);

      // Upload profile picture if changed
      if (profilePicFile) {
        await sp.uploadEvidence(profilePicFile, SHAREPOINT_PROFILE_FOLDER, 'ProfilePic.jpg');
      }

      setSuccess('Profile saved successfully!');
    } catch (e) {
      console.error('Save error:', e);
      setError(e instanceof Error ? e.message : 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8 pb-safe"> {/* Using pb-safe utility class */}
        <h1 className="text-2xl font-bold mb-6">Profile</h1>
        
        <div className="space-y-6">
          {/* Profile Picture */}
          <div className="bg-neutral-900 rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={profile.profilePicUrl || '/default-avatar.png'}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
                <label className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePicChange}
                    className="hidden"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                </label>
              </div>
              <div>
                <h2 className="text-xl font-semibold">Profile Picture</h2>
                <p className="text-sm text-neutral-400">Upload a professional photo</p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-neutral-900 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-800 text-white rounded px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Job Title</label>
                <input
                  type="text"
                  name="jobTitle"
                  value={profile.jobTitle}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-800 text-white rounded px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Employer</label>
                <input
                  type="text"
                  name="employer"
                  value={profile.employer}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-800 text-white rounded px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Years of Experience</label>
                <input
                  type="number"
                  name="yearsOfExperience"
                  value={profile.yearsOfExperience}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-800 text-white rounded px-4 py-2"
                />
              </div>
            </div>
          </div>

          {/* SharePoint Settings */}
          <div className="bg-neutral-900 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">SharePoint Settings</h2>
              <button
                onClick={() => setShowingSharePointHelp(true)}
                className="text-blue-400 hover:text-blue-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.41-.41a2.25 2.25 0 113.182 3.182l-4.182 4.182a2.25 2.25 0 01-3.182-3.182l.41-.41" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12.75v6.75m0 0h6.75m-6.75 0l-9-9" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">SharePoint Site URL</label>
                <input
                  type="text"
                  name="sharePointUrl"
                  value={profile.sharePointUrl}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-800 text-white rounded px-4 py-2"
                  placeholder="https://wrightspark625.sharepoint.com/sites/YourSiteName"
                />
                <p className="mt-1 text-sm text-neutral-400">
                  Enter your SharePoint site URL. You can copy this directly from your web browser when viewing your SharePoint site.
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded">
              {success}
            </div>
          )}

          <button
            className="w-full bg-blue-600 text-white font-semibold rounded-xl px-8 py-3 shadow-lg text-lg active:scale-95 transition-all"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>

      {/* SharePoint Help Modal */}
      {showingSharePointHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 rounded-2xl p-6 max-w-lg w-full">
            <h3 className="text-xl font-semibold mb-4">About SharePoint Site URL</h3>
            <p className="text-neutral-300 mb-4">
              The SharePoint Site URL is necessary for connecting to your specific SharePoint site. It allows the app to securely access your evidence portfolio while maintaining privacy and security.
            </p>
            <div className="space-y-2 text-neutral-400">
              <p className="font-medium">How to find your SharePoint URL:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Open your SharePoint site in a web browser</li>
                <li>Copy the entire URL from the address bar</li>
                <li>Paste it in the field above</li>
              </ol>
            </div>
            <button
              className="mt-6 w-full bg-blue-600 text-white font-semibold rounded-xl px-8 py-3"
              onClick={() => setShowingSharePointHelp(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      
      <BottomNavigation />
    </div>
  );
}
