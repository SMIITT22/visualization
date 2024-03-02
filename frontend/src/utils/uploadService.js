// Assuming uploadService.js is where you manage API calls
export const uploadZip = async (formData) => {
  try {
    const response = await fetch("http://localhost:3001/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload zip file");
    }

    // return await response.json();
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error uploading zip file:", error);
    throw error;
  }
};
