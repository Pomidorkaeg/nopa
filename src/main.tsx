import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Функция для обработки ошибок
const handleError = (error: Error) => {
  console.error('Ошибка приложения:', error);
};

// Функция для обработки отложенных ошибок
const handleRejectedPromise = (event: PromiseRejectionEvent) => {
  console.error('Отложенная ошибка:', event.reason);
};

// Добавляем обработчики ошибок
window.addEventListener('error', (event) => handleError(event.error));
window.addEventListener('unhandledrejection', handleRejectedPromise);

// Получаем корневой элемент
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Не найден корневой элемент #root');
}

// Создаем и рендерим приложение
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
