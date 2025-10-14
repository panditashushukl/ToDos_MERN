# Todos MERN Application - Dual Mode

[View Live Preview](https://to-dos-mern.vercel.app/)

A comprehensive Todo app built with the MERN stack that supports both Guest Mode (localStorage) and Authenticated Mode (server sync). See the project structure and key files:

- Backend: [back-end/package.json](back-end/package.json), app entry [back-end/src/index.js](back-end/src/index.js), constant [`DB_NAME`](back-end/src/constants.js) ([back-end/src/constants.js](back-end/src/constants.js))
- Frontend: [front-end/package.json](front-end/package.json), entry [front-end/src/main.jsx](front-end/src/main.jsx), app [front-end/src/App.jsx](front-end/src/App.jsx)
- Frontend API base: [`API_BASE_URL`](front-end/src/services/api.js) ([front-end/src/services/api.js](front-end/src/services/api.js))
- Dev tooling / proxy: [front-end/vite.config.js](front-end/vite.config.js)
- Vercel config: [front-end/vercel.json](front-end/vercel.json)
- Components index: [front-end/src/components/index.js](front-end/src/components/index.js) and example component [`TodoCard`](front-end/src/components/TodoComponents/TodoCard.jsx) ([front-end/src/components/TodoComponents/TodoCard.jsx](front-end/src/components/TodoComponents/TodoCard.jsx))
- Styles: [front-end/src/index.css](front-end/src/index.css)
- Integration tests guide: [test-integration.md](test-integration.md)
- License: [LICENSE](LICENSE)

Key features

- Dual-mode: Guest (localStorage) and Authenticated (server + MongoDB)
- Full CRUD, labels, due-dates, archive, bulk ops, statistics
- Auth: registration, login, JWT-based session handling
- Avatar upload (Cloudinary)
- Tailwind CSS + React 19 UI
