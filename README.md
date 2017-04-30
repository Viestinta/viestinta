<p align="center">
  <a href="https://viestinta.eu">
    <img src="https://github.com/Viestinta/viestinta/blob/master/src/static/images/logo_shadow.png" width="448">
  </a>
</p>

<p align="center">
  <a title="Build Status" href="https://drone.viestinta.eu/Viestinta/viestinta"><img src="https://drone.viestinta.eu/api/badges/Viestinta/viestinta/status.svg"></a>
  <a title="Dependencies" href="https://david-dm.org/Viestinta/viestinta"><img src="https://david-dm.org/Viestinta/viestinta.svg"></a>  
  <a title="Code Coverage" href="https://codecov.io/gh/Viestinta/viestinta"><img src= "https://codecov.io/gh/Viestinta/viestinta/branch/master/graph/badge.svg"></a>
  <a title= "Known Vulnerabilities" href="https://snyk.io/test/github/Viestinta/viestinta"><img src="https://snyk.io/test/github/Viestinta/viestinta/badge.svg"></a>
</p>
<p align="center">
<a title="Code Style" href="https://standardjs.com"><img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg"></a>
  <a title="License" href="https://github.com/Viestinta/viestinta/blob/master/LICENSE.md"><img src="https://img.shields.io/badge/license-GPLv3-blue.svg"></a>
  <a title="Website" href="https://viestinta.eu/"><img src="https://img.shields.io/badge/website-viestinta.eu-orange.svg"></a>
</p>


## Team members
* Dora Oline Eriksrud (teatimes)
* Ole Anders Stokker (frozenlight)
* Vetle Bjørngård Gundersen (weedle1912)
* Jacob Odgård Tørring (odgaard)

## Development setup

To run Viestinta, you need to obtain Oauth2 credentials from our provider at <a href="https://dashboard.dataporten.no">Dataporten<a>.
Or you could request oleast*stud.ntnu.no for the use of our secret keys.

Our setup is developed primarily to work on Linux.
This does not mean it can't be run on Windows or MacOS, but that you may need to jump through some hoops to get it working, and that only linux is officially supported.
This is because the docker image we are using relies on a linux system, and any other operating system would need to run the container in a virtual machine.

1. Install docker: https://docs.docker.com/engine/installation/
2. Install docker-compose: https://docs.docker.com/compose/install/
3. Clone the repo: 
    ```
    git clone https://github.com/Viestinta/viestinta.git
    ```
4. Move into the repo: 
    ```
    cd viestinta
    ```
5. Fire up docker containers, which optionally builds the image if it doesn't exist (this can take a while):
    ```
    sudo docker-compose up
    ```
6. Connect to website by entering `localhost:8000` into your browser

## Production setup
* https://github.com/Viestinta/viestinta-config
