import { useMemo } from 'react';

const useProfileImage = (auth) => {
    const baseUrl = process.env.REACT_APP_BACKEND_URL;
    const defaultAvatar = '/default-avatar.png';

    const imageUrls = useMemo(() => {
        const hasProfilePicture = auth?.profile_picture;

        const baseImageUrl = hasProfilePicture
            ? `${baseUrl}${auth.profile_picture}`
            : `${baseUrl}${defaultAvatar}`;

        return {
            original: baseImageUrl,
            small: `${baseImageUrl}?w=64`,
            medium: `${baseImageUrl}?w=150`,
            large: `${baseImageUrl}?w=300`,
            srcSet: `${baseImageUrl}?w=300 300w, ${baseImageUrl}?w=600 600w`,
            sizes: '(max-width: 600px) 300px, 600px',
        };
    }, [auth?.profile_picture, baseUrl]);

    const preloadImages = () => {
        Object.values(imageUrls).forEach((url) => {
            if (
                typeof url === 'string' &&
                !url.includes('srcSet') &&
                !url.includes('sizes')
            ) {
                const img = new Image();
                img.src = url;
            }
        });
    };

    return {
        urls: imageUrls,
        preloadImages,
        defaultAvatar: `${baseUrl}${defaultAvatar}`,
    };
};

export default useProfileImage;