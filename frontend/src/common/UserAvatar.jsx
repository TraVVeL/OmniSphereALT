import { Image } from 'react-bootstrap';
import { DefaultUserIcon } from '../assets/Icons';

// TODO: ADD FUNCTION TO STORE USER'S IMAGES
// THAT'S NOT EVEN TODO THAT ACTUALLY FIXME
// OR USE PREFERRED WAY WITH ALREADY MADE LIB SUCH AS ->
// https://www.npmjs.com/package/swr

const UserAvatar = ({ src, size = 80, alt = 'User Avatar', className = '' }) => {
    return src ? (
        <Image
            src={src}
            alt={alt}
            roundedCircle
            className={className}
            style={{
                height: `${size}px`,
                width: `${size}px`,
                objectFit: 'cover',
            }}
        />
    ) : (
        <DefaultUserIcon
            width={size}
            height={size}
            className={className}
        />
    );
};

export default UserAvatar;
