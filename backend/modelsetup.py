from mtcnn import MTCNN
import cv2

# load image
image = cv2.imread("goku.jpeg")

# convert to rgb
image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

# use MTCNN for facial detection
# extracts landmarks and bounding boxes
detector = MTCNN()
faces = detector.detect_faces(image_rgb)

print(faces)