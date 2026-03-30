const imageUtil = {
  imageSourceToBase64: async (src) => {
    const response = await fetch(src);
    const blob = await response.blob();

    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result); // data:image/...;base64,...
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  },
};

export default imageUtil;
