import api from './api';

const uploadSingleImage = (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  return api.post('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

const uploadMultipleImages = (imageFiles) => {
  const formData = new FormData();
  imageFiles.forEach(file => {
    formData.append('images', file);
  });
  
  return api.post('/upload/images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

const deleteImage = (publicId) => {
  return api.delete(`/upload/image/${publicId}`);
};

export default {
  uploadSingleImage,
  uploadMultipleImages,
  deleteImage
};
