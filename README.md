# Donation Platform

This repository is a stripped-down version of a production project, **though quite a few commits behind the final version and not production-ready**. It is provided simply as a basis for employers to browse and judge competency, whilst taking a few caveats into account (see below).

## Original Project
The specification of the original project was to create a system which the company (a local charity) could leverage to better facilitate one of their services. The service in question took in donations of unwanted furniture and other goods from the local community, renovated them, and further donated them to people in need. The management of this service was previously based around Excel spreadsheets and was becoming unwieldy due to the growing popularity of the service.

#### A note on installation:
It is recommended that you browse the repository as is because, due to obvious security concerns, the .env file is not committed. As much of the application relies on a connection to the database and environment variables, expect several errors when trying to replicate a "live" environment. However, if necessary one can run the following commands:

Install dependencies: `npm install`

Start the server: `npm run dev`

Start front-end: `ng serve -o`

## Caveats
Though this repository is indeed for employers to browse (and evaluate), it is indicative of my early work, whilst I was still learning many aspects of the Angular framework. Newer projects have benefited greatly from what I learned during the completion of this project. This version of the project is hence lacking in the areas listed below, most of which have been subsequently implemented in the production environment:

- Responsive layout (mobile etc)
- Missing Typescript models (using "any")
- Support for lazy-loading
- HttpInterceptors
- Use of Resolvers
- Unit tests


## Competencies
Despite the caveats above, I hope to demonstrate my understanding of the following concepts of the Angular framework and the MEAN stack in general:

#### Client-side:
- Routing
- Angular Animations API (inc. router animations)
- Route Guards
- Observables and RxJS operators (pipe, map etc)
- Services and dependency-injection
- Angular Pipes (including custom pipes)
- Reactive and Template Forms
- Angular HttpClient
- Client-side validation
- Angular CLI
- Basic deployment to Linux with Nginx

#### Server-side:
- JWT Token Authentication & Authorisation
- Basic safe storage of passwords
- Input validation and sanitation
- Server-side validation
- Safe secret storage
- MongoDB with Mongoose
- RESTful API creation
- Middleware
