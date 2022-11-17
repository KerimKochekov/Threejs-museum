from serpapi import GoogleSearch
import requests
import shutil
from tqdm import tqdm
import glob
import os
import sys

class GoogleImage:
    def __init__(self, url, title, width, height):
        self.url = url
        self.title = title
        self.width = width
        self.height = height

    def show(self):
        print(f"Title: {self.title} | Width: {self.width} | Height: {self.height} | URL: {self.url}")

def delete_all_files(dir):
    files = glob.glob(f'{dir}/*')
    for f in files:
        os.remove(f)

def download_images(dir, images):
    if not os.path.exists(dir):
        os.makedirs(dir)
    delete_all_files(dir)
    image_formats = ['png', 'jpeg', 'jpg', 'bmp', 'tiff', 'gif', 'svg']
    for i in tqdm(range(len(images))):
        url = images[i].url
        try:
            response = requests.get(url, stream=True)
            which_format = image_formats[1]
            for image_format in image_formats:
                if image_format in url:
                    which_format = image_format
                    break
            with open(f'{dir}/{i}.{which_format}', 'wb') as out_file:
                shutil.copyfileobj(response.raw, out_file)
            del response
        except:
            pass

assert len(sys.argv) > 2, "Please provide required inputs"
# python3 download_images.py <directory> <query> [query can be several words]
# Example: python3 download_images.py bin Hello world

directory = sys.argv[1]
query = ''
for i in range(2, len(sys.argv)):
    if len(query) > 0:
        query += ' '
    query += sys.argv[i]

secret_key = '<secret_key>'    

params = {
  "q": query,
  "tbm": "isch",
  "ijn": "0",
  "api_key": secret_key
}

results = GoogleSearch(params).get_dict()
result_images = []
for i in range(len(results["images_results"])):
    try:
        result_images.append(
                GoogleImage(
                    results["images_results"][i]['original'],
                    results["images_results"][i]['title'],
                    results["images_results"][i]['original_width'],
                    results["images_results"][i]['original_height'])    
                )
    except:
        pass

download_images(directory, result_images)
