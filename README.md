# server-for-trello

Приложение представляет из себя простейший CRUD API для работы с объектами Board, имеющими формат

### Board
```
idBoard — уникальный идентфикатор доски (string, uuid)
nameBoard — имя доски (string, required)
descriptionBoard — описание доски (number, required)
columns — список колонок доски (array of strings or empty array, required)
```
### Column
```
- idСolumn — уникальный идентфикатор колонки (string, uuid)
- nameColumn — имя колонки (string, required)
- descriptionСolumn — описание колонки (number, required)
- tasks — список задач колонки (array of strings or empty array, required)
```
### Task
```
- idTask — уникальный идентфикатор задачи (string, uuid)
- nameTask — имя задачи (string, required)
- descriptionTask — описание задачи (number, required)
```


## Endpoints
### Board
- **GET** `/api/board` получить все доски;
- **GET** `/api/board/${boardID}` получить доску по id;
- **POST** `/api/board` создать доску и добавить в database;
- **PUT** `/api/board/{boardID}` обновить доску по айди;
- **DELETE** `/api/board/${boardID}` удаляет доску по id;
### Column
- **GET** `/api/column/${boardID}` получить все колонки в доске по айди доски;
- **GET** `/api/column/id/${columnID}` получить колонку по айди;
- **POST** `/api/column/${boardID}` создать колонку в доске с айди;
- **PUT** `/api/column/{columnID}` обновить колонку по айди;
- **DELETE** `/api/column/${columnID}` удаляет колонку по idж
### Task
- **GET** `/api/task/${boardID}/${columnID}` получить все задачи в доске в колонке по айди доски и колонки;
- **GET** `/api/task/id/${taskID}` получить задачу по id;
- **POST** `/api/task/${boardID}/${columnID}` создать задачу в колонке с айди в доске с айди;
- **POST** `/api/task/${columnID}` создать задачу в колонке с айди;
- **PUT** `/api/task/${taskID}` обновить задачу по айди;
- **PUT** `/api/task/move/${taskID}` переместить задачу в новую колонку;
- **DELETE** `/api/task/${taskID}` удаляет задачу по id;

### Board
---
Получить все доски
- URL

    /api/board

- Method

    `GET`


### Column MOVE
---
- URL

    /column/move/:id

- Method

    `PUT`
    
- Data parameters:
```typescript
    {
        toBoardId: string,
        newPosition: number
    }
```
### Task MOVE
---
- URL

    /task/move/:id

- Method

    `PUT`

- Data parameters:
```typescript
    {
        toColumnId: string,
        newPosition: number,
    }
```

## User methods
---
**Registration user**

Registration a new user

<details>

- URL

    /api/register

- Method

    `POST`
    
- Data parameters:
```typescript
    {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
    }
```
- Returned value
```typescript
    {
        id: string
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        token: string;
        accessLevel: AccessLevel.User;
    }

    enum AccessLevel {
        "Admin",
        "User",
        "Anonymous"
    }
```
- Errors:

    `400` - Not all required fields are filled
    `409` - The User already exist
</details>

---

**Login user**

Login user with login and password

<details>

---
- URL

    /api/login

- Method

    `POST`
    
- Data parameters:
```typescript
    {
        email: string;
        password: string;
    }
```
- Returned value
```typescript
    {
        id: string
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        token?: string;
        accessLevel: AccessLevel.User;
        expiresIn: Date;
    }

    enum AccessLevel {
        "Admin",
        "User",
        "Anonymous"
    }
```
- Errors:

    `400` - Not all required fields are filled
    `401` - Invalid credentials
</details>

---
**Get user info**

Returns json data about specified user

<details>

---

- URL

    /api/user

- Method

    `GET`
    
- Data parameters:
    `none`

- Returned value
```typescript
    {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        accessLevel: AccessLevel;
        gender: string;
        registrationDate: Date;
    }
```
- Errors:

    `400` - Not all required fields are filled
    `401` - Invalid credentials

</details>

---
**Update user info**

Updates attributes of specified user.

<details>

---

- URL

    /api/user

- Method

    `PUT`
    
- Data parameters:
```typescript
    {
        firstName?: string;
        lastName?: string;
        password?: string;
        gender?: string;
    }
```

- Returned value
```typescript
    {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        accessLevel: AccessLevel;
        gender: string;
        registrationDate: Date;
    }
```
- Errors:

    `400` - Not all required fields are filled
    `401` - Invalid credentials

</details>

<br>

## Check list methods
---
**Get checkbox by ID**

Return json data about scpecified checkbox by ID

<details>
- URL

    /api/checkbox/id/:id

- Method

    `GET`

- Request parameters:
    - id - checkbox id

- Data parameters:
    `none`
- Returned value
```typescript
    {
        nameCheckBox: string;
        isChoose: boolean;
        idCheckBox: string;
    }
```
- Errors:

    `400` - Not all required fields are filled
    `401` - Invalid credentials

</details>

---
**Get all checkboxes by task ID**

Return json data about checkboxes in specified task by ID

<details>
- URL

    /api/checkbox/:id

- Method

    `GET`

- Request parameters:
    - id - task id
    
- Data parameters:
    `none`

- Returned value
```typescript
    {
        nameCheckBox: string;
        isChoose: boolean;
        idCheckBox: string;
    }
```
- Errors:

    `400` - Not all required fields are filled
    `401` - Invalid credentials

</details>

---
**Create checkbox**

Create a new checkbox in specified task

<details>
- URL

    /api/checkbox/:id

- Method

    `POST`

- Request URL parameters:
    - id - task id
    
- Data parameters:
```typescript
    {
        nameCheckBox: string;
        isChoose: boolean;
    }
```
- Returned value
```typescript
    {
        nameCheckBox: string;
        isChoose: boolean;
        idCheckBox: string;
    }
```
- Errors:

    `400` - Not all required fields are filled
    `401` - Invalid credentials
</details>

---
**Delete checkbox**

Delete specified checkbox from task

<details>

- URL

    /api/checkbox/:id

- Method

    `DELETE`

- Request URL parameters:
    - id - checkbox id
    
- Data parameters:

    `none`

- Returned value

    `none`

- Errors:

    `400` - Not all required fields are filled
    `401` - Invalid credentials

</details>

---
**Update checkbox**

Update attributes of specified checkbox

<details>
- URL

    /api/checkbox/:id

- Method

    `PUT`

- Request URL parameters:
    - id - checkbox id
    
- Data parameters:

```typescript
    {
        nameCheckBox: string;
        isChoose: boolean;
        idCheckBox: string;
    }
```
- Returned value

```typescript
    {
        nameCheckBox: string;
        isChoose: boolean;
        idCheckBox: string;
    }
```

- Errors:

    `400` - Not all required fields are filled
    `401` - Invalid credentials
</details>

---
**Update checklist**

Update whole checklist
<details>

- URL

    /api/checklist

- Method

    `PUT`

- Request URL parameters:
    - id - task id
    
- Data parameters:

```typescript
    {
        nameCheckBox: string;
        isChoose: boolean;
        idCheckBox: string;
    }[]
```
- Returned value

```typescript
    {
        nameCheckBox: string;
        isChoose: boolean;
        idCheckBox: string;
    }[]
```

- Errors:

    `400` - Not all required fields are filled
    `401` - Invalid credentials
</details>

---
## Example of valid request body:
```
    {
        nameBoard: 'Trello',
        dateBoard: new Date('06.02.2023'),
        descriptionBoard: 'creating app trello',
        isChosen: true,
        idBoard: '9e67fcee-8b69-40cd-a335-5c506655cf9c',
        ownerId: '8e0bcefd-6af9-4383-a490-3a3f5897fcfd',
        columns: [
            {
                nameColumn: 'need to do',
                descriptionColumn: 'what need to do week#1',
                idColumn: '082ad0bd-700f-4a80-9106-d57ccbe66424',
                tasks: [
                    {
                        nameTask: 'create HTTP.CreateServer',
                        descriptionTask:
                            'specify port 3000, create get, post-requests(URL discuss with team)',
                        idTask: '89942407-f5ca-488f-9e4a-09b3e3e6f0b0',
                        checkLists: [
                            {
                                nameCheckBox: 'testing in Postman',
                                isChoose: false,
                                idCheckBox: 'd25fe3f5-6ef9-4c55-b823-9f90f4be3da2',
                            },
                            {
                                nameCheckBox: 'create get, post, update, put requests',
                                isChoose: false,
                                idCheckBox: '7e330f79-8e89-4fc6-9eb0-6a46b7544ae3',
                            },
                            {
                                nameCheckBox: 'discuss URL with team',
                                isChoose: false,
                                idCheckBox: '42a8750a-78b0-4130-b275-a4b5fe459dbf',
                            },
                        ],
                    },
                    {
                        nameTask: 'updating.......',
                        descriptionTask: 'updating.......',
                        idTask: '1ca9c510-7110-45b5-90dc-adf5adf5d72c',
                        checkLists: [],
                    },
                ],
            },
            {
                nameColumn: 'in process',
                descriptionColumn: 'who perform a task',
                idColumn: '35553eba-b2bb-4af4-a860-8fc71ceda6c8',
                tasks: [
                    {
                        nameTask: 'create repository',
                        descriptionTask:
                            'create private repo, add collaboration, set up branch of deploy',
                        idTask: 'ef4d6c08-4984-454d-a30e-30f5efdb736c',
                        checkLists: [],
                    },
                ],
            },
        ],
    },
```
## Установка приложения

```
git clone {repository URL}
```

```
npm install или npm i
```

## Запуск приложения

Запуск приложения в режиме разработки

```
npm run start:dev
```
## Запуск в режиме релиза

```
npm run start:prod
```
Приложение прослушивает порт, указанный в .env (3000 по умолчанию). Вы можете указать другой (изменить SERVER_PORT=3000 в файле .env). 
Проверять работу приложения удобно с помощью Postman. Его можно установить себе на компьютер или использовать расширение для Chrome.

## Тестирование
```
npm run test
```
