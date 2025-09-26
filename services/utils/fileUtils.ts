export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // The result is in the format "data:image/jpeg;base64,LzlqLzRBQ...".
      // We need to extract just the base64 part.
      const base64String = (reader.result as string).split(',')[1];
      if (base64String) {
        resolve(base64String);
      } else {
        reject(new Error("Échec de la conversion du fichier en base64."));
      }
    };
    reader.onerror = error => reject(error);
  });
};
