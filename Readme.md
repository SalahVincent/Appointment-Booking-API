# Appointment Booking API

## App

![Swagger Interface](https://raw.githubusercontent.com/swagger-api/swagger.io/wordpress/images/assets/SWU-logo-clr.png)
![API Testing Dashboard](./assets/testing-preview.png)

## About

This project is a rbackend system designed exclusively for managing scheduling workflows between **Providers** and **Clients**. The API automates the entire coordination process, from initial account setup to final appointment resolution.

Key features include:
- **Dynamic Time-Slot Management:** A dedicated availability engine that allows providers to declare slots while permanently preventing double-bookings and race conditions.
- **RBAC (Role-Based Access Control):** Clear permission boundaries separating client scheduling actions from provider configuration controls.
- **Real-Time Synchronicity:** An integrated WebSocket layer that sends live, instantaneous notifications for booking requests, confirmations, and cancellations.
- **Automated Validation & Quality:** Enforced project-wide syntax verification running a modern ESLint configuration to guarantee clean code.

## API Design Document

The full technical specification and interactive endpoint documentation can be found via the integrated local route or the online instance hosted on [Swagger UI Documentation](./swagger.yaml).

## Built With

- Javascript (Node.js)
- Express.js
- Sequelize ORM
- PostgreSQL
- JWT (JsonWebToken)
- WebSockets (ws)
- Jest / Supertest
- ESLint

### Prerequisites

Knowledge about Backend Development:
- RESTful API architecture
- Relational Database Management Systems (PostgreSQL)
- Express.js Middleware logic
- Test-Driven Development loops (Jest isolation)

## Clone project

- To get a local copy up and running, follow these simple steps.
- Clone this repository using your terminal or command line.

## Command line steps

- $ `git clone https://github.com/SalahVincent/Appointment-Booking-API`
- $ `cd Appointment-Booking-API`
- $ `git checkout dev`

## Start App

- Run `npm install` to install the necessary dependencies.
- Setup your local `.env` file with your `DATABASE_URL` and `JWT_SECRET` keys.
- Run `npm run dev` to launch the localized live-reloading server environment.
- Visit `http://localhost:3000/api-docs` to view the interactive Swagger API documentation dashboard.

## Test

- Run `npm run lint` to perform static code analysis and search for syntax problems.
- Run `npm test` to trigger the automated Jest cross-platform integration testing pipeline.

---

## 🌐 Production Deployment & Persistence Notice

This application cleanly isolates structural core setup modules (`src/app.js`) from actual network listeners (`src/server.js`), allowing stable cloud hosting scaling on platform engines like Render.

> ⚠️ **Database Expiration Tip:** When deploying on Render's free tier, the associated free managed PostgreSQL instance will automatically expire and suspend exactly **30 days** after creation. If the production build fails during startup at `sequelize.authenticate()`, provision a fresh managed database instance and swap out your environment variable connection strings.

---

## Live Site

[Live Demo Link](https://appointment-booking-api-ybpu.onrender.com/api-docs/)

## Author

**Vincent Salah**

- GitHub: [@SalahVincent](https://github.com/SalahVincent)
- LinkedIn: [Vincent Salah](https://www.linkedin.com/in/salah-vincent/)

## Contributing

Contributions, issues and feature requests are welcome!

Feel free to check the [issues page](https://github.com/SalahVincent/Appointment-Booking-API/issues).

## Show your support

Give a ⭐️ if you like this project!

## License

This project is [MIT](./LICENSE) licensed.