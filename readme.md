## Keystone.js Framework

Docker based Keystone.js framework

### Prerequisites

You must have Docker and Docker Compose installed before beginning.

### Getting Started

* Clone this repo
* cd into the root of the repo and run:

```bash
tools/build
docker-compose up -d
```

The application should now be running on port 80. If you're using boot2docker, run `boot2docker ip` to get the ip address of the virtual machine.

### Tools

NPM has a proxy script located in `./tools`, which will run the correct docker-compose commands. For example, to update NPM dependencies, use:

```bash
tools/npm update
```

### Development Credentials

Visit `/admin` to manage the site. Use the following credentials in development:

**Email:** `johndoe@keystonejs.com`  
**Password:** `changeme`
