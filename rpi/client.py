import cv2
import pyqrcode
import numpy as np
import datetime as dt
import requests, sys, json, urllib

server = 'http://13.58.17.190'
headers = {'Content-Type': 'application/json'}
payload = {'devicename': 'admin', 'password': 'admin'}
print 'begin'

def getid():
    print 'getid'
    r = requests.post(server + '/getdata', data = json.dumps(payload), headers = headers)
    if r.status_code != 200:
        print "Failed"
        sys.exit(0)
    else:
        res_json = r.json()
        if len(res_json) == 1:
            print res_json[0]
            words = res_json[0]["words"]
            return res_json[0]["_id"], words

        else:
            print "Nothing to show"
            return None, []

def save(img_id):
    print 'save'
    if img_id:
        link = '/attachments/' + img_id + '.png'
        print (link)
        try:
            urllib.urlretrieve(server + link, 'display.png')
        except:
            print "Failed to download"

#img = cv2.imread('test_img.jpg')
current_id = -1
cv2.namedWindow("window", cv2.WND_PROP_FULLSCREEN)
cv2.setWindowProperty("window",cv2.WND_PROP_FULLSCREEN,cv2.cv.CV_WINDOW_FULLSCREEN)
# cv2.cv.CV_WINDOW_FULLSCREEN
print 'loop begin'
while(True):
    t = dt.datetime.now()
    img_id, words = getid()
    print words
    if img_id and img_id != current_id:
        save(img_id)
        current_id = img_id
        print 'one'
    	s = server + '/getevents?q=' + '-'.join(words)
    	text = pyqrcode.create(s)
        print text
    	text.png('qr_code12345.png', scale=6, module_color=[0, 0, 0, 128], background=[0xff, 0xff, 0xcc])
    	img = cv2.imread('qr_code12345.png', 0)
    	ret, qr = cv2.threshold(img, 220, 255, cv2.THRESH_BINARY)
    	cv2.imwrite('qr_code12345.png', qr)
    	img2 = cv2.imread('display.png')
    	img2 = cv2.resize(img2, (3000 * img2.shape[1] / (img2.shape[0] + img2.shape[1]), 3000 * img2.shape[0] / (img2.shape[0] + img2.shape[1])), interpolation = cv2.INTER_CUBIC)
    	# cv2.namedWindow("frame", cv2.WND_PROP_FULLSCREEN)
    	# cv2.setWindowProperty("frame",cv2.WND_PROP_FULLSCREEN,cv2.WINDOW_FULLSCREEN)
    	qr = cv2.cvtColor(qr, cv2.COLOR_GRAY2BGR)
    	for i in range(len(qr)):
    	    for j in range(len(qr)):
    		img2[len(img2) - len(qr) + i][len(img2[0]) - len(qr) + j] = qr[i][j]
        cv2.imwrite('display.png', img2)
    print 'two'
    img = cv2.imread('display.png')
    cv2.imshow("window", img)
    cv2.waitKey(5000)

if cv2.waitKey(0) == 27:
	cv2.destroyAllWindows()
