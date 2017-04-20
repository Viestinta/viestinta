<p align="center">
  <a href="https://viestinta.eu">
    <img src="https://github.com/Viestinta/viestinta/blob/master/src/static/images/logo_shadow.png" width="448">
  </a>
</p>

<p align="center">
  <a title="Build Status" href="https://drone.viestinta.eu/Viestinta/viestinta"><img src="https://drone.viestinta.eu/api/badges/Viestinta/viestinta/status.svg"></a>
  <a title="Code Coverage" href="https://codecov.io/gh/Viestinta/viestinta"><img src= "https://codecov.io/gh/Viestinta/viestinta/branch/master/graph/badge.svg"></a>
  <a title="License" href="https://github.com/Viestinta/viestinta/blob/master/LICENSE.md"><img src="https://img.shields.io/badge/license-GPLv3-blue.svg"></a>
  <a title="Website" href="https://viestinta.eu/"><img src="https://img.shields.io/badge/website-viestinta.eu-orange.svg"></a>
</p>

## Team members
* Dora Oline Eriksrud (teatimes)
* Ole Anders Stokker (frozenlight)
* Vetle Bjørngård Gundersen (weedle1912)
* Jacob Odgård Tørring (odgaard)

## Development setup
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
