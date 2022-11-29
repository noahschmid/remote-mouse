# Remote-Mouse
Web application to control the mouse of a linux machine remotely. Does not work under Windows/Mac. 

# Dependencies
You have to have [Node.js](https://nodejs.org/en/) installed on your machine. If needed, it can be installed using

    sudo apt install nodejs


# Usage
First install the required packages: 

    npm install

then you can start a new server:  

    sudo nodemon`  

**Important**: This application has to be run as root and the machine has to be connected to the same local network as the mobile phone to function properly.

Now open a browser and open  [http:://localhost::8080](http:://localhost::8080). You should see a QR code that needs to be scanned with your mobile phone. Your phone will connect to the server as soon as the code is scanned. You can now control the mouse of your machine using your phone. 
