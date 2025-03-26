import { Image } from 'react-bootstrap';


// TODO: ADD FUNCTION TO STORE USER'S IMAGES
// THAT'S NOT EVEN TODO THAT ACTUALLY FIXME
// OR USE PREFERRED WAY WITH ALREADY MADE LIB SUCH AS ->
// https://www.npmjs.com/package/swr 

const UserAvatar = ({
    src,
    size = 80,
    alt = 'User Avatar',
    className = '',
}) => {
    return (
        <Image
            src={
                src || `${process.env.REACT_APP_BACKEND_URL}/${process.env.REACT_APP_DEFAULT_URL_AVATAR}`
            }
            alt={alt}
            roundedCircle
            className={className}
            style={{
                height: `${size}px`,
                width: `${size}px`,
                objectFit: 'cover',
            }}
        />
    );
};

export default UserAvatar;
