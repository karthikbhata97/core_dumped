import cv2
import pyqrcode
import numpy as np
import pymysql
import datetime as dt
import requests, sys, json, urllib
import os

db = pymysql.connect(user="root", password="chco3651", host="localhost")
cursor = db.cursor()
cursor.execute("USE smartboard")

server = 'http://192.168.43.204:8080'
headers = {'Content-Type': 'application/json'}
payload = {'devicename': 'govind', 'password': 'kerala'}
print 'begin'

def getid():
    print 'getid'
    r = requests.post(server + '/getdata', data = json.dumps(payload), headers = headers)
    if r.status_code != 200:
        print "Failed"
        sys.exit(0)
    else:
        res_json = r.json()
        print len(res_json)
        for item in res_json:
      		tbegin = dt.datetime.strptime(item["timeBegin"].split('.')[0] + 'Z', '%Y-%m-%dT%H:%M:%SZ')
      		tend = dt.datetime.strptime(item["timeEnd"].split('.')[0] + 'Z', '%Y-%m-%dT%H:%M:%SZ')
        	cursor.execute("""INSERT into smartboard (
    		id, username, description, timeBegin, timeEnd, priority, words, filename
    		) VALUES 
    		(%s, %s, %s, %s, %s, %s, %s, %s)
    		""", (str(item["_id"]), str(item["username"]), str(item["description"]), tbegin, tend, int(item["priority"]), str('-'.join(item["words"])), str(item["filename"])))
    		db.commit()

def save(img_id):
    print 'save'
    if img_id:
        link = '/attachments/' + img_id + '.png'
        print (link)
        try:
            urllib.urlretrieve(server + link, 'images/' + img_id + '.png')
        except:
            print "Failed to download"

#img = cv2.imread('test_img.jpg')
current_id = -1
cv2.namedWindow("window", cv2.WND_PROP_FULLSCREEN)
cv2.setWindowProperty("window",cv2.WND_PROP_FULLSCREEN,cv2.WINDOW_FULLSCREEN)
# cv2.cv.CV_WINDOW_FULLSCREEN
print 'loop begin'
while(True):
    t = dt.datetime.now()
    getid()
    q = 'select id, words from smartboard where timeBegin < "%s" and timeEnd > "%s" order by priority desc limit 4'
    cursor.execute(q % (t, t))
    values = cursor.fetchall()
    print values
    for i in values:
	img_id, words = i
	if os.path.isfile('images/' + img_id + '.png')
	save(img_id)
	s = server + '/getevents?q=' + words
	text = pyqrcode.create(s)
	text.png('qr_code12345.png', scale=6, module_color=[0, 0, 0, 128], background=[0xff, 0xff, 0xcc])
    	img = cv2.imread('qr_code12345.png', 0)
    	ret, qr = cv2.threshold(img, 220, 255, cv2.THRESH_BINARY)
    	cv2.imwrite('qr_code12345.png', qr)
    	img2 = cv2.imread('images/' + img_id +'.png')
    	img2 = cv2.resize(img2, (3000 * img2.shape[1] / (img2.shape[0] + img2.shape[1]), 3000 * img2.shape[0] / (img2.shape[0] + img2.shape[1])), interpolation = cv2.INTER_CUBIC)
    	# cv2.namedWindow("frame", cv2.WND_PROP_FULLSCREEN)
    	# cv2.setWindowProperty("frame",cv2.WND_PROP_FULLSCREEN,cv2.WINDOW_FULLSCREEN)
    	qr = cv2.cvtColor(qr, cv2.COLOR_GRAY2BGR)
    	for i in range(len(qr)):
    	    for j in range(len(qr)):
    		img2[len(img2) - len(qr) + i][len(img2[0]) - len(qr) + j] = qr[i][j]
	cv2.imwrite(img_id + '.png', img2)
    for i in values:
	img_id, words = i
	img = cv2.imread('images/' + img_id + '.png')
        cv2.imshow("window", img)
        cv2.waitKey(5000)
        print 'one'
	'''
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
    ''''

if cv2.waitKey(0) == 27:
	cv2.destroyAllWindows()
