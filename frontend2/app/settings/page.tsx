'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Settings as SettingsIcon, 
  User, 
  Lock, 
  Bell, 
  Shield, 
  Trash2, 
  Save, 
  Edit3,
  MapPin,
  Calendar,
  Mail,
  Eye,
  EyeOff
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { usersAPI } from '@/lib/api';

export default function SettingsPage() {
  const { user, logout, refreshUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Profile form data
  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    location: '',
    interests: '',
    profilepic: null as File | null
  });

  // Password form data
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        bio: user.bio || '',
        location: user.location || '',
        interests: Array.isArray(user.interests) ? user.interests.join(', ') : (user.interests || ''),
        profilepic: null
      });
    }
  }, [user]);

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileData(prev => ({ ...prev, profilepic: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);

    try {
      let profileImageUrl = null;

      // First, upload the profile image to AWS if a new image is selected
      if (profileData.profilepic) {
        const imageFormData = new FormData();
        imageFormData.append('profilepic', profileData.profilepic);

        const uploadResponse = await fetch('/api/upload/profile', {
          method: 'POST',
          body: imageFormData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.message || 'Failed to upload profile image');
        }

        const uploadResult = await uploadResponse.json();
        profileImageUrl = uploadResult.data.url;
      }

      // Then update the profile with the new image URL
      const formData = new FormData();
      formData.append('name', profileData.name);
      formData.append('bio', profileData.bio);
      formData.append('location', profileData.location);
      formData.append('interests', profileData.interests);
        if (profileImageUrl) {
        formData.append('profilepic', profileImageUrl);
      }

      await usersAPI.updateProfile(formData);
      
      // Refresh user data to reflect changes
      await refreshUser();
        // Clear the preview and reset form
      setProfilePreview(null);
      setProfileData(prev => ({ ...prev, profilepic: null }));
      
      // Reset file input
      const fileInput = document.getElementById('profilepic') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
      
      // Show success message
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }

    setPasswordLoading(true);

    try {
      await usersAPI.changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });

      alert('Password changed successfully!');
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Failed to change password:', error);
      alert('Failed to change password. Please check your current password and try again.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        // TODO: Implement delete account API call
        await logout();
        router.push('/');
      } catch (error) {
        console.error('Failed to delete account:', error);
        alert('Failed to delete account. Please try again.');
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to access settings</h2>
          <Link href="/login">
            <Button>Go to Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'hsl(var(--color-background))' }}>      {/* Header */}
      <div className="sticky top-0 z-50 px-4 py-3 border-b backdrop-blur-md bg-background/95 supports-[backdrop-filter]:bg-background/60" style={{ 
        borderColor: 'hsl(var(--color-border))' 
      }}>
        <div className="flex items-center space-x-4">
          <Link href="/home">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'hsl(var(--color-foreground))' }}>
              Settings
            </h1>
            <p className="text-sm" style={{ color: 'hsl(var(--color-muted-foreground))' }}>
              Manage your account settings and preferences
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Profile Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center space-x-6">
                <div className="relative">                  <div className="w-24 h-24 rounded-full overflow-hidden border-4" style={{ borderColor: 'hsl(var(--color-border))' }}>
                    {profilePreview || user.profilepic ? (
                      <Image
                        src={profilePreview || user.profilepic || '/logo.png'}
                        alt={user.name || 'Profile'}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/logo.png';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: 'hsl(var(--color-muted))' }}>
                        <User className="w-8 h-8" style={{ color: 'hsl(var(--color-muted-foreground))' }} />
                      </div>
                    )}
                  </div>
                </div>                <div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => document.getElementById('profilepic')?.click()}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Change Photo
                  </Button>
                  <Input
                    id="profilepic"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfileImageChange}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    JPG, PNG or GIF. Max size 5MB.
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Your location"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interests">Interests</Label>
                <Input
                  id="interests"
                  value={profileData.interests}
                  onChange={(e) => setProfileData(prev => ({ ...prev, interests: e.target.value }))}
                  placeholder="coding, music, travel (comma-separated)"
                />
                <p className="text-sm text-muted-foreground">
                  Separate multiple interests with commas
                </p>
              </div>

              <Button type="submit" disabled={saveLoading} className="w-full md:w-auto">
                {saveLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Password Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock className="w-5 h-5" />
              <span>Change Password</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.oldPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, oldPassword: e.target.value }))}
                    placeholder="Enter your current password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      placeholder="Enter new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <Button type="submit" disabled={passwordLoading} className="w-full md:w-auto">
                {passwordLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mr-2" />
                    Changing...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Change Password
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-600">
              <Shield className="w-5 h-5" />
              <span>Danger Zone</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-red-600">Delete Account</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  className="w-full md:w-auto"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
