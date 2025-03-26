import { UserAvatar } from '../../../../common';

const ImageUploader = ({
    preview,
    getRootProps,
    getInputProps,
    isDragActive,
    t,
}) => (
    <div
        {...getRootProps()}
        className={`dropzone mb-lg-4 mb-3 ${isDragActive ? 'active' : ''}`}
        style={{
            border: '2px dashed #ccc',
            borderRadius: '10px',
            padding: '20px',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: isDragActive ? '#2b3035' : 'transparent',
        }}
    >
        <input {...getInputProps()} />
        <UserAvatar src={preview} size={80} className="mb-2" />

        <p className="text-muted">
            {isDragActive
                ? t('drop_your_photo_here')
                : t('drag_&_drop_or_click_to_upload')}
        </p>
        <small className="text-muted">
            {t('allowed_file_formats')}: JPEG, PNG, SVG, {t('size')}: 4MB
        </small>
    </div>
);

export default ImageUploader;
