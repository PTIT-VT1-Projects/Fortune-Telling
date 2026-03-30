const imageModules = import.meta.glob(
  "/src/pages/games/emotion-arena/resources/*.{png,jpg,jpeg,webp}",
  {
    eager: true,
    import: "default",
  },
);

const imageList = Object.values(imageModules);

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

  getRandomImage: () => {
    if (!imageList.length) return null;
    const randomIndex = Math.floor(Math.random() * imageList.length);
    return imageList[randomIndex];
  },
};

export default imageUtil;
