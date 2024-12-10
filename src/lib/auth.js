import { Google } from "arctic";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "$env/static/private";

export const google = new Google(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    import.meta.env.PROD ? "https://flexifeed.zapdos.me/login/google/callback" : "http://localhost:5173/login/google/callback"
);
