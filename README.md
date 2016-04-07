## Keystone.js Framework

[![wercker status](https://app.wercker.com/status/0c561dfe9bee08d97f6185dd8b9a9e8d/s "wercker status")](https://app.wercker.com/project/bykey/0c561dfe9bee08d97f6185dd8b9a9e8d)

Docker/Wercker based Keystone.js framework

### Prerequisites

You must have Docker and Wercker Cli installed before beginning.

### Getting Started

* Clone this repo
* cd into the root of the repo and run:

```bash
tools/dev
```

The application should now be running on port 80. You should be attached to the running container to run adhoc commands. If you're using docker-machine, run `docker-machine ip default` to get the ip address of the virtual machine.

### Development Credentials

Visit `/admin` to manage the site. Use the following credentials in development:

**Email:** `johndoe@keystonejs.com`  
**Password:** `changeme`
