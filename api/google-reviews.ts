type VercelRequest = any;
type VercelResponse = any;

const DEFAULT_PLACE_ID = "ChIJL0avNwADGTkR1nF8MiXCecQ";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID || DEFAULT_PLACE_ID;

  if (!apiKey) {
    return res.status(503).json({
      error: "Google Places API key is not configured.",
      configured: false,
      placeId,
    });
  }

  try {
    const response = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "id,displayName,rating,userRatingCount,reviews,googleMapsUri",
      },
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("Google Places API error:", response.status, detail);
      return res.status(502).json({ error: "Unable to load Google reviews." });
    }

    const place = await response.json();
    const reviews = Array.isArray(place.reviews) ? place.reviews : [];

    const normalizedReviews = reviews.map((review: any, index: number) => ({
      id: review.name || `google-${index}`,
      source: "google",
      name: review.authorAttribution?.displayName || "Google user",
      initials: (review.authorAttribution?.displayName || "G")
        .split(/\s+/).map((part: string) => part[0]).join("").slice(0, 2).toUpperCase(),
      rating: Number(review.rating || 5),
      text: review.text?.text || review.originalText?.text || "",
      date: review.relativePublishTimeDescription || "Google review",
      publishedAt: review.publishTime || null,
      googleMapsUri: review.googleMapsUri || place.googleMapsUri || null,
      authorUri: review.authorAttribution?.uri || null,
      authorPhotoUri: review.authorAttribution?.photoUri || null,
    }));

    return res.status(200).json({
      configured: true,
      place: {
        id: place.id,
        name: place.displayName?.text || "Haider Brothers Traders",
        rating: Number(place.rating || 0),
        userRatingCount: Number(place.userRatingCount || 0),
        googleMapsUri: place.googleMapsUri || null,
      },
      reviews: normalizedReviews,
    });
  } catch (error) {
    console.error("Google reviews handler failure:", error);
    return res.status(500).json({ error: "Unexpected Google reviews service error." });
  }
}
