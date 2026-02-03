# Att göra-lista (Todo App)

En frontend-applikation byggd med **React** och **TypeScript** som hanterar en dynamisk att göra-lista (Todo List) med full **CRUD-funktionalitet** mot ett backend-API.

Applikationen är en del av en laboration med fokus på state management i React, formulärhantering, API-integration och versionshantering med Git.

---

## Syfte och mål

Målet med projektet är att:

- Fördjupa förståelsen för **state management** i React
- Använda **useEffect** för att hämta och hantera dynamisk data
- Implementera **formulär med validering**
- Öva på **state lifting** mellan komponenter
- Bygga en komplett frontend med **CRUD-funktionalitet**
- Kommunicera med ett **backend-API**
- Arbeta strukturerat med **Git och GitHub**

---

## Tekniker som används

- **React**
- **TypeScript**
- **Vite**
- **CSS Modules**
- **json-server** (backend / mock-API)
- **react-spinners** (laddningsindikatorer)

---

## Funktionalitet

### Todos
- Skapa en ny todo
- Visa alla todos
- Uppdatera:
  - titel
  - beskrivning
  - status (Ej påbörjad, Pågående, Avklarad)
- Ta bort en todo (med egen bekräftelsedialog)

### Formulär & validering
- Titel är obligatorisk och minst **3 tecken**
- Beskrivning är valfri, max **200 tecken**
- Status har standardvärde **Ej påbörjad**

### UX & UI
- Laddningsindikatorer vid API-anrop
- Minsta visningstid för loader vid uppdatering
- Felhantering med tydliga meddelanden
- Responsiv layout (desktop & mobil)
- Ljusbeige, svart och vitt färgtema
- Egen bekräftelsedialog istället för `alert/confirm`

---

## Projektstruktur (översikt)
```text
src/
├── api/ # API-anrop (CRUD mot backend)
├── components/ # React-komponenter
│ ├── TodoForm
│ ├── TodoList
│ ├── TodoItem
│ └── ConfirmDialog
├── hooks/ # Custom hooks (useTodos)
├── types/ # TypeScript-typer
├── App.tsx
└── main.tsx
```
---

## Live demo
länk: https://to-do-list-l90gh8xmg-amanda-persdotters-projects.vercel.app/

---

## Kom igång lokalt

### 1. Klona repot
```bash
git clone https://github.com/amer1301/ToDoList.git
cd ToDoList
```

### 2. Installera beroenden
npm install

### 3. Starta backend (json-server)
npx json-server --watch db.json --port 5000

### 4. Starta frontend
npm run dev

Applikationen körs på:
http://localhost:5173

Backend-API:
http://localhost:5000/todos

---

## Backend (json-server)
Backenden är byggd med json-server och stödjer följande endpoints:
- GET /todos
- POST /todos
- PATCH /todos/:id
- DELETE /todos/:id

Exempel på todo-objekt:
```json
{
  "id": 1,
  "title": "Handla mat",
  "description": "Mjölk, bröd, frukt",
  "status": "Ej påbörjad"
}
```
