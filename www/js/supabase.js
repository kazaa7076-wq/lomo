import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://blmdptpbrxqqdaesmrnp.supabase.co";

const supabaseKey =
"sb_publishable_7UHafGiKx7hSUOgnN627yQ_b2qlA9Mr";

export const supabase = createClient(
    supabaseUrl,
    supabaseKey
);