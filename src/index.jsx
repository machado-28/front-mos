import { createRoot } from "react-dom/client";
import App from "./app/App";

import * as serviceWorker from "./serviceWorker";
// third party style
import "perfect-scrollbar/css/perfect-scrollbar.css";
import { BrowserRouter } from "react-router-dom";
// import ErrorFallback from "app/views/sessions/ErrorBoundary";
// import { ErrorBoundary } from 'react-error-boundary';
const root = createRoot(document.getElementById("root"));

// root.render(<>
//     <BrowserRouter>
//         <ErrorBoundary FallbackComponent={ErrorFallback}>
//             <App />
//         </ErrorBoundary>
//     </BrowserRouter>
// </>);

root.render(<>
    <BrowserRouter>

        <App />
        \
    </BrowserRouter>
</>);
// for IE-11 support un-comment cssVars() and it's import in this file
// and in MatxTheme file

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
