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

img_id = getid()
if img_id:
    link = '/attachments/' + img_id + '.png'
    print (link)
    try:
        img = urllib.request.urlopen(server + link)
        with open('display.png', 'b+w') as f:
            f.write(img.read())
    except:
        print ("Failed to download")
