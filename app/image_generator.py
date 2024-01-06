import base64
import requests
import os
from datetime import datetime
import math

API_KEY = "sk-9N7dcRGLkwoOcV6L8eVpGcRsga3zlfQBdAGnZ3cFMNRLUS8g"
url = "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image"

headers = {
  "Accept": "application/json",
  "Content-Type": "application/json",
  "Authorization": "Bearer " + API_KEY,
}

def clamp(value, lower, upper):
    return max(lower, min(value, upper))

def round_to_nearest_multiple(number, multiple):
    return round(number / multiple) * multiple

# EXAMPLE USAGE
# params = {'prompt': "A castle with a charriot with horses, make it be at sunset, make it be romantic"}
# params['samples'] = 1
# params['steps'] = 50
# params['cfg_scale'] = 5

# image_paths = generate_image(**params)
# print(image_paths)

def generate_image(**kwargs):
	if 'prompt' not in kwargs:
		return 
	
	body = {
		"steps": clamp(kwargs.get('steps', 40), 1, 50),
		"width": kwargs.get('width', 1024),
		"height": kwargs.get('height', 1024),
		"seed": kwargs.get('seed', 0),
		"cfg_scale": clamp(kwargs.get('cfg_scale', 5), 1, 35), # the higher the number, the more the image follows the prompt
		"samples": clamp(kwargs.get('samples', 1), 1, 10),
		"text_prompts": [
			{
			"text": kwargs.get('prompt'),
			"weight": 1
			},
			{
			"text": kwargs.get('negative_prompt', 'blurry bad'),
			"weight": -1
			}
		],
	}
	response = requests.post(url, headers=headers, json=body)

	if response.status_code != 200:
		raise Exception("Non-200 response: " + str(response.text))

	data = response.json()
	if not os.path.exists("./app/static"):	
		os.makedirs("./app/static")
	if not os.path.exists("./app/static"):	
		os.makedirs("./app/static")
	if not os.path.exists("./app/static/app"):	
		os.makedirs("./app/static/app")
	if not os.path.exists("./app/static/app/images"):	
		os.makedirs("./app/static/app/images")

	image_paths = []
	for i, image in enumerate(data["artifacts"]):
		timestamp = math.floor(datetime.timestamp(datetime.now()))
		image_name = f'image_illuminate_{image["seed"]}_{timestamp}.png'
		image_path = f'./app/static/app/images/{image_name}'
		image_paths.append(image_name)
		with open(image_path, "wb") as f:
			f.write(base64.b64decode(image["base64"]))

	return image_paths