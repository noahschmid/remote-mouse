# Remote-Mouse
Web application to control the mouse of a linux machine remotely. Does not work under Windows/Mac. 

# Dependencies
You have to have Node.js installed on your machine.

# Usage
First install the required packages: <br>
`npm install`

then you can start a new server:  
`sudo nodemon`  

**Important**: This application has to run as root to function properly.

Now open a browser and open <a href="http:://localhost::8080">http:://localhost::8080</a>. You should see a QR code that needs to be scanned with your mobile phone. Your phone will connect to the server as soon as the code is scanned. You can now control the mouse of your machine using your phone. 
