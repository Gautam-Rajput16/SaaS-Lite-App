const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-gallery");
const API_KEY = "";  //replace with our own api key

let isimageGenerationInProgress = false;

const updateImageCard = (imageURL) => {
  const imgCard = imageGallery.querySelectorAll(".img-card")[0];
  const imgElement = imgCard.querySelector("img");
  const downloadBtn = imgCard.querySelector(".download-btn");

  //image ki src ko update krna

  const aiGeneratedImg = `${imageURL}`;
  imgElement.src = aiGeneratedImg;

  // image ko load hone ke baad loading class ko remove krna

  imgElement.onload = () => {
    imgCard.classList.remove("loading");
    downloadBtn.setAttribute("href", aiGeneratedImg);
    downloadBtn.setAttribute("download", `ai-image-${Date.now()}.png`);
  };
};


const generateAiImages = async (userPrompt) => {
  try {
    // API ko request bhejna aur usse image generate krwana
    const response = await fetch(
      "https://api-inference.huggingface.co/models/ZB-Tech/Text-to-Image",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          inputs: userPrompt,
        }),
      }
    );

    const data = await response.blob(); // response ko blob me convert krna
    const imageURL = URL.createObjectURL(data); // blob ko URL me convert krna
    // console.log(data);

    // console.log(imageURL);

    updateImageCard(imageURL);
  } catch (error) {
    console.log(error);
  } finally {
    isimageGenerationInProgress = false;
  }
};

const handleFormSubmission = (e) => {
  e.preventDefault();
  if (isimageGenerationInProgress) {
    alert("Image generation is in progress. Please wait for a moment.");
    isimageGenerationInProgress = true;
    return;
  }

  // user se input or image quantity ki value lena
  const userPrompt = e.srcElement[0].value;
  const userImgQuantity = e.srcElement[1].value;

  // Check for sensitive keywords
  const sensitiveKeywords = ["sex", "boobs", "nude", "penis","porn"];
  const containsSensitiveKeywords = sensitiveKeywords.some(keyword =>
    userPrompt.toLowerCase().includes(keyword)
  );

  if (containsSensitiveKeywords) {
    alert("Kya re aa gya Aukaat pe 🤡");
    return;
  }

  console.log(userPrompt);

  // image gallery ko empty krna

  const imgCardMarkup = Array.from(
    { length: userImgQuantity },
    () =>
      ` <div class="img-card" loading>
             <img src="images/loader.svg" alt="Loading" >
             
           
 <a href="#" class="download-btn">
                <img src="images/download.svg" alt="download-icon">
            </a>


        </div>`
  ).join("");

  imageGallery.innerHTML = imgCardMarkup;

  // ai se image generate krwana
  generateAiImages(userPrompt);

  // image generate hone ke baad input field ko reset krna
  e.target.reset();
};

generateForm.addEventListener("submit", handleFormSubmission);
