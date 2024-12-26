import { redirect } from "@sveltejs/kit";
import { execute, fetch, fetchOne } from "$lib/db";



export const actions = {
    default: async ({ cookies, request, locals }) => {
        const data = await request.formData();
        console.log(data);
        const country = data.get("country");
        const topics = JSON.parse(data.get("topics"));
        console.log("country", country);
        console.log("topics", topics);

        const topicsArray = [];
        for (const [key, value] of Object.entries(topics)) {
            if (value) {
                topicsArray.push(key);
            }
        }

        const existing = fetchOne("SELECT * FROM user_settings WHERE user_id = ?", [locals.user.id]);
        if (existing) {
            execute(
                "UPDATE user_settings SET country = ?, topics = ? WHERE user_id = ?",
                [country, JSON.stringify(topicsArray), locals.user.id]
            );
        } else {
            execute(
                "INSERT INTO user_settings (user_id, country, topics) VALUES (?, ?, ?)",
                [locals.user.id, country, JSON.stringify(topicsArray)]
            );
        }

        return {success: true, country, topics};

    }
}

export const load = async (event) => {
    if (!event.locals.user) {
        return redirect(302, "/login");
    }

    const settings = fetchOne("SELECT * FROM user_settings WHERE user_id = ?", [event.locals.user.id]);

    console.log(JSON.stringify(settings));

    return {
        user: event.locals.user,
        country: settings?.country ?? null,
        topics: settings?.topics ? JSON.parse(settings.topics) : []
        
    };
};