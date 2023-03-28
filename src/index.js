import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://jojdwgktxkbdsdtltmgx.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvamR3Z2t0eGtiZHNkdGx0bWd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzkwNTgzNzUsImV4cCI6MTk5NDYzNDM3NX0.MEoznHgnL2VzB03m5RAHAiqkk6MYr7Tc5hOHX9NwtXM"
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
      <App />
    </SessionContextProvider>
  </React.StrictMode>
);
