import cv2
import numpy as np
import datetime as dt
import requests, sys, json, urllib

server = 'http://localhost:3000'
headers = {'Content-Type': 'application/json'}
payload = {'devicename': 'admin', 'password': 'admin'}

def getid():
    r = requests.post(server + '/getdata', data = json.dumps(payload), headers = headers)
    if r.status_code != 200:
        print ("Failed")
        sys.exit(0)
    else:
        res_json = r.json()
        if len(res_json) == 1:
            return res_json[0]["_id"]
        else:
            print ("Nothing to show")
            return None

def save(img_id):
    if img_id:
        link = '/attachments/' + img_id + '.png'
        print (link)
        try:
            img = urllib.request.urlopen(server + link)
            with open('display.png', 'b+w') as f:
                f.write(img.read())
        except:
            print ("Failed to download")

#img = cv2.imread('test_img.jpg')
current_id = -1
cv2.namedWindow("window", cv2.WND_PROP_FULLSCREEN)
cv2.setWindowProperty("window",cv2.WND_PROP_FULLSCREEN,cv2.WINDOW_FULLSCREEN)
while(True):
    t = dt.datetime.now()
    img_id = getid()
    if img_id and img_id != current_id:
        save(img_id)
        current_id = img_id
    img = cv2.imread('display.png')
    cv2.imshow("window", img)
    cv2.waitKey(5000)

if cv2.waitKey(0) == 27:
	cv2.destroyAllWindows()
