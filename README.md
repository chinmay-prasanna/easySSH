# EasySSH
This is a tool i developed to make it easier to handle ssh configurations and automate connections. 
## How it works - 
First off you can add a service to which you will be communicating with through ssh. Then multiple keys can be added to that service, make sure the username and ssh key paths are accurate. 
Then you can establish an ssh connection to those services using the particular keys.
## Usage
Setup a postgres database. Add an environment file containing - db_username, db_password, db_host, db_name. Run main.py
