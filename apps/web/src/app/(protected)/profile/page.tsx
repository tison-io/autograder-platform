'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { usersService } from '@/services';
import { profileSchema, ProfileFormData } from '@/lib/validations/auth';
import { UserAvatar } from '@/components/user-avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  User,
  Mail,
  Calendar,
  Github,
  Shield,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Edit2,
  X,
} from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    githubUsername: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileFormData, string>>>({});

  // Initialize form when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        githubUsername: user.githubUsername || '',
      });
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    setErrors({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrorMessage(null);
    setErrors({});
    // Reset form to current user values
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        githubUsername: user.githubUsername || '',
      });
    }
  };

  const handleChange =
    (field: keyof ProfileFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validate form data
    const result = profileSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ProfileFormData, string>> = {};
      result.error.issues.forEach((error) => {
        const field = error.path[0] as keyof ProfileFormData;
        fieldErrors[field] = error.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSaving(true);

    try {
      const updatedUser = await usersService.updateProfile({
        firstName: result.data.firstName,
        lastName: result.data.lastName,
        githubUsername: result.data.githubUsername || undefined,
      });

      // Update the auth store with new user data
      updateUser({
        ...user!,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        githubUsername: updatedUser.githubUsername,
      });

      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (file: File) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const updatedUser = await usersService.uploadAvatar(file);

      // Update the auth store with new avatar
      updateUser({
        ...user!,
        avatarUrl: updatedUser.avatarUrl,
      });

      setSuccessMessage('Avatar updated successfully!');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to upload avatar');
    }
  };

  const handleAvatarRemove = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await usersService.removeAvatar();

      // Update the auth store to remove avatar
      updateUser({
        ...user!,
        avatarUrl: null,
      });

      setSuccessMessage('Avatar removed successfully!');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to remove avatar');
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-12 w-48" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      case 'PROFESSOR':
        return 'bg-blue-100 text-blue-800';
      case 'STUDENT':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="mt-2 text-gray-600">Manage your account information and preferences</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Error Message */}
      {errorMessage && (
        <Alert className="mb-6 bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{errorMessage}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        {/* Profile Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>Your personal details and account information</CardDescription>
            </div>
            {!isEditing ? (
              <Button variant="outline" onClick={handleEdit} className="flex items-center gap-2">
                <Edit2 className="h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
              <Button
                variant="ghost"
                onClick={handleCancel}
                className="flex items-center gap-2 text-gray-500"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={handleChange('firstName')}
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={handleChange('lastName')}
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="githubUsername" className="flex items-center gap-2">
                    <Github className="h-4 w-4" />
                    GitHub Username
                  </Label>
                  <Input
                    id="githubUsername"
                    value={formData.githubUsername}
                    onChange={handleChange('githubUsername')}
                    placeholder="your-github-username"
                  />
                  {errors.githubUsername && (
                    <p className="text-sm text-red-500">{errors.githubUsername}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    Link your GitHub account to enable repository submissions
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                {/* Avatar and Name */}
                <div className="flex items-center gap-4">
                  <UserAvatar
                    avatarUrl={user.avatarUrl}
                    firstName={user.firstName}
                    lastName={user.lastName}
                    email={user.email}
                    size="xl"
                    editable={true}
                    onAvatarChange={handleAvatarChange}
                    onAvatarRemove={handleAvatarRemove}
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {user.firstName} {user.lastName}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      {user.role}
                    </span>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Github className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">GitHub</p>
                      {user.githubUsername ? (
                        <a
                          href={`https://github.com/${user.githubUsername}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:underline"
                        >
                          @{user.githubUsername}
                        </a>
                      ) : (
                        <p className="text-gray-400 italic">Not connected</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Member Since</p>
                      <p className="font-medium text-gray-900">{formatDate(user.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Last Updated</p>
                      <p className="font-medium text-gray-900">{formatDate(user.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Security Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Account Security
            </CardTitle>
            <CardDescription>Manage your password and security settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Password</h4>
                <p className="text-sm text-gray-500">Last changed: Unknown</p>
              </div>
              <Button variant="outline" asChild>
                <a href="/forgot-password">Change Password</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
