1. Verify you have at least version 12 of Node.JS installed by running the command 'node -v' from cmd or terminal or Install Node.JS from https://nodejs.org/en/download/
	i. Once installed verify by running node -v
2. Verify you have Docker installed/running by running the commnad 'docker ps'
	i. If needed install Docker from https://docs.docker.com/get-docker/
3. From the top-level directory of my project in terminal or cmd, cd into the 'backend/src' folder
	i. run 'npm i' to install dependencies
	ii. Once install is complete cd one level up to the backend folder by running the command 'cd ..'
	iii. Now with docker running, issue the command 'docker-compose up' and the backend server should be starting up
4. From the top-level directory of my project in a new terminal or cmd window, cd into the 'frontend' folder
	i. run 'npm i' to install dependencies
	ii. Once install is complete run the command 'npm start' 
	iii. If prompted to start the server on a port other than 3000 hit y to do so and a webpage should automatically load with my project. 
		If not go to http://localhost:3001 or use whatever the port number is for the server it should be listed in the terminal window.

To view the backend responses in JSON you can go to localhost:3000/ to get the raw JSON. 
If you encounter any problems with running this on your local machine please do not hesitate to email me at kennedy@smu.edu. 