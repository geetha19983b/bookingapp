# Item Image Upload Guide

## Overview
Items can have images stored on the server. Images are uploaded as files and stored in `backend/uploads/items/`, with their URLs stored in the database.

## Storage Strategy
- **Files**: Stored in `backend/uploads/items/` directory
- **Database**: Stores relative URLs (e.g., `/uploads/items/product-1234567890-123456789.jpg`)
- **Access**: Files served as static content via Express at `/uploads/` endpoint

## API Endpoints

### 1. Upload Single Image
**POST** `/api/v1/items/upload-image`

**Request:**
- Content-Type: `multipart/form-data`
- Field name: `image`
- Allowed formats: JPEG, PNG, GIF, WebP
- Max size: 5MB

**Example (curl):**
```bash
curl -X POST http://localhost:3000/api/v1/items/upload-image \
  -F "image=@/path/to/image.jpg"
```

**Response:**
```json
{
  "message": "Image uploaded successfully",
  "data": {
    "filename": "product-1714478400000-123456789.jpg",
    "url": "/uploads/items/product-1714478400000-123456789.jpg",
    "size": 245678,
    "mimetype": "image/jpeg"
  }
}
```

### 2. Upload Multiple Images
**POST** `/api/v1/items/upload-images`

**Request:**
- Content-Type: `multipart/form-data`
- Field name: `images` (multiple files)
- Max files: 5
- Allowed formats: JPEG, PNG, GIF, WebP
- Max size per file: 5MB

**Example (curl):**
```bash
curl -X POST http://localhost:3000/api/v1/items/upload-images \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg"
```

**Response:**
```json
{
  "message": "Images uploaded successfully",
  "data": [
    {
      "filename": "product-1714478400000-123456789.jpg",
      "url": "/uploads/items/product-1714478400000-123456789.jpg",
      "size": 245678,
      "mimetype": "image/jpeg"
    },
    {
      "filename": "product-1714478400001-987654321.jpg",
      "url": "/uploads/items/product-1714478400001-987654321.jpg",
      "size": 312456,
      "mimetype": "image/jpeg"
    }
  ]
}
```

## Using with Item Create/Update

### Step 1: Upload Image(s)
First, upload the image(s) using one of the upload endpoints above to get the URLs.

### Step 2: Create/Update Item with Image URLs
Use the returned URLs when creating or updating an item:

**POST** `/api/v1/items`
```json
{
  "itemType": "goods",
  "name": "Sample Product",
  "imageUrl": "/uploads/items/product-1714478400000-123456789.jpg",
  "imageUrls": [
    "/uploads/items/product-1714478400000-123456789.jpg",
    "/uploads/items/product-1714478400001-987654321.jpg"
  ],
  "costPrice": 100,
  "sellingPrice": 150
}
```

## Accessing Images

Images are accessible via HTTP at:
```
http://localhost:3000/uploads/items/{filename}
```

Example:
```
http://localhost:3000/uploads/items/product-1714478400000-123456789.jpg
```

## Frontend Integration Example

### HTML Form
```html
<form id="uploadForm">
  <input type="file" name="image" accept="image/*" />
  <button type="submit">Upload</button>
</form>
```

### JavaScript (Fetch API)
```javascript
const form = document.getElementById('uploadForm');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(form);
  
  const response = await fetch('http://localhost:3000/api/v1/items/upload-image', {
    method: 'POST',
    body: formData
  });
  
  const result = await response.json();
  console.log('Uploaded image URL:', result.data.url);
});
```

### React Example
```jsx
const [imageUrl, setImageUrl] = useState('');

const handleUpload = async (e) => {
  const file = e.target.files[0];
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await fetch('http://localhost:3000/api/v1/items/upload-image', {
    method: 'POST',
    body: formData
  });
  
  const result = await response.json();
  setImageUrl(result.data.url);
};

return (
  <div>
    <input type="file" onChange={handleUpload} accept="image/*" />
    {imageUrl && <img src={`http://localhost:3000${imageUrl}`} alt="Preview" />}
  </div>
);
```

## File Naming Convention
Uploaded files are renamed using the pattern:
```
{sanitized-original-name}-{timestamp}-{random-number}.{extension}
```

Example: `product_image-1714478400000-123456789.jpg`

## Security & Limits
- ✅ Only image file types allowed (JPEG, PNG, GIF, WebP)
- ✅ Maximum file size: 5MB per file
- ✅ Maximum files per upload: 5 (for multi-upload)
- ✅ Filenames are sanitized to prevent directory traversal
- ✅ Files stored outside web root with controlled access

## Future Enhancements
For production, consider:
- Cloud storage integration (AWS S3, Cloudinary)
- Image optimization/compression
- Thumbnail generation
- CDN integration
- Image deletion endpoint when items are deleted
