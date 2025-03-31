const PEXELS_API_KEY = "" // replace with our own api key

document.getElementById("videoForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const prompt = document.getElementById("prompt").value;
  const videoContainer = document.getElementById("videoContainer");
  videoContainer.innerHTML = "<p style='color:white;'>Loading...</p>"; // Show loading state
  console.log(prompt);

  try {
    // Fetch videos from Pexels API (requesting 2 videos)
    const response = await fetch(
      `https://api.pexels.com/videos/search?query=${encodeURIComponent(
        prompt
      )}&per_page=2`,
      {
        headers: { Authorization: PEXELS_API_KEY },
      }
    );

    const data = await response.json();

    if (data.videos.length > 0) {
      // Create video elements dynamically
      videoContainer.innerHTML = "";
      data.videos.slice(0, 2).forEach((video) => {
        const videoUrl = video.video_files[0].link;
        const videoElement = `<video width="45%" height="50%" controls>
                                        <source src="${videoUrl}" type="video/mp4">
                                      </video>`;
        videoContainer.innerHTML += videoElement;
      });
    } else {
      videoContainer.innerHTML = `<p class="error">No videos found for this prompt.</p>`;
    }
  } catch (error) {
    console.error("Error fetching videos:", error);
    videoContainer.innerHTML = `<p class="error">Failed to fetch videos. Try again later.</p>`;
  }

  e.target.reset(); // Clear the prompt input after videos are generated
});
