import cv2
import numpy as np
import datetime as dt

#img = cv2.imread('test_img.jpg')
st = list('img1.jpg')
cv2.namedWindow("window", cv2.WND_PROP_FULLSCREEN)
cv2.setWindowProperty("window",cv2.WND_PROP_FULLSCREEN,cv2.WINDOW_FULLSCREEN)
while(True):
	t = dt.datetime.now()
	print(st)
	st1 = ''.join(st)
	img = cv2.imread(st1)
	cv2.imshow("window", img)
	cv2.waitKey(5000)
	st[3] = str((ord(st[3]) - 48) % 3 + 1)
	#while(dt.datetime.now().second == (t + 5) % 60):
		#pass

if cv2.waitKey(0) == 27:
	cv2.destroyAllWindows()
