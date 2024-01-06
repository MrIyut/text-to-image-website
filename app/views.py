from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .image_generator import generate_image
import os, json

# Create your views here.
options = [
        {'label': 'Gandalf','image_url': 'Gandalf.jpg'},
        {'label': 'Barbie', 'image_url': 'Barbie.jpeg'},
        {'label': 'Dracula', 'image_url': 'Dracula.png'},
        {'label': 'Sauron', 'image_url': 'Sauron.jpg'},
        {'label': 'Scooby Doo', 'image_url': 'ScoobyDoo.jpeg'},
        {'label': 'Harry Potter', 'image_url': 'harrypotter.0.jpg'},
        {'label': 'Mickey Mouse', 'image_url': 'Mickey.jpg'},
]

def cleanupImages(response):
    if 'image_paths' in response.session:
        image_paths = response.session['image_paths']
        print("cleanup", image_paths)
        for image_path in image_paths:
            path = f'./app/static/app/images/{image_path}'
            print(path, os.path.exists(path))
            if os.path.exists(path):
                os.remove(path)
        del response.session['image_paths']

def index(response):
    if response.method == "POST":
        params = {}
        params['prompt'] = response.POST.get('Prompt', 'A sample image')
        negative_prompt_value = response.POST.get('NegativePrompt')
        if negative_prompt_value is not None:
            params['negative_prompt'] = negative_prompt_value

        cleanupImages(response)
        image_paths = generate_image(**params)
        print(image_paths)

        response.session['image_paths'] = image_paths
        return render(response, "app/index.html", {
            'options': options,
            'image_paths': image_paths,
        })

    cleanupImages(response)
    return render(response, "app/index.html", {
        'options': options,
        'image_paths': [],
    })