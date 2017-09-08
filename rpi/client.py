import requests, sys, json

server = 'http://localhost:3000'
headers = {'Content-Type': 'application/json'}
payload = {'devicename': 'admin', 'password': 'admin'}

def getlink():
    r = requests.post(server + '/getdata', data = json.dumps(payload), headers = headers)
    if r.status_code != 200:
        print ("Failed")
        sys.exit(0)
    else:
        res_json = r.json()[0]
        if res_json:
            link = '/attachments/' + r.json()[0]["_id"] + '.png'
            return (server + link)
        else:
            print ("Nothing to show")
            return None

print getlink()
