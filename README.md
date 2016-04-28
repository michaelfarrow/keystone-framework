# Keystone.js Framework

[![wercker status](https://app.wercker.com/status/0c561dfe9bee08d97f6185dd8b9a9e8d/s "wercker status")](https://app.wercker.com/project/bykey/0c561dfe9bee08d97f6185dd8b9a9e8d)

Docker/Wercker based Keystone.js framework, using Dokku for deployment

## Local Development

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

### Environment

Any environment variables which need to be supplied when developing locally can be placed in the `ENVIRONMENT` file, with variable names prefixed with `X_`. For any variables which you don't want adding to the repository can be added to the `ENVIRONMENT_LOCAL.template` file, without the `X_` prefix. If this template file is not empty, the application will not start without an `ENVIRONMENT_LOCAL` file being created.

## Deployment

The framework is setup to deploy to a Dokku instance using Wercker.

### Wercker Project Setup

1. Navigate to your project and open up `Settings > SSH Keys`
2. Create a new SSH key
3. Open up `Settings > Targets`
4. Create a new target and give it a name *(production, staging etc.)*
5. Create three environment variables:
    - **DOKKU_KEY** - SSH Key - [key created in step 2]
    - **DOKKU_HOST** - String - [your dokku host ip or fqdn]
    - **DOKKU_APP** - String - keystone
6. Save the target settings

### Dokku Server Setup

Once you've booted your Dokku server, on the installation screen, copy and paste the public SSH key from the Wercker Project target. Then run the following steps:

```bash
# Set some environment variables
export MONGO_IMAGE_VERSION="3.2.4"

# Install Mongo Dokku plugin
dokku plugin:install https://github.com/dokku/dokku-mongo.git

# Create our Keystone app
dokku apps:create keystone

# Create our Mongo service and link to our Keystone app
dokku mongo:create keystone-db
dokku mongo:link keystone-db keystone

# Create our volumes
mkdir -p /var/lib/dokku/data/keystone/cache
mkdir -p /var/lib/dokku/data/keystone/uploads

# Mount our volumes
dokku storage:mount keystone /var/lib/dokku/data/keystone/cache:/app/public/cache
dokku storage:mount keystone /var/lib/dokku/data/keystone/uploads:/app/public/uploads

# Set our config values
dokku config:set keystone COOKIE_SECRET="$(< /dev/urandom tr -dc _A-Z-a-z-0-9 | head -c64)"
dokku config:set keystone ADMIN_FIRST_NAME="[first name]"
dokku config:set keystone ADMIN_LAST_NAME="[last name]"
dokku config:set keystone ADMIN_EMAIL="[email]"
dokku config:set keystone ADMIN_PASSWORD="[password]"
dokku config:set keystone CLOUDINARY_URL="[url]"
```
