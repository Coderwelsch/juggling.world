# juggling.world

![](./docs/images/teaser.png)

**⚠️ The design and project’s name doesn’t really fit together right now. My first idea was to just program a little platform for diabolo enthusiasts, 
but it didn’t take that long for me to realize that this platform should be more generic and inclusive for all other artistic and flowy disciplines as well. 
So now I am about to do a little redesign and I need to redo the logo and stuff to fit to the new name «juggling.world» ❤️**

Source Code of the all new juggling.world platform. Lets connect, share and learn together! 

## Figma Prototype

[You can take a look at the figma file here →](https://www.figma.com/file/ev2wLBI15wKCA1KGZRWaMg/Mockups?type=design&node-id=0%3A1&mode=design&t=Bg1T5B12WPZlcWAI-1)  

## Tech Stack

- [Docker](https://www.docker.com/)
- [Next.js (frontend)](https://nextjs.org/)
- [Strapi (cms)](https://strapi.io/)
- [PostgreSQL (cms database)](https://www.postgresql.org/)

## Development

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

juggling.world is built with docker. You need to have docker installed on your machine.

# Setup for your Code Editor

In theory, you don’t need to have [Node.js](https://nodejs.org/) and the `node_modules` installed on your machine, but mostly your code editor will complain about missing dependencies and typescript types packages etc. So it’s recommended to have Node.js installed and to install the `node_modules` for both [services](./services) ([frontend](./services/frontend) and [cms](./services/cms)) like this:

```bash
# in services/frontend
yarn install

# in services/cms
yarn install
```

### Setup Environment File

Copy the `.env.example` file to `.env` and adjust the values to your needs. 

For strapi related environment variables, please refer to the [strapi documentation](https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#environment-variables).

### Start the Project

To start the project, run the following command:

```bash
docker-compose up # --build
```

or if you want to run it via yarn:

```bash
yarn dev
```

## Contributing

Feel free to contribute to this project.

## Contact

If you have any questions, feel free to ask them in the [r/diabolo reddit channel](https://reddit.com/r/diabolo) or send me an email to [social@coderwelsch.com](mailto:social@coderwelsch.com).
