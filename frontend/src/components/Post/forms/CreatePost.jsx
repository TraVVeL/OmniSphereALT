import React, { useEffect, useRef, useState } from 'react';
import { Crepe } from '@milkdown/crepe';
import '@milkdown/crepe/theme/common/style.css';
import '@milkdown/crepe/theme/frame-dark.css';

import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import './style.css';


const text = `# Запуск происходит посредством Docker

Создание миграций
\`\`\`
docker-compose up --build -d
\`\`\`
\`\`\`
docker exec -it <container_id> /bin/bash    
\`\`\`
\`\`\`
python manage.py migrate    
python manage.py makemigrations    
\`\`\`

# API для управления комнатами и бронированиями

## Комнаты

### 1. Создание комнаты

* **Описание**: Создает новую комнату с указанным описанием и ценой.
* **URL**: \`POST /rooms/create\`
* **Параметры запроса**:

| Параметр    | Тип           | Обязательный | Описание                    |
|-------------|---------------|--------------|-----------------------------|
| description | string        | Да           | Описание комнаты            |
| price       | decimal(10,2) | Да           | Цена комнаты                |

* **Пример запроса**:
\`\`\`
curl -X POST -d "description=Уютная комната с видом на море" -d "price=7999.00" http://localhost:8000/api/rooms/create
\`\`\`

* **Пример успешного ответа** (201 Created):
\`\`\`json
{
  "success": "room was created: 1"
}
\`\`\`

* **Пример ошибки** (400 Bad Request):
\`\`\`json
{
  "price": ["Ensure that there are no more than 10 digits in total."]
}
\`\`\`

### 2. Список комнат

* **Описание**: Получает список комнат, отсортированных по указанным параметрам.
* **URL**: \`GET /rooms/list\`
* **Параметры запроса**:

| Параметр | Тип   | Обязательный | Описание                              |
|----------|-------|--------------|---------------------------------------|
| sort_by  | string| Нет          | Поле для сортировки. Доступные значения: price, created_at. По умолчанию: created_at |
| order    | string| Нет          | Порядок сортировки. Доступные значения: asc, desc. По умолчанию: asc               |

* **Пример запроса**:
\`\`\`
curl -X GET "http://localhost:8000/api/rooms/list?sort_by=price&order=desc"
\`\`\`

* **Пример успешного ответа** (200 OK):
\`\`\`json
[
  {
    "id": 1,
    "description": "Уютная комната с видом на море",
    "price": "7999.00",
    "created_at": "2025-03-14T10:30:00Z"
  },
  {
    "id": 2,
    "description": "Стандартная комната с двумя кроватями",
    "price": "5999.00",
    "created_at": "2025-03-13T09:15:00Z"
  }
]
\`\`\``;

export const CreatePost = () => {
    const editorRef = useRef(null);
    const crepeRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const { i18n } = useTranslation();

    useEffect(() => {
        if (!editorRef.current) return;

        const crepe = new Crepe({
            root: editorRef.current,
            defaultValue: text,
        });

        crepe.create().then(() => {
            console.log('Milkdown Editor created');
        });

        crepeRef.current = crepe;

        return () => {
            crepe.destroy();
        };
    }, []);

    const handleSubmit = async () => {
        if (!crepeRef.current) return;

        try {
            setIsLoading(true);
            setMessage('');

            const content = await crepeRef.current.getMarkdown();

            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/${i18n.language}/api/posts/create/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: "No title",
                    content: content,

                }),
            });

            if (!response.ok) {
                throw new Error(`Ошибка: ${response.status}`);
            }

            const result = await response.json();
            setMessage('Пост успешно сохранен!');

        } catch (error) {
            console.error('Ошибка при отправке:', error);
            setMessage(`Ошибка при сохранении: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-4">
            <div ref={editorRef} className="mb-3" />

            <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={isLoading}
            >
                {isLoading ? 'Отправка...' : 'Сохранить пост'}
            </Button>

            {message && (
                <div
                    className={`mt-2 ${
                        message.includes('Ошибка')
                            ? 'text-danger'
                            : 'text-success'
                    }`}
                >
                    {message}
                </div>
            )}
        </div>
    );
};
