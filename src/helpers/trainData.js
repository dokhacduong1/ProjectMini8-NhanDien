export async function convertImageToBase64(imageList){
    const result = [];
    await Promise.all(
      imageList.map((data) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(data);
          reader.onload = function (event) {
            result.push(event.target.result);
            resolve();
          };
        });
      })
    );
   return result;
}
