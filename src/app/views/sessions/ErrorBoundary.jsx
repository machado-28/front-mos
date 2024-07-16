import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
 

export default function ErrorFallback({ error, resetErrorBoundary }) {
    return (
        <div role="alert">
            <h2>Oops! Algo deu errado.</h2>
            <pre>{error.message}</pre>
            <button onClick={resetErrorBoundary}>Tente novamente</button>
            <Link to="/">Voltar para a página inicial</Link>
        </div>
    );
}
