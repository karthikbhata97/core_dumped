# the-repo
**smart notice board:**

Dynamic customizable notice board based on priority and time scheduling where if any event is to occur the data can be fed prior and the same gets digitally displayed on time.Basically the product automates the entire system i,e display of notices

## Things done:
* MEAN web application is setup to add and delete notice,add and delete remote devices to connect running on local host and view all schedules.
* The Same is being Deployed on AWS cloud
* RPI is  setup and connected to aws cloud and a python script is written to ping the server every 5 seconds
* The posted notice can connect to multiple devices
* Using google cloud vision, the image is being analysed and features like text are extracted and stored.
* Dynamic link generation of related posts from the data obtained by google cloud vision.
* QR code is used to navigate into that link which will be posted on smart notice board

## Steps to deploy
*clone the repo*
'''
cd core_dumped
'''

**Cloud**
'''
node server.js                                                # port 8080
'''

**Raspberry Pi**
'''
python2.7 rpi/client.py
'''

**Admin portal**
* Open the specified ip of aws
