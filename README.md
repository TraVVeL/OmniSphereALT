# Настройка приложения (React + Django)

## Зависимости
1. Зависимости для создания туннеля
    - [CloudPub](https://cloudpub.ru/)

| **Функция**          | **Работоспособность** | **Тип**              | **Local URL**                                   | **Global URL**                                       |
|----------------------|-----------------------|----------------------|-------------------------------------------------|------------------------------------------------------|
| Регистрация          | Да                    | Аутентификация       | Посредством модального окна                     | Посредством модального окна                          |
| Вход                 | Да                    | Аутентификация       | Посредством модального окна                     | Посредством модального окна                          |
| Сброс пароля         | Да                    | Аутентификация       | Посредством модального окна                     | Посредством модального окна                          |
| Oauth Google         | Да                    | Аутентификация       | Посредством модального окна                     | Посредством модального окна                          |
| Oauth Telegram       | Да                    | Аутентификация       | Посредством модального окна                     | Посредством модального окна                          |
| Oauth GitHub         | Да                    | Аутентификация       | Посредством модального окна                     | Посредством модального окна                          |
| Профиль              | Да                    | Профиль пользователя | `localhost:3000/profile/<username>`             | `https://omnisphere.cloudpub.ru/<username>`          |
| Аккаунт/Изменить     | Да                    | Профиль пользователя | `http://localhost:3000/account/profile`         | `https://omnisphere.cloudpub.ru/account/profile`     |
| Профиль/Смена пароля | Да                    | Профиль пользователя | `http://localhost:3000/account/change-password` | `https://omnisphere.cloudpub.ru/change-password`     |
| Профиль/Интеграции   | Да                    | Профиль пользователя | `http://localhost:3000/account/integration`     | `https://omnisphere.cloudpub.ru/account/integration` |
| Профиль/Соц.сети     | Да                    | Профиль пользователя | `http://localhost:3000/account/social`          | `https://omnisphere.cloudpub.ru/account/social`      |
| Профиль/Сессии       | Не реализованно       | Профиль пользователя | `http://localhost:3000/account/profile`         | `https://omnisphere.cloudpub.ru/account/profile`     |
| Внешний вид/Профиль  | Не реализованно       | Профиль пользователя | `http://localhost:3000/account/profile`         | `https://omnisphere.cloudpub.ru/account/profile`     |
| Создать              | Не особо              | Статьи               | `http://localhost:3000/create-post`             | `https://omnisphere.cloudpub.ru/account/profile`     |
| Статьи               | Не особо              | Статьи               | `http://localhost:3000/`                        | `https://omnisphere.cloudpub.ru/account/profile`     |

## Шаг 1: Клонируем репозиторий

```bash
git clone https://github.com/TraVVeL/OmniSphere
cd OmniSphere
```

## Шаг 2: Запускаем compose файл (без контейнера cloudpub) (путь первый):
   Проект запустится, но всё будет работать
   ```bash
   docker-compose up --build -d backend redis database frontend celery_worker
   ```

## Шаг 2: Запускаем CloudPub отдельно (без контейнера cloudpub) (путь второй) 
1. Открываем терминал и запускаем туннель
    
   для Windows
   ```bash
   clo.exe publish http 8000
   clo.exe publish http 3000
   ```
   Для Linux
   ```bash
   clo publish http 8000
   clo publish http 3000
   ```
2. Во всех env файлах обновляем URL's на предоставленные от CloudPub

   для `backend/.env`

   ```ini
   DJANGO_ALLOWED_HOSTS=omnisphere.cloudpub.ru,omnisphere-api.cloudpub.ru
   DJANGO_CORS_ALLOWED_ORIGINS=https://your-backend-url.cloudpub.ru,https://your-frontend-url.cloudpub.ru
   DJANGO_CSRF_TRUSTED_ORIGINS=https://your-backend-url.cloudpub.ru,https://your-frontend-url.cloudpub.ru
   ```
   
   для `frontend/.env`
   ```ini
   REACT_APP_BACKEND_URL=https://your-backend-url.cloudpub.ru
   ```

3. Запускаем docker-compose без CloudPub
   ```bash
   docker-compose up --build -d backend redis database frontend celery_worker
   ```


# Немного доп. настроек

1. Тесты
   ```shell
   python manage.py test --verbosity=2 
   ```
2. Языки
   * Backend 
   ```bash
   python manage.py makemessages -l en  
   python manage.py makemessages -l ru
   django-admin compilemessages
   ```
   * Frontend 
   ```bash
   npm run i18n:scan  
   ```

