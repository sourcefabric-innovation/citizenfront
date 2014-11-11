[![Build Status](https://travis-ci.org/sourcefabric-innovation/citizendesk-frontend.png?branch=master)](https://travis-ci.org/sourcefabric-innovation/citizendesk-frontend)
[![Coverage Status](https://coveralls.io/repos/sourcefabric-innovation/citizendesk-frontend/badge.png?branch=master)](https://coveralls.io/r/sourcefabric-innovation/citizendesk-frontend?branch=master)
[![devDependency Status](https://david-dm.org/sourcefabric-innovation/citizendesk-frontend/dev-status.svg)](https://david-dm.org/sourcefabric-innovation/citizendesk-frontend#info=devDependencies)
[![Issue Stats](http://issuestats.com/github/sourcefabric-innovation/citizendesk-frontend/badge/pr?style=flat)](http://issuestats.com/github/sourcefabric-innovation/citizendesk-frontend)
[![Issue Stats](http://issuestats.com/github/sourcefabric-innovation/citizendesk-frontend/badge/issue?style=flat)](http://issuestats.com/github/sourcefabric-innovation/citizendesk-frontend)

### Citizen Desk Web Front End

This is the web front end for [Citizen
Desk](https://www.sourcefabric.org/en/citizendesk/). It provides a web
user interface communicating with a [Citizendesk Application
Programming Interface][interface] component.

You can try a demo
[here](https://sourcefabric-innovation.github.io/citizendesk-frontend/dist/),
picking an username like `User1`, `User2`, `User3` with its password,
[listed
here](https://github.com/sourcefabric-innovation/citizendesk-interface/blob/master/demo-passwords.csv). Keep
in mind that Citizen Desk is meant to be mobile first, so you are
encouraged to use chrome emulation tools to emulate a mobile device if
you are trying it from a desktop.

#### Deployment

In the simplest case, the app can be deployed just statically serving
the files under `app/`. Remember to install the [Bower][bower] dependencies
running bower install:

    $ bower install

In order to work, the front end has to be connected to a [Citizendesk
interface][interface] component, and you have to write its address in
the `config.server.url` configuration variable, which you can find in
`app/scripts/app.js`. This is the standard way to connect an [Eve API
client service](https://github.com/sourcefabric-innovation/eve-api) to
its server-side API provider. The currently provided address will try
to connect to a demo instance.

For more advanced deployments, for example concatenating and minifying
the files, check the details about [Grunt][grunt] tasks below.

### Development notes

This is an Angular application produced with [Yeoman][yeoman], and as
such all its files are arranged according to the result of [Yeoman
generators](https://github.com/yeoman/generator-angular). Development
dependencies are handled through the `package.json` file, and
installed running `npm install` in the repo root. Some Node modules
may require you to install some libraries on your system, so don't
be scared if the installation of some modules fails, but gather
more info about installing the requirements in your machine.

Also the [Grunt][grunt] tasks here available mainly
correspond with the tasks automatically generated by
[Yeoman][yeoman]. For example the following tasks are available:

    $ grunt test
    $ grunt serve
    $ grunt build

Please refer to the Grunt file for a better understanding of the
available tasks and the involved Grunt plugins.

##### Error handling strategy

Through the application there are a lot of API calls, and the error
case is not handled for every single call. In order to simplify the
code, there is a global error handler, responsible for actions like
showing a global error message, reloading the page, and sending us a
message through Sentry. Reloading the page is often the easiest way to
get back to a constistent and updated data structure, and to make the
user understand in case she is experiencing connectivity problems

##### Deploy to the `gh-pages` branch

In the repo root there is a bash script which, in a correctly
configured system, will publish the current master to gh-pages. It
will run the tests, checkout the branch, rebase and push. It is not
error proof, it is just a shortcut. You are expected to understand
what it does. Once in a while, it will probably make sense to squash
all the `fix` commits there.

Just run `source deploy-gh-pages.dot` or `. deploy-gh-pages.dot` in
your shell in order to try the script

#### Testing

For basic informations about running the tests, refer to the Travis
file here in the root folder. Remember that Travis automatically 
executes `npm install` as a preliminary step and `npm test` in order
to run the tests, since these are the standard commands for working
with Node modules.

Tests use a `mocks` object built with a tool called
[mockatenate](https://github.com/danse/mockatenate). In order to
update the file, run the `./mockatenate` command from the root
repository folder

##### Test troubleshooting

There are some details in maintaining the tests that, if you do not
pay attention, makes you waste a lot of time. If your tests are
failing and you really do not know what is going on, check this list:

 - make sure that your mocks are updated using the `./mockatenate` script
 - if your are directly mocking HTTP, make sure that the API endpoint you are using (throug `eve-api`) is in the root mock
 - there is a build process concatenating all the templates. it is triggered automatically when a template is modified and `grunt serve` is running

[interface]: https://github.com/sourcefabric-innovation/citizendesk-interface
[yeoman]: http://yeoman.io/
[grunt]: http://gruntjs.com/
[bower]: http://bower.io/
