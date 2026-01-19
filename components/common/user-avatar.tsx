type User = { name?: string; image?: string };

interface UserAvatarProps {
  user: User;
  size?: number; // px
  className?: string;
}

export function UserAvatar({ user, size = 44, className }: UserAvatarProps) {
  const initial =
    (user?.name?.trim()?.charAt(0)?.toUpperCase() || 'U');

  const styles: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    background: '#e3f2fd',
    color: '#1976d2',
    overflow: 'hidden',
    userSelect: 'none',
  };

  if (user?.image) {
    return (
      <img
        src={user.image}
        alt={user?.name || 'User'}
        width={size}
        height={size}
        style={{ ...styles, objectFit: 'cover' }}
        loading="lazy"
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <span
      aria-label={user?.name || 'User'}
      title={user?.name}
      className={className}
      style={styles}
    >
      {initial}
    </span>
  );
}