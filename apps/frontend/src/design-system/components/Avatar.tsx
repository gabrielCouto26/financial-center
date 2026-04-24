import './Avatar.css';

interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar = ({
  src,
  alt = 'Avatar',
  initials,
  size = 'md',
  className = '',
}: AvatarProps) => {
  return (
    <div className={`avatar avatar--${size} ${className}`}>
      {src ? (
        <img src={src} alt={alt} className="avatar__image" />
      ) : (
        <span className="avatar__fallback">{initials || '?'}</span>
      )}
    </div>
  );
};
