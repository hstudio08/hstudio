"use server";

export async function uploadResumeAction(formData: FormData) {
  const apiKey = process.env.IMGBB_API_KEY;
  
  if (!apiKey) {
    throw new Error("Server configuration error: Missing ImgBB API Key");
  }

  const file = formData.get('image') as File;
  if (!file) {
    throw new Error("No image file provided");
  }

  // Convert File to base64 to ensure it securely travels through Node.js fetch
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64Image = buffer.toString('base64');

  const uploadData = new FormData();
  uploadData.append('image', base64Image);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: 'POST',
    body: uploadData,
  });
  
  const json = await res.json();
  
  if (!json.success) {
    console.error("ImgBB Upload Error:", json);
    throw new Error("Failed to upload resume image. Please try again.");
  }
  
  return json.data.url;
}
