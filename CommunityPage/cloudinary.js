export async function uploadImage(file) {
    const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dwnorfkwt/image/upload"; // Replace with actual Cloudinary URL
    const CLOUDINARY_UPLOAD_PRESET = "Unsigned_upload"; // Replace with your Cloudinary preset

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
        const response = await fetch(CLOUDINARY_URL, {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        return data.secure_url; // Returns the uploaded image URL
    } catch (error) {
        console.error("Error uploading image:", error);
        return "";
    }
}
