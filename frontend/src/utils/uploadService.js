export const uploadFiles = async (files) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files[]", file);
  });

  try {
    const response = await fetch("http://localhost:3001/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload files");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error uploading files:", error);
    throw error;
  }
};
