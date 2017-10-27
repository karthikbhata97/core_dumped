import datetime as dt
import requests, sys, json, urllib
import pymysql

db = pymysql.connect(user="root", password="", host="localhost")
cursor = db.cursor()
cursor.execute("USE smartboard")

server = 'http://192.168.43.204:8080'
headers = {'Content-Type': 'application/json'}
payload = {'devicename': 'khaaaaa', 'password': '1234'}
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
            urllib.urlretrieve(server + link, 'display.png')
        except:
            print "Failed to download"


getid()
