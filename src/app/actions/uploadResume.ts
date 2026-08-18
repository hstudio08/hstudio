"use server";

export async function uploadResumeAction(formData: FormData) {
  const apiKey = process.env.IMGBB_API_KEY;
  
  if (!apiKey) {
    throw new Error("Server configuration error: Missing ImgBB API Key");
  }

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: 'POST',
    body: formData,
  });
  
  const json = await res.json();
  
  if (!json.success) {
    throw new Error("Failed to upload resume image. Please try again.");
  }
  
  return json.data.url;
}
