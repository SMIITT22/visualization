export const uploadFiles = async (files, rootComponentName) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files[]", file);
  });
  formData.append("rootComponentName", rootComponentName);

  try {
    const response = await fetch("http://localhost:3001/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.log(errorResponse.message);
      throw new Error(errorResponse.message);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error uploading files:", error);
    throw error;
  }
};
