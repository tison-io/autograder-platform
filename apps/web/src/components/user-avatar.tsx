'use client';

import { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface UserAvatarProps {
  avatarUrl?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  editable?: boolean;
  onAvatarChange?: (file: File) => Promise<void>;
  onAvatarRemove?: () => Promise<void>;
  className?: string;
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-16 w-16 text-lg',
  xl: 'h-24 w-24 text-2xl',
};

const iconSizes = {
  sm: 16,
  md: 20,
  lg: 32,
  xl: 48,
};

export function UserAvatar({
  avatarUrl,
  firstName,
  lastName,
  email,
  size = 'md',
  editable = false,
  onAvatarChange,
  onAvatarRemove,
  className,
}: UserAvatarProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Generate initials from name or email
  const getInitials = (): string => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) {
      return firstName[0].toUpperCase();
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return 'U';
  };

  // Generate a consistent color based on the name/email
  const getBackgroundColor = (): string => {
    const str = firstName || email || 'user';
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-orange-500',
      'bg-pink-500',
      'bg-teal-500',
      'bg-indigo-500',
      'bg-cyan-500',
    ];
    return colors[Math.abs(hash) % colors.length];
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onAvatarChange) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      await onAvatarChange(file);
      setImageError(false);
    } catch {
      alert('Failed to upload avatar. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!onAvatarRemove) return;

    if (!confirm('Are you sure you want to remove your avatar?')) return;

    setIsUploading(true);
    try {
      await onAvatarRemove();
      setImageError(false);
    } catch {
      alert('Failed to remove avatar. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const hasValidAvatar = avatarUrl && !imageError;

  return (
    <div className={cn('relative inline-block', className)}>
      {/* Avatar Circle */}
      <div
        className={cn(
          'relative flex items-center justify-center rounded-full overflow-hidden font-semibold text-white',
          sizeClasses[size],
          !hasValidAvatar && getBackgroundColor(),
        )}
      >
        {isUploading ? (
          <Loader2 className="animate-spin" size={iconSizes[size] * 0.6} />
        ) : hasValidAvatar ? (
          <img
            src={avatarUrl}
            alt={`${firstName || 'User'}'s avatar`}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <span>{getInitials()}</span>
        )}
      </div>

      {/* Edit overlay for editable mode */}
      {editable && !isUploading && (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Upload button (hidden input) */}
          <label
            className={cn(
              'absolute inset-0 flex items-center justify-center rounded-full cursor-pointer',
              'bg-black/0 hover:bg-black/40 transition-colors group',
            )}
          >
            <Upload
              className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
              size={iconSizes[size] * 0.5}
            />
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleFileSelect}
              className="sr-only"
            />
          </label>
        </div>
      )}

      {/* Remove button for editable mode with existing avatar */}
      {editable && hasValidAvatar && !isUploading && (
        <Button
          variant="destructive"
          size="icon"
          className="absolute -top-1 -right-1 h-5 w-5 rounded-full"
          onClick={handleRemove}
        >
          <X size={12} />
        </Button>
      )}
    </div>
  );
}

// Simple avatar display without edit functionality
export function Avatar({
  avatarUrl,
  firstName,
  lastName,
  email,
  size = 'md',
  className,
}: Omit<UserAvatarProps, 'editable' | 'onAvatarChange' | 'onAvatarRemove'>) {
  return (
    <UserAvatar
      avatarUrl={avatarUrl}
      firstName={firstName}
      lastName={lastName}
      email={email}
      size={size}
      className={className}
      editable={false}
    />
  );
}
